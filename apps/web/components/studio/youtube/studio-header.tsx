"use client";

import { ChevronLeft, Share2, Sparkles, Clapperboard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link";

interface StudioHeaderProps {
  title: string;
  onSave?: () => void;
  onExport?: () => void;
  onAiSuggest?: () => void;
  onGenerateStoryboard?: () => void;
}

export function StudioHeader({ 
  title, 
  onSave, 
  onExport, 
  onAiSuggest, 
  onGenerateStoryboard 
}: StudioHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-3 md:px-6 border-b border-white/10 glass sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        <SidebarTrigger className="h-9 w-9 text-muted-foreground shrink-0" />
        <Button variant="ghost" size="icon" asChild className="hover:bg-white/5 shrink-0 hidden sm:flex">
          <Link href="/editor">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
        </Button>
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-[13px] sm:text-lg font-black tracking-tight text-gradient truncate max-w-[100px] sm:max-w-none">{title}</h1>
          <p className="technical-label text-[9px] md:text-[10px] opacity-40 uppercase tracking-widest hidden sm:block truncate">Studio // Production v1.0</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="glass border-white/10 hover:bg-white/10 h-9 px-2 sm:px-4"
          onClick={onAiSuggest}
        >
          <Sparkles className="w-4 h-4 text-yellow-500 sm:mr-2" />
          <span className="hidden sm:inline">AI Suggest</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="glass border-white/10 hover:bg-white/10 h-9 px-2 sm:px-4"
          onClick={onGenerateStoryboard}
        >
          <Clapperboard className="w-4 h-4 text-blue-500 sm:mr-2" />
          <span className="hidden xl:inline">Generate Storyboard</span>
          <span className="hidden sm:inline xl:hidden">Generate</span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1 bg-white/10 hidden md:block" />
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSave}
          className="hover:bg-white/5 h-9 px-3 hidden md:flex"
        >
          <Save className="w-4 h-4 md:mr-2" />
          <span className="hidden lg:inline">Save Project</span>
          <span className="hidden md:inline lg:hidden">Save</span>
        </Button>
        
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white font-black h-9 px-3 sm:px-6 shadow-glow text-[10px] md:text-xs tracking-widest uppercase"
          onClick={onExport}
        >
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
}
