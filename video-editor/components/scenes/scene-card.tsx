"use client";

import { MoreVertical, Scissors, Play, Plus, GripVertical, User, Image, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Scene } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SceneCard({ 
  scene,
  isSelected, 
  onClick
}: SceneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const isARoll = scene.visualType === "a-roll";
  const provider = isARoll ? scene.aRoll?.provider : scene.bRoll?.provider;
  const assetStatus = isARoll ? scene.aRoll?.assetStatus : scene.bRoll?.assetStatus;

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
    switch (provider) {
      case "heygen":
        return <User className="w-3 h-3" />;
      case "pexels":
        return <Image className="w-3 h-3" />;
      case "veo3":
        return <Wand2 className="w-3 h-3" />;
      case "hera-ai":
        return <Sparkles className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass border-border overflow-hidden group transition-all cursor-pointer",
        isSelected 
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary/50 shadow-glow bg-card" 
          : "hover:scale-[1.01] hover:border-border/80"
      )}
      onClick={onClick}
    >
      <div className="aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden">
        {/* Top left - Drag handle + Scene badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners}
            style={{ touchAction: 'none' }}
            className="h-7 w-7 flex items-center justify-center rounded-md bg-background/60 hover:bg-background/80 border border-border cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
          </div>
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
              isARoll 
                ? "text-blue-400 border-blue-500/30 bg-blue-500/10" 
                : "text-purple-400 border-purple-500/30 bg-purple-500/10"
            )}
          >
            {isARoll ? "A-ROLL" : "B-ROLL"}
          </Badge>
          <div className={cn("w-2 h-2 rounded-full", getStatusColor(assetStatus))} />
        </div>
        
        {/* Empty state / Provider indicator */}
        <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
          <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
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
            {isARoll && scene.aRoll && (
              <Badge variant="outline" className="text-[8px] opacity-60 py-0">
                {scene.aRoll.cameraAngle}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 bg-card/50">
        <p className={cn(
          "text-[11px] line-clamp-2 leading-relaxed font-medium transition-colors",
          isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
        )}>
          {scene.script}
        </p>
      </CardContent>
    </Card>
  );
}
