import { Scene, AgentResult, BaseAgent, ProjectContext } from "./types";
import { openai } from "../openai";
import { SIMULATED_TOOLS } from "./tools/simulation-tools";
import { memoryService } from "../services/api/memory-service";
import { sceneService } from "../services/api/scene-service";
import { jobService } from "../services/api/job-service";
import { TOOL_REGISTRY } from "../tools/simulation/registry";

export abstract class BaseSpecializedAgent implements BaseAgent {
  abstract name: string;
  abstract role: string;

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

      // 2. Strong Prompting for Tool Usage
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `You are the ${this.name}. ${this.role}
            CRITICAL: You MUST use your specialized tools to simulate the production workflow. 
            Do NOT reply with text ONLY. Always break down the script into discrete tool-driven steps.
            Script: "${scene.script}"` 
          },
          { 
            role: "user", 
            content: "Break down this scene into production steps and execute them using your tools in sequence." 
          }
        ],
        tools: SIMULATED_TOOLS,
        tool_choice: "auto",
      });

      const toolCalls = response.choices[0].message.tool_calls;

      if (toolCalls && toolCalls.length > 0) {
        console.log(`[${this.name}] Executing ${toolCalls.length} tool calls...`);
        for (const toolCall of toolCalls) {
          if (toolCall.type !== 'function') continue;

          const { name } = toolCall.function;
          const args = JSON.parse(toolCall.function.arguments);
          
          // 3. Create Job (Initial)
          const job = await jobService.create({
            scene_id: scene.id,
            provider: `${this.name} (${name})`,
            external_id: toolCall.id,
            status: 'processing',
            result: { tool: name, args }
          });

          const logMsg = `${this.name}: Executing ${name.replace(/_/g, ' ')}...`;
          await memoryService.update(projectId, { last_log: logMsg });
          
          // 4. EXECUTE ACTUAL TOOL FUNCTION
          const toolFn = TOOL_REGISTRY[name];
          let toolResult = { status: "simulated" };
          
          if (toolFn) {
            toolResult = await toolFn(args);
          } else {
            console.warn(`[${this.name}] WARNING: Tool function ${name} not found in registry.`);
          }

          // 5. Update Job (Final)
          await jobService.update(job.id, { 
            status: 'completed',
            result: { ...job.result, ...toolResult, completed_at: new Date().toISOString() }
          });
        }
      } else {
        console.warn(`[${this.name}] No tool calls returned by OpenAI. Script was likely handled by text only.`);
        await memoryService.update(projectId, { last_log: `${this.name}: Warning - No specialized tools called.` });
      }

      // 6. Finalize Scene
      await sceneService.update(scene.id, { status: 'completed' });
      const currentMemory = await memoryService.getByProjectId(projectId);
      await memoryService.update(projectId, { 
        completed_count: (currentMemory.completed_count || 0) + 1,
        active_agents: [],
        current_scene_id: undefined,
        last_log: `${this.name}: Scene ${scene.index} successfully productionized.`
      });

      return { 
        success: true, 
        message: `${this.name} work complete for scene ${scene.index}.`, 
        log: `Completed ${toolCalls?.length || 0} production steps.`
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
