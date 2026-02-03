// Scene data types based on the example-output-for-scene.json schema
// Visual Types: a-roll (avatar), b-roll (stock footage), graphics (motion graphics), image (static images)

export type VisualType = "a-roll" | "b-roll" | "graphics" | "image";

export interface Transition {
  type: "fade" | "crossfade" | "wipe" | "dissolve" | "none";
  duration: number;
  direction?: "in" | "out" | "left" | "right";
}

// A-Roll: AI Avatar / Talking Head
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

// B-Roll: Stock Footage / Real-world video
export interface BRoll {
  type: "stock-footage";
  provider: "pexels" | "storyblocks";
  searchQuery: string;
  videoId?: string;
  sourceUrl: string | null;
  sourceDuration: number | null;
  targetDuration: number;
  assetStatus: "pending_generation" | "generated" | "ready";
  fittingRequired: boolean;
  fittingStrategy: "trim" | "slowdown" | "speedup" | "none";
  speedFactor?: number;
  trimStart?: number;
  trimEnd?: number;
}

// Graphics: Motion Graphics / Animations
export interface Graphics {
  type: "motion-graphic";
  provider: "veo3" | "hera-ai";
  prompt: string;
  sourceUrl: string | null;
  sourceDuration: number | null;
  targetDuration: number;
  assetStatus: "pending_generation" | "generated" | "ready";
  fittingRequired: boolean;
  fittingStrategy: "generate_to_duration" | "trim" | "slowdown" | "none";
  speedFactor?: number;
  generationParams?: {
    style: string;
    colorScheme?: string;
    motion: string;
    duration: number;
  };
}

// Image: Static images used as footage (with optional Ken Burns effect)
export interface ImageAsset {
  type: "static-image";
  provider: "pexels" | "unsplash" | "upload";
  searchQuery?: string;
  imageId?: string;
  sourceUrl: string | null;
  targetDuration: number;
  assetStatus: "pending_generation" | "generated" | "ready";
  fittingRequired: boolean;
  fittingStrategy: "zoom-in" | "zoom-out" | "pan" | "static" | "none";
  zoomParams?: {
    startZoom: number;
    endZoom: number;
    centerX: number;
    centerY: number;
  };
}

export interface Scene {
  id: string;
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
  script: string;
  visualType: VisualType;
  aRoll?: ARoll;
  bRoll?: BRoll;
  graphics?: Graphics;
  image?: ImageAsset;
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
    graphicsScenes: number;
    imageScenes: number;
    assetsGenerated: number;
    assetsPendingGeneration: number;
    assetsReady: number;
  };
}
