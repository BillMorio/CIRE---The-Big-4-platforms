import { Scene } from "./types";

export const sampleScenes: Scene[] = [
  {
    id: "scene_001",
    index: 1,
    startTime: 0.0,
    endTime: 6.5,
    duration: 6.5,
    script: "Hey everyone! Welcome back to the channel. If you're struggling to grow your YouTube presence, this video is exactly what you need.",
    visualType: "a-roll",
    aRoll: {
      type: "ai-avatar",
      avatarId: "avatar_host_01",
      provider: "heygen",
      emotion: "enthusiastic",
      cameraAngle: "medium-shot",
      sourceUrl: null,
      assetStatus: "pending_generation",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration"
    },
    transition: { type: "fade", duration: 0.5, direction: "in" }
  },
  {
    id: "scene_002",
    index: 2,
    startTime: 6.5,
    endTime: 18.3,
    duration: 11.8,
    script: "Today, I'm sharing five proven strategies that helped me go from zero to one hundred thousand subscribers.",
    visualType: "b-roll",
    bRoll: {
      type: "motion-graphic",
      provider: "veo3",
      prompt: "animated number counter from 0 to 100k subscribers",
      sourceUrl: null,
      sourceDuration: null,
      targetDuration: 11.8,
      assetStatus: "pending_generation",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration"
    },
    transition: { type: "crossfade", duration: 1.0 }
  },
  {
    id: "scene_003",
    index: 3,
    startTime: 18.3,
    endTime: 23.8,
    duration: 5.5,
    script: "Strategy number one: Master the art of the thumbnail. This is absolutely crucial.",
    visualType: "a-roll",
    aRoll: {
      type: "ai-avatar",
      avatarId: "avatar_host_01",
      provider: "heygen",
      emotion: "serious-emphasis",
      cameraAngle: "close-up",
      sourceUrl: null,
      assetStatus: "generated",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration"
    },
    transition: { type: "fade", duration: 0.8, direction: "in" }
  },
  {
    id: "scene_004",
    index: 4,
    startTime: 23.8,
    endTime: 36.2,
    duration: 12.4,
    script: "Your thumbnail is the first thing people see. It needs to pop off the screen and communicate value instantly.",
    visualType: "b-roll",
    bRoll: {
      type: "stock-footage",
      provider: "pexels",
      searchQuery: "graphic designer creating youtube thumbnails",
      videoId: "pexels_22334",
      sourceUrl: "https://example.com/stock/thumbnail_design.mp4",
      sourceDuration: 18.7,
      targetDuration: 12.4,
      assetStatus: "ready",
      fittingRequired: true,
      fittingStrategy: "trim",
      trimStart: 0.0,
      trimEnd: 12.4
    },
    transition: { type: "crossfade", duration: 0.5 }
  },
  {
    id: "scene_005",
    index: 5,
    startTime: 36.2,
    endTime: 48.9,
    duration: 12.7,
    script: "Here's an example from one of my most successful videos. This thumbnail got a click-through rate of over twelve percent.",
    visualType: "b-roll",
    bRoll: {
      type: "stock-footage",
      provider: "pexels",
      searchQuery: "youtube analytics dashboard showing high ctr",
      videoId: "pexels_55667",
      sourceUrl: "https://example.com/stock/analytics.mp4",
      sourceDuration: 9.5,
      targetDuration: 12.7,
      assetStatus: "ready",
      fittingRequired: true,
      fittingStrategy: "slowdown",
      speedFactor: 0.748
    },
    transition: { type: "wipe", duration: 0.8, direction: "left" }
  },
  {
    id: "scene_006",
    index: 6,
    startTime: 48.9,
    endTime: 54.2,
    duration: 5.3,
    script: "Strategy number two: Hook them in the first five seconds. You have no time to waste.",
    visualType: "a-roll",
    aRoll: {
      type: "ai-avatar",
      avatarId: "avatar_host_01",
      provider: "heygen",
      emotion: "urgent",
      cameraAngle: "medium-shot",
      sourceUrl: null,
      assetStatus: "pending_generation",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration"
    },
    transition: { type: "fade", duration: 0.5, direction: "in" }
  },
  {
    id: "scene_007",
    index: 7,
    startTime: 54.2,
    endTime: 67.5,
    duration: 13.3,
    script: "Most viewers decide whether to keep watching in the first five seconds. Get straight to the value.",
    visualType: "b-roll",
    bRoll: {
      type: "motion-graphic",
      provider: "hera-ai",
      prompt: "5 second countdown timer with attention-grabbing effects",
      sourceUrl: null,
      sourceDuration: null,
      targetDuration: 13.3,
      assetStatus: "pending_generation",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration",
      generationParams: {
        style: "high-energy-tech",
        colorScheme: "red-orange-urgent",
        motion: "fast-dynamic",
        duration: 13.3
      }
    },
    transition: { type: "crossfade", duration: 1.0 }
  },
  {
    id: "scene_008",
    index: 8,
    startTime: 67.5,
    endTime: 72.8,
    duration: 5.3,
    script: "Strategy number three: Optimize for the algorithm, but create for humans.",
    visualType: "a-roll",
    aRoll: {
      type: "ai-avatar",
      avatarId: "avatar_host_01",
      provider: "heygen",
      emotion: "thoughtful",
      cameraAngle: "medium-shot",
      sourceUrl: null,
      assetStatus: "generated",
      fittingRequired: true,
      fittingStrategy: "generate_to_duration"
    },
    transition: { type: "dissolve", duration: 0.7 }
  }
];

export const sampleProject = {
  id: "proj_xyz789",
  title: "5 Proven Strategies to Grow Your YouTube Channel in 2024",
  totalDuration: 72.8
};
