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
import { 
  Sparkles,
  Scissors, 
  Save,
  Play,
  Gauge,
  Upload,
  Wand2,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GraphicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Scene;
  onUpdate: (data: Partial<Scene>) => void;
}

type Provider = "hera-ai" | "veo3";

export function GraphicsModal({ isOpen, onClose, scene, onUpdate }: GraphicsModalProps) {
  const [activeTab, setActiveTab] = useState<Provider>(scene.graphics?.provider || "hera-ai");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(scene.duration);
  
  const [heraPrompt, setHeraPrompt] = useState(scene.graphics?.prompt || "");
  const [heraDuration, setHeraDuration] = useState(scene.duration);
  
  const [veoPrompt, setVeoPrompt] = useState("");
  const [veoDuration, setVeoDuration] = useState(Math.min(8, scene.duration));

  const graphics = scene.graphics;

  const handleSave = () => {
    onUpdate({
      graphics: {
        ...scene.graphics!,
        provider: activeTab,
        prompt: activeTab === "hera-ai" ? heraPrompt : veoPrompt,
      }
    });
    onClose();
  };

  const leftPanel = (
    <div className="p-6 space-y-6">
      {/* Preview */}
      <div className="aspect-[16/10] bg-muted/10 border border-border rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
        <Sparkles className="w-12 h-12 text-muted-foreground/30" />
        <span className="technical-label text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mt-2">
          Motion Graphics Preview
        </span>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="outline" className="text-[8px] bg-background/60">{scene.duration.toFixed(1)}s</Badge>
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
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 px-3 bg-muted/10 border border-border rounded-md flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Target:</span>
            <span className="text-xs font-mono font-bold">{scene.duration.toFixed(1)}s</span>
          </div>
          <Button variant="outline" size="sm" className="h-9 text-[10px] technical-label">
            <Play className="w-3 h-3 mr-1" /> Apply Fit
          </Button>
        </div>
      </div>

      {/* Script Context */}
      <div className="space-y-3">
        <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
          Script Context
        </label>
        <div className="p-3 bg-muted/10 border border-border rounded-md">
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{scene.script}</p>
        </div>
      </div>
    </div>
  );

  const rightPanel = (
    <div className="p-6 space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("hera-ai")}
          className={cn(
            "flex-1 h-10 rounded-md border text-[10px] technical-label font-bold uppercase transition-colors flex items-center justify-center gap-2",
            activeTab === "hera-ai" 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30" 
              : "bg-muted/10 border-border hover:bg-muted/20"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" /> Hera AI
        </button>
        <button
          onClick={() => setActiveTab("veo3")}
          className={cn(
            "flex-1 h-10 rounded-md border text-[10px] technical-label font-bold uppercase transition-colors flex items-center justify-center gap-2",
            activeTab === "veo3" 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30" 
              : "bg-muted/10 border-border hover:bg-muted/20"
          )}
        >
          <Wand2 className="w-3.5 h-3.5" /> Veo 3.1
        </button>
      </div>

      {/* Hera AI Tab */}
      {activeTab === "hera-ai" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
              Prompt
            </label>
            <textarea 
              value={heraPrompt}
              onChange={(e) => setHeraPrompt(e.target.value)}
              placeholder="Describe the motion graphics you want to generate..."
              className="w-full h-24 p-3 bg-muted/10 border border-border rounded-md text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
              Reference Image (Optional)
            </label>
            <div className="aspect-video bg-muted/10 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground mt-2">Drop image or click to upload</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Duration
            </label>
            <Input 
              type="number" 
              value={heraDuration}
              onChange={(e) => setHeraDuration(parseFloat(e.target.value) || scene.duration)}
              className="h-9 text-xs font-mono"
              step={0.5}
              min={1}
            />
          </div>

          <Button className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white technical-label text-[10px] font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Generate with Hera AI
          </Button>
        </div>
      )}

      {/* Veo 3.1 Tab */}
      {activeTab === "veo3" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
                Start Image
              </label>
              <div className="aspect-square bg-muted/10 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground/30" />
                <span className="text-[9px] text-muted-foreground mt-1">First Frame</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
                End Image
              </label>
              <div className="aspect-square bg-muted/10 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground/30" />
                <span className="text-[9px] text-muted-foreground mt-1">Last Frame</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground">
              Prompt
            </label>
            <textarea 
              value={veoPrompt}
              onChange={(e) => setVeoPrompt(e.target.value)}
              placeholder="Describe the transition/motion between frames..."
              className="w-full h-20 p-3 bg-muted/10 border border-border rounded-md text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] technical-label font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Duration</span>
              <span className="text-amber-500">Max 8 seconds</span>
            </label>
            <Input 
              type="number" 
              value={veoDuration}
              onChange={(e) => setVeoDuration(Math.min(8, parseFloat(e.target.value) || 5))}
              className="h-9 text-xs font-mono"
              step={0.5}
              min={1}
              max={8}
            />
          </div>

          <Button className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white technical-label text-[10px] font-bold uppercase">
            <Wand2 className="w-3.5 h-3.5 mr-2" />
            Generate with Veo 3.1
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border border-border dark:border-2 dark:border-border/80 shadow-2xl h-[85vh] flex flex-col" style={{ backgroundColor: 'hsl(var(--background))', opacity: 1 }}>
        <DialogHeader className="p-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="technical-label text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Graphics Editor // Scene {scene.index.toString().padStart(2, '0')}
              </DialogTitle>
              <DialogDescription className="text-[10px] technical-label opacity-60 uppercase">
                Motion Graphics Generation
              </DialogDescription>
            </div>
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[9px] technical-label">
              {activeTab.toUpperCase()}
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
