/**
 * PRODUCTION AUDIO TOOLS
 * These tools bridge to the external FFmpeg Playground server (port 3333)
 * to perform surgical media operations.
 */

const FFMPEG_SERVER = process.env.FFMPEG_SERVER_URL || "http://localhost:3333";

export interface TrimAudioArgs {
  audioUrl: string;
  start: number;
  duration: number;
}

/**
 * Trims a specific segment from a master audio file using the FFmpeg Playground server.
 * Uses FormData to ship the audio stream to the surgical layer.
 */
export async function trim_audio_segment(args: TrimAudioArgs) {
  console.log(`[AudioTool] Trimming segment from ${args.audioUrl} starting at ${args.start}s for ${args.duration}s...`);

  try {
    // 1. Fetch the master audio file
    const audioResponse = await fetch(args.audioUrl);
    if (!audioResponse.ok) throw new Error(`Failed to fetch master audio from ${args.audioUrl}`);
    const audioBlob = await audioResponse.blob();

    // 2. Prepare FormData for the FFmpeg Playground
    const formData = new FormData();
    formData.append("file", audioBlob, "master_audio.mp3");
    formData.append("start", args.start.toString());
    formData.append("duration", args.duration.toString());

    // 3. Post to Playground API
    const response = await fetch(`${FFMPEG_SERVER}/api/audio-trim`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "failed",
        error: data.error || "Failed to trim audio via playground",
        details: data.details
      };
    }

    console.log(`[AudioTool] Trim successful: ${data.outputFile}`);

    return {
      status: "completed",
      outputUrl: `${FFMPEG_SERVER}${data.outputFile}`,
      message: "Audio segment extracted successfully."
    };
  } catch (error: any) {
    console.error("[AudioTool] Error during production trim:", error);
    return {
      status: "failed",
      error: error.message || "Unknown error during production trim"
    };
  }
}
