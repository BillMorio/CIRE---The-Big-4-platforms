import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import config from '../config/storage.js';

export const convertVideo = (inputPath, outputFormat = 'mp4') => {
  const outputPath = path.join(config.outputsDir, `converted-${Date.now()}.${outputFormat}`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('start', (cmd) => console.log('Started conversion:', cmd))
      .on('end', () => resolve(outputPath))
      .on('error', (err, stdout, stderr) => {
        const error = new Error(err.message);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      })
      .run();
  });
};

export const resizeVideo = (inputPath, width, height) => {
  const outputPath = path.join(config.outputsDir, `resized-${Date.now()}.mp4`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(`${width}x${height}`)
      .output(outputPath)
      .on('start', (cmd) => console.log('[FFmpeg] Started resizing:', cmd))
      .on('end', () => {
        console.log('[FFmpeg] Resizing complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('[FFmpeg] Resizing error:', err.message);
        console.error('[FFmpeg] stderr:', stderr);
        const error = new Error(err.message);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      })
      .run();
  });
};

export const trimVideo = (inputPath, start, duration) => {
  const outputPath = path.join(config.outputsDir, `trimmed-${Date.now()}.mp4`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .on('start', (cmd) => console.log('[FFmpeg] Started trimming:', cmd))
      .on('end', () => {
        console.log('[FFmpeg] Trimming complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('[FFmpeg] Trimming error:', err.message);
        console.error('[FFmpeg] stderr:', stderr);
        const error = new Error(err.message);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      })
      .run();
  });
};

export const applyFilter = (inputPath, filterName) => {
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

  const ffmpegFilter = filterMap[filterName] || filterName;
  const outputPath = path.join(config.outputsDir, `filtered-${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(ffmpegFilter)
      .output(outputPath)
      .on('start', (cmd) => console.log('[FFmpeg] Started filter:', cmd))
      .on('end', () => {
        console.log('[FFmpeg] Filter complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('[FFmpeg] Filter error:', err.message);
        console.error('[FFmpeg] stderr:', stderr);
        const error = new Error(err.message);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      })
      .run();
  });
};

export const generateThumbnail = (inputPath, timestamp = '00:00:01') => {
  const filename = `thumb-${Date.now()}.png`;
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: filename,
        folder: config.outputsDir,
        size: '320x240'
      })
      .on('end', () => resolve(path.join(config.outputsDir, filename)))
      .on('error', (err) => reject(err));
  });
};

export const watermarkVideo = (videoPath, watermarkPath) => {
  const outputPath = path.join(config.outputsDir, `watermarked-${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(watermarkPath)
      .complexFilter(['overlay=10:10'])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};

export const concatVideos = async (files, transition = 'none', transitionDuration = 1) => {
  const outputPath = path.join(config.outputsDir, `production-master-${Date.now()}.mp4`);
  
  const getVideoDuration = (filePath) => {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        resolve(err ? 0 : (metadata.format.duration || 0));
      });
    });
  };
  
  const hasAudio = (filePath) => {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return resolve(false);
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
        resolve(!!audioStream);
      });
    });
  };

  const [audioChecks, durations] = await Promise.all([
    Promise.all(files.map(f => hasAudio(f.path))),
    Promise.all(files.map(f => getVideoDuration(f.path)))
  ]);
  
  let filterParts = [];
  
  const xfadeMap = { 'crossfade': 'fade', 'fade': 'fade', 'wipeleft': 'wipeleft', 'wiperight': 'wiperight', 'slideup': 'slideup', 'slidedown': 'slidedown' };
  
  // NORMALIZE ALL INPUTS: 1920x1080, 30fps, yuv420p
  // This ensures that even mixed 720p/1080p or different formats stitch perfectly.
  
  if (transition === 'none' || files.length < 2) {
    let concatInputs = '';
    files.forEach((_, i) => {
      // Scale and pad to 1920x1080
      filterParts.push(`[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v${i}]`);
      
      if (audioChecks[i]) {
        filterParts.push(`[${i}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[a${i}]`);
      } else {
        filterParts.push(`anullsrc=channel_layout=stereo:sample_rate=44100:duration=${durations[i]}[a${i}]`);
      }
      concatInputs += `[v${i}][a${i}]`;
    });
    filterParts.push(`${concatInputs}concat=n=${files.length}:v=1:a=1[outv][outa]`);
  } else {
    // 2. Video Sequential transition chain (Duration Preserving)
    // We use sequential fade filters on each stream and then concat them.
    // This ensures Total Duration = Sum(Scene Durations).
    files.forEach((_, i) => {
      const dur = durations[i];
      const h_fade = transitionDuration / 2;
      
      // Build a filter that fades in at start and out at end
      let vFilters = `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1`;
      
      if (i > 0) vFilters += `,fade=t=in:st=0:d=${h_fade}`;
      if (i < files.length - 1) vFilters += `,fade=t=out:st=${dur - h_fade}:d=${h_fade}`;
      
      filterParts.push(`[${i}:v]${vFilters}[v${i}]`);
      
      let aFilters = `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo`;
      if (!audioChecks[i]) {
        // Generate silence for the full duration of the clip
        filterParts.push(`anullsrc=channel_layout=stereo:sample_rate=44100:duration=${dur}[sa${i}]`);
        aFilters = `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo`;
        if (i > 0) aFilters += `,afade=t=in:st=0:d=${h_fade}`;
        if (i < files.length - 1) aFilters += `,afade=t=out:st=${dur - h_fade}:d=${h_fade}`;
        filterParts.push(`[sa${i}]${aFilters}[a${i}]`);
      } else {
        if (i > 0) aFilters += `,afade=t=in:st=0:d=${h_fade}`;
        if (i < files.length - 1) aFilters += `,afade=t=out:st=${dur - h_fade}:d=${h_fade}`;
        filterParts.push(`[${i}:a]${aFilters}[a${i}]`);
      }
    });

    let sequentialInputs = '';
    files.forEach((_, i) => { sequentialInputs += `[v${i}][a${i}]`; });
    filterParts.push(`${sequentialInputs}concat=n=${files.length}:v=1:a=1[outv][outa]`);
  }

  return new Promise((resolve, reject) => {
    let command = ffmpeg();
    files.forEach(f => { command = command.input(f.path); });
    
    // No longer need to add anullsrc as an external input
    
    command
      .complexFilter(filterParts.join(';'))
      .outputOptions(['-map', '[outv]', '-map', '[outa]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart'])
      .output(outputPath)
      .on('start', (cmd) => console.log('[FFmpeg] Started Production Concat:', cmd))
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`[FFmpeg] Processing: ${progress.percent.toFixed(2)}% | Time: ${progress.timemark}`);
        } else {
          console.log(`[FFmpeg] Processing... | Time: ${progress.timemark}`);
        }
      })
      .on('end', () => {
        console.log('[FFmpeg] Production Concat complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('[FFmpeg] Concat error:', err.message);
        console.error('[FFmpeg] stderr:', stderr);
        const error = new Error(err.message);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      })
      .run();
  });
};

export const adjustSpeed = async (inputPath, targetDuration, inputSpeed) => {
  const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 0);
      });
    });
  };

  const originalDuration = await getVideoDuration(inputPath);
  let speed = targetDuration ? (originalDuration / targetDuration) : (inputSpeed || 1);
  speed = Math.max(0.25, Math.min(4, speed));

  const outputPath = path.join(config.outputsDir, `speed-${Date.now()}.mp4`);
  const buildAtempoFilter = (s) => {
    const filters = [];
    let cur = s;
    while (cur > 2.0) { filters.push('atempo=2.0'); cur /= 2.0; }
    while (cur < 0.5) { filters.push('atempo=0.5'); cur /= 0.5; }
    filters.push(`atempo=${cur.toFixed(4)}`);
    return filters.join(',');
  };

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(`setpts=PTS/${speed}`)
      .audioFilters(buildAtempoFilter(speed))
      .outputOptions(['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '192k'])
      .output(outputPath)
      .on('end', () => resolve({ outputPath, originalDuration, speed }))
      .on('error', (err) => reject(err))
      .run();
  });
};

export const applyZoom = async (inputPath, options) => {
  const getVideoInfo = (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        const vs = metadata.streams.find(s => s.codec_type === 'video');
        let fps = 30;
        if (vs?.r_frame_rate) {
          const p = vs.r_frame_rate.split('/');
          fps = p.length === 2 ? parseInt(p[0]) / parseInt(p[1]) : parseFloat(p[0]);
        }
        resolve({ duration: metadata.format.duration || 0, width: vs?.width || 1920, height: vs?.height || 1080, fps: Math.round(fps) || 30 });
      });
    });
  };

  const vi = await getVideoInfo(inputPath);
  const { type = 'in', startZoom = options.type === 'in' ? 1 : 1.5, endZoom = options.type === 'in' ? 1.5 : 1, centerX = 0.5, centerY = 0.5 } = options;
  const outW = options.width || vi.width;
  const outH = options.height || vi.height;
  const outputPath = path.join(config.outputsDir, `zoom-${Date.now()}.mp4`);
  
  const totalFrames = Math.ceil(vi.duration * vi.fps);
  const upscale = 8;
  const upW = Math.round(outW * upscale);
  const upH = Math.round(outH * upscale);
  
  const filter = [
    `scale=${upW}:${upH}:flags=lanczos`,
    `zoompan=z='${startZoom}+(${endZoom}-${startZoom})*(on/${totalFrames})':x='(iw-iw/zoom)*${centerX}':y='(ih-ih/zoom)*${centerY}':d=1:s=${upW}x${upH}:fps=${vi.fps}`,
    `scale=${outW}:${outH}:flags=lanczos`
  ].join(',');

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(filter)
      .outputOptions(['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '192k', '-pix_fmt', 'yuv420p'])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};
