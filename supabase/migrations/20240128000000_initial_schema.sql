-- 0001_initial_schema.sql
-- Consolidated schema for Multi-Platform Scraping and YouTube Studio

-- 1. MASTER SCRAPER SYSTEM
-- This table tracks every scrape run, regardless of platform
CREATE TABLE IF NOT EXISTS scraper_runs (
  id varchar(255) PRIMARY KEY,
  platform varchar(50) NOT NULL, -- 'youtube', 'twitter', 'linkedin'
  status varchar(50) DEFAULT 'queued',
  created_at timestamptz DEFAULT now()
);

-- 2. YOUTUBE SPECIFIC METADATA
-- Extends scraper_runs with YouTube-only context
CREATE TABLE IF NOT EXISTS youtube_runs (
  Run_ID varchar(255) PRIMARY KEY REFERENCES scraper_runs(id) ON DELETE CASCADE,
  Run_DateTime timestamptz DEFAULT now(),
  Keywords_Scraped text,
  Creators_Scraped text,
  Total_Results_Found integer,
  New_Results_Count integer,
  Content_Generated integer,
  Run_Status varchar(100)
);

CREATE TABLE IF NOT EXISTS youtube_channels (
  Channel_ID serial PRIMARY KEY,
  Youtube_Channel varchar(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS youtube_search_terms (
  Search_Term_ID serial PRIMARY KEY,
  Search_Terms varchar(255),
  Day varchar(50)
);

-- 3. ANALYSIS & RESULTS
CREATE TABLE IF NOT EXISTS youtube_creator_results (
  Result_ID serial PRIMARY KEY,
  Run_ID varchar(255) REFERENCES scraper_runs(id) ON DELETE SET NULL,
  Video_ID varchar(255),
  Creator_ID integer REFERENCES youtube_channels(Channel_ID) ON DELETE SET NULL,
  Video_URL varchar(1024),
  Video_Title varchar(1024),
  Video_Description text,
  Transcript_Content text,
  Channel_Name varchar(255),
  Channel_URL varchar(1024),
  Views bigint,
  Likes integer,
  Comments_Count integer,
  Published_Date timestamptz,
  Analysis_Status varchar(100),
  Content_Blueprint text,
  Repurpose_Fit varchar(100),
  Repurpose_Rationale text,
  content_category varchar(100)
);

CREATE TABLE IF NOT EXISTS youtube_search_results (
  Result_ID serial PRIMARY KEY,
  Run_ID varchar(255) REFERENCES scraper_runs(id) ON DELETE SET NULL,
  Video_ID varchar(255),
  Search_Term_Used varchar(255),
  Video_URL varchar(1024),
  Video_Title varchar(1024),
  Video_Description text,
  Transcript_Content text,
  Channel_Name varchar(255),
  Channel_URL varchar(1024),
  Views bigint,
  Likes integer,
  Comments_Count integer,
  Published_Date timestamptz,
  Analysis_Status varchar(100),
  Content_Blueprint text,
  Repurpose_Fit varchar(100),
  Repurpose_Rationale text,
  content_category varchar(100)
);

-- 4. YOUTUBE STUDIO PRODUCTION (The high-demand layer)
CREATE TABLE IF NOT EXISTS youtube_studio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id varchar(255) REFERENCES scraper_runs(id) ON DELETE SET NULL,
  source_result_id integer, -- Links back to either search or creator results
  title text NOT NULL,
  status varchar(50) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS youtube_studio_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES youtube_studio_projects(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  script text,
  duration float DEFAULT 5.0,
  shot_type varchar(50) DEFAULT 'WIDE_SHOT',
  media_url text,
  created_at timestamptz DEFAULT now()
);

-- 5. CONTENT GENERATION (Social Repurposing)
CREATE TABLE IF NOT EXISTS generated_content (
  Content_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  Run_ID varchar(255) REFERENCES scraper_runs(id) ON DELETE SET NULL,
  studio_project_id uuid REFERENCES youtube_studio_projects(id) ON DELETE CASCADE,
  platform varchar(50) NOT NULL, -- 'Twitter', 'LinkedIn', etc.
  Generated_Date timestamptz DEFAULT now(),
  Status varchar(50) DEFAULT 'draft',
  content_body text, -- Combined field for multi-platform use
  image_link varchar(1024),
  google_drive_link varchar(1024)
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_creator_results_video_id ON youtube_creator_results(Video_ID);
CREATE INDEX IF NOT EXISTS idx_search_results_video_id ON youtube_search_results(Video_ID);
CREATE INDEX IF NOT EXISTS idx_generated_run_id ON generated_content(Run_ID);
CREATE INDEX IF NOT EXISTS idx_studio_scenes_project_id ON youtube_studio_scenes(project_id);
