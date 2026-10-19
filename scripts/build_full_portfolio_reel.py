import os
import math
import subprocess
import numpy as np
from PIL import Image
import cv2
import imageio_ffmpeg

def create_ken_burns_clip(
    img_path,
    out_clip_path,
    duration_sec=6.5,
    fps=30,
    pan_mode="left_to_right",
    zoom_in=True,
    bg_color=(7, 9, 14),
):
    """
    Renders an authentic, ultra-smooth Ken Burns motion video from a project image.
    Outputs Full HD 1920x1080 @ 30fps.
    """
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    target_w, target_h = 1920, 1080
    total_frames = int(duration_sec * fps)

    # 1. Open image and handle alpha compositing if RGBA
    pil_img = Image.open(img_path)
    if pil_img.mode == "RGBA":
        bg = Image.new("RGBA", pil_img.size, bg_color + (255,))
        pil_img = Image.alpha_composite(bg, pil_img).convert("RGB")
    elif pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")

    w, h = pil_img.size

    # 2. Scale image so it comfortably covers 1920x1080 with room to pan and zoom
    # We want base dimension to be at least 1.25x the 1920x1080 frame
    scale_w = (target_w * 1.30) / w
    scale_h = (target_h * 1.30) / h
    base_scale = max(scale_w, scale_h, 1.0)
    
    scaled_w = int(w * base_scale)
    scaled_h = int(h * base_scale)
    img_scaled = np.array(pil_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS))

    # 3. Launch FFmpeg process streaming rawvideo
    cmd = [
        ffmpeg_exe, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{target_w}x{target_h}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "faster",
        "-crf", "18",
        "-an",
        out_clip_path
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for i in range(total_frames):
        u = i / total_frames
        # Smooth cosine ease-in-out (0 -> 1)
        ease = 0.5 * (1.0 - math.cos(math.pi * u))

        # Dynamic zoom
        if zoom_in:
            z = 1.05 + 0.12 * ease
        else:
            z = 1.17 - 0.12 * ease

        crop_w = int(target_w / z)
        crop_h = int(target_h / z)

        max_x = max(0, scaled_w - crop_w)
        max_y = max(0, scaled_h - crop_h)

        if pan_mode == "left_to_right":
            x1 = int(max_x * (0.08 + 0.84 * ease))
            y1 = int(max_y * (0.20 + 0.25 * math.sin(math.pi * ease)))
        elif pan_mode == "right_to_left":
            x1 = int(max_x * (0.92 - 0.84 * ease))
            y1 = int(max_y * (0.35 - 0.20 * math.sin(math.pi * ease)))
        elif pan_mode == "top_to_bottom":
            x1 = int(max_x * (0.30 + 0.20 * math.sin(math.pi * ease)))
            y1 = int(max_y * (0.05 + 0.85 * ease))
        elif pan_mode == "bottom_to_top":
            x1 = int(max_x * (0.35 + 0.15 * math.sin(math.pi * ease)))
            y1 = int(max_y * (0.90 - 0.80 * ease))
        else:  # subtle center drift
            x1 = int(max_x * (0.50 + 0.15 * (ease - 0.5)))
            y1 = int(max_y * (0.50 + 0.15 * (ease - 0.5)))

        x1 = max(0, min(x1, scaled_w - crop_w))
        y1 = max(0, min(y1, scaled_h - crop_h))
        x2 = x1 + crop_w
        y2 = y1 + crop_h

        crop = img_scaled[y1:y2, x1:x2]
        frame = cv2.resize(crop, (target_w, target_h), interpolation=cv2.INTER_LINEAR)

        # Subtle atmospheric lighting breathing
        light = 1.0 + 0.02 * math.sin(math.pi * u)
        if light != 1.0:
            frame = np.clip(frame.astype(np.float32) * light, 0, 255).astype(np.uint8)

        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    proc.wait()
    print(f"  Generated Ken Burns video: {out_clip_path} ({os.path.getsize(out_clip_path)} bytes)")


def extract_real_video_clip(src, start_sec, duration_sec, out_clip_path):
    """
    Extracts and normalizes a real video segment to 1920x1080 30fps.
    """
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg_exe, "-y",
        "-ss", str(start_sec),
        "-i", src,
        "-t", str(duration_sec),
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
        "-c:v", "libx264",
        "-preset", "faster",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-an",
        out_clip_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  Extracted real video clip: {out_clip_path} ({os.path.getsize(out_clip_path)} bytes)")


def main():
    temp_dir = "scripts/temp_clips"
    os.makedirs(temp_dir, exist_ok=True)
    master_output = "public/videos/work-hero-reel.mp4"

    print("=========================================================")
    print(" BUILDING MASTER 1-2 MINUTE PORTFOLIO REEL (ALL 7 WORK)  ")
    print("=========================================================")

    clips_plan = [
        # 1. The Carmen Hotel (Real Video)
        {
            "type": "video",
            "src": "public/videos/carmen-hotel-hero.mp4",
            "start": 2.0,
            "duration": 7.0,
            "out": os.path.join(temp_dir, "01_carmen_ocean.mp4"),
            "desc": "The Carmen Hotel - Ocean & Beachfront Resort"
        },
        # 2. Chicago Dogs 42 (Real Video)
        {
            "type": "video",
            "src": "public/videos/chicago-dog-pr.mp4",
            "start": 2.0,
            "duration": 7.0,
            "out": os.path.join(temp_dir, "02_chicago_news.mp4"),
            "desc": "Chicago Dogs 42 - TV News Broadcast & Kitchen"
        },
        # 3. Turf Life (Real Video from YouTube)
        {
            "type": "video",
            "src": "public/videos/turflife-real-video.mp4",
            "start": 0.5,
            "duration": 7.0,
            "out": os.path.join(temp_dir, "03_turf_promo.mp4"),
            "desc": "Turf Life - Protect Your Turf Promo Video"
        },
        # 4. Food Court Micro-Brands (Ken Burns Motion)
        {
            "type": "image",
            "src": "public/showcase/microbrands/food-hall-storefronts.webp",
            "pan": "left_to_right",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "04_microbrands_storefronts.mp4"),
            "desc": "Food Court Micro-Brands - 4 Restaurant Storefronts"
        },
        # 5. City of Jacksonville (Ken Burns Motion)
        {
            "type": "image",
            "src": "public/showcase/jacksonville_real_1.jpg",
            "pan": "top_to_bottom",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "05_jacksonville_portal.mp4"),
            "desc": "City of Jacksonville - Property Appraiser Portal"
        },
        # 6. Swing Perfect (Ken Burns Motion)
        {
            "type": "image",
            "src": "public/showcase/swing_perfect_real_1.png",
            "pan": "left_to_right",
            "zoom_in": False,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "06_swing_perfect_app.mp4"),
            "desc": "Swing Perfect - Mobile Golf Swing Analyzer"
        },
        # 7. Aspiration Bank (Ken Burns Motion)
        {
            "type": "image",
            "src": "public/showcase/aspiration_bank.jpg",
            "pan": "right_to_left",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "07_aspiration_platform.mp4"),
            "desc": "Aspiration Bank - Sustainable Banking Platform"
        },
        # 8. The Carmen Hotel (Real Video - Poolside / Lounge)
        {
            "type": "video",
            "src": "public/videos/carmen-hotel-body.mp4",
            "start": 6.0,
            "duration": 7.0,
            "out": os.path.join(temp_dir, "08_carmen_pool.mp4"),
            "desc": "The Carmen Hotel - Poolside Lounge Experience"
        },
        # 9. Chicago Dogs 42 (Real Video - Food Truck & Community)
        {
            "type": "video",
            "src": "public/videos/chicago-dog-insta.mp4",
            "start": 4.0,
            "duration": 7.0,
            "out": os.path.join(temp_dir, "09_chicago_truck.mp4"),
            "desc": "Chicago Dogs 42 - Mother Truckin' Food Truck Rollout"
        },
        # 10. Turf Life (Motion Banner)
        {
            "type": "image",
            "src": "public/showcase/turflife_protect_banner.webp",
            "pan": "bottom_to_top",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "10_turf_movement.mp4"),
            "desc": "Turf Life - Protect Your Turf Sports Movement"
        },
        # 11. Food Court Micro-Brands (Ken Burns - Taps & Counter)
        {
            "type": "image",
            "src": "public/showcase/microbrands/berlin-barrel-taps.webp",
            "pan": "right_to_left",
            "zoom_in": False,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "11_microbrands_taps.mp4"),
            "desc": "Food Court Micro-Brands - Berlin Barrel Tap Wall"
        },
        # 12. City of Jacksonville (Ken Burns - Records Search)
        {
            "type": "image",
            "src": "public/showcase/jacksonville_real_3.png",
            "pan": "left_to_right",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "12_jacksonville_records.mp4"),
            "desc": "City of Jacksonville - Parcel Records Visualizer"
        },
        # 13. Swing Perfect (Ken Burns - Analytics Engine)
        {
            "type": "image",
            "src": "public/showcase/swing_perfect_real_2.png",
            "pan": "top_to_bottom",
            "zoom_in": True,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "13_swing_perfect_metrics.mp4"),
            "desc": "Swing Perfect - Automated Scanning & Swing Metrics"
        },
        # 14. Aspiration Bank (Ken Burns - Digital Dashboard)
        {
            "type": "image",
            "src": "public/showcase/aspiration_real_3.png",
            "pan": "left_to_right",
            "zoom_in": False,
            "duration": 6.5,
            "out": os.path.join(temp_dir, "14_aspiration_dashboard.mp4"),
            "desc": "Aspiration Bank - Digital Dashboard & Impact"
        },
    ]

    total_duration = sum(c["duration"] for c in clips_plan)
    print(f"Total Clips: {len(clips_plan)} | Total Duration: {total_duration:.1f}s ({total_duration/60:.1f} min)")

    encoded_clips = []
    for idx, c in enumerate(clips_plan):
        print(f"\nProcessing Clip {idx+1}/{len(clips_plan)}: {c['desc']} ({c['duration']}s)")
        if c["type"] == "video":
            extract_real_video_clip(c["src"], c["start"], c["duration"], c["out"])
        else:
            create_ken_burns_clip(
                img_path=c["src"],
                out_clip_path=c["out"],
                duration_sec=c["duration"],
                pan_mode=c["pan"],
                zoom_in=c["zoom_in"],
            )
        if os.path.exists(c["out"]):
            encoded_clips.append(c["out"])

    print("\n---------------------------------------------------------")
    print(f"Concatenating all {len(encoded_clips)} clips into master reel...")
    concat_list_file = os.path.join(temp_dir, "full_portfolio_concat.txt")
    with open(concat_list_file, "w") as f:
        for clip in encoded_clips:
            norm_path = os.path.abspath(clip).replace("\\", "/")
            f.write(f"file '{norm_path}'\n")

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    concat_cmd = [
        ffmpeg_exe, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_file,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        master_output
    ]

    res = subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if res.returncode == 0 and os.path.exists(master_output):
        size_mb = os.path.getsize(master_output) / (1024 * 1024)
        print(f"\nSUCCESS! Master portfolio reel created at: {master_output}")
        print(f"File Size: {size_mb:.2f} MB | Total Length: {total_duration:.1f}s")
    else:
        print("Failed to concatenate master reel.")

if __name__ == "__main__":
    main()
