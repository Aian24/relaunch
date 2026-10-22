import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * ReLaunch Studio — End Card CTA Screen Component
 * Displayed in the final 3-5 seconds of the ad.
 */

interface EndCardProps {
  ctaText?: string;
  brandUrl?: string;
  brandName?: string;
}

export const EndCard: React.FC<EndCardProps> = ({
  ctaText = 'Claim 20% Off Today',
  brandUrl = 'relaunch.us',
  brandName = 'ReLaunch Studio',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(9, 10, 15, 0.92)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        zIndex: 9500,
        opacity,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        <span
          style={{
            color: '#00F0FF',
            fontSize: 18,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          {brandName}
        </span>

        <h2
          style={{
            color: '#FFFFFF',
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {ctaText}
        </h2>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 12,
            background: 'linear-gradient(135deg, #7F48ED, #00F0FF)',
            color: '#FFFFFF',
            padding: '18px 44px',
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 0 30px rgba(127, 72, 237, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <span>Tap Below To Start</span>
          <span>→</span>
        </div>

        <span
          style={{
            color: '#9CA3AF',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {brandUrl}
        </span>
      </div>
    </div>
  );
};
