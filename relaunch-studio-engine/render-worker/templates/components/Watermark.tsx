import React from 'react';

/**
 * ReLaunch Studio — Mandatory AI-Generated Media Watermark
 * Baked directly into the Remotion composition layer.
 * Complies with TikTok, Meta, FTC, and NY Synthetic Performer laws.
 */

interface WatermarkProps {
  label?: string;
  position?: 'bottom_left' | 'bottom_right';
}

export const Watermark: React.FC<WatermarkProps> = ({
  label = 'AI-Generated Media',
  position = 'bottom_left',
}) => {
  const isLeft = position === 'bottom_left';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120, // Safe zone above TikTok/Reels captions & sound bar
        left: isLeft ? 48 : 'auto',
        right: !isLeft ? 48 : 'auto',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 9999,
        background: 'rgba(9, 10, 15, 0.72)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Sparkle Icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
      <span
        style={{
          color: '#F3F4F6',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
};
