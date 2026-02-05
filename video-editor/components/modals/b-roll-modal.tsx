"use client";

import { Scene } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TwoColumnLayout } from "@/components/ui/resizable-panel-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Film,
  Scissors, 
  ZoomIn,
  Save,
  Search,
  Play,
  Gauge,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Scene;
  onUpdate: (data: Partial<Scene>) => void;
}

export function BRollModal({ isOpen, onClose, scene, onUpdate }: BRollModalProps) {
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(scene.bRoll?.sourceDuration || scene.duration);
  const [zoomType, setZoomType] = useState<"in" | "out" | "none">("none");
  const [startZoom, setStartZoom] = useState(1);
  const [endZoom, setEndZoom] = useState(1.3);
  const [searchQuery, setSearchQuery] = useState(scene.bRoll?.searchQuery || "");
  const [directorNote, setDirectorNote] = useState(scene.directorNote || "");

  const bRoll = scene.bRoll;

  const handleSave = () => {
    onUpdate({
      directorNote,
      bRoll: {
        ...scene.bRoll!,
        searchQuery,
      }
    });
    onClose();
  };

  const leftPanel = (
    <div className="p-6 space-y-6">
      {/* Preview */}
      <div className="aspect-[16/10] bg-muted/10 border border-border rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
        {(scene.final_video_url || scene.asset_url) ? (
          <video 
            src={scene.final_video_url || scene.asset_url}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <>
            <Film className="w-12 h-12 text-muted-foreground/30" />
            <span className="technical-label text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mt-2">
              Stock Footage Preview
            </span>
          </>
        )}
        
        {/* Play Icon Overlay */}
        {(scene.final_video_url || scene.asset_url) && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
              <Play className="w-6 h-6 text-primary fill-current" />
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="outline" className="text-[8px] bg-background/60">
            Source: {bRoll?.sourceDuration?.toFixed(1) || "?"}s
          </Badge>
          <Badge variant="outline" className="text-[8px] bg-background/60 text-primary">
            Target: {scene.duration.toFixed(1)}s
          </Badge>
        </div>
      </div>

      {/* Trim Controls */}
      <div className="space-y-3">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Scissors className="w-3.5 h-3.5" />
          Trim
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground">Start</span>
            <Input 
              type="number" 
              value={trimStart} 
              onChange={(e) => setTrimStart(parseFloat(e.target.value) || 0)}
              className="h-9 text-xs font-mono"
              step={0.1}
              min={0}
            />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground">End</span>
            <Input 
              type="number" 
              value={trimEnd} 
              onChange={(e) => setTrimEnd(parseFloat(e.target.value) || scene.duration)}
              className="h-9 text-xs font-mono"
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Fit to Duration */}
      <div className="space-y-3">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5" />
          Fit to Duration
        </label>
        <div className="p-3 bg-muted/10 border border-border rounded-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Source Duration</span>
            <span className="font-mono">{bRoll?.sourceDuration?.toFixed(1) || "?"}s</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Target Duration</span>
            <span className="font-mono font-bold text-primary">{scene.duration.toFixed(1)}s</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Strategy</span>
            <Badge variant="outline" className="text-[8px]">
              {bRoll?.fittingStrategy || "trim"}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full h-9 text-[10px] technical-label">
          <Play className="w-3 h-3 mr-1" /> Apply Fit
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="space-y-3">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ZoomIn className="w-3.5 h-3.5" />
          Zoom Effect
        </label>
        <div className="flex gap-2">
          {(["none", "in", "out"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setZoomType(type)}
              className={cn(
                "flex-1 h-9 rounded-md border text-[10px] technical-label font-bold uppercase transition-colors",
                zoomType === type 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted/10 border-border hover:bg-muted/20"
              )}
            >
              {type === "none" ? "None" : type === "in" ? "Zoom In" : "Zoom Out"}
            </button>
          ))}
        </div>
        
        {zoomType !== "none" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground">Start Zoom</span>
              <Input 
                type="number" 
                value={startZoom} 
                onChange={(e) => setStartZoom(parseFloat(e.target.value) || 1)}
                className="h-9 text-xs font-mono"
                step={0.1}
                min={1}
                max={3}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground">End Zoom</span>
              <Input 
                type="number" 
                value={endZoom} 
                onChange={(e) => setEndZoom(parseFloat(e.target.value) || 1.3)}
                className="h-9 text-xs font-mono"
                step={0.1}
                min={1}
                max={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const rightPanel = (
    <div className="p-6 space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Search className="w-3.5 h-3.5" />
          Search Stock Footage
        </label>
        <div className="flex gap-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Pexels..."
            className="h-9 text-xs"
          />
          <Button variant="outline" size="sm" className="h-9 px-4">
            <Search className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Search Results Placeholder */}
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="aspect-video bg-muted/10 border border-border rounded-md flex items-center justify-center hover:border-primary/50 cursor-pointer transition-colors"
          >
            <Film className="w-6 h-6 text-muted-foreground/20" />
          </div>
        ))}
      </div>

      {/* Generate B-Roll */}
      <div className="space-y-3 pt-4 border-t border-border">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Generate B-Roll
        </label>
        <p className="text-[11px] text-muted-foreground">
          Generate custom B-roll footage using AI based on your script context.
        </p>
        <Button variant="outline" className="w-full h-10 text-[10px] technical-label font-bold">
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          Generate with AI
        </Button>
      </div>

      {/* Script & Director Note */}
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
            Script Context
          </label>
          <div className="p-3 bg-muted/10 border border-border rounded-md">
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{scene.script}</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-amber-500/80 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Director's Intent
          </label>
          <Textarea 
            value={directorNote}
            onChange={(e) => setDirectorNote(e.target.value)}
            placeholder="Visual vibe, energy, or specific cinematic instructions..."
            className="min-h-[100px] text-xs italic bg-amber-500/5 border-amber-500/20 focus-visible:border-amber-500/40"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border border-border dark:border-2 dark:border-border/80 shadow-2xl h-[85vh] flex flex-col" style={{ backgroundColor: 'hsl(var(--background))', opacity: 1 }}>
        <DialogHeader className="p-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="technical-label text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                B-Roll Editor // Scene {scene.index.toString().padStart(2, '0')}
              </DialogTitle>
              <DialogDescription className="text-[10px] technical-label opacity-60 uppercase">
                Stock Footage Configuration
              </DialogDescription>
            </div>
            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-[9px] technical-label">
              {bRoll?.provider?.toUpperCase() || "PEXELS"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <TwoColumnLayout 
            leftPanel={leftPanel}
            rightPanel={rightPanel}
          />
        </div>

        <DialogFooter className="p-4 border-t border-border bg-background/50 flex items-center justify-end gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="technical-label text-[10px] font-bold uppercase">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground technical-label text-[10px] font-bold uppercase px-6">
            <Save className="w-3.5 h-3.5 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
