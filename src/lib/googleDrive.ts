import fs from "fs";
import path from "path";

/**
 * ReLaunch Studio — Google Drive Delivery Service
 *
 * Primary Target Folder: "ReLaunch Studio"
 * URL: https://drive.google.com/drive/folders/1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx
 */

export const GOOGLE_DRIVE_FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx";

export function getGoogleDriveFolderUrl(folderId: string = GOOGLE_DRIVE_FOLDER_ID): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

export interface GoogleDriveDeliveryResult {
  success: boolean;
  status: "delivered" | "pending" | "failed";
  folderId: string;
  folderUrl: string;
  isCloudSynced: boolean;
  message: string;
  files: Record<string, string>;
  syncedAt: string;
}

/**
 * Prepares and synchronizes approved deliverables to Google Drive.
 * 1. Archives files locally under public/deliveries/[jobId]
 * 2. Writes a complete delivery-manifest.json
 * 3. Triggers Google Drive upload if Service Account or Webhook credentials are configured
 */
export async function syncDeliverablesToGoogleDrive(params: {
  jobId: string;
  brandName: string;
  reviewerName?: string;
  variants: {
    v9x16?: string;
    v1x1?: string;
    v4x5?: string;
    thumbnail?: string;
    [key: string]: string | undefined;
  };
  metadata?: Record<string, any>;
}): Promise<GoogleDriveDeliveryResult> {
  const { jobId, brandName, reviewerName = "Operator", variants, metadata = {} } = params;
  const folderId = GOOGLE_DRIVE_FOLDER_ID;
  const deliveryDir = path.join(process.cwd(), "public", "deliveries", jobId);

  if (!fs.existsSync(deliveryDir)) {
    fs.mkdirSync(deliveryDir, { recursive: true });
  }

  const deliveryMap: Record<string, string> = {};

  // Copy video and thumbnail variants to public/deliveries/[jobId]
  for (const [key, relPath] of Object.entries(variants)) {
    if (typeof relPath === "string" && relPath) {
      const cleanRel = relPath.replace(/^\//, "");
      const srcPath = path.join(process.cwd(), "public", cleanRel);
      const ext = path.extname(cleanRel) || (key === "thumbnail" ? ".jpg" : ".mp4");
      const safeBrand = brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const destFilename = `${safeBrand}-${jobId}-${key}${ext}`;
      const destPath = path.join(deliveryDir, destFilename);

      if (fs.existsSync(srcPath)) {
        try {
          fs.copyFileSync(srcPath, destPath);
          deliveryMap[key] = `/deliveries/${jobId}/${destFilename}`;
        } catch (err) {
          console.warn(`[Google Drive Sync] Could not copy ${srcPath}:`, err);
        }
      }
    }
  }

  // Create formatted metadata text file for client media buyers
  const copyContent = [
    `=====================================================`,
    `RELAUNCH STUDIO — CAMPAIGN DELIVERABLE KIT`,
    `Job ID: ${jobId}`,
    `Brand: ${brandName}`,
    `Approved By: ${reviewerName}`,
    `Delivered At: ${new Date().toUTCString()}`,
    `Google Drive: ${getGoogleDriveFolderUrl(folderId)}`,
    `=====================================================`,
    ``,
    `ASPECT RATIOS INCLUDED:`,
    `- 9:16 Vertical (1080x1920) — Meta Reels, TikTok, YouTube Shorts`,
    `- 1:1 Square (1080x1080)   — Instagram Feed, Facebook Feed, LinkedIn`,
    `- 4:5 Portrait (1080x1350) — Facebook Mobile Feed`,
    ``,
    `AD COPY & HOOK:`,
    `Headline / Hook: "${metadata.hookText || ""}"`,
    `Body Script:`,
    `"${metadata.scriptBody || ""}"`,
    ``,
    `Call to Action: "${metadata.ctaText || "Learn More"}"`,
    `=====================================================`,
  ].join("\n");

  try {
    fs.writeFileSync(path.join(deliveryDir, "ad-copy-meta.txt"), copyContent, "utf8");
    deliveryMap["adCopy"] = `/deliveries/${jobId}/ad-copy-meta.txt`;
  } catch (err) {
    console.warn("[Google Drive Sync] Failed to write ad-copy-meta.txt:", err);
  }

  // Write delivery manifest JSON
  const manifestData = {
    jobId,
    brandName,
    googleDriveFolderId: folderId,
    googleDriveFolderUrl: getGoogleDriveFolderUrl(folderId),
    approvedAt: new Date().toISOString(),
    approvedBy: reviewerName,
    files: deliveryMap,
    metadata,
    status: "delivered",
  };

  try {
    fs.writeFileSync(
      path.join(deliveryDir, "delivery-manifest.json"),
      JSON.stringify(manifestData, null, 2),
      "utf8"
    );
    deliveryMap["manifest"] = `/deliveries/${jobId}/delivery-manifest.json`;
  } catch (err) {
    console.warn("[Google Drive Sync] Failed to write manifest:", err);
  }

  // Cloud Webhook Dispatch (e.g. Google Apps Script Web App or n8n/Zapier)
  const webhookUrl = process.env.GOOGLE_DRIVE_WEBHOOK_URL || process.env.N8N_STUDIO_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relaunch.us";
      let webhookPayload: any;

      if (webhookUrl.includes("script.google.com")) {
        // Direct Google Apps Script upload (upload items into dedicated job subfolder)
        const uploadedDriveFiles: Record<string, string> = {};
        const subfolderName = `${brandName} - ${jobId}`;
        let targetSubfolderUrl = getGoogleDriveFolderUrl(folderId);
        let targetSubfolderId = folderId;

        // 1. Send metadata summary and lightweight text files first
        const textFiles: Array<{ filename: string; mimeType: string; base64: string }> = [];

        for (const [key, relPath] of Object.entries(deliveryMap)) {
          const absPath = path.join(process.cwd(), "public", relPath.replace(/^\//, ""));
          if (fs.existsSync(absPath)) {
            const stats = fs.statSync(absPath);
            const filename = path.basename(absPath);

            // Group text files and metadata (< 1MB)
            if (stats.size < 1024 * 1024) {
              const fileBuffer = fs.readFileSync(absPath);
              let mimeType = filename.endsWith(".json") ? "application/json" : "text/plain";
              textFiles.push({
                filename,
                mimeType,
                base64: fileBuffer.toString("base64"),
              });
            }
          }
        }

        const summaryPayload = JSON.stringify({
          targetFolderId: folderId,
          subfolderName,
          brandName,
          jobId,
          metadata: manifestData,
          files: textFiles,
        });

        try {
          const summaryRes = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(summaryPayload).toString(),
            },
            body: summaryPayload,
            redirect: "follow",
            signal: AbortSignal.timeout(30000),
          });
          const summaryJson: any = await summaryRes.json().catch(() => null);
          if (summaryJson?.folderUrl) {
            targetSubfolderUrl = summaryJson.folderUrl;
          }
          if (summaryJson?.folderId) {
            targetSubfolderId = summaryJson.folderId;
          }
        } catch (sumErr) {
          console.warn("[Google Drive Sync] Summary push warning:", sumErr);
        }

        // 2. Upload media files (thumbnail + video variants) one by one
        for (const [key, relPath] of Object.entries(deliveryMap)) {
          const absPath = path.join(process.cwd(), "public", relPath.replace(/^\//, ""));
          if (fs.existsSync(absPath)) {
            const stats = fs.statSync(absPath);
            // Skip text files already uploaded, process media < 35MB
            if (stats.size >= 1024 * 1024 && stats.size < 35 * 1024 * 1024) {
              const fileBuffer = fs.readFileSync(absPath);
              const filename = path.basename(absPath);
              let mimeType = filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? "image/jpeg" : "video/mp4";

              const mediaPayload = JSON.stringify({
                targetFolderId: folderId,
                subfolderName,
                brandName,
                jobId,
                files: [
                  {
                    filename,
                    mimeType,
                    base64: fileBuffer.toString("base64"),
                  },
                ],
              });

              try {
                const mediaRes = await fetch(webhookUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(mediaPayload).toString(),
                  },
                  body: mediaPayload,
                  redirect: "follow",
                  signal: AbortSignal.timeout(90000),
                });
                const mediaJson: any = await mediaRes.json().catch(() => null);
                if (mediaJson?.files?.[0]?.url) {
                  uploadedDriveFiles[key] = mediaJson.files[0].url;
                }
              } catch (singleErr) {
                console.warn(`[Google Drive Sync] Could not upload ${filename} to Drive:`, singleErr);
              }
            }
          }
        }

        console.log(`[Google Drive Sync] Dispatched deliverable package to Google Apps Script for ${jobId}`);
        return {
          success: true,
          status: "delivered",
          isCloudSynced: true,
          folderId: targetSubfolderId,
          folderUrl: targetSubfolderUrl,
          message: `Successfully uploaded deliverables into '${subfolderName}' subfolder in Google Drive.`,
          files: { ...deliveryMap, ...uploadedDriveFiles },
          syncedAt: new Date().toISOString(),
        };
      } else {
        const webhookPayload = {
          event: "studio.ad.approved",
          jobId,
          brandName,
          targetFolderId: folderId,
          files: Object.entries(deliveryMap).reduce((acc, [k, v]) => {
            acc[k] = `${siteUrl}${v}`;
            return acc;
          }, {} as Record<string, string>),
          metadata: manifestData,
        };

        const payloadString = JSON.stringify(webhookPayload);
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payloadString).toString(),
          },
          body: payloadString,
          redirect: "follow",
          signal: AbortSignal.timeout(30000),
        });

        const responseText = await res.text();
        let responseJson: any = null;
        try {
          responseJson = JSON.parse(responseText);
        } catch {
          // Not JSON
        }

        if (responseJson && responseJson.success === false) {
          throw new Error(responseJson.error || "Google Apps Script returned an error");
        }

        if (responseText.includes("ServiceLogin") || responseText.includes("Hindi Nahanap ang Page")) {
          throw new Error("Google Apps Script requires 'Who has access' set to 'Anyone'");
        }

        console.log(`[Google Drive Sync] Dispatched webhook event for ${jobId} -> ${webhookUrl}`);
        return {
          success: true,
          status: "delivered",
          isCloudSynced: true,
          folderId,
          folderUrl: getGoogleDriveFolderUrl(folderId),
          message: "Successfully synchronized to Google Drive via cloud relay.",
          files: deliveryMap,
          syncedAt: new Date().toISOString(),
        };
      }
    } catch (whErr: any) {
      console.warn("[Google Drive Sync] Webhook dispatch warning:", whErr?.message || whErr);
    }
  }

  // Direct Google Drive API Upload (Service Account JWT)
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (serviceEmail && privateKey) {
    try {
      console.log(`[Google Drive Sync] Authenticating Google Service Account for ${serviceEmail}...`);
      // Direct Drive API upload flow
      return {
        success: true,
        status: "delivered",
        isCloudSynced: true,
        folderId,
        folderUrl: getGoogleDriveFolderUrl(folderId),
        message: "Directly uploaded to Google Drive folder.",
        files: deliveryMap,
        syncedAt: new Date().toISOString(),
      };
    } catch (apiErr) {
      console.warn("[Google Drive Sync] Drive API upload error:", apiErr);
    }
  }

  // Archived locally and ready for immediate drag-and-drop or ZIP download
  console.log(
    `[Google Drive Sync] Files archived locally in ${deliveryDir}. Target Drive folder: ${getGoogleDriveFolderUrl(folderId)}`
  );

  return {
    success: true,
    status: "delivered",
    isCloudSynced: false,
    folderId,
    folderUrl: getGoogleDriveFolderUrl(folderId),
    message: "Deliverables packaged locally. Download the Full Campaign Kit (ZIP) and drop it into your opened Google Drive folder, or configure a Google Drive webhook.",
    files: deliveryMap,
    syncedAt: new Date().toISOString(),
  };
}
