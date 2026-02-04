import { supabase } from '@/lib/supabase';
import { Scene } from '@/lib/agents/types';

export const sceneService = {
  /**
   * Fetch all scenes for a project
   */
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('scenes')
      .select(`
        *,
        visual_data:scene_visual_data(*)
      `)
      .eq('project_id', projectId)
      .order('index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a new scene and its visual data
   */
  async create(scene: Partial<Scene>, visualData: any = {}) {
    console.log("[SceneService] Creating scene:", scene.index);
    // 1. Create Scene
    const { data: newScene, error: sceneError } = await supabase
      .from('scenes')
      .insert({
        ...scene,
        fitting_strategy: (scene as any).fitting_strategy || 'trim',
        transition: (scene as any).transition || { type: "none", duration: 0 }
      })
      .select()
      .single();
    
    if (sceneError) {
        console.error("[SceneService] SCENE INSERT ERROR:", sceneError);
        throw sceneError;
    }

    // 2. Create Visual Data
    console.log("[SceneService] Creating visual data for scene:", newScene.id);
    const { error: visualError } = await supabase
      .from('scene_visual_data')
      .insert({
        scene_id: newScene.id,
        payload: visualData
      });
    
    if (visualError) {
        console.error("[SceneService] VISUAL DATA INSERT ERROR:", visualError);
        throw visualError;
    }

    return newScene;
  },

  /**
   * Update a scene
   */
  async update(id: string, updates: Partial<Scene>) {
    console.log(`[SceneService] Updating scene ${id}:`, updates);
    const { data, error } = await supabase
      .from('scenes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
        console.error(`[SceneService] UPDATE ERROR for ID ${id}:`, error);
        throw error;
    }
    return data;
  },

  /**
   * Update visual data for a scene
   */
  async updateVisualData(sceneId: string, payload: any) {
    const { data, error } = await supabase
      .from('scene_visual_data')
      .update({ payload })
      .eq('scene_id', sceneId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a scene (visual data will cascade delete)
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('scenes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
