/**
 * ReLaunch Studio — Master Client Service Agreement Addendum
 * Commercial Production, Creator Rights & AI-Assisted Production Terms
 * Governed by ReLaunch Creative Studio Operations
 */

export interface AgreementSection {
  clauseNumber: string;
  title: string;
  summary: string;
  body: string;
}

export const CLIENT_SERVICE_AGREEMENT_ADDENDUM: AgreementSection[] = [
  {
    clauseNumber: "1.0",
    title: "AI-Assisted Production & Selective Synthetic Media Disclosure",
    summary: "Clarifies that AI is used strictly as an editor-assist and sensory gap-fill tool, not a substitute for real footage.",
    body: `ReLaunch Studio produces performance commercial video advertising utilizing a hybrid workflow that integrates authentic creator-generated hook footage, client-supplied product and lifestyle footage, and proprietary AI video synthesis tools (including Kling AI, Grok Imagine, and custom neural motion pipelines). 

Client acknowledges and agrees that:
(a) Real footage is the primary visual foundation of every commercial master;
(b) AI video synthesis is utilized selectively for sensory texture, b-roll transitions, or cosmetic gap-fill when physical product footage is thin or unavailable;
(c) Where photorealistic synthetic media depicting human beings, products, or simulated environments is generated, ReLaunch Studio applies standard platform-compliant synthetic media metadata and on-screen disclosure tags in strict adherence to Meta Advertising Standards, TikTok Commercial Content Policies, and FTC Truth-in-Advertising guidelines. Real authentic footage remains exempt from synthetic media disclosures.`,
  },
  {
    clauseNumber: "2.0",
    title: "Creator Synchronization, Likeness & Commercial Whitelisting Rights",
    summary: "Grants full worldwide commercial usage rights for all on-camera creator talent.",
    body: `All creator talent, actors, and spokespersons engaged by ReLaunch Studio execute binding Commercial Actor Talent Releases granting:
(a) Worldwide, non-exclusive, royalty-free commercial synchronization rights to incorporate their video, voice, name, and likeness into client advertising campaigns across paid digital channels (including Meta, TikTok, YouTube, Pinterest, and programmatic ad networks);
(b) The right to run ads under creator Spark Ads authorization codes and Meta Partnership / Creator Whitelisting permissions for the active duration of the client's subscription tier;
(c) Perpetual archive rights for internal analytics, portfolio display, and client brand asset vaults;
(d) Client guarantees that it will not sub-license or resell raw creator likenesses outside the scope of authorized paid advertising campaigns.`,
  },
  {
    clauseNumber: "3.0",
    title: "Client Raw Product Footage & Intellectual Property Warranties",
    summary: "Confirms client owns their product trademarks and warrants footage truthfulness.",
    body: `Client warrants and represents that:
(a) It owns or holds valid commercial licenses for all raw footage, product packaging, logos, trademarks, audio tracks, and customer testimonials delivered to ReLaunch Studio;
(b) All materials supplied to ReLaunch Studio are authentic, accurate, and free of defamatory, infringing, or illegal content;
(c) ReLaunch Studio receives a limited, royalty-free commercial license to edit, color-grade, composite, audio-master, and store client materials for the sole purpose of delivering commercial ad kits. Upon approval and delivery, Client retains 100% commercial ownership of all finished ad masters, 4K Pro deliverables, DaVinci/Premiere XML timelines, and exported copy kits.`,
  },
  {
    clauseNumber: "4.0",
    title: "Truth-in-Advertising & Claim Substantiation Protocol",
    summary: "Prohibits fabricated ratings/metrics; restricts badges to verified client policies.",
    body: `In accordance with FTC regulations (16 CFR Part 255) and quality studio governance established by Robert Clark (Creative Director):
(a) ReLaunch Studio strictly prohibits the fabrication of consumer review ratings, fake five-star badges, fabricated customer counters, or artificial endorsements;
(b) All on-screen trust badges and claims (such as '30-Day Money-Back Guarantee', 'Cruelty-Free & Lab Tested', 'Licensed Partner', or free delivery policies) must be substantiated by client terms of service, laboratory documentation, or verifiable commercial policies;
(c) Client assumes full legal responsibility for the factual accuracy of any performance claims, health benefits, or financial figures contained within client-approved scripts and video masters.`,
  },
  {
    clauseNumber: "5.0",
    title: "Delivery, Approval Gates & Quality Revision Standards",
    summary: "Nothing reaches Google Drive or active deployment until human CD sign-off is recorded.",
    body: `(a) CD Gate Enforcement: No commercial ad cut, XML timeline, or ad-kit copy document shall be released to the client Google Drive archive or client download portal until the designated Creative Director or Lead QA Operator has verified all compliance checks and recorded explicit approval in the Studio Review Room.
(b) Iterations & Re-Cuts: Each weekly drop includes standard 24-hour turnaround for copy edits, timing adjustments, audio balancing, or alternate hook re-cuts requested via the Review Room.
(c) Ad-Kit Copy: Generated primary texts and headlines are provided as starting editable drafts for editor and client refinement, ensuring tone of voice matches brand nuance.`,
  },
];

