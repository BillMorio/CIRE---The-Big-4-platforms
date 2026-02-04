import { waitForProcessing } from "@/lib/agents/tools/simulation-tools";

export const process_voice_cloning = async (args: { seconds?: number }) => {
  const delay = args.seconds || 3;
  console.log(`[Simulation] Cloning voice... (${delay}s)`);
  await waitForProcessing(delay);
  return { status: "success", voiceId: "cloned_voice_v1" };
};

export const generate_avatar_lipsync = async (args: { seconds?: number }) => {
  const delay = args.seconds || 8;
  console.log(`[Simulation] Generating Lip-sync... (${delay}s)`);
  await waitForProcessing(delay);
  return { status: "success", videoUrl: "https://simulated.heygen.com/output.mp4" };
};
