"use client";

import { MoreVertical, Scissors, Play, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Note: In a real app, you'd pass the actual scene object here. 
// For now, we'll keep it simple but use the index to show we're dynamic.
interface SceneCardProps {
  id: string | number;
  index: number;
  script?: string;
  duration?: string;
  shotType?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onDropAsset?: (assetId: string) => void;
}

export function SceneCard({ 
  id,
  index, 
  script,
  duration,
  shotType,
  isSelected, 
  onClick, 
  onDropAsset
}: SceneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`glass border-white/10 overflow-hidden group transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background border-blue-500/50 shadow-glow bg-white/[0.04]' : 'hover:scale-[1.01]'
      }`}
      onDragOver={(e) => {
        // Keep asset dropping functionality
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const assetId = e.dataTransfer.getData("assetId");
        if (assetId && onDropAsset) {
          onDropAsset(assetId);
        }
      }}
      onClick={onClick}
    >
      <div className="aspect-video bg-white/[0.03] relative flex items-center justify-center overflow-hidden cursor-pointer">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners}
            style={{ touchAction: 'none' }}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/40 hover:bg-black/60 glass border-white/10 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-4 h-4 text-white/40 group-hover:text-white/80" />
          </div>
          <Badge className={`backdrop-blur-xl border-white/10 text-[9px] technical-label font-black tracking-widest px-2 py-0.5 ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-black/60 opacity-60'}`}>
            NODE_SCENE_{index.toString().padStart(2, '0')}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/40 hover:bg-black/60 glass border-white/10">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Mock for thumbnail / empty state */}
        <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
           <Plus className="w-8 h-8" />
           <span className="technical-label text-[10px] font-black uppercase tracking-tighter">Null_Visual_Node</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-1.5 text-[10px] technical-label font-bold text-white shadow-sm">
               <Scissors className="w-3 h-3 text-red-500" /> 
               {duration || "15.0"}S
             </div>
             <div className="flex items-center gap-1.5 text-[10px] technical-label font-bold text-white shadow-sm">
               <Play className="w-3 h-3 text-blue-500" /> 
               {shotType || "WIDE_SHOT"}
             </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4 bg-white/[0.01]">
        <p className={`text-[12px] line-clamp-2 leading-relaxed font-medium transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'}`}>
          {script || "No script content provided for this node..."}
        </p>
      </CardContent>
    </Card>
  );
}
