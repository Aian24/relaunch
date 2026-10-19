import re
import urllib.request

req = urllib.request.Request(
    'https://turflifeclub.com/',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8', errors='ignore')

print(f"Total HTML length: {len(html)}")

# Find all youtube / vimeo / wistia / mp4 / webm / mov
embeds = set(re.findall(r'https?://[^\s"\'<>]+(?:youtube|vimeo|wistia|video|media|player|cdn)[^\s"\'<>]*', html, re.I))
print("\n--- Embeds & Video Keywords ---")
for e in sorted(embeds):
    if not any(x in e for x in ['jquery', 'plugins', 'css', 'wp-includes']):
        print(e)

# Find all video or iframe tags
print("\n--- All <video> and <iframe> tags ---")
for tag in re.findall(r'<(?:video|iframe)[^>]*>.*?</(?:video|iframe)>|<(?:video|iframe)[^>]*/>', html, re.I | re.S):
    print(tag)

# Find all background video attributes
print("\n--- All video attributes ---")
for attr in re.findall(r'data-[a-z0-9_-]*video[a-z0-9_-]*="[^"]*"', html, re.I):
    print(attr)

