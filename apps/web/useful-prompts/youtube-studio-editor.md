# YouTube Studio - Design Specification

## Overview
The YouTube Studio is a premium visual production workspace that transforms text scripts into production-ready storyboards. It maintains CIRE's "Glass Matrix" design language while introducing specialized tools for video content creation.

---

## 🎨 Visual Design Language

### Color Palette (extends CIRE's theme)
```
Primary Actions: #FF0000 (YouTube Red)
Secondary Actions: #065FD4 (YouTube Blue)
Success States: #00D964
Warning States: #F4B400

Glass Surfaces:
- Light Mode: rgba(255, 255, 255, 0.7) with backdrop-blur(20px)
- Dark Mode: rgba(17, 24, 39, 0.7) with backdrop-blur(20px)

Accent Gradient: linear-gradient(135deg, #FF0000 0%, #CC0000 100%)
```

### Typography
```
Headers: Inter Bold, 24px-32px
Body: Inter Regular, 14px-16px
Metadata: Inter Medium, 12px-14px
Timestamps: Mono font, 12px
```

---

## 📐 Layout Architecture

### Overall Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (60px fixed)                                                │
│  [← Back to Editor] [Project Title]         [AI Tools ✨] [Export] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────┬──────────────────────────┬─────────────────┐│
│  │ ASSET LIBRARY     │  MAIN CANVAS             │  PROPERTIES     ││
│  │ (280px collapsible│  (flexible)              │  (320px)        ││
│  │                   │                          │                 ││
│  │ [Search Assets]   │  ┌────────────────────┐  │ ┌─────────────┐ ││
│  │                   │  │ SCENE 1            │  │ │ Script Text │ ││
│  │ 📁 Images (24)    │  │ ┌────────────────┐ │  │ │ Editor      │ ││
│  │ 📁 Videos (12)    │  │ │ [Visual Asset] │ │  │ │             │ ││
│  │ 📁 Graphics (8)   │  │ │                │ │  │ │             │ ││
│  │ 📁 B-Roll (15)    │  │ └────────────────┘ │  │ └─────────────┘ ││
│  │                   │  │ Duration: 15s      │  │                 ││
│  │ [+ Upload]        │  │ Shot: Close-up     │  │ Shot Type:      ││
│  │                   │  └────────────────────┘  │ [Dropdown]      ││
│  │                   │                          │                 ││
│  │                   │  ┌────────────────────┐  │ Duration:       ││
│  │                   │  │ SCENE 2            │  │ [15s] ⏱️       ││
│  │                   │  │ ┌────────────────┐ │  │                 ││
│  │                   │  │ │ [Visual Asset] │ │  │ Comments (3)    ││
│  │                   │  │ │                │ │  │ 💬 Director     ││
│  │                   │  │ └────────────────┘ │  │ 🎬 Visual       ││
│  │                   │  │ Duration: 20s      │  │ ✂️ Edit         ││
│  │                   │  └────────────────────┘  │                 ││
│  │                   │                          │ [+ Add Note]    ││
│  └───────────────────┴──────────────────────────┴─────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Layout Features:**
- **Three-column layout**: Asset Library (left) | Storyboard Canvas (center) | Properties Panel (right)
- **Collapsible sidebars**: Asset library can collapse to 60px icon bar for more canvas space
- **Fixed header**: Always visible with project controls and AI tools
- **Glassmorphism throughout**: All panels use frosted glass surfaces with subtle shadows

---

## 🧩 Component Specifications

### 1. Header Bar
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Editor | 🎬 My First N8N Tutorial                    │
│                                                                 │
│                        [✨ AI Suggest Visuals] [💾 Save]        │
│                        [🎨 Generate Storyboard] [📦 Export]     │
└─────────────────────────────────────────────────────────────────┘

Height: 60px
Background: Glass surface with subtle border-bottom
Sticky: Yes (always visible on scroll)
```

**Elements:**
- **Back button**: Returns to AI Editor with confirmation if unsaved changes
- **Project title**: Editable on click, auto-saves
- **AI Tools**: Dropdown with smart features (suggest visuals, auto-storyboard)
- **Save**: Shows "Saving..." or "All changes saved ✓"
- **Export**: Opens export modal to download production package

---

### 2. Asset Library (Left Sidebar)

```
┌─────────────────────────┐
│ ASSET LIBRARY           │
│ ┌─────────────────────┐ │
│ │ 🔍 Search assets... │ │
│ └─────────────────────┘ │
│                         │
│ ▼ 📸 Images (24)        │
│   ┌───┐ ┌───┐ ┌───┐   │
│   │img│ │img│ │img│   │
│   └───┘ └───┘ └───┘   │
│                         │
│ ▼ 🎥 Videos (12)        │
│   ┌───┐ ┌───┐          │
│   │vid│ │vid│          │
│   └───┘ └───┘          │
│                         │
│ ▼ 🎨 Graphics (8)       │
│   ┌───┐ ┌───┐          │
│   │gfx│ │gfx│          │
│   └───┘ └───┘          │
│                         │
│ ▼ 📹 B-Roll (15)        │
│                         │
│ ┌─────────────────────┐ │
│ │ + Upload New Asset  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ✨ AI Find Images   │ │
│ └─────────────────────┘ │
└─────────────────────────┘

Width: 280px (collapsible to 60px icon bar)
Background: Glass surface
```

**Features:**
- **Collapsible categories**: Click category header to expand/collapse
- **Thumbnail grid**: 3 columns, 80x80px each
- **Drag-and-drop**: Grab any asset and drag to scene cards
- **Search bar**: Filter assets by name or tag
- **Upload button**: Click to add new media files
- **AI Find Images**: Smart search based on scene content

**Asset Card:**
```
┌─────────────┐
│ [Thumbnail] │ ← 80x80px preview
│             │
│ filename.png│ ← Name (truncated)
│ 1920x1080   │ ← Dimensions
└─────────────┘

Hover state: 
- Scale to 1.05
- Show overlay: "Add to Scene"
- Slight glow effect
```

---

### 3. Main Canvas (Storyboard View)

```
┌────────────────────────────────────────────────────────────┐
│ 📊 Total Duration: 2m 35s | 8 Scenes                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐│
│  │ SCENE 1          │  │ SCENE 2          │  │ SCENE 3  ││
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │          ││
│  │ │              │ │  │ │              │ │  │  + Add   ││
│  │ │ [Image/Video]│ │  │ │ [Image/Video]│ │  │  Visual  ││
│  │ │              │ │  │ │              │ │  │          ││
│  │ └──────────────┘ │  │ └──────────────┘ │  │          ││
│  │                  │  │                  │  │          ││
│  │ "Hey everyone!   │  │ "First, we'll    │  │          ││
│  │  Today we're..." │  │  look at..."     │  │          ││
│  │                  │  │                  │  │          ││
│  │ ⏱️ 15s  📹 Close │  │ ⏱️ 20s  📹 Wide  │  │          ││
│  │ 💬 3 comments    │  │ 💬 1 comment     │  │          ││
│  │                  │  │                  │  │          ││
│  │ [Edit] [⋮]       │  │ [Edit] [⋮]       │  │          ││
│  └──────────────────┘  └──────────────────┘  └──────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘

Layout: CSS Grid (3 columns on large screens, 2 on medium, 1 on small)
Gap: 20px
Padding: 24px
```

**Scene Card Anatomy:**
```
┌──────────────────────────┐
│ SCENE 3                  │ ← Scene number (auto-updates on reorder)
│ ┌──────────────────────┐ │
│ │                      │ │
│ │   Visual Asset       │ │ ← 16:9 aspect ratio container
│ │   Preview            │ │   Shows first attached asset
│ │   (or placeholder)   │ │   Or "+" to add new
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│ "This is where we'll     │ ← Script excerpt (first 3 lines)
│  demonstrate the key     │   Truncated with "..."
│  feature that..."        │
│                          │
│ ⏱️ 25s  📹 Screen Rec    │ ← Metadata badges
│ 🎬 Cut transition        │
│                          │
│ 💬 2  🖼️ 3  🎵 1         │ ← Counters (comments, assets, audio)
│                          │
│ ┌──────────┬───────────┐ │
│ │ Edit     │ ⋮ More    │ │ ← Action buttons
│ └──────────┴───────────┘ │
└──────────────────────────┘

Dimensions: 280px min width, auto height
Background: Glass card with subtle shadow
Border: 1px solid rgba(255,255,255,0.1)

States:
- Default: Subtle glass effect
- Hover: Elevate with stronger shadow, scale 1.02
- Selected: Blue border (2px), stronger glow
- Dragging: Opacity 0.6, cursor grabbing
```

**Empty Scene Card (No Visual Assets):**
```
┌──────────────────────────┐
│ SCENE 5                  │
│ ┌──────────────────────┐ │
│ │                      │ │
│ │      ┌────────┐      │ │
│ │      │   +    │      │ │ ← Large + icon
│ │      └────────┘      │ │
│ │                      │ │
│ │  Add Visual Asset    │ │
│ │                      │ │
│ │ Drag & drop or click │ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│ "In this segment..."     │
│                          │
│ ⏱️ 18s  📹 Medium        │
│                          │
└──────────────────────────┘

State: Dashed border, muted colors
Interaction: Click opens file picker, or drag asset from library
```

---

### 4. Properties Panel (Right Sidebar)

```
┌─────────────────────────────┐
│ SCENE 2 PROPERTIES          │
├─────────────────────────────┤
│                             │
│ ▼ 📝 Script                 │
│ ┌─────────────────────────┐ │
│ │ First, we'll look at    │ │
│ │ how to set up your      │ │
│ │ first workflow in n8n.  │ │
│ │ The interface is        │ │
│ │ incredibly intuitive... │ │
│ │                         │ │
│ │ [/] Type / for AI help  │ │
│ └─────────────────────────┘ │
│   245 characters            │
│                             │
│ ▼ 🎬 Production Details     │
│ Shot Type:                  │
│ ┌─────────────────────────┐ │
│ │ Wide Shot            ▼  │ │
│ └─────────────────────────┘ │
│                             │
│ Duration Estimate:          │
│ ┌──────┐                    │
│ │ 20   │ seconds            │
│ └──────┘                    │
│                             │
│ Transition:                 │
│ ┌─────────────────────────┐ │
│ │ Fade                 ▼  │ │
│ └─────────────────────────┘ │
│                             │
│ On-Screen Text:             │
│ ┌─────────────────────────┐ │
│ │ "N8N Workflow Editor"   │ │
│ └─────────────────────────┘ │
│                             │
│ ▼ 🖼️ Visual Assets (2)      │
│ ┌───┐ workflow-screenshot  │
│ │img│ 1920x1080             │
│ └───┘ [Remove]              │
│                             │
│ ┌───┐ n8n-logo-overlay     │
│ │gfx│ SVG                   │
│ └───┘ [Remove]              │
│                             │
│ [+ Add Asset]               │
│                             │
│ ▼ 💬 Production Notes (3)   │
│ ┌─────────────────────────┐ │
│ │ 🎬 Director             │ │
│ │ "Zoom into the workflow"│ │
│ │ - Added 2m ago          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ✂️ Editor               │ │
│ │ "Add subtle zoom effect"│ │
│ │ - Added 5m ago          │ │
│ └─────────────────────────┘ │
│                             │
│ [+ Add Note]                │
│   💬 Director               │
│   🎬 Visual Cue             │
│   ✂️ Edit Note              │
│   🎨 Post-Production        │
│                             │
│ ▼ 🎵 Audio                  │
│ Background Music:           │
│ ┌─────────────────────────┐ │
│ │ Upbeat Tech          ▼  │ │
│ └─────────────────────────┘ │
│                             │
│ Sound Effects:              │
│ [ ] Click sound             │
│ [ ] Whoosh transition       │
│                             │
└─────────────────────────────┘

Width: 320px
Background: Glass surface
Scroll: Independent scrolling
```

**Collapsible Sections:**
- Each section has ▼/► toggle arrow
- Click header to expand/collapse
- Smooth height transition (0.3s ease)
- Section state persists per session

**Script Editor:**
- Rich text editor (Tiptap-based)
- Type `/` to trigger AI commands menu:
  - `/improve` - Enhance writing quality
  - `/shorten` - Reduce word count
  - `/hooks` - Generate hook variations
  - `/cta` - Add call-to-action
- Character counter updates in real-time
- Auto-saves on blur

**Production Note Card:**
```
┌─────────────────────────┐
│ 🎬 Director             │ ← Icon + Type badge
│ "Zoom into the workflow"│ ← Note content
│ - Added 2m ago          │ ← Timestamp
│              [Edit] [×] │ ← Actions (show on hover)
└─────────────────────────┘

Background: Slightly darker glass
Border-left: 3px solid (color by type)
  🎬 Director: #FF0000
  🎬 Visual Cue: #00D964
  ✂️ Edit Note: #F4B400
  🎨 Post-Production: #065FD4

Hover state: Show edit and delete buttons
```

---

## 🎭 How It Works - User Interactions

### Adding Assets to Scenes

**Method 1: Drag & Drop**
1. User hovers over asset in library
2. Asset card lifts slightly (scale 1.05)
3. User drags asset onto canvas
4. Scene cards highlight with dashed blue border (drop zones)
5. User drops asset on desired scene
6. Asset instantly appears in scene card with smooth fade-in
7. Toast notification: "✓ Asset added to Scene 3"

**Method 2: Click to Add**
1. User clicks on a scene card (border highlights in blue)
2. Scene is now "selected" (shown in properties panel)
3. User clicks any asset in the library
4. Asset immediately added to selected scene
5. Scene card updates to show new asset

**Method 3: Upload Directly to Scene**
1. User clicks "+" placeholder in empty scene card
2. File picker dialog opens
3. User selects image/video file
4. Upload progress shows briefly
5. Asset appears in scene card
6. Asset also added to library automatically

### Editing Script Text

**How it works:**
1. User clicks on scene card (becomes selected)
2. Properties panel on right shows scene details
3. User clicks in "Script" section
4. Text becomes editable (cursor appears)
5. User types to edit content
6. Character count updates in real-time below editor
7. Type `/` to open AI command menu:
   ```
   ┌──────────────────────┐
   │ /improve             │
   │ /shorten             │
   │ /hooks               │
   │ /cta                 │
   └──────────────────────┘
   ```
8. Select command → AI processes → Updated text appears
9. Changes auto-save after 2 seconds of no typing

### Managing Scenes

**Reordering Scenes:**
1. User clicks and holds scene card
2. Card lifts with shadow (z-index increase)
3. Drag to new position
4. Other cards smoothly shift to make space
5. Drop to place
6. Scene numbers automatically update (1, 2, 3...)

**Splitting a Scene:**
1. User right-clicks scene card
2. Context menu appears: "Split Scene"
3. Click splits current scene into two
4. New scene appears after original
5. User can then distribute assets between them

**Duplicating a Scene:**
1. Click "⋮ More" button on scene card
2. Select "Duplicate"
3. Exact copy created and placed immediately after
4. All assets, script, and metadata copied
5. User can then modify the duplicate

**Deleting a Scene:**
1. Click "⋮ More" → "Delete"
2. Confirmation modal: "Delete Scene 3?"
3. User confirms
4. Scene fades out and disappears
5. Remaining scenes reflow smoothly
6. Scene numbers update

### Adding Production Notes

**How it works:**
1. User selects a scene (clicks scene card)
2. Properties panel shows scene details
3. User scrolls to "Production Notes" section
4. Clicks "[+ Add Note]" button
5. Dropdown appears with note types:
   - 💬 Director Note
   - 🎬 Visual Cue
   - ✂️ Edit Note
   - 🎨 Post-Production
6. User selects type
7. Text input appears
8. User types note content
9. Note saves and appears in list
10. Comment counter on scene card increments

### Using AI Features

**AI Suggest Visuals:**
1. User selects scene without visual assets
2. Clicks "✨ AI Suggest Visuals" in header
3. Modal opens with AI-generated suggestions:
   ```
   ┌─────────────────────────────────┐
   │ 🔍 AI Visual Suggestions        │
   ├─────────────────────────────────┤
   │ For Scene 3: "workflow setup"   │
   │                                 │
   │ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
   │ │ 1 │ │ 2 │ │ 3 │ │ 4 │        │
   │ └───┘ └───┘ └───┘ └───┘        │
   │                                 │
   │ [Add Selected] [Search More]    │
   └─────────────────────────────────┘
   ```
4. User clicks suggested images to select
5. Clicks "Add Selected"
6. Images added to scene and asset library

**AI Generate Storyboard:**
1. User starts with script text only (no scenes created)
2. Clicks "🎨 Generate Storyboard" in header
3. AI analyzes script content
4. Progress modal shows:
   ```
   ┌─────────────────────────────────┐
   │ ✨ Generating Storyboard...     │
   │ ▓▓▓▓▓▓▓▓░░░░ 70%               │
   │                                 │
   │ ✓ Identified 8 scene breaks     │
   │ ✓ Analyzing content...          │
   └─────────────────────────────────┘
   ```
5. AI creates scene cards automatically
6. Each scene gets:
   - Natural break points in script
   - Suggested shot type
   - Duration estimate
7. User reviews and adjusts as needed

---

## 🎨 Glass Surface Design Details

### Scene Card Glass Effect
```css
Background: rgba(255, 255, 255, 0.05)
Backdrop Filter: blur(20px) saturate(180%)
Border: 1px solid rgba(255, 255, 255, 0.1)
Border Radius: 12px
Box Shadow: 
  0 8px 32px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.1)

On Hover:
  Background: rgba(255, 255, 255, 0.08)
  Transform: translateY(-2px)
  Box Shadow: 
    0 12px 48px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15)
```

### Sidebar Panel Glass
```css
Background: linear-gradient(
  180deg,
  rgba(17, 24, 39, 0.6) 0%,
  rgba(17, 24, 39, 0.4) 100%
)
Backdrop Filter: blur(40px)
Border Right: 1px solid rgba(255, 255, 255, 0.08)
```

### Header Glass
```css
Background: rgba(17, 24, 39, 0.8)
Backdrop Filter: blur(60px)
Border Bottom: 1px solid rgba(255, 255, 255, 0.05)
```

---

## 📦 Export Modal

```
┌──────────────────────────────────────────────┐
│ 📦 Export Production Package                 │
├──────────────────────────────────────────────┤
│                                              │
│ Your storyboard is ready for production!     │
│                                              │
│ This package includes:                       │
│ ✓ Script with timestamps                     │
│ ✓ All visual assets (organized by scene)     │
│ ✓ Production notes PDF                       │
│ ✓ Storyboard overview PDF                    │
│ ✓ Shot list                                  │
│                                              │
│ Project: My First N8N Tutorial               │
│ Scenes: 8                                    │
│ Total Duration: 2m 35s                       │
│ Assets: 24 files (245 MB)                    │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Include:                                 │ │
│ │ ☑ Production notes                       │ │
│ │ ☑ Shot list spreadsheet                  │ │
│ │ ☑ Storyboard PDF                         │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [Cancel]              [Download Package]     │
└──────────────────────────────────────────────┘

Modal Style: 
- Centered on screen
- Glass background with strong blur
- Drop shadow for depth
- Smooth fade-in animation
```

**What Gets Exported:**
```
my-first-n8n-tutorial/
├── 📄 script.pdf (formatted with timestamps)
├── 📄 production-notes.pdf (all comments organized by scene)
├── 📄 storyboard.pdf (visual overview with thumbnails)
├── 📄 shot-list.csv (spreadsheet for production team)
└── 📁 assets/
    ├── 📁 scene-01/
    │   ├── intro-graphic.png
    │   └── hook-broll.mp4
    ├── 📁 scene-02/
    │   ├── workflow-screenshot.png
    │   └── n8n-logo.svg
    └── 📁 scene-03/
        └── automation-demo.mp4
```

---

## 🎯 Key Visual Features

### 1. Scene Selection State
When a scene is selected:
- **Border**: 2px solid #065FD4 (YouTube blue)
- **Glow**: 0 0 20px rgba(6, 95, 212, 0.3)
- **Background**: Slightly lighter glass effect
- **Properties panel**: Updates to show scene details

### 2. Drag & Drop Visual Feedback
When dragging an asset:
- **Asset being dragged**: Opacity 0.6, follows cursor
- **Valid drop zones**: Dashed blue border appears
- **On hover over zone**: Border becomes solid, background highlights
- **Invalid zones**: Red tint if incompatible asset type

### 3. Empty States
**No assets yet:**
```
┌─────────────────────────┐
│    📦                   │
│                         │
│  No assets uploaded     │
│                         │
│  Drag & drop files here │
│  or click to browse     │
│                         │
│  [Browse Files]         │
└─────────────────────────┘
```

**No scenes yet:**
```
┌────────────────────────────────┐
│         🎬                     │
│                                │
│  No scenes created yet         │
│                                │
│  Click "Generate Storyboard"   │
│  to get started with AI        │
│                                │
│  [✨ Generate Storyboard]      │
└────────────────────────────────┘
```

### 4. Loading States
**AI Processing:**
```
┌─────────────────────────┐
│  ✨ AI Working...       │
│  ▓▓▓▓▓▓░░░░ 60%        │
│  Analyzing scene 5 of 8 │
└─────────────────────────┘
```

**Uploading Asset:**
```
┌─────────────────────────┐
│  📤 Uploading...        │
│  ▓▓▓▓▓▓▓▓░░ 85%        │
│  video-demo.mp4         │
└─────────────────────────┘
```

### 5. Notification Toasts
Appear in top-right corner:
```
┌────────────────────────────┐
│ ✓ Scene 3 updated          │
└────────────────────────────┘

┌────────────────────────────┐
│ ✓ Asset added to library   │
└────────────────────────────┘

┌────────────────────────────┐
│ ⚠️ Maximum scenes reached  │
└────────────────────────────┘
```

Style: Glass card, auto-dismiss after 3s, slide-in from right

---

## 📱 Responsive Behavior

### Desktop (1440px+)
- Full three-column layout visible
- Storyboard shows 3 scene cards per row
- All features accessible

### Laptop (1024px - 1439px)
- Asset library auto-collapses to icon bar (60px)
- Click icon to expand temporarily
- Storyboard shows 2 cards per row

### Tablet (768px - 1023px)
- Bottom tab navigation:
  ```
  [📋 Storyboard] [📁 Assets] [⚙️ Properties]
  ```
- One panel shown at a time
- Swipe to switch panels
- Storyboard shows 2 cards per row

### Mobile (< 768px)
- Single column view
- Scenes shown as vertical list
- Tap scene to open properties
- Simplified upload: use device camera
- Bottom sheet for asset selection

---

## 💡 Design Philosophy

**1. Visual First**
Every element emphasizes visual assets. The interface makes it obvious what the final video will look like before production begins.

**2. Minimal Friction**
- Drag & drop everywhere
- AI suggests intelligently
- Auto-save constantly
- One-click actions

**3. Professional Grade**
Glass surfaces, smooth animations, thoughtful microinteractions. This looks and feels like a premium production tool, not a toy.

**4. Production Ready**
At any moment, you can export everything needed to start filming. No incomplete states, no "almost ready" situations.

**5. Context Aware**
The interface remembers your preferences, suggests based on content, and adapts to your workflow as you work.

---

This design creates a seamless bridge between script writing and video production, making your content creation workflow significantly more efficient and organized.