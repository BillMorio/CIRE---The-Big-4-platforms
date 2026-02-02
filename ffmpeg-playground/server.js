import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3333;

// Enable CORS for all origins (for development)
app.use(cors());

// Create directories for uploads and outputs
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir));
app.use('/outputs', express.static(outputsDir));

// ============================================
// FFmpeg Playground Endpoints
// ============================================

// 1. Check FFmpeg availability
app.get('/api/ffmpeg-info', (req, res) => {
  ffmpeg.getAvailableFormats((err, formats) => {
    if (err) {
      return res.status(500).json({ 
        error: 'FFmpeg not found or not working',
        message: err.message,
        hint: 'Make sure FFmpeg is installed and in your PATH'
      });
    }
    
    ffmpeg.getAvailableCodecs((err, codecs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        status: 'FFmpeg is available!',
        formatsCount: Object.keys(formats).length,
        codecsCount: Object.keys(codecs).length,
        sampleFormats: Object.keys(formats).slice(0, 20),
        sampleVideoCodecs: Object.keys(codecs).filter(c => codecs[c].type === 'video').slice(0, 10)
      });
    });
  });
});

// 2. Get video/audio metadata
app.post('/api/probe', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  ffmpeg.ffprobe(req.file.path, (err, metadata) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      filename: req.file.originalname,
      format: metadata.format,
      streams: metadata.streams
    });
  });
});

// 3. Convert video format
app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const outputFormat = req.body.format || 'mp4';
  const outputPath = path.join(outputsDir, `converted-${Date.now()}.${outputFormat}`);

  ffmpeg(req.file.path)
    .output(outputPath)
    .on('start', (cmd) => console.log('Started:', cmd))
    .on('progress', (progress) => console.log('Progress:', progress.percent?.toFixed(2) + '%'))
    .on('end', () => {
      res.json({
        success: true,
        message: 'Conversion complete!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// 4. Extract audio from video
app.post('/api/extract-audio', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const outputPath = path.join(outputsDir, `audio-${Date.now()}.mp3`);

  ffmpeg(req.file.path)
    .noVideo()
    .audioCodec('libmp3lame')
    .audioBitrate(192)
    .output(outputPath)
    .on('end', () => {
      res.json({
        success: true,
        message: 'Audio extracted!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// 5. Create thumbnail from video
app.post('/api/thumbnail', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const timestamp = req.body.timestamp || '00:00:01';
  const outputPath = path.join(outputsDir, `thumb-${Date.now()}.png`);

  ffmpeg(req.file.path)
    .screenshots({
      timestamps: [timestamp],
      filename: path.basename(outputPath),
      folder: outputsDir,
      size: '320x240'
    })
    .on('end', () => {
      res.json({
        success: true,
        message: 'Thumbnail created!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
});

// 6. Resize/scale video
app.post('/api/resize', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const width = req.body.width || 640;
  const height = req.body.height || 480;
  const outputPath = path.join(outputsDir, `resized-${Date.now()}.mp4`);

  ffmpeg(req.file.path)
    .size(`${width}x${height}`)
    .output(outputPath)
    .on('end', () => {
      res.json({
        success: true,
        message: 'Video resized!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// 7. Trim video
app.post('/api/trim', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const startTime = req.body.start || '00:00:00';
  const duration = req.body.duration || '00:00:10';
  const outputPath = path.join(outputsDir, `trimmed-${Date.now()}.mp4`);

  ffmpeg(req.file.path)
    .setStartTime(startTime)
    .setDuration(duration)
    .output(outputPath)
    .on('end', () => {
      res.json({
        success: true,
        message: 'Video trimmed!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// 8. Add watermark/overlay
app.post('/api/watermark', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'watermark', maxCount: 1 }
]), (req, res) => {
  if (!req.files?.video || !req.files?.watermark) {
    return res.status(400).json({ error: 'Both video and watermark files required' });
  }

  const videoPath = req.files.video[0].path;
  const watermarkPath = req.files.watermark[0].path;
  const outputPath = path.join(outputsDir, `watermarked-${Date.now()}.mp4`);

  ffmpeg(videoPath)
    .input(watermarkPath)
    .complexFilter([
      'overlay=10:10' // Position watermark at top-left with 10px padding
    ])
    .output(outputPath)
    .on('end', () => {
      res.json({
        success: true,
        message: 'Watermark added!',
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// 9. Concatenate videos (with re-encoding and optional transitions)
app.post('/api/concat', upload.array('files', 10), async (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: 'At least 2 files required' });
  }

  const outputPath = path.join(outputsDir, `concat-${Date.now()}.mp4`);
  const files = req.files;
  const transition = req.body.transition || 'none';
  const transitionDuration = parseFloat(req.body.transitionDuration) || 1;
  
  console.log(`Transition: ${transition}, Duration: ${transitionDuration}s`);
  
  // Helper to get video duration
  const getVideoDuration = (filePath) => {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          resolve(0);
          return;
        }
        resolve(metadata.format.duration || 0);
      });
    });
  };
  
  // Helper to check if file has audio stream
  const hasAudio = (filePath) => {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          resolve(false);
          return;
        }
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
        resolve(!!audioStream);
      });
    });
  };

  try {
    // Check each file for audio and get durations
    const [audioChecks, durations] = await Promise.all([
      Promise.all(files.map(f => hasAudio(f.path))),
      Promise.all(files.map(f => getVideoDuration(f.path)))
    ]);
    
    console.log('Audio checks:', audioChecks);
    console.log('Durations:', durations);
    
    // We need to add a silent audio source for videos without audio
    const needsSilentAudio = audioChecks.some(hasAudio => !hasAudio);
    let silentAudioInput = needsSilentAudio ? files.length : null;
    
    let filterParts = [];
    
    // Map xfade transition names
    const xfadeMap = {
      'crossfade': 'fade',
      'fade': 'fade',
      'wipeleft': 'wipeleft',
      'wiperight': 'wiperight',
      'slideup': 'slideup',
      'slidedown': 'slidedown',
    };
    
    if (transition === 'none' || files.length > 2) {
      // No transition or more than 2 videos - use simple concat
      let concatInputs = '';
      
      files.forEach((_, i) => {
        filterParts.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v${i}]`);
        
        if (audioChecks[i]) {
          filterParts.push(`[${i}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[a${i}]`);
        } else {
          filterParts.push(`[${silentAudioInput}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[a${i}]`);
        }
        
        concatInputs += `[v${i}][a${i}]`;
      });
      
      filterParts.push(`${concatInputs}concat=n=${files.length}:v=1:a=1[outv][outa]`);
    } else {
      // With transition - use xfade for video
      const xfadeType = xfadeMap[transition] || 'fade';
      const video1Duration = durations[0];
      const offsetTime = Math.max(0, video1Duration - transitionDuration);
      const offsetMs = Math.round(offsetTime * 1000); // adelay uses milliseconds
      
      // Scale both videos
      filterParts.push(`[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v0]`);
      filterParts.push(`[1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v1]`);
      
      // Apply xfade video transition
      filterParts.push(`[v0][v1]xfade=transition=${xfadeType}:duration=${transitionDuration}:offset=${offsetTime}[outv]`);
      
      // Handle audio - use adelay and amix to properly overlap audio during transition
      // This keeps audio in sync with the video overlap from xfade
      if (audioChecks[0] && audioChecks[1]) {
        // Both have audio - delay second audio and mix
        filterParts.push(`[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,afade=t=out:st=${offsetTime}:d=${transitionDuration}[a0]`);
        filterParts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=${transitionDuration},adelay=${offsetMs}|${offsetMs}[a1]`);
        filterParts.push(`[a0][a1]amix=inputs=2:duration=longest:normalize=0[outa]`);
      } else if (audioChecks[0]) {
        // Only first has audio - just fade out, pad with silence
        filterParts.push(`[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,afade=t=out:st=${offsetTime}:d=${transitionDuration}[a0]`);
        filterParts.push(`[${silentAudioInput}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,adelay=${offsetMs}|${offsetMs}[a1]`);
        filterParts.push(`[a0][a1]amix=inputs=2:duration=longest:normalize=0[outa]`);
      } else if (audioChecks[1]) {
        // Only second has audio - delay it and fade in
        filterParts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=${transitionDuration},adelay=${offsetMs}|${offsetMs}[outa]`);
      } else {
        // Neither has audio - just use silent audio
        filterParts.push(`[${silentAudioInput}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[outa]`);
      }
    }
    
    const filterComplex = filterParts.join(';');
    console.log('Filter complex:', filterComplex);

    let command = ffmpeg();
    
    // Add all input files
    files.forEach(file => {
      command = command.input(file.path);
    });
    
    // Add silent audio generator if needed
    if (needsSilentAudio) {
      command = command
        .input('anullsrc=channel_layout=stereo:sample_rate=44100')
        .inputOptions(['-f', 'lavfi', '-t', '3600']);
    }

    command
      .complexFilter(filterComplex)
      .outputOptions([
        '-map', '[outv]',
        '-map', '[outa]',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-movflags', '+faststart'
      ])
      .output(outputPath)
      .on('start', (cmd) => console.log('Concat started:', cmd))
      .on('progress', (progress) => console.log('Progress:', progress.percent?.toFixed(2) + '%'))
      .on('end', () => {
        console.log('Concat complete!');
        res.json({
          success: true,
          message: 'Videos concatenated!',
          outputFile: `/outputs/${path.basename(outputPath)}`
        });
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Concat error:', err.message);
        console.error('FFmpeg stderr:', stderr);
        res.status(500).json({ error: err.message, details: stderr });
      })
      .run();
  } catch (err) {
    console.error('Concat setup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 10. Apply video filters (grayscale, blur, etc.)
app.post('/api/filter', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filter = req.body.filter || 'grayscale';
  const outputPath = path.join(outputsDir, `filtered-${Date.now()}.mp4`);

  // Map of user-friendly filter names to FFmpeg filter syntax
  const filterMap = {
    grayscale: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
    blur: 'boxblur=5:1',
    sharpen: 'unsharp=5:5:1.0:5:5:0.0',
    mirror: 'hflip',
    flip: 'vflip',
    sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
    vintage: 'curves=vintage',
    negative: 'negate'
  };

  const ffmpegFilter = filterMap[filter] || filter;

  ffmpeg(req.file.path)
    .videoFilters(ffmpegFilter)
    .output(outputPath)
    .on('end', () => {
      res.json({
        success: true,
        message: `Filter "${filter}" applied!`,
        outputFile: `/outputs/${path.basename(outputPath)}`
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// Simple test page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FFmpeg Playground</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
        h1 { color: #00d9ff; }
        h2 { color: #ff6b6b; margin-top: 30px; }
        .endpoint { background: #16213e; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #00d9ff; }
        .method { color: #4ade80; font-weight: bold; }
        code { background: #0f3460; padding: 2px 6px; border-radius: 4px; }
        a { color: #00d9ff; }
      </style>
    </head>
    <body>
      <h1>🎬 FFmpeg Playground Server</h1>
      <p>A simple Node.js server to experiment with FFmpeg capabilities.</p>
      
      <h2>Available Endpoints</h2>
      
      <div class="endpoint">
        <span class="method">GET</span> <code>/api/ffmpeg-info</code>
        <p>Check if FFmpeg is available and get supported formats/codecs</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/probe</code>
        <p>Get metadata from a video/audio file. Upload a file as <code>file</code></p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/convert</code>
        <p>Convert video format. Body: <code>format</code> (e.g., "webm", "avi")</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/extract-audio</code>
        <p>Extract audio track from video as MP3</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/thumbnail</code>
        <p>Generate thumbnail from video. Body: <code>timestamp</code> (e.g., "00:00:05")</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/resize</code>
        <p>Resize video. Body: <code>width</code>, <code>height</code></p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/trim</code>
        <p>Trim video. Body: <code>start</code> (timestamp), <code>duration</code> (e.g., "00:00:10")</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/watermark</code>
        <p>Add watermark. Upload <code>video</code> and <code>watermark</code> files</p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/concat</code>
        <p>Concatenate videos. Upload multiple files as <code>files</code></p>
      </div>
      
      <div class="endpoint">
        <span class="method">POST</span> <code>/api/filter</code>
        <p>Apply filter. Body: <code>filter</code> (grayscale, blur, sharpen, mirror, flip, sepia, vintage, negative)</p>
      </div>
      
      <h2>Quick Test</h2>
      <p><a href="/api/ffmpeg-info">Click here to test if FFmpeg is working</a></p>
      
      <h2>Usage with cURL</h2>
      <pre style="background: #0f3460; padding: 15px; border-radius: 8px; overflow-x: auto;">
# Check FFmpeg
curl http://localhost:3333/api/ffmpeg-info

# Probe a file
curl -X POST -F "file=@video.mp4" http://localhost:3333/api/probe

# Convert to WebM
curl -X POST -F "file=@video.mp4" -F "format=webm" http://localhost:3333/api/convert

# Extract audio
curl -X POST -F "file=@video.mp4" http://localhost:3333/api/extract-audio

# Apply grayscale filter
curl -X POST -F "file=@video.mp4" -F "filter=grayscale" http://localhost:3333/api/filter
      </pre>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`
  🎬 FFmpeg Playground Server running!
  
  Open: http://localhost:${PORT}
  
  Make sure FFmpeg is installed:
  - Windows: choco install ffmpeg  OR  download from https://ffmpeg.org/download.html
  - Mac: brew install ffmpeg
  - Linux: sudo apt install ffmpeg
  `);
});
