import { Scene, AgentResult, BaseAgent, ProjectContext, AgentMemory } from "./types";
import { ARollAgent } from "./a-roll-agent";
import { stateService } from "../services/state-service";

export class Orchestrator {
  private aRollAgent = new ARollAgent();

  async findAndProcessNextScene(projectId: string): Promise<AgentResult> {
    console.log("[Orchestrator] Pulling project state from Agent Memory...");

    // Step 1: Get the current state from DB
    const memory = await stateService.getProjectMemory(projectId);
    
    // Step 2: Check if we should even proceed
    if (memory.workflow_status === 'paused' || memory.workflow_status === 'completed') {
      return { success: false, message: `Orchestrator idle. Workflow status: ${memory.workflow_status}` };
    }

    // Batch Check: Are we done?
    if (memory.completed_count + memory.failed_count >= memory.total_scenes) {
      await stateService.updateWorkflowStatus(projectId, 'completed');
      return { success: true, message: "Project completed successfully." };
    }

    // Step 3: Mock finding a 'todo' scene in the DB
    const mockScene: Scene = {
      id: "scene_123",
      project_id: projectId,
      index: memory.completed_count + 1,
      start_time: 0,
      end_time: 5,
      script: "Hello, this is a test for the A-Roll agent with memory.",
      visual_type: "a-roll",
      status: "todo"
    };

    console.log(`[Orchestrator] Next task: ${mockScene.id} (Type: ${mockScene.visual_type})`);

    // Memory-Driven Context (Zero hardcoding)
    const context: ProjectContext = {
      memory
    };

    // Step 5: Routing logic with Context & Memory Reporting
    if (mockScene.visual_type === 'a-roll') {
      // Register that an agent is starting
      await stateService.registerAgentStart(projectId, this.aRollAgent.name);
      
      const result = await this.aRollAgent.process(mockScene, context);
      
      // Register that agent is done and update state
      await stateService.registerAgentDone(projectId, this.aRollAgent.name, result);
      
      return result;
    }

    return { success: false, message: "No suitable agent found for visual type" };
  }
}
