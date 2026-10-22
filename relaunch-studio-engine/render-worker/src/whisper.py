#!/usr/bin/env python3
"""
ReLaunch Studio — faster-whisper Word-Level Transcription Engine
Extracts word-level timestamps (<50ms precision) for Remotion kinetic captions.
"""

import sys
import json
import os

def transcribe_audio(audio_path, model_size="base.en"):
    if not os.path.exists(audio_path):
        return {"error": f"Audio file not found: {audio_path}", "words": []}

    try:
        from faster_whisper import WhisperModel
        
        # Use CPU with int8 quantization for high throughput on VPS without GPU
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, word_timestamps=True)

        words = []
        for segment in segments:
            if not segment.words:
                continue
            for word_obj in segment.words:
                cleaned_word = word_obj.word.strip()
                if cleaned_word:
                    words.append({
                        "word": cleaned_word,
                        "start": round(word_obj.start, 3),
                        "end": round(word_obj.end, 3),
                        "probability": round(word_obj.probability, 2)
                    })

        return {
            "success": True,
            "language": info.language,
            "duration": round(info.duration, 2),
            "words": words
        }
    except Exception as e:
        return {"error": str(e), "words": []}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python whisper.py <audio_file_path>"}))
        sys.exit(1)

    input_path = sys.argv[1]
    result = transcribe_audio(input_path)
    print(json.dumps(result))
