import { Scene, AgentResult, BaseAgent, ProjectContext } from "./types";
import { trimAudioSegment } from "../tools/audio-tools";
import { createAvatarJob } from "../tools/heygen-tools";

export class ARollAgent implements BaseAgent {
  name = "A-Roll Specialist";
  role = "Handles avatar and talking-head visual generation.";

  async process(scene: Scene, context: ProjectContext): Promise<AgentResult> {
    console.log(`[${this.name}] Processing scene: ${scene.id}`);
    console.log(`[${this.name}] Project: ${context.memory.project_name} | Tone: ${context.memory.metadata?.tone}`);
    
    if (scene.visual_type !== 'a-roll') {
      return { success: false, message: "Invalid visual type for A-Roll agent", error: "TYPE_MISMATCH" };
    }

    try {
      // Step 2: Trim the audio for this specific segment
      const audioResult = await trimAudioSegment("master_audio.mp3", scene.start_time, (scene.end_time - scene.start_time));
      
      // Step 3: Initiate Avatar Job (using context from DB)
      const avatarJob = await createAvatarJob(scene.script, audioResult.path, scene.payload?.avatarId);
      
      return { 
        success: true, 
        message: `A-Roll generation workflow initiated for ${context.memory.project_name}`, 
        log: `Successfully initiated HeyGen job ${avatarJob.job_id} for scene ${scene.id}`,
        data: { 
          sceneId: scene.id, 
          jobId: avatarJob.job_id,
          audio: audioResult.temp_filename
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        message: "Failed to process A-Roll", 
        log: `Error in A-Roll agent: ${String(error)}`,
        error: String(error) 
      };
    }
  }
}
