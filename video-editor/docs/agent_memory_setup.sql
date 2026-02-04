-- 1. Create Workflow Status Enum
CREATE TYPE workflow_status AS ENUM ('idle', 'processing', 'paused', 'completed');

-- 2. Create Agent Memory Table
CREATE TABLE agent_memory (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    workflow_status workflow_status NOT NULL DEFAULT 'idle',
    project_system_prompt TEXT NOT NULL DEFAULT 'You are a premium AI video editor. Maintain a professional and technical tone. Ensure all visuals align with the project brand.',
    active_agents TEXT[] DEFAULT '{}',
    total_scenes INT NOT NULL DEFAULT 0,
    completed_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    current_scene_id UUID REFERENCES scenes(id) ON DELETE SET NULL,
    last_log TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add Trigger for Updated At
CREATE TRIGGER update_agent_memory_updated_at 
BEFORE UPDATE ON agent_memory 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. Enable Real-time (Optional, for frontend progress bars)
ALTER PUBLICATION supabase_realtime ADD TABLE agent_memory;
