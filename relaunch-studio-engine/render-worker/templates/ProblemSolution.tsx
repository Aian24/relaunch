import React from 'react';
import { Sequence, Video, Audio, AbsoluteFill } from 'remotion';
import { Captions, WordTimestamp } from './components/Captions';
import { Watermark } from './components/Watermark';
import { EndCard } from './components/EndCard';

/**
 * ReLaunch Studio — Problem-Solution Ad Template
 * Structure:
 * 0-3s:   High-impact visual problem hook + teaser text
 * 3-15s:  AI Creator Talking Head + B-Roll Cutaway
 * 15-20s: End Card with brand CTA
 * Overlay: Kinetic Word-Highlight Subtitles + Mandatory AI Disclosure
 */

export interface ProblemSolutionProps {
  hookVideoUrl?: string;
  actorVideoUrl?: string;
  brollVideoUrl?: string;
  voiceoverAudioUrl?: string;
  musicAudioUrl?: string;
  hookText?: string;
  ctaText?: string;
  brandName?: string;
  brandUrl?: string;
  words?: WordTimestamp[];
  disclosureLabel?: string;
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({
  hookVideoUrl,
  actorVideoUrl,
  brollVideoUrl,
  voiceoverAudioUrl,
  musicAudioUrl,
  hookText = 'Stop scrolling if your CPA keeps climbing',
  ctaText = 'Claim 20% Off Today',
  brandName = 'ReLaunch Studio',
  brandUrl = 'relaunch.us',
  words = [],
  disclosureLabel = 'AI-Generated Media',
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 1. Hook Video Sequence (0 - 3s / 0 - 90 frames @ 30fps) */}
      <Sequence from={0} durationInFrames={90}>
        {hookVideoUrl ? (
          <Video
            src={hookVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: '#181028' }} />
        )}
        {/* Hook text banner */}
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
              borderRadius: 8,
              fontSize: 38,
              fontWeight: 900,
              fontFamily: "'Montserrat', sans-serif",
              textTransform: 'uppercase',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              display: 'inline-block',
              lineHeight: 1.2,
            }}
          >
            {hookText}
          </span>
        </div>
      </Sequence>

      {/* 2. Creator Body Sequence (3 - 15s / 90 - 450 frames) */}
      <Sequence from={90} durationInFrames={360}>
        {actorVideoUrl ? (
          <Video
            src={actorVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: '#090A0F' }} />
        )}
      </Sequence>

      {/* 3. B-Roll Cutaway (Overlays creator from 6s to 9s / 180 to 270 frames) */}
      {brollVideoUrl && (
        <Sequence from={180} durationInFrames={90}>
          <Video
            src={brollVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Sequence>
      )}

      {/* 4. End Card Sequence (15 - 20s / 450 - 600 frames) */}
      <Sequence from={450} durationInFrames={150}>
        <EndCard
          ctaText={ctaText}
          brandName={brandName}
          brandUrl={brandUrl}
        />
      </Sequence>

      {/* 5. Audio Tracks */}
      {voiceoverAudioUrl && <Audio src={voiceoverAudioUrl} volume={1.0} />}
      {musicAudioUrl && <Audio src={musicAudioUrl} volume={0.15} />}

      {/* 6. Kinetic Captions Subtitle Layer */}
      {words.length > 0 && <Captions words={words} />}

      {/* 7. Mandatory AI Disclosure Watermark Layer */}
      <Watermark label={disclosureLabel} position="bottom_left" />
    </AbsoluteFill>
  );
};
