"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  ImageIcon,
  Video,
  Type,
  Music,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AssetLibrary() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`border-r border-white/10 glass transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-white/10">
        {!isCollapsed && <h2 className="technical-label text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Asset Library</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 hover:bg-white/5"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 border-b border-white/5">
           <div className="relative">
            <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted-foreground opacity-50" />
            <Input 
              placeholder="Search source nodes..." 
              className="pl-9 bg-white/[0.02] border-white/10 h-10 text-xs technical-label" 
            />
           </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-2 space-y-2 scrollbar-hide">
        <Category icon={<ImageIcon className="w-4 h-4 text-purple-400" />} label="Images" count={24} collapsed={isCollapsed} />
        <Category icon={<Video className="w-4 h-4 text-blue-400" />} label="Videos" count={12} collapsed={isCollapsed} />
        <Category icon={<Type className="w-4 h-4 text-orange-400" />} label="Graphics" count={8} collapsed={isCollapsed} />
        <Category icon={<Music className="w-4 h-4 text-green-400" />} label="Audio" count={5} collapsed={isCollapsed} />
        
        {/* Recent Assets Preview (only if expanded) */}
        {!isCollapsed && (
          <div className="pt-6 px-2">
            <h3 className="technical-label text-[9px] uppercase tracking-widest opacity-40 mb-3">Recent Imports</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div 
                  key={i} 
                  draggable 
                  onDragStart={(e) => {
                    e.dataTransfer.setData("assetId", `asset-${i}`);
                    e.dataTransfer.setData("assetType", "image");
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  className="aspect-square rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing overflow-hidden group relative"
                >
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Plus className="w-4 h-4 text-white" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="p-4 bg-white/[0.02] border-t border-white/10">
          <Button className="w-full glass border-white/10 font-bold text-xs" variant="outline">
            <Plus className="w-3.5 h-3.5 mr-2" />
            UPLOAD NEW NODE
          </Button>
        </div>
      )}
    </aside>
  );
}

function Category({ icon, label, count, collapsed }: { icon: any, label: string, count: number, collapsed: boolean }) {
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-full aspect-square hover:bg-white/5">
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black border-white/10">
            <p className="technical-label text-xs">{label} ({count})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all border border-transparent hover:border-white/5 group">
      <div className="flex items-center gap-3">
        <span className="opacity-60 grayscale group-hover:grayscale-0 transition-all">{icon}</span>
        <span className="text-xs font-bold technical-label opacity-60 group-hover:opacity-100 transition-all uppercase tracking-wider">{label}</span>
      </div>
      <Badge variant="secondary" className="bg-white/5 text-[9px] technical-label opacity-40 group-hover:opacity-100 transition-all">{count}</Badge>
    </div>
  );
}
