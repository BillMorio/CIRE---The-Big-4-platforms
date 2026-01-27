"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function StudioLoadingOverlay({ message }: { message: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="glass p-8 rounded-2xl border-white/10 max-w-sm w-full space-y-4 shadow-glow active-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 animate-pulse">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div>
             <h3 className="technical-label text-xs font-black uppercase tracking-widest">{message}</h3>
             <p className="description-label text-[10px] opacity-40">AI_PROCESSING_ACTIVE</p>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-white/5" />
        <div className="flex justify-between items-center opacity-40 font-mono text-[9px]">
          <span>PHASE: OPTIMIZING_STORYBOARD</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export function StudioToast({ message, type = "success" }: { message: string, type?: "success" | "error" }) {
  return (
    <div className="fixed top-20 right-4 z-[101] animate-in slide-in-from-right fade-in duration-300">
      <div className={`glass px-4 py-3 rounded-xl border-white/10 flex items-center gap-3 shadow-2xl ${type === 'error' ? 'border-red-500/20' : 'border-green-500/20'}`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        <span className="technical-label text-[10px] font-black uppercase tracking-tight opacity-80">{message}</span>
      </div>
    </div>
  );
}
