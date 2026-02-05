import { supabase } from '../config/supabase.js';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import config from '../config/storage.js';

/**
 * Uploads a local file to Supabase Storage
 * @param {string} localPath Full path to the local file
 * @param {string} bucket Bucket name
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadToSupabase(localPath, bucket = 'Lumina web3 file storage') {
  try {
    const fileName = `${Date.now()}-${path.basename(localPath)}`;
    const fileBuffer = await fsPromises.readFile(localPath);

    console.log(`[StorageService] Uploading ${path.basename(localPath)} to Supabase...`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: getContentType(localPath),
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log(`[StorageService] Upload successful: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('[StorageService] Error uploading to Supabase:', err);
    throw err;
  }
}

/**
 * Downloads an external file to the local uploads directory
 * @param {string} url External URL
 * @returns {Promise<string>} Local path to the downloaded file
 */
export async function downloadFile(url) {
  try {
    const fileName = `${Date.now()}-download-${path.basename(new URL(url).pathname)}`;
    const localPath = path.join(config.uploadsDir, fileName);
    
    console.log(`[StorageService] Downloading ${url} to local disk...`);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`[StorageService] Download complete: ${localPath}`);
        resolve(localPath);
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error('[StorageService] Error downloading file:', err);
    throw err;
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp4': return 'video/mp4';
    case '.mp3': return 'audio/mpeg';
    case '.wav': return 'audio/wav';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}
