markdown# Project Context: Content Intelligence & Repurposing Engine (CIRE)

## Overview
We're building a Next.js application that discovers high-performing content across social platforms (Reddit, Twitter, LinkedIn, YouTube), analyzes what makes it successful, and helps users create their own content based on proven blueprints.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL database, Auth, Storage)
- **Orchestration:** n8n (workflow automation, content processing)
- **Scraping:** Apify (platform-specific scrapers)
- **AI:** OpenAI/Anthropic Claude APIs (via n8n)

## Core System Flow
```
User configures scraping jobs 
  ↓
Apify scrapes content from platforms
  ↓
n8n processes & analyzes content
  ↓
Data stored in Supabase
  ↓
Next.js app displays trending content
  ↓
User creates new content from blueprints
  ↓
AI adapts content to brand voice
  ↓
Content scheduled/published via n8n
```

## Application Architecture

### Main Navigation Structure
```
├── 🏠 Dashboard (overview & metrics)
├── 🔍 Discover (trending content + scraping job management)
|-- Drafts(This is the drafts page and we could have drafts from Ai or manually generated)
├── ✍️ Studio (unified content editor)
├── 📅 Calendar (content scheduling)
└── 📊 Analytics (performance tracking)
```

### Key Features

#### 1. Discover Page (Primary Focus)
- Display trending/high-performing content from all platforms
- Show scraping job status at the top (last run, next run, active jobs)
- "Manage Jobs" button for quick access to job configuration
- Filters: Platform, Sort (engagement/latest/trending), Time range, Content type
- Content cards with: Title, snippet, platform badge, engagement metrics, "Use This" button
- Each card links to full content view with extracted blueprint

#### 2. Scraping Job Management (Modal/Slide-over from Discover)
- View all active scraping jobs by platform
- Configure new jobs: platform, targets (keywords/accounts/channels), frequency
- Monitor job status: running, success, failed, paused
- Show job history and logs
- Pause/Resume/Edit/Delete jobs

#### 3. Content Studio (Main Editor)
- Unified editor for all platforms
- Platform selector (can select multiple)
- Post topic/description input (required)
- Optional: Blueprint selector (pre-fill from trending content)
- Style/Tone/Length selectors (pulls from brand voice settings)
- Live character count and platform-specific constraints
- Multi-platform preview (side-by-side view)
- Rich text editor with formatting options
- Save as draft / Schedule / Publish immediately
- AI assistance: "Improve hook", "Make shorter", "Adapt for [platform]"

#### 4. Brand Voice System
- Store brand voice profiles (tone, vocabulary, values, audience)
- Apply brand voice transformation during content creation
- Multiple tone variations: Professional, Casual, Inspiring, Thought-provoking

## Database Schema (Supabase)

### Core Tables:

**scraping_jobs**
- id, platform, job_type (keyword/creator), targets (JSON), frequency, status, last_run, next_run, created_at

**raw_content**
- id, job_id, platform, content_url, title, description, content_text, author, engagement_metrics (JSON), scraped_at

**content_blueprints**
- id, raw_content_id, content_type, main_ideas (JSON), hooks (JSON), structure (JSON), performance_score, strategic_fit_score, funnel_stage

**brand_voice_profiles**
- id, name, tone_descriptors (JSON), writing_rules (JSON), vocabulary_preferences (JSON), example_content (JSON)

**generated_content**
- id, blueprint_id, brand_voice_id, platforms (array), content_text, status (draft/approved/published), scheduled_for, created_at

**published_content**
- id, generated_content_id, platform, post_url, published_at, performance_metrics (JSON)

## Key Design Patterns

### 1. Workflow-First Navigation
- Users think in terms of tasks (discover → create → schedule → analyze)
- Platform is a property of content, not primary navigation
- Single powerful editor adapts to selected platform(s)

### 2. Real-time Status Updates
- Show scraping job health prominently on Discover page
- Toast notifications for completed jobs or failures
- Live preview updates in editor

### 3. Multi-Platform First
- Default to creating content for multiple platforms simultaneously
- Platform-aware editing (character limits, formatting rules)
- Show variations side-by-side

### 4. AI-Assisted but Human-Reviewed
- AI generates content drafts and suggestions
- Clear status workflow: Draft → Review → Approved → Scheduled → Published
- Users maintain creative control

## Code Style Preferences
- Use TypeScript with strict mode
- Functional React components with hooks
- Server Components by default, Client Components only when needed
- Tailwind CSS for styling (no CSS modules)
- Descriptive variable names
- Error handling with try-catch and user-friendly messages
- Loading states for all async operations
- Optimistic UI updates where appropriate

## API Integration Points

### n8n Webhooks (to be called from Next.js):
- POST `/webhook/scraping-job` - Trigger new scraping job
- POST `/webhook/analyze-content` - Request content analysis
- POST `/webhook/generate-content` - Generate content from blueprint
- POST `/webhook/publish-content` - Publish to platforms

### Supabase Real-time:
- Subscribe to `scraping_jobs` table for status updates
- Subscribe to `generated_content` for new drafts

## Current Development Focus
We're building the Discover page with integrated scraping job management. The page should:
1. Display a status bar showing scraping job health
2. Have a "Manage Jobs" button that opens a modal/drawer
3. Show content cards in a responsive grid
4. Include comprehensive filtering options
5. Allow users to click "Use This" on any content to jump to Studio with pre-filled blueprint

## Important Notes
- All content scraped is for inspiration/analysis only - never plagiarize
- User authentication required (Supabase Auth)
- Rate limiting on API calls to n8n
- Graceful handling of failed scraping jobs
- Clear attribution when showing scraped content
- GDPR-compliant data storage and user consent