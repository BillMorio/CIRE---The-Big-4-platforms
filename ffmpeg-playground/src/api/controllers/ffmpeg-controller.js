import { 
  getFfmpegInfo, 
  probeMetadata, 
  checkHealth 
} from '../../services/ffmpeg-core.js';
import { 
  convertVideo, 
  resizeVideo, 
  trimVideo, 
  applyFilter,
  generateThumbnail,
  watermarkVideo,
  concatVideos,
  adjustSpeed,
  applyZoom
} from '../../services/video-service.js';
import { extractAudio, trimAudio } from '../../services/audio-service.js';
import path from 'path';
import config from '../../config/storage.js';
import { uploadToSupabase, downloadFile } from '../../services/storage-service.js';
import { promises as fsPromises } from 'fs';

export const healthCheck = async (req, res) => {
  const isHealthy = await checkHealth();
  if (isHealthy) res.send('OK');
  else res.status(500).send('FFmpeg not ready');
};

export const getInfo = async (req, res) => {
  try {
    const info = await getFfmpegInfo();
    res.json({
      status: 'FFmpeg is available!',
      formatsCount: Object.keys(info.formats).length,
      codecsCount: Object.keys(info.codecs).length,
      sampleFormats: Object.keys(info.formats).slice(0, 20),
      sampleVideoCodecs: Object.keys(info.codecs).filter(c => info.codecs[c].type === 'video').slice(0, 10)
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const probe = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const metadata = await probeMetadata(req.file.path);
    res.json({
      filename: req.file.originalname,
      format: metadata.format,
      streams: metadata.streams
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const convert = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await convertVideo(req.file.path, req.body.format);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Conversion complete!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const resize = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await resizeVideo(req.file.path, req.body.width, req.body.height);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Video resized!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const trim = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await trimVideo(req.file.path, req.body.start, req.body.duration);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Video trimmed!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const filter = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await applyFilter(req.file.path, req.body.filter);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: `Filter applied!`,
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const thumbnail = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await generateThumbnail(req.file.path, req.body.timestamp);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Thumbnail created!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const audio = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await extractAudio(req.file.path);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Audio extracted!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const trimAudioAction = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await trimAudio(req.file.path, req.body.start, req.body.duration);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Audio segment processed!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const watermark = async (req, res) => {
  if (!req.files?.video || !req.files?.watermark) {
    return res.status(400).json({ error: 'Both video and watermark files required' });
  }
  try {
    const outPath = await watermarkVideo(req.files.video[0].path, req.files.watermark[0].path);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Watermark added!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const concat = async (req, res) => {
  console.log('[API] Concat Request:', { 
    files: req.files?.map(f => f.originalname), 
    transition: req.body.transition,
    duration: req.body.transitionDuration 
  });
  if (!req.files || req.files.length < 2) return res.status(400).json({ error: 'At least 2 files required' });
  try {
    const outPath = await concatVideos(req.files, req.body.transition, req.body.transitionDuration);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Videos concatenated!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    console.error('[API] Concat Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const speed = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await adjustSpeed(req.file.path, req.body.targetDuration, req.body.speed);
    const publicUrl = await uploadToSupabase(result.outputPath);
    res.json({
      success: true,
      message: `Speed adjusted to ${result.speed.toFixed(2)}x`,
      outputFile: `/outputs/${path.basename(result.outputPath)}`,
      publicUrl,
      originalDuration: result.originalDuration.toFixed(2),
      speedApplied: result.speed.toFixed(2)
    });
  } catch (err) {
    console.error(`[API] ${req.path} Error:`, err);
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || err.stdout || null
    });
  }
};

export const zoom = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const outPath = await applyZoom(req.file.path, req.body);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Zoom effect applied!',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: path.basename(req.file.path),
    originalName: req.file.originalname,
    path: `/uploads/${path.basename(req.file.path)}`
  });
};

// --- Agent Actions (Work with files already on disk) ---

export const agentProbe = async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'Filename is required' });
  try {
    const filePath = path.join(config.uploadsDir, filename);
    const metadata = await probeMetadata(filePath);
    res.json({ success: true, metadata });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const agentTrim = async (req, res) => {
  const { filename, start, duration } = req.body;
  if (!filename) return res.status(400).json({ error: 'Filename is required' });
  try {
    const filePath = path.join(config.uploadsDir, filename);
    const isAudio = filename.toLowerCase().endsWith('.mp3') || filename.toLowerCase().endsWith('.wav');
    const outPath = isAudio 
      ? await trimAudio(filePath, start, duration)
      : await trimVideo(filePath, start, duration);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Agent trim complete',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const agentConcat = async (req, res) => {
  const { filenames, transition, duration } = req.body;
  if (!filenames || filenames.length < 2) return res.status(400).json({ error: 'At least 2 filenames required' });
  try {
    const files = filenames.map(f => ({ path: path.join(config.uploadsDir, f) }));
    const outPath = await concatVideos(files, transition, duration);
    const publicUrl = await uploadToSupabase(outPath);
    res.json({
      success: true,
      message: 'Agent concat complete',
      outputFile: `/outputs/${path.basename(outPath)}`,
      publicUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const projectStitch = async (req, res) => {
  console.log('>>> [BACKEND] projectStitch ENTERED');
  const { sceneUrls, transition, duration } = req.body;
  
  console.log('[API] Project Stitch Request:', { 
    count: sceneUrls?.length,
    url0: sceneUrls?.[0],
    transition 
  });

  if (!sceneUrls || sceneUrls.length < 2) {
    return res.status(400).json({ error: 'At least 2 scenes required for stitching' });
  }

  const downloadedPaths = [];
  
  try {
    // 1. Download all assets in parallel
    console.log(`[API] Downloading ${sceneUrls.length} scene assets in parallel...`);
    const downloadPromises = sceneUrls.map(url => downloadFile(url));
    const downloadedPaths = await Promise.all(downloadPromises);
    
    console.log('[API] All assets downloaded locally.');

    // 2. Concatenate with normalization
    console.log('[API] Starting concat of', downloadedPaths.length, 'files...');
    const outPath = await concatVideos(
      downloadedPaths.map(p => ({ path: p })), 
      transition || 'none', 
      duration || 1
    );

    // 3. Upload final master to Supabase
    console.log('[API] Uploading production master to storage...');
    const publicUrl = await uploadToSupabase(outPath);

    // 4. Cleanup temporary files
    console.log('[API] Cleaning up temporary assets...');
    await Promise.all(downloadedPaths.map(p => fsPromises.unlink(p).catch(e => console.error('Unlink error:', e))));
    // Don't unlink outPath yet, maybe keep it in outputs/ as per current logic
    
    res.json({
      success: true,
      message: 'Project production stitched successfully!',
      publicUrl,
      outputFile: `/outputs/${path.basename(outPath)}`
    });

  } catch (err) {
    console.error('[API] Project Stitch Error:', err);
    // Attempt cleanup on failure
    await Promise.all(downloadedPaths.map(p => fsPromises.unlink(p).catch(() => {})));
    
    res.status(500).json({ 
      error: err.message,
      details: err.stderr || null
    });
  }
};
