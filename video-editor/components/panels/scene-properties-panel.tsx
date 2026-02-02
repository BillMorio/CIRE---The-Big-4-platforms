"use client";

import { Scene } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Film, 
  Clock, 
  Sparkles, 
  Video,
  Image,
  Wand2,
  ArrowRight
} from "lucide-react";

interface ScenePropertiesPanelProps {
  scene: Scene | null;
  onUpdate?: (data: Partial<Scene>) => void;
}

export function ScenePropertiesPanel({ scene, onUpdate }: ScenePropertiesPanelProps) {
  if (!scene) {
    return (
      <aside className="w-80 h-full border-l border-border bg-card/30 p-6 flex flex-col items-center justify-center text-center shrink-0">
        <div className="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center mb-4">
          <Film className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">Select a scene to view properties</p>
      </aside>
    );
  }

  const isARoll = scene.visualType === "a-roll";
  const provider = isARoll ? scene.aRoll?.provider : scene.bRoll?.provider;
  const assetStatus = isARoll ? scene.aRoll?.assetStatus : scene.bRoll?.assetStatus;

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "ready":
      case "generated":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "pending_generation":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getProviderIcon = (prov: string | undefined) => {
    switch (prov) {
      case "heygen":
        return <User className="w-3.5 h-3.5" />;
      case "pexels":
        return <Image className="w-3.5 h-3.5" />;
      case "veo3":
        return <Wand2 className="w-3.5 h-3.5" />;
      case "hera-ai":
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Video className="w-3.5 h-3.5" />;
    }
  };

  return (
    <aside className="w-80 h-full border-l border-border bg-card/30 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs technical-label font-bold uppercase tracking-widest text-muted-foreground">
            Scene Properties
          </h3>
          <Badge 
            variant="outline" 
            className={`text-[9px] technical-label ${isARoll ? 'text-blue-500 border-blue-500/30' : 'text-purple-500 border-purple-500/30'}`}
          >
            {scene.visualType.toUpperCase()}
          </Badge>
        </div>
        <p className="text-lg font-bold">Scene {scene.index.toString().padStart(2, '0')}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {/* Timing */}
        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Timing
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground">Start</span>
              <div className="h-9 px-3 bg-muted/20 border border-border rounded-md flex items-center text-xs font-mono">
                {scene.startTime.toFixed(1)}s
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground">End</span>
              <div className="h-9 px-3 bg-muted/20 border border-border rounded-md flex items-center text-xs font-mono">
                {scene.endTime.toFixed(1)}s
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground">Duration</span>
              <div className="h-9 px-3 bg-primary/10 border border-primary/30 rounded-md flex items-center text-xs font-mono text-primary font-bold">
                {scene.duration.toFixed(1)}s
              </div>
            </div>
          </div>
        </div>

        {/* Asset Info */}
        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Video className="w-3.5 h-3.5" />
            Asset
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/10 border border-border rounded-md">
              <div className="flex items-center gap-2">
                {getProviderIcon(provider)}
                <span className="text-xs font-medium uppercase">{provider || "Unknown"}</span>
              </div>
              <Badge variant="outline" className={`text-[9px] ${getStatusColor(assetStatus)}`}>
                {assetStatus?.replace("_", " ") || "N/A"}
              </Badge>
            </div>

            {isARoll && scene.aRoll && (
              <div className="p-3 bg-muted/5 border border-border rounded-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Camera</span>
                  <span className="font-medium uppercase text-[10px]">{scene.aRoll.cameraAngle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Emotion</span>
                  <span className="font-medium">{scene.aRoll.emotion}</span>
                </div>
              </div>
            )}

            {!isARoll && scene.bRoll && (
              <div className="p-3 bg-muted/5 border border-border rounded-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium uppercase text-[10px]">{scene.bRoll.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fitting</span>
                  <span className="font-medium">{scene.bRoll.fittingStrategy}</span>
                </div>
                {scene.bRoll.prompt && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-[9px] text-muted-foreground block mb-1">Prompt</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{scene.bRoll.prompt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transition */}
        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5" />
            Transition
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-9 px-3 bg-muted/20 border border-border rounded-md flex items-center text-xs font-medium uppercase">
              {scene.transition.type}
            </div>
            <div className="h-9 px-3 bg-muted/20 border border-border rounded-md flex items-center text-xs font-mono">
              {scene.transition.duration}s
            </div>
          </div>
        </div>

        {/* Script */}
        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
            Script
          </label>
          <div className="p-3 bg-muted/10 border border-border rounded-md">
            <p className="text-sm leading-relaxed text-foreground/90">{scene.script}</p>
          </div>
          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
            <span>{scene.script.length} chars</span>
            <span>~{Math.ceil(scene.script.split(' ').length / 2.5)}s read time</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
