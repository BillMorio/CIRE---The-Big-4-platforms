import * as aroll from "./aroll-tools";
import * as broll from "./broll-tools";
import * as image from "./image-tools";
import * as motion from "./motion-tools";

export const TOOL_REGISTRY: Record<string, (args: any) => Promise<any>> = {
  // A-Roll
  process_voice_cloning: aroll.process_voice_cloning,
  generate_avatar_lipsync: aroll.generate_avatar_lipsync,
  
  // B-Roll
  search_pexels_library: broll.search_pexels_library,
  trim_stock_footage: broll.trim_stock_footage,
  
  // Image
  generate_sdxl_visual: image.generate_sdxl_visual,
  apply_text_branding: image.apply_text_branding,
  
  // Motion
  render_motion_sequence: motion.render_motion_sequence,
  composite_ffmpeg_layer: motion.composite_ffmpeg_layer,
};
