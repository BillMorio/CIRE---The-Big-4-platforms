"use client";

import { Plus, Scissors, Play, Music, Clapperboard, Edit3, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SceneEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene?: {
    id: number;
    script: string;
    duration: string;
    shotType: string;
  };
  onUpdate?: (data: any) => void;
}

export function SceneEditorModal({ isOpen, onClose, scene, onUpdate }: SceneEditorModalProps) {
  if (!scene) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden glass border-white/10 shadow-2xl bg-background/80 backdrop-blur-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b border-white/10 shrink-0">
          <div className="space-y-1">
             <DialogTitle className="technical-label text-xs font-black uppercase tracking-[0.2em] opacity-80 flex items-center gap-2 text-foreground">
               <div className="w-2 h-2 rounded-full bg-blue-500 shadow-glow" />
               Edit_Scene_Node_{scene.id.toString().padStart(2, '0')}
             </DialogTitle>
             <DialogDescription className="text-[10px] technical-label opacity-40 uppercase text-muted-foreground">
               Focused_Configuration_Mode // production_v1
             </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            {/* Left Side: Preview & Meta */}
            <div className="p-6 space-y-8 border-r border-white/5 h-full">
               <div className="aspect-video bg-foreground/[0.02] border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Plus className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-all group-hover:scale-110 text-foreground" />
                  <span className="technical-label text-[10px] font-black uppercase tracking-widest opacity-20 mt-2 text-foreground">Update_Visual_Node</span>
                  
                  <div className="absolute bottom-4 left-4 flex gap-2">
                     <Badge className="bg-background/60 border-white/10 text-[8px] technical-label px-2 text-foreground">HD_PREVIEW</Badge>
                     <Badge className="bg-background/60 border-white/10 text-[8px] technical-label px-2 text-foreground">{scene.duration}S</Badge>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40 block text-foreground">Shot Parameters</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[9px] technical-label font-bold uppercase opacity-30 text-foreground">Duration</span>
                        <div className="relative">
                          <Input 
                            value={scene.duration} 
                            onChange={(e) => onUpdate?.({ duration: e.target.value })}
                            className="h-10 bg-foreground/[0.02] border-white/10 text-xs technical-label font-bold pl-3 pr-8 focus:ring-blue-500/50 text-foreground" 
                          />
                          <span className="absolute right-3 top-3 text-[10px] opacity-30 font-bold text-foreground">SEC</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] technical-label font-bold uppercase opacity-30 text-foreground">Shot Type</span>
                        <div className="relative">
                           <select 
                            value={scene.shotType} 
                            onChange={(e) => onUpdate?.({ shotType: e.target.value })}
                            className="w-full h-10 bg-foreground/[0.02] border border-white/10 rounded-md text-xs technical-label font-bold px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-foreground"
                           >
                             <option className="bg-background text-foreground">WIDE_SHOT</option>
                             <option className="bg-background text-foreground">CLOSE_UP</option>
                             <option className="bg-background text-foreground">MEDIUM</option>
                             <option className="bg-background text-foreground">OVER_SHOULDER</option>
                           </select>
                           <Play className="absolute right-3 top-3.5 w-3 h-3 text-blue-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] technical-label font-bold uppercase opacity-30 text-foreground">Transition Node</span>
                    <div className="relative">
                      <Input defaultValue="CROSS_DISSOLVE" className="h-10 bg-foreground/[0.02] border-white/10 text-xs technical-label font-bold pl-3 text-foreground" />
                      <Scissors className="absolute right-3 top-3.5 w-3 h-3 text-red-500" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Right Side: Script & Audio */}
            <div className="p-6 space-y-8 bg-foreground/[0.01] h-full">
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40 text-foreground">Script Processor</label>
                   <Badge variant="outline" className="text-[8px] technical-label opacity-40 px-1 py-0 text-foreground">UTF-8</Badge>
                 </div>
                 <Card className="glass border-white/10 shadow-none bg-foreground/[0.02] transition-colors border-dashed hover:border-white/20">
                   <CardContent 
                     className="p-4 text-[13px] min-h-[200px] focus:outline-none leading-relaxed font-medium text-foreground" 
                     contentEditable
                     suppressContentEditableWarning
                   >
                     {scene.script}
                   </CardContent>
                 </Card>
                 <div className="flex items-center justify-between opacity-40 font-mono text-[9px] text-foreground">
                   <span>CHARS: {scene.script.length}</span>
                   <span className="italic uppercase">/cmd: AI_ENHANCE_SCRIPT</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40 block text-foreground">Audio Engine</label>
                 <div className="p-4 rounded-2xl border border-white/10 bg-foreground/[0.02] flex items-center justify-between group cursor-pointer hover:bg-foreground/[0.04] transition-all">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-glow shadow-green-500/10">
                       <Music className="w-5 h-5 text-green-500" />
                     </div>
                     <div>
                       <p className="text-[11px] font-bold technical-label tracking-tight text-foreground">SYNTH_WAVE_01.MP3</p>
                       <p className="text-[9px] opacity-40 technical-label text-foreground">Loop enabled // 128kbps</p>
                     </div>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
                     <Edit3 className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-white/10 bg-background/40 flex items-center justify-end gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="technical-label text-[10px] font-black uppercase tracking-widest text-foreground">
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white technical-label text-[10px] font-black uppercase tracking-widest px-6 shadow-glow shadow-blue-500/40">
            <Save className="w-4 h-4 mr-2" />
            Apply_Node_Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NoteItem({ type, text, color }: { type: string, text: string, color: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/10 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${color} shadow-glow`} />
          <span className="technical-label text-[9px] font-black uppercase tracking-wider opacity-60">{type}_LOG</span>
        </div>
        <span className="text-[8px] opacity-20 technical-label font-bold">T-02M_AGO</span>
      </div>
      <p className="text-[11px] opacity-70 leading-relaxed font-medium group-hover:opacity-100 transition-opacity">{text}</p>
    </div>
  );
}
