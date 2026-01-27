"use client";

import { Plus, Scissors, Play, Music, Clapperboard, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PropertiesPanelProps {
  scene?: {
    id: number;
    script: string;
    duration: string;
    shotType: string;
  };
  onUpdate?: (data: any) => void;
}

export function PropertiesPanel({ scene, onUpdate }: PropertiesPanelProps) {
  return (
    <aside className="w-80 border-l border-white/10 glass flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 h-16 flex items-center">
        <h2 className="technical-label text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Scene Parameters</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-8 scrollbar-hide pb-20">
         <div className="space-y-3">
           <div className="flex items-center justify-between">
             <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40">Script Processor</label>
             <Badge variant="outline" className="text-[8px] technical-label opacity-40 px-1 py-0">UTF-8</Badge>
           </div>
           <Card className="glass border-white/10 shadow-none bg-white/[0.02] active:bg-white/[0.04] transition-colors border-dashed hover:border-white/20">
             <CardContent 
               className="p-4 text-xs min-h-[160px] focus:outline-none leading-relaxed font-medium" 
               contentEditable
               suppressContentEditableWarning
             >
               {scene?.script || "Select a scene to edit its script..."}
             </CardContent>
           </Card>
           <div className="flex items-center justify-between opacity-40 font-mono text-[9px]">
             <span>CHARS: {scene?.script?.length || 0}</span>
             <span className="italic uppercase">/cmd: focus_ai</span>
           </div>
         </div>

         <div className="space-y-4">
            <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40 block">Production Meta</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-[9px] technical-label font-bold uppercase opacity-30">Duration</span>
                <div className="relative">
                  <Input 
                    value={scene?.duration || "0.00"} 
                    onChange={(e) => onUpdate?.({ duration: e.target.value })}
                    className="h-10 bg-white/[0.02] border-white/10 text-xs technical-label font-bold pl-3 pr-8" 
                  />
                  <span className="absolute right-3 top-3 text-[10px] opacity-30 font-bold">SEC</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] technical-label font-bold uppercase opacity-30">Shot Type</span>
                <div className="relative">
                   <select 
                    value={scene?.shotType || "WIDE_SHOT"} 
                    onChange={(e) => onUpdate?.({ shotType: e.target.value })}
                    className="w-full h-10 bg-white/[0.02] border border-white/10 rounded-md text-xs technical-label font-bold px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                   >
                     <option>WIDE_SHOT</option>
                     <option>CLOSE_UP</option>
                     <option>MEDIUM</option>
                     <option>OVER_SHOULDER</option>
                   </select>
                   <Play className="absolute right-3 top-3.5 w-3 h-3 text-blue-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[9px] technical-label font-bold uppercase opacity-30">Transition Node</span>
              <div className="relative">
                <Input defaultValue="CROSS_DISSOLVE" className="h-10 bg-white/[0.02] border-white/10 text-xs technical-label font-bold pl-3" />
                <Scissors className="absolute right-3 top-3.5 w-3 h-3 text-red-500" />
              </div>
            </div>
         </div>

         <div className="space-y-4 pt-4">
           <div className="flex items-center justify-between border-b border-white/5 pb-2">
             <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40">Production Notes</label>
             <button className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
               <Plus className="w-3 h-3" />
             </button>
           </div>
           <div className="space-y-3">
             <NoteItem type="Director" text="Ensure background blur remains consistent during transition." color="bg-red-500" />
             <NoteItem type="Visual" text="Add subtle parallax on the background images." color="bg-green-500" />
             <NoteItem type="Edit" text="Cut strictly on the beat drop." color="bg-yellow-500" />
           </div>
         </div>

         <div className="space-y-4 pt-4">
           <label className="technical-label text-[10px] font-black uppercase tracking-widest opacity-40 block">Audio Engine</label>
           <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                 <Music className="w-4 h-4 text-green-500" />
               </div>
               <div>
                 <p className="text-[10px] font-bold technical-label tracking-tight">SYNTH_WAVE_01.MP3</p>
                 <p className="text-[9px] opacity-40 technical-label">Loop Enabled</p>
               </div>
             </div>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit3 className="w-3 h-3 opacity-40" />
             </div>
           </div>
         </div>
      </div>
    </aside>
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
