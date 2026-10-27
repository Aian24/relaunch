import React from 'react';
import { Composition } from 'remotion';
import { ProblemSolution, ThreeSegmentAdProps } from './ProblemSolution';

/**
 * ReLaunch Studio — Remotion Composition Registry
 * Exports 3 locked aspect ratios:
 * - 9:16 Vertical Story & Reels (1080x1920)
 * - 1:1 Square Feed (1080x1080)
 * - 4:5 Portrait Feed (1080x1350)
 * Total duration: 22s (660 frames @ 30fps)
 */

const defaultProps: ThreeSegmentAdProps = {
  hookText: "3 Hidden Reasons Why Traditional Hot Dogs Don't Compare",
  ctaText: 'Order Online for 15% Off Your First Box',
  brandName: 'Chicago Dog House',
  brandUrl: 'relaunch.us/studio',
  disclosureLabel: 'AI-Generated Media • ReLaunch Studio',
  words: [
    { word: 'REASON', start: 0.1, end: 0.5 },
    { word: '1:', start: 0.6, end: 0.9 },
    { word: 'AUTHENTIC', start: 1.0, end: 1.5 },
    { word: 'VIENNA', start: 1.6, end: 2.0 },
    { word: 'BEEF', start: 2.1, end: 2.6 },
    { word: 'SNAP.', start: 2.7, end: 3.2 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 Native Vertical Story & Reels (1080x1920) */}
      <Composition
        id="ProblemSolution-9x16"
        component={ProblemSolution}
        durationInFrames={660} // 22 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />

      {/* 1:1 Square Feed (1080x1080) */}
      <Composition
        id="ProblemSolution-1x1"
        component={ProblemSolution}
        durationInFrames={660} // 22 seconds @ 30fps
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* 4:5 Instagram Portrait Feed (1080x1350) */}
      <Composition
        id="ProblemSolution-4x5"
        component={ProblemSolution}
        durationInFrames={660} // 22 seconds @ 30fps
        fps={30}
        width={1080}
        height={1350}
        defaultProps={defaultProps}
      />
    </>
  );
};
