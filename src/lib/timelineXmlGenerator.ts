/**
 * Premiere Pro & DaVinci Resolve Timeline Project Generator (FCP XML / xmeml v5)
 * Industry-standard interchange format natively readable by:
 * - DaVinci Resolve 17, 18, 19
 * - Adobe Premiere Pro CC / 2024+
 * - Final Cut Pro X (via SendToX) / CapCut Desktop
 */

export interface TimelineCut {
  sceneId: number;
  name: string;
  sourceFile: string;
  startSec: number; // Timeline position start
  durationSec: number; // Cut duration in seconds
  inPointSec: number; // Subclip in-point in source file
  outPointSec: number; // Subclip out-point in source file
  isAiGapFill?: boolean;
}

export interface TimelineProjectOptions {
  jobId: string;
  brandName: string;
  fps?: number; // default 30
  width?: number; // default 2160 (4K vertical)
  height?: number; // default 3840 (4K vertical)
  cuts: TimelineCut[];
  audioVoiceoverPath?: string;
  audioMusicPath?: string;
  audioMusicTitle?: string;
  notes?: string;
}

export function generateTimelineXml(options: TimelineProjectOptions): string {
  const {
    jobId,
    brandName,
    fps = 30,
    width = 2160,
    height = 3840,
    cuts,
    audioVoiceoverPath = "audio/stem-voiceover.wav",
    audioMusicPath = "audio/stem-music.wav",
    audioMusicTitle = "Licensed Commercial Soundtrack",
    notes = "ReLaunch Studio 4K Commercial Master",
  } = options;

  // Calculate total duration in frames
  const totalDurationSec = cuts.reduce((acc, c) => acc + c.durationSec, 0);
  const totalFrames = Math.round(totalDurationSec * fps);

  // Generate video track clipitems
  let currentTimelineFrame = 0;
  const videoClipItemsXml = cuts
    .map((cut, idx) => {
      const cutFrames = Math.max(1, Math.round(cut.durationSec * fps));
      const inFrame = Math.round(cut.inPointSec * fps);
      const outFrame = inFrame + cutFrames;
      const startFrame = currentTimelineFrame;
      const endFrame = startFrame + cutFrames;
      currentTimelineFrame = endFrame;

      const clipId = `clipitem-${idx + 1}`;
      const fileId = `file-${idx + 1}`;
      const isAi = cut.isAiGapFill ? " [AI Gap-Fill]" : " [Real Footage]";

      return `          <clipitem id="${clipId}">
            <name>${escapeXml(cut.name)}${isAi}</name>
            <duration>${cutFrames}</duration>
            <rate>
              <timebase>${fps}</timebase>
              <ntsc>FALSE</ntsc>
            </rate>
            <start>${startFrame}</start>
            <end>${endFrame}</end>
            <in>${inFrame}</in>
            <out>${outFrame}</out>
            <file id="${fileId}">
              <name>${escapeXml(cut.sourceFile.split("/").pop() || cut.sourceFile)}</name>
              <pathurl>${escapeXml(cut.sourceFile)}</pathurl>
              <rate>
                <timebase>${fps}</timebase>
                <ntsc>FALSE</ntsc>
              </rate>
              <duration>${cutFrames + inFrame}</duration>
              <media>
                <video>
                  <samplecharacteristics>
                    <width>${width}</width>
                    <height>${height}</height>
                  </samplecharacteristics>
                </video>
              </media>
            </file>
            <labels>
              <label2>${cut.isAiGapFill ? "Violet" : "Caribbean"}</label2>
            </labels>
            <comments>
              <mastercomment1>${escapeXml(cut.name)}</mastercomment1>
              <mastercomment2>${cut.isAiGapFill ? "Synthesized Gap-Fill" : "Authentic Real Footage"}</mastercomment2>
            </comments>
          </clipitem>`;
    })
    .join("\n");

  // Timeline Markers for each scene transition
  let markerTimelineSec = 0;
  const markersXml = cuts
    .map((cut) => {
      const markerFrame = Math.round(markerTimelineSec * fps);
      markerTimelineSec += cut.durationSec;
      return `      <marker>
        <comment>${escapeXml(cut.name)} (${cut.durationSec.toFixed(1)}s)</comment>
        <name>${escapeXml(cut.name)}</name>
        <in>${markerFrame}</in>
        <out>${markerFrame}</out>
      </marker>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <sequence id="sequence-relaunch-${escapeXml(jobId)}">
    <name>${escapeXml(brandName)} - ReLaunch Studio Master [${escapeXml(jobId)}]</name>
    <duration>${totalFrames}</duration>
    <rate>
      <timebase>${fps}</timebase>
      <ntsc>FALSE</ntsc>
    </rate>
    <timecode>
      <rate>
        <timebase>${fps}</timebase>
        <ntsc>FALSE</ntsc>
      </rate>
      <string>00:00:00:00</string>
      <frame>0</frame>
      <displayformat>NDF</displayformat>
    </timecode>
    <media>
      <video>
        <format>
          <samplecharacteristics>
            <width>${width}</width>
            <height>${height}</height>
            <anamorphic>FALSE</anamorphic>
            <pixelaspectratio>square</pixelaspectratio>
            <fielddominance>none</fielddominance>
            <rate>
              <timebase>${fps}</timebase>
              <ntsc>FALSE</ntsc>
            </rate>
            <colordepth>24</colordepth>
          </samplecharacteristics>
        </format>
        <track>
          <enabled>TRUE</enabled>
          <locked>FALSE</locked>
${videoClipItemsXml}
        </track>
      </video>
      <audio>
        <format>
          <samplecharacteristics>
            <depth>24</depth>
            <samplerate>48000</samplerate>
          </samplecharacteristics>
        </format>
        <track>
          <!-- Track A1: Clean Voiceover Stem -->
          <enabled>TRUE</enabled>
          <locked>FALSE</locked>
          <outputchannelindex>1</outputchannelindex>
          <clipitem id="clipitem-stem-vo">
            <name>Voiceover Stem (ElevenLabs Broadcast Master)</name>
            <duration>${totalFrames}</duration>
            <rate>
              <timebase>${fps}</timebase>
              <ntsc>FALSE</ntsc>
            </rate>
            <start>0</start>
            <end>${totalFrames}</end>
            <in>0</in>
            <out>${totalFrames}</out>
            <file id="file-stem-vo">
              <name>relaunch-${escapeXml(jobId)}-stem-vo.wav</name>
              <pathurl>${escapeXml(audioVoiceoverPath)}</pathurl>
              <rate>
                <timebase>${fps}</timebase>
              </rate>
              <duration>${totalFrames}</duration>
              <media>
                <audio>
                  <samplecharacteristics>
                    <depth>24</depth>
                    <samplerate>48000</samplerate>
                  </samplecharacteristics>
                  <channelcount>2</channelcount>
                </audio>
              </media>
            </file>
          </clipitem>
        </track>
        <track>
          <!-- Track A2: Licensed Background Music Stem -->
          <enabled>TRUE</enabled>
          <locked>FALSE</locked>
          <outputchannelindex>2</outputchannelindex>
          <clipitem id="clipitem-stem-bgm">
            <name>${escapeXml(audioMusicTitle)}</name>
            <duration>${totalFrames}</duration>
            <rate>
              <timebase>${fps}</timebase>
              <ntsc>FALSE</ntsc>
            </rate>
            <start>0</start>
            <end>${totalFrames}</end>
            <in>0</in>
            <out>${totalFrames}</out>
            <file id="file-stem-bgm">
              <name>relaunch-${escapeXml(jobId)}-stem-music.wav</name>
              <pathurl>${escapeXml(audioMusicPath)}</pathurl>
              <rate>
                <timebase>${fps}</timebase>
              </rate>
              <duration>${totalFrames}</duration>
              <media>
                <audio>
                  <samplecharacteristics>
                    <depth>24</depth>
                    <samplerate>48000</samplerate>
                  </samplecharacteristics>
                  <channelcount>2</channelcount>
                </audio>
              </media>
            </file>
          </clipitem>
        </track>
      </audio>
    </media>
${markersXml}
    <logginginfo>
      <description>${escapeXml(notes)}</description>
      <scene>4-Scene Quality Workflow</scene>
      <shottake>Master 80/20 Cut</shottake>
      <lognote>Assembled by ReLaunch Studio AI Engine · Ready for Final Human Polish in DaVinci Resolve / Premiere Pro</lognote>
    </logginginfo>
  </sequence>
</xmeml>`;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

