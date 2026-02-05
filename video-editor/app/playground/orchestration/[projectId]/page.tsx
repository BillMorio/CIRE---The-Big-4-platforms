"use client";

import { useState, useEffect, useRef, use } from "react";
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Terminal,
  Cpu,
  Plus,
  LayoutGrid
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavSidebar } from "@/components/panels/nav-sidebar";
import { SceneCard } from "@/components/scenes/scene-card";
import { SceneModal } from "@/components/modals/scene-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/use-projects";
import { useScenes, useUpdateScene } from "@/hooks/use-scenes";
import { useAgentState, useResetAgentState, useUpdateAgentState } from "@/hooks/use-agent-state";
import { useParams } from "next/navigation";

export default function DynamicStudioPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  // React Query Hooks (Real Data)
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: dbScenes, isLoading: scenesLoading } = useScenes(projectId);
  const { data: agentMemory } = useAgentState(projectId);
  
  const updateSceneMutation = useUpdateScene(projectId);
  const updateAgentStateMutation = useUpdateAgentState(projectId);
  const resetAgentStateMutation = useResetAgentState(projectId);

  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [localLogs, setLocalLogs] = useState<{msg: string, type: 'system' | 'orchestrator' | 'agent' | 'success' | 'error'}[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Sync internal logs with DB logs
  useEffect(() => {
    if (agentMemory?.last_log) {
        setLocalLogs(prev => {
            // Only add if it's different from the last log to avoid duplicates during polling
            if (prev.length > 0 && prev[prev.length - 1].msg === agentMemory.last_log) return prev;
            return [...prev, { msg: agentMemory.last_log as string, type: 'orchestrator' }];
        });
    }
  }, [agentMemory?.last_log]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localLogs]);

  const addLog = async (msg: string, type: 'system' | 'orchestrator' | 'agent' | 'success' | 'error' = 'system') => {
    setLocalLogs(prev => [...prev.slice(-50), { msg, type }]);
    // Also push to DB for persistence/orchestration memory
    await updateAgentStateMutation.mutateAsync({ last_log: msg });
  };

  const startSimulation = async () => {
    if (!dbScenes) return;
    setIsSimulating(true);
    
    await updateAgentStateMutation.mutateAsync({ workflow_status: 'processing' });
    await addLog("🚀 Simulation Started: Orchestrator taking control.", 'orchestrator');
    
    // Use the Server Action
    const { processNextScene } = await import("@/app/actions/orchestrator");

    // Loop through scenes using a local active flag
    let active = true;
    while (active) {
        const result = await processNextScene(projectId);
        
        console.log("[Studio] Result from scene processor:", result);

        if (result.success && result.message === "Project completed.") {
            await addLog("✅ All scenes processed. Pipeline complete.", 'success');
            active = false;
        } else if (!result.success) {
            if (result.message.includes("inactive") || result.message.includes("completed")) {
                active = false;
            } else {
                console.error("Simulation Error:", result.error || result.message);
                await addLog(`❌ Error: ${result.message}`, 'error');
                active = false;
            }
        }

        // Small pause between scenes for UI visibility/DB polling
        if (active) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    setIsSimulating(false);
  };
  const handleReset = async () => {
    if (confirm("Reset simulation state? This will wipe progress in the database.")) {
        setIsSimulating(false);
        setLocalLogs([{ msg: "Simulation reset by user.", type: 'system' }]);
        
        const { resetProjectSimulation } = await import("@/app/actions/orchestrator");
        await resetProjectSimulation(projectId);
    }
  };

  // Map DB scene format to SceneCard's expected format
  const mappedScenes = dbScenes?.map(s => ({
    ...s,
    startTime: s.start_time,
    endTime: s.end_time,
    duration: s.duration || (s.end_time - s.start_time),
    visualType: s.visual_type,
    directorNote: s.director_notes || s.payload?.directorNote,
    // Add fake structures for the Card UI colors/icons if payload is missing
    aRoll: s.visual_type === 'a-roll' ? { 
      assetStatus: s.status === 'completed' ? 'ready' : (s.status === 'processing' ? 'pending_generation' : 'generated'),
      ...s.payload 
    } : undefined,
    bRoll: s.visual_type === 'b-roll' ? { 
      assetStatus: s.status === 'completed' ? 'ready' : (s.status === 'processing' ? 'pending_generation' : 'generated'),
      ...s.payload 
    } : undefined,
    graphics: s.visual_type === 'graphics' ? { 
      assetStatus: s.status === 'completed' ? 'ready' : (s.status === 'processing' ? 'pending_generation' : 'generated'),
      ...s.payload 
    } : undefined,
    image: s.visual_type === 'image' ? { 
      assetStatus: s.status === 'completed' ? 'ready' : (s.status === 'processing' ? 'pending_generation' : 'generated'),
      ...s.payload 
    } : undefined,
    transition: s.transition || { type: 'none', duration: 0 }
  })) || [];

  if (projectLoading || scenesLoading) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-[10px] technical-label opacity-40 uppercase tracking-widest">Waking up project nodes...</p>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <NavSidebar activeItem="studio" />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">🎬 {project?.title || "Loading Project..."}</h1>
              <p className="text-[10px] technical-label text-muted-foreground uppercase tracking-wider">Project ID: {projectId.slice(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
                onClick={handleReset}
                disabled={isSimulating}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-all disabled:opacity-20"
                title="Reset Database State"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button 
                onClick={startSimulation}
                disabled={isSimulating || agentMemory?.workflow_status === 'completed'}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md technical-label text-[10px] font-bold uppercase tracking-widest transition-all",
                    isSimulating 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : (agentMemory?.workflow_status === 'completed' ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow")
                )}
            >
                {isSimulating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isSimulating ? "SIMULATING..." : (agentMemory?.workflow_status === 'completed' ? "COMPLETED" : "START SIMULATION")}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6 md:p-8 scrollbar-hide bg-muted/5">
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Storyboard Canvas</h1>
                  <p className="text-[10px] technical-label opacity-40 uppercase tracking-widest mt-1">
                    Orchestration Status: <span className="text-primary">{agentMemory?.workflow_status.toUpperCase()}</span> // {project?.total_duration}s total
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4">
                    {mappedScenes.length} SCENES
                  </Badge>
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4 text-green-500 border-green-500/30">
                    {agentMemory?.completed_count || 0} READY
                  </Badge>
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4 text-amber-500 border-amber-500/30">
                    {mappedScenes.length - (agentMemory?.completed_count || 0)} PENDING
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {mappedScenes.map((scene, i) => (
                  <SceneCard 
                    key={scene.id} 
                    scene={scene as any}
                    isSelected={selectedSceneIndex === i}
                    onClick={() => setSelectedSceneIndex(i)}
                    onDoubleClick={() => {
                        setSelectedSceneIndex(i);
                        setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </main>

          <aside className="w-[420px] border-l border-border bg-card/50 flex flex-col shrink-0 backdrop-blur-md">
             <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/10">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-[10px] technical-label font-bold uppercase tracking-widest">Agent Activity Log</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", isSimulating ? "bg-green-500 animate-pulse" : "bg-muted")} />
                    <span className="text-[9px] technical-label opacity-40 uppercase font-bold tracking-widest">
                        {isSimulating ? "LIVE" : "STANDBY"}
                    </span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-mono text-[11px] leading-relaxed scrollbar-hide bg-muted/5">
                {localLogs.map((log, i) => (
                    <div key={i} className={cn(
                        "flex gap-4 animate-in fade-in slide-in-from-right-3 duration-500",
                        log.type === 'success' ? "text-green-400" : log.type === 'orchestrator' ? "text-primary" : log.type === 'agent' ? "text-amber-400/80" : "text-muted-foreground/60"
                    )}>
                        <span className="opacity-10 shrink-0 select-none">{(i+1).toString().padStart(2, '0')}</span>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-tighter w-fit border",
                                    log.type === 'orchestrator' ? "bg-primary/20 text-primary border-primary/20" : 
                                    log.type === 'agent' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                                    log.type === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground/50 border-border"
                                )}>
                                    {log.type}
                                </span>
                            </div>
                            <p className="text-[11px]">{log.msg}</p>
                        </div>
                    </div>
                ))}
                <div ref={logEndRef} />
             </div>

             <div className="p-4 border-t border-border bg-background/50 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] technical-label opacity-30 uppercase tracking-[0.2em]">Active Agent</span>
                    <span className="text-[10px] technical-label font-bold text-primary truncate max-w-[200px]">
                        {agentMemory?.active_agents && agentMemory.active_agents.length > 0 ? agentMemory.active_agents[0] : "IDLE"}
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] technical-label opacity-30 uppercase tracking-[0.2em]">System</span>
                    <p className="text-[10px] technical-label font-bold uppercase text-green-500/80">Active Memory</p>
                </div>
             </div>
          </aside>
        </div>
      </div>

      {/* Modal Integration (DB-Driven) */}
      {selectedSceneIndex !== null && dbScenes && (
          <SceneModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            scene={mappedScenes[selectedSceneIndex] as any}
            onUpdate={async (data) => {
                await updateSceneMutation.mutateAsync({ id: dbScenes[selectedSceneIndex].id, updates: data });
            }}
          />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .technical-label { font-family: var(--font-inter), sans-serif; }
        .shadow-glow { box-shadow: 0 0 20px -5px rgba(var(--primary), 0.3); }
      `}</style>
    </div>
  );
}

// Minimal loader component for inner logic
function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
