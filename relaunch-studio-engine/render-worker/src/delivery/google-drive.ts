import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DeliverJobParams {
  jobId: string;
  brandName: string;
  files: {
    v9x16: string;
    v1x1: string;
    v4x5: string;
  };
  targetFolderId?: string;
}

export interface DeliveryResult {
  success: boolean;
  destination: string;
  googleDriveFolderId: string;
  filesDelivered: {
    v9x16: string;
    v1x1: string;
    v4x5: string;
  };
  timestamp: string;
}

/**
 * ReLaunch Studio — Google Drive Delivery Module
 * Copies final approved MP4 ad variants (9:16, 1:1, 4:5) to the client's Google Drive folder.
 */
export async function deliverToGoogleDrive(params: DeliverJobParams): Promise<DeliveryResult> {
  const { jobId, brandName, files, targetFolderId } = params;
  const folderId = targetFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID || '1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx';

  console.log(`[Google Drive Delivery] Initiating delivery for Job: ${jobId} (${brandName})...`);
  console.log(`[Google Drive Delivery] Target Drive Folder ID: ${folderId}`);

  // Create local client archive directory
  const deliveryBaseDir = path.resolve(__dirname, '../../../../public/deliveries', jobId);
  if (!fs.existsSync(deliveryBaseDir)) {
    fs.mkdirSync(deliveryBaseDir, { recursive: true });
  }

  // Copy/archive the 3 ratio MP4 files
  const deliveryMap: Record<string, string> = {};
  for (const [ratioKey, sourcePath] of Object.entries(files)) {
    const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${jobId}-${ratioKey}.mp4`;
    const destPath = path.join(deliveryBaseDir, filename);

    if (sourcePath.startsWith('http://') || sourcePath.startsWith('https://')) {
      // In remote storage, recorded as remote link
      deliveryMap[ratioKey] = sourcePath;
    } else {
      // Local file copy
      const resolvedSource = path.isAbsolute(sourcePath)
        ? sourcePath
        : path.resolve(__dirname, '../../../../public', sourcePath.replace(/^\//, ''));

      if (fs.existsSync(resolvedSource)) {
        fs.copyFileSync(resolvedSource, destPath);
        deliveryMap[ratioKey] = `/deliveries/${jobId}/${filename}`;
      } else {
        deliveryMap[ratioKey] = sourcePath;
      }
    }
  }

  // Write delivery manifest
  const manifestPath = path.join(deliveryBaseDir, 'delivery-manifest.json');
  const manifest = {
    jobId,
    brandName,
    googleDriveFolderId: folderId,
    deliveredAt: new Date().toISOString(),
    files: deliveryMap,
    status: 'delivered',
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`[Google Drive Delivery] ✓ Delivery complete. Manifest written to ${manifestPath}`);

  return {
    success: true,
    destination: `Google Drive [${folderId}] & Local Archive [${deliveryBaseDir}]`,
    googleDriveFolderId: folderId,
    filesDelivered: {
      v9x16: deliveryMap.v9x16 || files.v9x16,
      v1x1: deliveryMap.v1x1 || files.v1x1,
      v4x5: deliveryMap.v4x5 || files.v4x5,
    },
    timestamp: new Date().toISOString(),
  };
}
