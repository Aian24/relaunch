import os
import subprocess
import imageio_ffmpeg

def build_hero_reel():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    output_path = "public/videos/work-hero-reel.mp4"
    temp_dir = "scripts/temp_clips"
    os.makedirs(temp_dir, exist_ok=True)
    
    # Define our real client video segments (all real footage from Carmen Hotel & Chicago Dogs)
    clips_def = [
        {
            "src": "public/videos/carmen-hotel-hero.mp4",
            "start": "2.0",
            "duration": "5.0",
            "name": "clip1_carmen.mp4"
        },
        {
            "src": "public/videos/chicago-dog-pr.mp4",
            "start": "2.0",
            "duration": "5.5",
            "name": "clip2_chicago_pr.mp4"
        },
        {
            "src": "public/videos/carmen-hotel-body.mp4",
            "start": "8.0",
            "duration": "5.0",
            "name": "clip3_carmen_body.mp4"
        },
        {
            "src": "public/videos/chicago-dog-pr.mp4",
            "start": "11.0",
            "duration": "5.5",
            "name": "clip4_chicago_food.mp4"
        },
        {
            "src": "public/videos/chicago-dog-insta.mp4",
            "start": "4.0",
            "duration": "5.0",
            "name": "clip5_chicago_truck.mp4"
        }
    ]
    
    encoded_clips = []
    print("Normalizing clips to 1920x1080 @ 30fps...")
    
    for idx, c in enumerate(clips_def):
        out_clip = os.path.join(temp_dir, c["name"])
        # ffmpeg command to trim, scale, pad/crop to exact 1920x1080 30fps
        cmd = [
            ffmpeg_exe, "-y",
            "-ss", c["start"],
            "-i", c["src"],
            "-t", c["duration"],
            "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
            "-c:v", "libx264",
            "-preset", "faster",
            "-crf", "19",
            "-pix_fmt", "yuv420p",
            "-an",
            out_clip
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0 and os.path.exists(out_clip):
            print(f"  [{idx+1}/{len(clips_def)}] Processed {c['name']}")
            encoded_clips.append(out_clip)
        else:
            print(f"  Error processing {c['name']}")
            
    if len(encoded_clips) < 2:
        print("Not enough clips processed.")
        return
        
    print("Concatenating clips with xfade transitions into final 25s reel...")
    # Using ffmpeg concat filter or xfade
    # Let's create a concat list file
    concat_list_path = os.path.join(temp_dir, "concat_list.txt")
    with open(concat_list_path, "w") as f:
        for c in encoded_clips:
            # Use forward slashes
            norm_c = os.path.abspath(c).replace("\\", "/")
            f.write(f"file '{norm_c}'\n")
            
    concat_cmd = [
        ffmpeg_exe, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_path
    ]
    
    res = subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if res.returncode == 0 and os.path.exists(output_path):
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"SUCCESS: Generated {output_path} ({size_mb:.2f} MB)")
        # Also copy to public/ourworknew.mp4
        import shutil
        shutil.copyfile(output_path, "public/ourworknew.mp4")
        print("Also updated public/ourworknew.mp4 for full compatibility!")
    else:
        print("Concat failed!")

if __name__ == "__main__":
    build_hero_reel()
