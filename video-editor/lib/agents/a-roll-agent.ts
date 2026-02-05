import { Scene, AgentResult, BaseAgent, ProjectContext } from "./types";
import { openai } from "../openai";
import { SIMULATED_TOOLS } from "./tools/simulation/definitions";
import { memoryService } from "../services/api/memory-service";
import { sceneService } from "../services/api/scene-service";
import { jobService } from "../services/api/job-service";
// Import tools directly for explicit execution
import * as arollTools from "./tools/simulation/aroll-tools";

export class ARollAgent implements BaseAgent {
  name = "A-Roll Specialist";
  role = "Responsible for the primary 'talking-head' video segment. Requires trimming audio first, then generating a lip-synced avatar.";

  async process(scene: Scene, context: ProjectContext): Promise<AgentResult> {
    const projectId = scene.project_id;
    console.log(`[${this.name}] Starting Production Chain for scene ${scene.index}`);

    try {
      // 1. Initial State Sync
      await sceneService.update(scene.id, { status: 'processing' });
      await memoryService.update(projectId, { 
        active_agents: [this.name],
        current_scene_id: scene.id,
        last_log: `${this.name}: Starting production for Scene ${scene.index}.`
      });

      // 2. Initialize Conversation History for Multi-Turn Reasoning
      const messages: any[] = [
        { 
          role: "system", 
          content: `You are the ${this.name}. ${this.role}
          
          SCENE CONTEXT:
          - Start Time: ${scene.start_time}s
          - End Time: ${scene.end_time}s
          - Duration: ${scene.duration}s
          - Script: "${scene.script}"

          PRODUCTION WORKFLOW (Reason-Act):
          1. You operate in a loop. Execute ONE tool at a time.
          2. STEP 1: Use 'trim_audio_segment' to extract the audio.
          3. FEEDBACK: I will provide the result of the trimming.
          4. STEP 2: Use 'generate_avatar_lipsync' with the resulting audio to create the visual.
          5. FINISH: Once both steps are successful, respond with a final confirmation text.` 
        },
        { 
          role: "user", 
          content: "Please begin the production sequence for this scene." 
        }
      ];

      let isRunning = true;
      let turnCount = 0;
      const MAX_TURNS = 5;

      // 3. THE MULTI-TURN AGENTIC LOOP (Re-entrant)
      while (isRunning && turnCount < MAX_TURNS) {
        turnCount++;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messages,
          tools: SIMULATED_TOOLS,
          tool_choice: "auto",
        });

        const responseMessage = response.choices[0].message;
        messages.push(responseMessage); // Save AI's thought/intent

        const toolCalls = responseMessage.tool_calls;

        // Condition A: AI wants to call tools
        if (toolCalls && toolCalls.length > 0) {
          console.log(`[${this.name}] Round ${turnCount}: Processing ${toolCalls.length} tool calls...`);
          
          for (const toolCall of toolCalls) {
            if (toolCall.type !== 'function') continue;
            
            const { name: toolName } = toolCall.function;
            const args = JSON.parse(toolCall.function.arguments);
            
            // Create Job for tracking
            const job = await jobService.create({
              scene_id: scene.id,
              provider: `${this.name} (${toolName})`,
              external_id: toolCall.id,
              status: 'processing',
              result: { tool: toolName, args }
            });

            await memoryService.update(projectId, { last_log: `${this.name}: Executing ${toolName}...` });

            // EXPLICIT TOOL EXECUTION
            let toolResult: any;
            if (toolName === 'trim_audio_segment') {
              toolResult = await arollTools.trim_audio_segment(args);
            } else if (toolName === 'generate_avatar_lipsync') {
              toolResult = await arollTools.generate_avatar_lipsync(args);
            } else {
              toolResult = { status: "failed", error: `Tool ${toolName} not found.` };
            }

            // Update Job with result
            await jobService.update(job.id, { 
              status: toolResult.status === 'failed' ? 'failed' : 'completed',
              result: { ...job.result, ...toolResult, completed_at: new Date().toISOString() }
            });

            // FEEDBACK: Pass the tool result back into the conversation history
            messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: toolName,
              content: JSON.stringify(toolResult),
            });

            // If a critical tool fails, we let the LLM see it, but we might want to throw if it persists
            if (toolResult.status === "failed") {
              console.error(`[${this.name}] Tool ${toolName} failed logistically.`);
            }
          }
        } 
        // Condition B: AI responds with text (Final response or intermediate thought)
        else {
          console.log(`[${this.name}] Final response received from AI.`);
          isRunning = false; 
        }
      }

      // 4. Finalize Scene Level Progress
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
        last_log: `${this.name}: Scene ${scene.index} production finalized.`
      });

      return { 
        success: true, 
        message: `${this.name} work complete for scene ${scene.index}.`, 
        log: `Completed in ${turnCount} reasoning turns.`
      };

    } catch (error) {
      console.error(`[${this.name}] PRODUCTION FAILURE:`, error);
      await sceneService.update(scene.id, { status: 'failed' });
      await memoryService.update(projectId, { 
        failed_count: (context.memory.failed_count || 0) + 1,
        active_agents: [],
        workflow_status: 'paused',
        last_log: `CRITICAL ERROR in ${this.name} during Scene ${scene.index}.`
      });

      return { success: false, message: `Failed in ${this.name}`, log: String(error), error: String(error) };
    }
  }
}
