// Scene data types based on the example-output-for-scene.json schema

export interface Transition {
  type: "fade" | "crossfade" | "wipe" | "dissolve";
  duration: number;
  direction?: "in" | "out" | "left" | "right";
}

export interface ARoll {
  type: "ai-avatar";
  avatarId: string;
  provider: "heygen";
  emotion: string;
  cameraAngle: "close-up" | "medium-shot" | "wide-shot";
  sourceUrl: string | null;
  assetStatus: "pending_generation" | "generated" | "ready";
  fittingRequired: boolean;
  fittingStrategy: "generate_to_duration" | "none";
}

export interface BRoll {
  type: "stock-footage" | "motion-graphic";
  provider: "pexels" | "veo3" | "hera-ai";
  prompt?: string;
  searchQuery?: string;
  videoId?: string;
  sourceUrl: string | null;
  sourceDuration: number | null;
  targetDuration: number;
  assetStatus: "pending_generation" | "generated" | "ready";
  fittingRequired: boolean;
  fittingStrategy: "generate_to_duration" | "trim" | "slowdown" | "none";
  speedFactor?: number;
  trimStart?: number;
  trimEnd?: number;
  generationParams?: {
    style: string;
    colorScheme?: string;
    motion: string;
    duration: number;
  };
}

export interface Scene {
  id: string;
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
  script: string;
  visualType: "a-roll" | "b-roll";
  aRoll?: ARoll;
  bRoll?: BRoll;
  transition: Transition;
}

export interface Project {
  id: string;
  title: string;
  totalDuration: number;
  masterVoiceover?: {
    url: string;
    duration: number;
    transcriptUrl: string;
  };
}

export interface ProjectData {
  project: Project;
  scenes: Scene[];
  metadata: {
    totalScenes: number;
    aRollScenes: number;
    bRollScenes: number;
    stockFootageCount: number;
    motionGraphicCount: number;
    assetsGenerated: number;
    assetsPendingGeneration: number;
    assetsReady: number;
  };
}
