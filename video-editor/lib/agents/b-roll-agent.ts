import { Scene, AgentResult, BaseAgent, ProjectContext } from "./types";
import { openai } from "../openai";
import { BROLL_AGENT_TOOLS } from "./tools/b-roll-agent-definitions";
import { memoryService } from "../services/api/memory-service";
import { sceneService } from "../services/api/scene-service";
import { jobService } from "../services/api/job-service";
// Import real production tools
import * as brollTools from "./tools/production/broll-tools";

export class BRollAgent implements BaseAgent {
  name = "B-Roll Specialist";
  role = "Specializes in acquiring stock footage and overlaying it on top of the A-Roll timeline.";

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

          PRODUCTION WORKFLOW (Reason-Act):
          1. Execute ONE tool at a time. 
          2. STEP 1: Search for relevant footage via 'search_pexels_library'. 
             * STRATEGY: Use the script and director notes to find the most fitting visual.
             * SELECTION: Our tool will automatically pick the best clip based on duration.
          3. FEEDBACK: Observe the search result.
          4. STEP 2: Use 'fit_stock_footage_to_duration' to conform the clip to the exact scene duration.
             * NOTE: This will warping/adjust the speed of the clip to fit perfectly.
          5. Respond with final confirmation text when done.` 
        },
        { 
          role: "user", 
          content: "Please execute the B-Roll production sequence." 
        }
      ];

      let isRunning = true;
      let turnCount = 0;
      const MAX_TURNS = 5;
      let finalAgentResponse = "B-Roll production complete.";

      // 3. THE MULTI-TURN AGENTIC LOOP
      while (isRunning && turnCount < MAX_TURNS) {
        turnCount++;
        
        // Add Turn Context (Helps AI stay aware of time)
        const turnContext = { 
          role: "system" as const, 
          content: `You are on turn ${turnCount}/${MAX_TURNS}. Please prioritize finalizing the scene.` 
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

            await memoryService.update(projectId, { last_log: `${this.name}: Executing ${toolName}...` });

            let toolResult: any;
            if (toolName === 'search_pexels_library') {
              // Inject targetDuration for local selection logic
              toolResult = await brollTools.search_pexels_library({
                ...args,
                targetDuration: scene.duration
              });

              // Update scene with initial search results
              if (toolResult.status === 'completed') {
                const updatedScene = await sceneService.update(scene.id, {
                  asset_url: toolResult.videoUrl,
                  thumbnail_url: toolResult.thumbnail,
                  payload: { ...scene.payload, ...toolResult }
                });
                // Sync local state to prevent data loss in subsequent turns
                Object.assign(scene, updatedScene);
              }
            } else if (toolName === 'fit_stock_footage_to_duration') {
              toolResult = await brollTools.fit_stock_footage_to_duration({
                videoUrl: args.videoUrl,
                targetDuration: scene.duration
              });

              // Update scene with final processed video
              if (toolResult.status === 'completed') {
                const updatedScene = await sceneService.update(scene.id, {
                  final_video_url: toolResult.outputUrl,
                  payload: { ...scene.payload, ...toolResult }
                });
                // Sync local state
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
