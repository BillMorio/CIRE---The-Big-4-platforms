import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { projectTitle, storyboardData } = await req.json();

    if (!projectTitle || !storyboardData || !storyboardData.scenes) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // 1. Create the Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        title: projectTitle,
        total_duration: storyboardData.project.totalDuration || 0,
        status: "draft"
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // 2. Create the Scenes
    const scenesToInsert = storyboardData.scenes.map((scene: any, index: number) => ({
      project_id: project.id,
      index: scene.index || index + 1,
      start_time: scene.startTime,
      end_time: scene.endTime,
      duration: scene.endTime - scene.startTime,
      script: scene.script,
      visual_type: scene.visualType,
      status: "todo"
    }));

    const { data: createdScenes, error: scenesError } = await supabase
      .from("scenes")
      .insert(scenesToInsert)
      .select();

    if (scenesError) throw scenesError;

    // 3. Create Scene Visual Data
    const visualDataToInsert = createdScenes.map((scene, i) => {
      const sourceScene = storyboardData.scenes[i];
      // Extract the relevant visual payload based on the type
      let payload: any = { directorNote: sourceScene.directorNote };
      
      if (scene.visual_type === 'a-roll') Object.assign(payload, sourceScene.aRoll || {});
      else if (scene.visual_type === 'b-roll') Object.assign(payload, sourceScene.bRoll || {});
      else if (scene.visual_type === 'graphics') Object.assign(payload, sourceScene.graphics || {});
      else if (scene.visual_type === 'image') Object.assign(payload, sourceScene.image || {});

      return {
        scene_id: scene.id,
        payload
      };
    });

    const { error: visualDataError } = await supabase
      .from("scene_visual_data")
      .insert(visualDataToInsert);

    if (visualDataError) throw visualDataError;

    // 4. Initialize Agent Memory
    const { error: memoryError } = await supabase
      .from("agent_memory")
      .insert({
        project_id: project.id,
        project_name: projectTitle,
        workflow_status: "idle",
        total_scenes: storyboardData.scenes.length,
        completed_count: 0,
        failed_count: 0,
        last_log: "Project storyboard initialized."
      });

    if (memoryError) throw memoryError;

    return NextResponse.json({ 
      success: true, 
      projectId: project.id 
    });

  } catch (error: any) {
    console.error("[Project Creation Error]", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
