"use client";

import { Scissors, Play, Plus, User, Film, Sparkles, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scene, VisualType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

// Visual type configuration
const VISUAL_TYPE_CONFIG: Record<VisualType, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  "a-roll": {
    label: "A-ROLL",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  "b-roll": {
    label: "B-ROLL",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  "graphics": {
    label: "GRAPHICS",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  "image": {
    label: "IMAGE",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30"
  }
};

export function SceneCard({ 
  scene,
  isSelected, 
  onClick,
  onDoubleClick
}: SceneCardProps) {
  // Get asset data based on visual type
  const getAssetData = () => {
    switch (scene.visualType) {
      case "a-roll":
        return { provider: scene.aRoll?.provider, status: scene.aRoll?.assetStatus };
      case "b-roll":
        return { provider: scene.bRoll?.provider, status: scene.bRoll?.assetStatus };
      case "graphics":
        return { provider: scene.graphics?.provider, status: scene.graphics?.assetStatus };
      case "image":
        return { provider: scene.image?.provider, status: scene.image?.assetStatus };
      default:
        return { provider: undefined, status: undefined };
    }
  };

  const { provider, status: assetStatus } = getAssetData();
  const typeConfig = VISUAL_TYPE_CONFIG[scene.visualType];

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "ready":
      case "generated":
        return "bg-green-500";
      case "pending_generation":
        return "bg-amber-500";
      default:
        return "bg-muted-foreground";
    }
  };

  const getProviderIcon = () => {
    switch (scene.visualType) {
      case "a-roll":
        return <User className="w-3 h-3" />;
      case "b-roll":
        return <Film className="w-3 h-3" />;
      case "graphics":
        return <Sparkles className="w-3 h-3" />;
      case "image":
        return <ImageIcon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Get fitting strategy label
  const getFittingLabel = () => {
    switch (scene.visualType) {
      case "a-roll":
        return scene.aRoll?.fittingStrategy;
      case "b-roll":
        return scene.bRoll?.fittingStrategy;
      case "graphics":
        return scene.graphics?.fittingStrategy;
      case "image":
        return scene.image?.fittingStrategy;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "glass border-border overflow-hidden group transition-all cursor-pointer",
        isSelected 
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary/50 shadow-glow bg-card" 
          : "hover:scale-[1.01] hover:border-border/80"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden">
        {/* Top left - Scene number badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "text-[9px] technical-label font-bold tracking-widest px-2 py-0.5",
              isSelected ? "bg-primary/20 text-primary border-primary/30" : "bg-background/60 opacity-80"
            )}
          >
            {scene.index.toString().padStart(2, '0')}
          </Badge>
        </div>

        {/* Top right - Visual type badge + Status */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "text-[8px] technical-label font-bold tracking-wider px-1.5 py-0.5",
              typeConfig.color,
              typeConfig.borderColor,
              typeConfig.bgColor
            )}
          >
            {typeConfig.label}
          </Badge>
          <div className={cn("w-2 h-2 rounded-full", getStatusColor(assetStatus))} />
        </div>
        
        {/* Empty state / Provider indicator */}
        <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
          <div className={cn(
            "w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center",
            typeConfig.bgColor
          )}>
            {getProviderIcon() || <Plus className="w-6 h-6" />}
          </div>
          <span className="technical-label text-[9px] font-bold uppercase tracking-wider">
            {provider?.toUpperCase() || "NO ASSET"}
          </span>
        </div>
        
        {/* Bottom overlay with timing */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[9px] technical-label font-bold text-foreground/80">
                <Scissors className="w-3 h-3 text-destructive/70" /> 
                {scene.duration.toFixed(1)}s
              </div>
              <div className="flex items-center gap-1 text-[9px] technical-label font-bold text-foreground/80">
                <Play className="w-3 h-3 text-primary/70" /> 
                {scene.transition.type.toUpperCase()}
              </div>
            </div>
            {getFittingLabel() && getFittingLabel() !== "none" && (
              <Badge variant="outline" className="text-[8px] opacity-60 py-0">
                {getFittingLabel()?.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 bg-card/80 space-y-2">
        <p className={cn(
          "text-[12px] line-clamp-2 leading-relaxed font-medium transition-colors",
          isSelected ? "text-foreground" : "text-foreground/90"
        )}>
          {scene.script}
        </p>
        
        {scene.directorNote && (
          <div className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 space-y-1 group/note relative">
            <div className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500/70" />
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/40">Director's Intent</span>
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-tight line-clamp-2">
              {scene.directorNote}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
