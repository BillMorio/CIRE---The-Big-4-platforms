import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import config from '../config/storage.js';

export const extractAudio = (inputPath) => {
  const outputPath = path.join(config.outputsDir, `audio-${Date.now()}.mp3`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate(192)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};

export const trimAudio = (inputPath, start, duration) => {
  const outputPath = path.join(config.outputsDir, `trim-${Date.now()}.mp3`);
  
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .setStartTime(start)
      .audioCodec('libmp3lame')
      .audioBitrate(192);

    if (duration) {
      command = command.setDuration(duration);
    }

    command
      .output(outputPath)
      .on('start', (cmd) => console.log('[FFmpeg] Executing:', cmd))
      .on('end', () => {
        const stats = fs.statSync(outputPath);
        if (stats.size === 0) {
          fs.unlinkSync(outputPath); // Clean up empty file
          reject(new Error('Extraction produced an empty file. Check if start time is within bounds.'));
          return;
        }
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        err.stderr = stderr;
        reject(err);
      })
      .run();
  });
};
