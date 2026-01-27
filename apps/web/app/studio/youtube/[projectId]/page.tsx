"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudioHeader } from "@/components/studio/youtube/studio-header";
import { AssetLibrary } from "@/components/studio/youtube/asset-library";
import { SceneCard as StudioSceneCard } from "@/components/studio/youtube/scene-card";
import { SceneEditorModal } from "@/components/studio/youtube/scene-editor-modal";
import { StudioLoadingOverlay, StudioToast } from "@/components/studio/youtube/studio-feedback";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  TouchSensor
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';

export default function YouTubeStudioPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scenes, setScenes] = useState<any[]>([
    { id: 1, script: "Welcome to the first scene...", duration: "15.00", shotType: "WIDE_SHOT" },
    { id: 2, script: "The quick brown fox...", duration: "10.00", shotType: "CLOSE_UP" },
    { id: 3, script: "Another scene node...", duration: "12.00", shotType: "MEDIUM" },
    { id: 4, script: "Fourth visual node...", duration: "08.00", shotType: "OVER_SHOULDER" },
    { id: 5, script: "Fifth content block...", duration: "20.00", shotType: "WIDE_SHOT" },
    { id: 6, script: "Sixth and final...", duration: "15.00", shotType: "CLOSE_UP" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const simulateAiAction = (message: string, successMessage: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
    setTimeout(() => {
      setIsLoading(false);
      showToast(successMessage);
    }, 2500);
  };

  const generateStoryboard = () => {
    simulateAiAction("ANALYZING_SCRIPT_NODES", "STORYBOARD_GENERATED_SUCCESSFULLY");
    setScenes([
      { id: 1, script: "New Scene 1...", duration: "10s", shotType: "WIDE" },
      { id: 2, script: "New Scene 2...", duration: "12s", shotType: "CLOSE" },
      { id: 3, script: "New Scene 3...", duration: "15s", shotType: "WIDE" },
    ]);
  };

  const addScene = () => {
    const newScene = { id: Date.now(), script: "New scene content...", duration: "10.00", shotType: "WIDE_SHOT" };
    setScenes([...scenes, newScene]);
    showToast(`SCENE_APPENDED`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setScenes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      showToast("SCENE_ORDER_UPDATED");
    }
    setDraggedSceneIndex(null);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {isLoading && <StudioLoadingOverlay message={loadingMessage} />}
      {toast && <StudioToast message={toast.message} type={toast.type} />}

      <StudioHeader 
        title="🎬 My First YouTube Project" 
        onSave={() => showToast("PROJECT_SAVED_LOCAL")}
        onExport={() => simulateAiAction("COMPILING_PRODUCTION_PACKAGE", "PACKAGE_READY_FOR_DOWNLOAD")}
        onAiSuggest={() => simulateAiAction("FETCHING_VISUAL_NODES", "SUGGESTIONS_POPULATED")}
        onGenerateStoryboard={generateStoryboard}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Toggles */}
        <div className="lg:hidden absolute bottom-6 right-6 z-[60] flex flex-col gap-2">
           <Button size="icon" className="rounded-full h-12 w-12 glass shadow-glow border-white/10" variant="outline">
             <Plus className="w-6 h-6" />
           </Button>
        </div>

        <div className="hidden lg:flex shrink-0 h-full">
          <AssetLibrary />
        </div>

        {/* Storyboard Canvas (Center) */}
        <main className="flex-1 overflow-auto p-6 md:p-12 scrollbar-hide bg-white/[0.01]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-4">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Storyboard_Canvas</h1>
                <p className="text-[10px] technical-label opacity-40 uppercase tracking-widest mt-1">sequence_orchestrator // version_2.4</p>
              </div>
              <div className="flex items-center gap-4">
                 <Badge variant="outline" className="glass border-white/10 text-[10px] technical-label font-black py-1.5 px-4">
                   {scenes.length} SCENES_DETECTED
                 </Badge>
                 <Badge variant="outline" className="glass border-white/10 text-[10px] technical-label font-black py-1.5 px-4 uppercase tracking-widest text-blue-500">
                   STATUS: READY
                 </Badge>
              </div>
            </div>

            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={scenes.map(s => s.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 transition-all duration-500">
                  {scenes.map((scene, i) => (
                    <StudioSceneCard 
                      key={scene.id} 
                      id={scene.id}
                      index={i + 1} 
                      script={scene.script}
                      duration={scene.duration}
                      shotType={scene.shotType}
                      isSelected={selectedSceneIndex === i}
                      onClick={() => {
                        setSelectedSceneIndex(i);
                        setIsModalOpen(true);
                      }}
                      onDropAsset={(assetId) => showToast(`ASSET_${assetId}_LINKED_TO_SCENE_${i + 1}`)}
                    />
                  ))}
                  
                  <button 
                    onClick={addScene}
                    className="border-2 border-dashed border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center gap-5 hover:bg-white/5 hover:border-white/20 transition-all group relative overflow-hidden h-full min-h-[220px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5 group-hover:border-white/20">
                      <Plus className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="technical-label text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-all">Append_New_Node</span>
                      <span className="text-[10px] opacity-40 technical-label">Add Scene {scenes.length + 1}</span>
                    </div>
                  </button>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>

      <SceneEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scene={scenes[selectedSceneIndex]}
        onUpdate={(data) => {
          const newScenes = [...scenes];
          newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], ...data };
          setScenes(newScenes);
        }}
      />
    </div>
  );
}
