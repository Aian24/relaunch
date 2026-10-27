import React from 'react';
import { Sequence, Video, Audio, AbsoluteFill } from 'remotion';
import { Captions, WordTimestamp } from './components/Captions';
import { Watermark } from './components/Watermark';
import { EndCard } from './components/EndCard';

/**
 * ReLaunch Studio — Three-Segment Ad Assembly Template
 * Client Locked Assembly:
 * 0–3s:   Creator Hook (sample/placeholder UGC clip) + teaser hook banner
 * 3–15s:  Client Footage (authentic product / location raw video)
 * 15–22s: AI Scene (Grok Imagine synthetic dynamic B-roll)
 * 19–22s: CTA End Card with offer
 * Overlays:
 * - Kinetic word-highlight captions (ElevenLabs / Whisper timings)
 * - AI disclosure watermark burned into bottom corner
 * - Ducked background music bed + master voiceover
 */

export interface ThreeSegmentAdProps {
  creatorHookVideoUrl?: string;
  clientFootageVideoUrl?: string;
  aiSceneVideoUrl?: string;
  voiceoverAudioUrl?: string;
  musicAudioUrl?: string;
  hookText?: string;
  ctaText?: string;
  brandName?: string;
  brandUrl?: string;
  words?: WordTimestamp[];
  disclosureLabel?: string;
}

export const ProblemSolution: React.FC<ThreeSegmentAdProps> = ({
  creatorHookVideoUrl,
  clientFootageVideoUrl,
  aiSceneVideoUrl,
  voiceoverAudioUrl,
  musicAudioUrl,
  hookText = "3 Hidden Reasons Why Traditional Hot Dogs Don't Compare",
  ctaText = 'Order Online for 15% Off Your First Box',
  brandName = 'Chicago Dog House',
  brandUrl = 'relaunch.us/studio',
  words = [],
  disclosureLabel = 'AI-Generated Media • ReLaunch Studio',
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* ================================================================= */}
      {/* SEGMENT 1: Creator Hook (0–3s / Frames 0 to 90 @ 30fps)          */}
      {/* ================================================================= */}
      <Sequence from={0} durationInFrames={90}>
        {creatorHookVideoUrl ? (
          <Video
            src={creatorHookVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: '#181028' }} />
        )}

        {/* High-Retention Hook Banner Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 32,
            right: 32,
            textAlign: 'center',
            zIndex: 8000,
          }}
        >
          <span
            style={{
              background: '#FFE600',
              color: '#000000',
              padding: '12px 24px',
              borderRadius: 10,
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              textTransform: 'uppercase',
              boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
              display: 'inline-block',
              lineHeight: 1.25,
              border: '2px solid rgba(0,0,0,0.15)',
            }}
          >
            {hookText}
          </span>
        </div>
      </Sequence>

      {/* ================================================================= */}
      {/* SEGMENT 2: Client Footage (3–15s / Frames 90 to 450 @ 30fps)      */}
      {/* ================================================================= */}
      <Sequence from={90} durationInFrames={360}>
        {clientFootageVideoUrl ? (
          <Video
            src={clientFootageVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: '#090A0F' }} />
        )}
      </Sequence>

      {/* ================================================================= */}
      {/* SEGMENT 3: AI Scene (15–22s / Frames 450 to 660 @ 30fps)          */}
      {/* ================================================================= */}
      <Sequence from={450} durationInFrames={210}>
        {aiSceneVideoUrl ? (
          <Video
            src={aiSceneVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: '#0C101A' }} />
        )}
      </Sequence>

      {/* ================================================================= */}
      {/* CTA End-Card Overlay (19–22s / Frames 570 to 660 @ 30fps)         */}
      {/* ================================================================= */}
      <Sequence from={570} durationInFrames={90}>
        <EndCard
          ctaText={ctaText}
          brandName={brandName}
          brandUrl={brandUrl}
        />
      </Sequence>

      {/* ================================================================= */}
      {/* Master Voiceover Track (ElevenLabs)                               */}
      {/* ================================================================= */}
      {voiceoverAudioUrl && <Audio src={voiceoverAudioUrl} volume={1.0} />}

      {/* Background Music Bed (ducked)                                     */}
      {musicAudioUrl && <Audio src={musicAudioUrl} volume={0.12} />}

      {/* ================================================================= */}
      {/* Kinetic Captions Subtitles Layer (Whisper / ElevenLabs Timings)   */}
      {/* ================================================================= */}
      {words.length > 0 && <Captions words={words} />}

      {/* ================================================================= */}
      {/* Mandatory AI Disclosure Watermark Layer                           */}
      {/* ================================================================= */}
      <Watermark label={disclosureLabel} position="bottom_left" />
    </AbsoluteFill>
  );
};
