import express from 'express';
import * as ffmpegController from './controllers/ffmpeg-controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Health check
router.get('/health', ffmpegController.healthCheck);

// Info
router.get('/api/ffmpeg-info', ffmpegController.getInfo);

// Probe
router.post('/api/probe', upload.single('file'), ffmpegController.probe);

// Upload
router.post('/api/upload', upload.single('file'), ffmpegController.uploadFile);

// Transformations
router.post('/api/convert', upload.single('file'), ffmpegController.convert);
router.post('/api/resize', upload.single('file'), ffmpegController.resize);
router.post('/api/trim', upload.single('file'), ffmpegController.trim);
router.post('/api/thumbnail', upload.single('file'), ffmpegController.thumbnail);
router.post('/api/extract-audio', upload.single('file'), ffmpegController.audio);
router.post('/api/audio-trim', upload.single('file'), ffmpegController.trimAudioAction);
router.post('/api/filter', upload.single('file'), ffmpegController.filter);
router.post('/api/speed', upload.single('file'), ffmpegController.speed);
router.post('/api/zoom', upload.single('file'), ffmpegController.zoom);

// Complex Transformations (Multi-file)
router.post('/api/watermark', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'watermark', maxCount: 1 }
]), ffmpegController.watermark);

router.post('/api/concat', upload.array('files', 10), ffmpegController.concat);

// Project Production Routes
router.post('/api/project/stitch', ffmpegController.projectStitch);

// Agent Internal Routes (Path-based)
router.post('/api/agent/probe', ffmpegController.agentProbe);
router.post('/api/agent/trim', ffmpegController.agentTrim);
router.post('/api/agent/concat', ffmpegController.agentConcat);

export default router;
