import React from 'react';
import { Sequence, Video, Audio, AbsoluteFill } from 'remotion';
import { Captions, WordTimestamp } from './components/Captions';
import { Watermark } from './components/Watermark';
import { EndCard } from './components/EndCard';

/**
 * ReLaunch Studio — Three-Segment Ad Assembly Template
 * Client Locked Assembly:
 * 0–3.5s:  Creator Hook (authentic UGC video clip with real creator voice preserved @ 100%)
 * 3.5–15s: Client Footage (authentic product / portfolio footage)
 * 15–22s:  AI Scene (Grok / Kling synthetic dynamic B-roll)
 * 19–22s:  CTA End Card with offer
 * Overlays:
 * - Real creator voice on hook (0–3.5s); ElevenLabs VO begins strictly at body (3.5s+)
 * - Kinetic word-highlight captions (ElevenLabs / Whisper timings)
 * - AI disclosure watermark burned into bottom corner
 * - Ducked background music bed
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
  hookTrimStartSeconds?: number;
  hookDurationSeconds?: number;
}

export const ProblemSolution: React.FC<ThreeSegmentAdProps> = ({
  creatorHookVideoUrl,
  clientFootageVideoUrl,
  aiSceneVideoUrl,
  voiceoverAudioUrl,
  musicAudioUrl,
  hookText = "Stop scrolling if you want real results",
  ctaText = 'Claim Exclusive Offer Today',
  brandName = 'ReLaunch',
  brandUrl = 'relaunch.us/studio',
  words = [],
  disclosureLabel = 'AI-Generated Media • ReLaunch Studio',
  hookTrimStartSeconds = 0,
  hookDurationSeconds = 3.5,
}) => {
  const fps = 30;
  const hookDurationFrames = Math.round((hookDurationSeconds || 3.5) * fps);
  const hookStartFromFrame = Math.round((hookTrimStartSeconds || 0) * fps);
  const totalFrames = 660; // 22 seconds @ 30fps
  const aiSceneFrames = 210; // 7 seconds (15–22s)
  const clientFootageFrames = Math.max(90, totalFrames - hookDurationFrames - aiSceneFrames);
  const clientFootageStart = hookDurationFrames;
  const aiSceneStart = clientFootageStart + clientFootageFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* ================================================================= */}
      {/* SEGMENT 1: Creator Hook (0 to hookDuration / Real Creator Voice)  */}
      {/* ================================================================= */}
      <Sequence from={0} durationInFrames={hookDurationFrames}>
        {creatorHookVideoUrl ? (
          <Video
            src={creatorHookVideoUrl}
            startFrom={hookStartFromFrame}
            volume={1.0}
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
              fontSize: 34,
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
      {/* SEGMENT 2: Client Footage (hookDuration to AI Scene)              */}
      {/* ================================================================= */}
      <Sequence from={clientFootageStart} durationInFrames={clientFootageFrames}>
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
      {/* SEGMENT 3: AI Scene (aiSceneStart to End @ 30fps)                 */}
      {/* ================================================================= */}
      <Sequence from={aiSceneStart} durationInFrames={aiSceneFrames}>
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
      {/* CTA End-Card Overlay (Last 90 Frames / 19–22s @ 30fps)            */}
      {/* ================================================================= */}
      <Sequence from={totalFrames - 90} durationInFrames={90}>
        <EndCard
          ctaText={ctaText}
          brandName={brandName}
          brandUrl={brandUrl}
        />
      </Sequence>

      {/* ================================================================= */}
      {/* Master Voiceover Track (ElevenLabs) — strictly delayed after hook */}
      {/* Real creator voice owns 0 to hookDuration; VO owns 3.5s to 22s    */}
      {/* ================================================================= */}
      {voiceoverAudioUrl && (
        <Sequence from={hookDurationFrames}>
          <Audio src={voiceoverAudioUrl} volume={1.0} />
        </Sequence>
      )}

      {/* Ducked Background Music Bed (0.10)                                */}
      {musicAudioUrl && <Audio src={musicAudioUrl} volume={0.10} />}

      {/* Kinetic Captions Subtitles Layer (Whisper / ElevenLabs Timings)   */}
      {words.length > 0 && <Captions words={words} />}

      {/* Mandatory AI Disclosure Watermark Layer                           */}
      <Watermark label={disclosureLabel} position="bottom_left" />
    </AbsoluteFill>
  );
};
