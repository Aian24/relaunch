import React from 'react';
import { Composition } from 'remotion';
import { ProblemSolution, ProblemSolutionProps } from './ProblemSolution';

/**
 * ReLaunch Studio — Remotion Composition Registry
 * Exports 9:16 vertical, 1:1 square, and 4:5 feed aspect ratios.
 */

const defaultProps: ProblemSolutionProps = {
  hookText: 'Stop scrolling if your CPA keeps climbing',
  ctaText: 'Claim 20% Off Today',
  brandName: 'ReLaunch Studio',
  brandUrl: 'relaunch.us/studio',
  disclosureLabel: 'AI-Generated Media',
  words: [
    { word: 'STOP', start: 0.1, end: 0.5 },
    { word: 'SCROLLING', start: 0.6, end: 1.1 },
    { word: 'IF', start: 1.2, end: 1.4 },
    { word: 'YOUR', start: 1.5, end: 1.7 },
    { word: 'CPA', start: 1.8, end: 2.2 },
    { word: 'KEEPS', start: 2.3, end: 2.6 },
    { word: 'CLIMBING', start: 2.7, end: 3.2 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 Native Vertical Story & Reels (1080x1920) */}
      <Composition
        id="ProblemSolution-9x16"
        component={ProblemSolution}
        durationInFrames={600} // 20 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />

      {/* 1:1 Square Feed (1080x1080) */}
      <Composition
        id="ProblemSolution-1x1"
        component={ProblemSolution}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* 4:5 Instagram Portrait Feed (1080x1350) */}
      <Composition
        id="ProblemSolution-4x5"
        component={ProblemSolution}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={defaultProps}
      />
    </>
  );
};
