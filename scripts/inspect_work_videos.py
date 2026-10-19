import cv2
import os

videos = [
    "public/videos/carmen-hotel-hero.mp4",
    "public/videos/carmen-hotel-body.mp4",
    "public/videos/chicago-dog-pr.mp4",
    "public/videos/chicago-dog-hero.mp4",
    "public/videos/chicago-dog-insta.mp4",
    "public/videos/chicago-dog-social-1.mp4"
]

for v in videos:
    if not os.path.exists(v):
        print(f"Missing: {v}")
        continue
    cap = cv2.VideoCapture(v)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = frames / fps if fps > 0 else 0
    cap.release()
    print(f"{os.path.basename(v)}: {w}x{h}, {fps:.1f} fps, {frames} frames ({dur:.1f}s)")
