"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SceneHeader } from "@/components/scenes/scene-header";
import { SceneCard } from "@/components/scenes/scene-card";
import { SceneEditorModal } from "@/components/scenes/scene-editor-modal";
import { NavSidebar } from "@/components/panels/nav-sidebar";
import { ScenePropertiesPanel } from "@/components/panels/scene-properties-panel";
import { Scene } from "@/lib/types";
import { sampleScenes, sampleProject } from "@/lib/sample-data";
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
  rectSortingStrategy
} from '@dnd-kit/sortable';

export default function VideoEditorPage() {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>(sampleScenes);
  const [activeNavItem, setActiveNavItem] = useState("studio");
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addScene = () => {
    const newScene: Scene = { 
      id: `scene_${Date.now()}`,
      index: scenes.length + 1,
      startTime: scenes.length > 0 ? scenes[scenes.length - 1].endTime : 0,
      endTime: scenes.length > 0 ? scenes[scenes.length - 1].endTime + 10 : 10,
      duration: 10,
      script: "New scene content. Click to edit and add your script.", 
      visualType: "a-roll",
      aRoll: {
        type: "ai-avatar",
        avatarId: "avatar_host_01",
        provider: "heygen",
        emotion: "neutral",
        cameraAngle: "medium-shot",
        sourceUrl: null,
        assetStatus: "pending_generation",
        fittingRequired: true,
        fittingStrategy: "generate_to_duration"
      },
      transition: { type: "fade", duration: 0.5, direction: "in" }
    };
    setScenes([...scenes, newScene]);
    showToast(`Scene ${scenes.length + 1} added`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
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
        const reordered = arrayMove(items, oldIndex, newIndex);
        // Update indices
        return reordered.map((scene, i) => ({ ...scene, index: i + 1 }));
      });
      showToast("Scene order updated");
    }
  };

  const selectedScene = selectedSceneIndex !== null ? scenes[selectedSceneIndex] : null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border technical-label text-xs font-bold uppercase tracking-wider ${
          toast.type === "success" 
            ? "bg-green-500/10 border-green-500/30 text-green-500" 
            : "bg-destructive/10 border-destructive/30 text-destructive"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Left Navigation Sidebar (Retractable) */}
      <NavSidebar 
        activeItem={activeNavItem} 
        onItemClick={(id) => setActiveNavItem(id)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SceneHeader 
          title={`🎬 ${sampleProject.title}`}
          onSave={() => showToast("Project saved")}
          onExport={() => showToast("Exporting...")}
          onAiSuggest={() => showToast("AI generating suggestions...")}
          onGenerateStoryboard={() => showToast("Generating storyboard...")}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Canvas */}
          <main className="flex-1 overflow-auto p-6 md:p-8 scrollbar-hide bg-muted/5">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Storyboard Canvas</h1>
                  <p className="text-[10px] technical-label opacity-40 uppercase tracking-widest mt-1">
                    Scene Orchestrator // {sampleProject.totalDuration.toFixed(1)}s total
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4">
                    {scenes.length} SCENES
                  </Badge>
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4 text-green-500 border-green-500/30">
                    {scenes.filter(s => 
                      (s.aRoll?.assetStatus === "ready" || s.aRoll?.assetStatus === "generated") ||
                      (s.bRoll?.assetStatus === "ready" || s.bRoll?.assetStatus === "generated")
                    ).length} READY
                  </Badge>
                  <Badge variant="outline" className="text-[10px] technical-label font-bold py-1.5 px-4 text-amber-500 border-amber-500/30">
                    {scenes.filter(s => 
                      s.aRoll?.assetStatus === "pending_generation" ||
                      s.bRoll?.assetStatus === "pending_generation"
                    ).length} PENDING
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-500">
                    {scenes.map((scene, i) => (
                      <SceneCard 
                        key={scene.id} 
                        scene={scene}
                        isSelected={selectedSceneIndex === i}
                        onClick={() => {
                          setSelectedSceneIndex(i);
                        }}
                      />
                    ))}
                    
                    <button 
                      onClick={addScene}
                      className="border-2 border-dashed border-border rounded-lg aspect-video flex flex-col items-center justify-center gap-4 hover:bg-muted/10 hover:border-border/80 transition-all group relative overflow-hidden min-h-[180px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:bg-muted/50 group-hover:scale-110 transition-all border border-border">
                        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="technical-label text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-all">Add Scene</span>
                        <span className="text-[9px] opacity-40 technical-label">Scene {scenes.length + 1}</span>
                      </div>
                    </button>
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </main>

          {/* Right Properties Panel */}
          <ScenePropertiesPanel 
            scene={selectedScene}
            onUpdate={(data) => {
              if (selectedSceneIndex !== null) {
                const newScenes = [...scenes];
                newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], ...data };
                setScenes(newScenes);
              }
            }}
          />
        </div>
      </div>

      <SceneEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scene={selectedScene ? {
          id: parseInt(selectedScene.id.split('_')[1]) || 0,
          script: selectedScene.script,
          duration: selectedScene.duration.toString(),
          shotType: selectedScene.aRoll?.cameraAngle || "WIDE_SHOT"
        } : undefined}
        onUpdate={(data) => {
          if (selectedSceneIndex !== null) {
            const newScenes = [...scenes];
            newScenes[selectedSceneIndex] = { 
              ...newScenes[selectedSceneIndex], 
              script: data.script || newScenes[selectedSceneIndex].script,
              duration: parseFloat(data.duration) || newScenes[selectedSceneIndex].duration
            };
            setScenes(newScenes);
          }
        }}
      />
    </div>
  );
}
