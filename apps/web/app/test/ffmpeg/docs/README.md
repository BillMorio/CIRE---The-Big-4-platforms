# Video Join Tool - Frontend Documentation

## Overview

The Video Join Tool is a web-based interface that allows users to combine two videos into one. It's built as a React page within our Next.js application and communicates with a separate FFmpeg backend server.

---

## What It Does

1. **Upload Two Videos** - Users can drag/drop or click to select two video files
2. **Preview Before Joining** - Shows video previews with file size information
3. **Select Transition** - Choose from fade, crossfade, wipe, or slide effects
4. **Adjust Duration** - Set transition duration (0.5s to 3s)
5. **Join Videos** - Sends both videos to the FFmpeg server for processing
6. **Download Result** - The combined video can be played and downloaded

---

## How It Works

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   User Browser  │  ──────▶│   Next.js App   │  ──────▶│  FFmpeg Server  │
│   (React UI)    │         │   (Port 3000)   │         │   (Port 3333)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Step-by-Step Flow

1. **User visits** `/test/ffmpeg` in the browser
2. **User uploads** two video files using the file pickers
3. **User clicks** "Join Videos" button
4. **Frontend sends** both videos to `http://localhost:3333/api/concat` using FormData
5. **FFmpeg server** processes the videos (re-encoding, normalizing, concatenating)
6. **Server returns** a URL to the combined video file
7. **Frontend displays** the result with a video player and download button

---

## Key Components

### State Management

| State Variable | Purpose |
|----------------|---------|
| `video1` | Stores the first uploaded video file |
| `video2` | Stores the second uploaded video file |
| `transition` | Selected transition type (none, fade, crossfade, etc.) |
| `transitionDuration` | Duration of the transition in seconds |
| `isProcessing` | Shows loading state while FFmpeg processes |
| `outputUrl` | URL of the combined video from the server |
| `error` | Any error messages to display |
| `progress` | Status text during processing |

### The VideoSlot Component

A reusable component for each video upload area that:
- Shows an upload prompt when empty
- Displays file info and preview when a video is selected
- Allows removing the selected video

---

## API Integration

### Request to FFmpeg Server

```javascript
const formData = new FormData();
formData.append("files", video1);
formData.append("files", video2);
formData.append("transition", transition);       // e.g., "fade", "crossfade"
formData.append("transitionDuration", "1");      // seconds

const response = await fetch("http://localhost:3333/api/concat", {
  method: "POST",
  body: formData,
});
```

### Expected Response

```json
{
  "success": true,
  "message": "Videos concatenated!",
  "outputFile": "/outputs/concat-1234567890.mp4"
}
```

---

## Error Handling

The UI handles several error cases:

| Scenario | User Feedback |
|----------|---------------|
| Missing video selection | "Please select both videos" |
| Server unreachable | Network error message |
| FFmpeg processing fails | Shows the error from the server |

---

## Design Decisions

### Why a Separate Server?

FFmpeg is a command-line tool that processes video files. It needs:
- Access to the file system to read/write video files
- Significant CPU for video encoding
- The ability to run long processes

This doesn't fit well in a serverless/edge environment (like Vercel), so we run a dedicated Node.js server.

### Why Re-encoding?

Different videos often have:
- Different codecs (H.264, H.265, VP9, etc.)
- Different resolutions (1080p, 720p, 4K, etc.)
- Different frame rates (24fps, 30fps, 60fps)
- Some have audio, some don't

The FFmpeg server normalizes all videos to a common format before joining them, ensuring smooth playback.

---

## File Location

```
apps/web/app/test/ffmpeg/
├── page.tsx          # The main React component
└── docs/
    └── README.md     # This documentation
```

---

## Testing Checklist

- [ ] Can upload a video in the first slot
- [ ] Can upload a video in the second slot
- [ ] Can remove a selected video
- [ ] Can select different transition types
- [ ] Can adjust transition duration with slider
- [ ] Join button is disabled until both videos are selected
- [ ] Shows loading state during processing
- [ ] Displays the combined video when complete
- [ ] Transitions work correctly with audio sync
- [ ] Download button works
- [ ] Error messages appear for failures
