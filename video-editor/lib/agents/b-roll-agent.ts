import { Scene, AgentResult, BaseAgent, ProjectContext } from "./types";
import { openai } from "../openai";
import { BROLL_AGENT_TOOLS } from "./tools/b-roll-agent-definitions";
import { memoryService } from "../services/api/memory-service";
import { sceneService } from "../services/api/scene-service";
import { jobService } from "../services/api/job-service";
// Import real production tools
import * as brollTools from "./tools/production/broll-tools";

export class BRollAgent implements BaseAgent {
  name = "B-Roll Agent";
  role = "Specializes in acquiring stock footage and overlaying it on top of the A-Roll timeline.";

  private TOOL_LOG_MAPPING: Record<string, string> = {
    'search_pexels_library': 'Searching for relevant stock footage on Pexels',
    'fit_stock_footage_to_duration': 'Conforming stock footage to scene duration',
    'trim_stock_footage': 'Surgically trimming stock footage segment',
  };

  async process(scene: Scene, context: ProjectContext): Promise<AgentResult> {
    const projectId = scene.project_id;
    console.log(`[${this.name}] Starting Production Chain for scene ${scene.index}`);

    try {
      // 1. Register Start
      await sceneService.update(scene.id, { status: 'processing' });
      await memoryService.update(projectId, { 
        active_agents: [this.name],
        current_scene_id: scene.id,
        last_log: `${this.name}: Starting production for Scene ${scene.index}.`
      });

      // 2. Initialize Conversation History
      const messages: any[] = [
        { 
          role: "system", 
          content: `You are the ${this.name}. ${this.role}
          
          SCENE CONTEXT:
          - Index: ${scene.index}
          - Start Time: ${scene.start_time}s
          - End Time: ${scene.end_time}s
          - Target Duration: ${scene.duration}s
          - Script: "${scene.script}"
          - Director Notes: "${scene.director_notes || "None"}"
          - Persistent State: ${JSON.stringify(scene.agent_state || {})}

          PRODUCTION WORKFLOW (Acquisition -> Trimming -> Conforming):
          1. Discovery: Use 'search_pexels_library' to find the best visual match.
          2. Evaluation: Look at the 'duration' of the found clip.
          3. Trimming (Conditional): If the clip is significantly longer than ${scene.duration}s (e.g. > 2s gap), use 'trim_stock_footage' to extract a surgical segment first.
          4. Mandatory Conforming: Finally, use 'fit_stock_footage_to_duration' to ensure a perfect technical fit for the master timeline.
             * CRITICAL: You MUST call the fitting tool at least once to ensure a perfect match for the ${scene.duration}s scene.
          5. VERIFICATION: If your state is 'asset_acquired' and the clip is long, TRIM IT. If state is 'asset_trimmed' or the clip is short, FIT IT.
          6. Respond with final confirmation only AFTER the fitting step is complete. (Step should be 'conforming_complete')` 
        },
        { 
          role: "user", 
          content: "Please execute the B-Roll production sequence." 
        }
      ];

      // Re-hydrate conversation if it's already in progress
      if (scene.agent_state?.step === 'asset_acquired') {
        messages.push({
          role: "assistant",
          content: `Internal State Recovery: Asset acquired (${scene.agent_state.videoUrl}). Proceeding to mandatory conforming.`
        });
      }

      let isRunning = true;
      let turnCount = 0;
      const MAX_TURNS = 5;
      let finalAgentResponse = "B-Roll production complete.";

      // 3. THE MULTI-TURN AGENTIC LOOP
      while (isRunning && turnCount < MAX_TURNS) {
        turnCount++;
        
        // Dynamic turn context based on state
        const stateSummary = scene.agent_state?.step || 'idle';
        const turnContext = { 
          role: "system" as const, 
          content: `Current Internal State: ${stateSummary}. Turn ${turnCount}/${MAX_TURNS}. ` + 
                   (stateSummary === 'asset_acquired' ? "HINT: If the clip is much longer than the target, call 'trim_stock_footage'. Otherwise, call 'fit_stock_footage_to_duration'." : "") +
                   (stateSummary === 'asset_trimmed' ? "MANDATORY: You have trimmed the asset. Now call 'fit_stock_footage_to_duration' to finalize the fit." : "")
        };

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [...messages, turnContext],
          tools: BROLL_AGENT_TOOLS,
          tool_choice: "auto",
        });

        const responseMessage = response.choices[0].message;
        messages.push(responseMessage);

        const toolCalls = responseMessage.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
          console.log(`[${this.name}] Round ${turnCount}: Processing ${toolCalls.length} tool calls...`);
          
          for (const toolCall of toolCalls) {
            if (toolCall.type !== 'function') continue;

            const { name: toolName } = toolCall.function;
            const args = JSON.parse(toolCall.function.arguments);
            
            const job = await jobService.create({
              scene_id: scene.id,
              provider: `${this.name} (${toolName})`,
              external_id: toolCall.id,
              status: 'processing',
              result: { tool: toolName, args }
            });

            const logAction = this.TOOL_LOG_MAPPING[toolName] || `Executing ${toolName}`;
            await memoryService.update(projectId, { last_log: `${this.name}: ${logAction}...` });

            let toolResult: any;
            if (toolName === 'search_pexels_library') {
              toolResult = await brollTools.search_pexels_library({
                ...args,
                targetDuration: scene.duration
              });

              if (toolResult.status === 'success') {
                const newState = { 
                  step: 'asset_acquired', 
                  videoUrl: toolResult.videoUrl, 
                  originalDuration: toolResult.duration 
                };
                const updatedScene = await sceneService.update(scene.id, {
                  asset_url: toolResult.videoUrl,
                  thumbnail_url: toolResult.thumbnail,
                  agent_state: newState,
                  payload: { ...scene.payload, ...toolResult }
                });
                Object.assign(scene, updatedScene);
              }
            } else if (toolName === 'trim_stock_footage') {
              // Add 0.8s handles (0.4s head/tail) to preserve content during 0.8s crossfades
              const paddedDuration = Number(args.duration || scene.duration) + 0.8;
              toolResult = await brollTools.trim_stock_footage({
                ...args,
                duration: paddedDuration
              });

              if (toolResult.status === 'success') {
                const newState = { 
                  ...scene.agent_state,
                  step: 'asset_trimmed', 
                  videoUrl: toolResult.outputUrl,
                  paddedDuration
                };
                const updatedScene = await sceneService.update(scene.id, {
                  asset_url: toolResult.outputUrl, 
                  agent_state: newState,
                  payload: { ...scene.payload, ...toolResult }
                });
                Object.assign(scene, updatedScene);
              }
            } else if (toolName === 'fit_stock_footage_to_duration') {
              // Add 0.8s handles (0.4s head/tail) to preserve content during 0.8s crossfades
              const paddedDuration = Number(args.targetDuration || scene.duration) + 0.8;
              toolResult = await brollTools.fit_stock_footage_to_duration({
                videoUrl: args.videoUrl || scene.asset_url,
                targetDuration: paddedDuration
              });

              if (toolResult.status === 'completed') {
                const newState = { 
                  ...scene.agent_state,
                  step: 'conforming_complete', 
                  finalUrl: toolResult.outputUrl 
                };
                const updatedScene = await sceneService.update(scene.id, {
                  final_video_url: toolResult.outputUrl,
                  agent_state: newState,
                  payload: { ...scene.payload, ...toolResult }
                });
                Object.assign(scene, updatedScene);
              }
            } else {
              toolResult = { status: "failed", error: `Tool ${toolName} not found.` };
            }

            // Update Job with result
            await jobService.update(job.id, { 
              status: toolResult.status === 'failed' ? 'failed' : 'completed',
              result: { ...job.result, ...toolResult, completed_at: new Date().toISOString() }
            });

            messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: toolName,
              content: JSON.stringify(toolResult),
            });

            // Handle Failures
            if (toolResult.status === "failed") {
              console.error(`[${this.name}] Tool ${toolName} failed logistically.`);
              // Note: We don't break yet, allowing AI to see the failure and try to fix it.
            }
          }
        } else {
          console.log(`[${this.name}] Final response received from AI.`);
          finalAgentResponse = responseMessage.content || finalAgentResponse;
          isRunning = false;
        }
      }

      // Handle Edge Case: Max Turns Reached
      if (turnCount >= MAX_TURNS && isRunning) {
        console.warn(`[${this.name}] Max turns (${MAX_TURNS}) reached for scene ${scene.index}.`);
        await memoryService.update(projectId, { 
          last_log: `${this.name}: Max reasoning turns reached. Scene may be incomplete.` 
        });
      }

      // 4. Finalize Scene
      await sceneService.update(scene.id, { 
        status: 'completed',
        asset_url: scene.asset_url,
        thumbnail_url: scene.thumbnail_url,
        final_video_url: scene.final_video_url,
        payload: scene.payload
      });
      const currentMemory = await memoryService.getByProjectId(projectId);
      await memoryService.update(projectId, { 
        completed_count: (currentMemory.completed_count || 0) + 1,
        active_agents: [],
        current_scene_id: undefined,
        last_log: `${this.name}: Scene ${scene.index} successfully productionized.`
      });

      return { 
        success: true, 
        message: finalAgentResponse, 
        log: `Completed in ${turnCount} turns.`
      };
    } catch (error) {
      console.error(`[${this.name}] CRITICAL FAILURE:`, error);
      await sceneService.update(scene.id, { status: 'failed' });
      const currentMemory = await memoryService.getByProjectId(projectId);
      await memoryService.update(projectId, { 
        failed_count: (currentMemory.failed_count || 0) + 1,
        active_agents: [],
        current_scene_id: undefined,
        workflow_status: 'paused',
        last_log: `CRITICAL ERROR in ${this.name} during Scene ${scene.index}.`
      });

      return { success: false, message: `Failed in ${this.name}`, log: String(error), error: String(error) };
    }
  }
}
