import os
import math
import numpy as np
from PIL import Image
import cv2
import imageio_ffmpeg
import subprocess

def create_turf_hero_video():
    input_img_path = "public/showcase/turf-banner-video.webp"
    output_mp4_path = "public/videos/turf-life-hero.mp4"
    
    print(f"Loading {input_img_path}...")
    pil_img = Image.open(input_img_path).convert("RGB")
    src_w, src_h = pil_img.size
    print(f"Source image size: {src_w}x{src_h}")
    
    # Target 1920x1080 Full HD
    target_w, target_h = 1920, 1080
    
    fps = 30
    duration_sec = 6  # 6 second seamless loop
    total_frames = fps * duration_sec
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{target_w}x{target_h}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "faster",
        "-crf", "20",
        "-movflags", "+faststart",
        output_mp4_path
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    # Upscale base image slightly for subtle pan/zoom headroom
    max_scale = 1.08
    scaled_w = int(target_w * max_scale)
    scaled_h = int(target_h * max_scale)
    base_resized = pil_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    base_np = np.array(base_resized, dtype=np.float32)
    
    print(f"Generating {total_frames} frames (30fps, {duration_sec}s seamless loop)...")
    
    for i in range(total_frames):
        t = i / total_frames
        # Smooth cosine interpolation (0 -> 1 -> 0 for seamless loop)
        curve = 0.5 * (1.0 - math.cos(2.0 * math.pi * t))
        
        # Subtle zoom: scale from 1.0 to 1.05
        curr_scale = 1.0 + curve * 0.05
        frame_crop_w = int(target_w * curr_scale)
        frame_crop_h = int(target_h * curr_scale)
        
        # Subtle horizontal & vertical drift
        center_x = (scaled_w // 2) + int((curve - 0.5) * 25)
        center_y = (scaled_h // 2) + int((curve - 0.5) * 12)
        
        x1 = max(0, center_x - frame_crop_w // 2)
        y1 = max(0, center_y - frame_crop_h // 2)
        x2 = min(scaled_w, x1 + frame_crop_w)
        y2 = min(scaled_h, y1 + frame_crop_h)
        
        crop = base_np[y1:y2, x1:x2]
        crop_uint8 = np.clip(crop, 0, 255).astype(np.uint8)
        resized_frame = cv2.resize(crop_uint8, (target_w, target_h), interpolation=cv2.INTER_LINEAR)
        
        # Subtle atmospheric sunlight breathing
        light_boost = 1.0 + 0.025 * math.sin(2.0 * math.pi * t)
        if light_boost != 1.0:
            frame_float = resized_frame.astype(np.float32) * light_boost
            resized_frame = np.clip(frame_float, 0, 255).astype(np.uint8)
            
        proc.stdin.write(resized_frame.tobytes())
        
    proc.stdin.close()
    proc.wait()
    
    if os.path.exists(output_mp4_path):
        size_mb = os.path.getsize(output_mp4_path) / (1024 * 1024)
        print(f"SUCCESS: Generated {output_mp4_path} ({size_mb:.2f} MB)")
    else:
        print("Failed to generate video")

if __name__ == "__main__":
    create_turf_hero_video()
