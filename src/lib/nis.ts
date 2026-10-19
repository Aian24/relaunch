// src/lib/nis.ts — Narrative Intelligence Score engine (TypeScript)
// Layers & weights: StoryBrand SB7 35% · Hero's Journey 30% · Draper 25% · Archetype 10%
import * as cheerio from 'cheerio';

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const has = (txt: string, words: string[]) => words.some(w => txt.includes(w));
const count = (txt: string, re: RegExp) => (txt.match(re) || []).length;

export interface ExtractedHtml {
  title: string;
  metaDesc: string;
  h1: string;
  headings: string;
  btns: string;
  body: string;
  lower: string;
  btnsLower: string;
}

export function extractHtmlData(html: string): ExtractedHtml {
  const $ = cheerio.load(html);
  $('script,style,noscript,svg').remove();
  const title = ($('title').first().text() || '').trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || '').trim();
  const h1 = $('h1').map((_, e) => $(e).text().trim()).get().join(' · ');
  const headings = $('h1,h2,h3').map((_, e) => $(e).text().trim()).get().join(' ');
  const btns = $('a,button').map((_, e) => $(e).text().trim()).get().filter(Boolean).join(' | ');
  const body = $('body').text().replace(/\s+/g, ' ').trim();
  return {
    title,
    metaDesc,
    h1,
    headings,
    btns,
    body,
    lower: (title + ' ' + metaDesc + ' ' + body).toLowerCase(),
    btnsLower: btns.toLowerCase(),
  };
}

// ---- Layer 1: StoryBrand SB7 (35%) ----
function sb7(d: ExtractedHtml) {
  const t = d.lower, b = d.btnsLower;
  const checks = {
    character:  /\b(you|your|you're|yours)\b/.test(t),                              // customer as hero
    problem:    has(t, ['struggle','frustrat','losing','waste','problem','tired of','stop ','without','stuck','overwhelm','fall behind']),
    guide:      has(t, ['we help','our team','years','trusted','clients','proven','experience','since ']),
    empathy:    has(t, ['we understand','we know','we get','we believe','you deserve']),
    plan:       has(t, ['how it works','step 1','step one','our process','three steps','getting started','what to expect']),
    directCTA:  has(b, ['book','call','get started','schedule','buy','sign up','contact us','request','get my','start']),
    transCTA:   has(b, ['free','download','learn more','see how','guide','audit','pricing','watch','explore']),
    success:    has(t, ['grow','win','more customers','results','succeed','thrive','increase','save time','peace of mind']),
    stakes:     has(t, ['miss out','lose','behind','risk','without','fail','falling behind'])
  };
  const youRatio = count(t, /\b(you|your)\b/g) / Math.max(1, count(t, /\b(we|our|us)\b/g));
  let s = 0;
  s += checks.character ? 12 : 0;
  s += checks.problem ? 14 : 0;
  s += (checks.guide ? 7 : 0) + (checks.empathy ? 7 : 0);      // guide = empathy + authority
  s += checks.plan ? 14 : 0;
  s += (checks.directCTA ? 12 : 0) + (checks.transCTA ? 8 : 0);
  s += checks.success ? 8 : 0;
  s += checks.stakes ? 6 : 0;
  s += youRatio >= 1 ? 12 : (youRatio >= 0.5 ? 6 : 0);          // customer-centric language balance
  return { score: clamp(s), checks, youRatio: Math.round(youRatio * 100) / 100 };
}

// ---- Layer 2: Hero's Journey (30%) ----
function hero(d: ExtractedHtml) {
  const t = d.lower;
  const checks = {
    ordinary:    has(t, ['most ','many ','today','businesses','owners','you ']),       // relatable starting world
    call:        has(t, ['imagine','what if','ready to','time to','ready for']),
    transform:   has(t, ['transform','turn ','from ','to ','before','after','go from','become']),
    beforeAfter: /from\s+[^.]{0,40}\bto\b/.test(t) || has(t, ['used to','now ','once ']),
    aspiration:  has(t, ['thrive','leader','best','dream','vision','growth','scale','next level','stand out']),
    mentor:      has(t, ['we guide','we handle','we build','done for you','we take care','with you','partner']),
    resolution:  has(t, ['results','success','grow','win','achieve','proven','case study','story'])
  };
  let s = 0;
  s += checks.ordinary ? 12 : 0;
  s += checks.call ? 14 : 0;
  s += (checks.transform ? 16 : 0) + (checks.beforeAfter ? 10 : 0);
  s += checks.aspiration ? 16 : 0;
  s += checks.mentor ? 16 : 0;
  s += checks.resolution ? 16 : 0;
  return { score: clamp(s), checks };
}

// ---- Layer 3: Draper Principles (25%) ----
function draper(d: ExtractedHtml) {
  const t = d.lower;
  const words = count(t, /\b\w+\b/g);
  const h1len = d.h1 ? d.h1.split(/\s+/).length : 99;
  const checks = {
    emotion:    has(t, ['feel','confidence','proud','peace of mind','love','trust','relief','excited','happy','worry']),
    desire:     has(t, ['want','deserve','dream','imagine','finally','effortless','without the','so you can']),
    identity:   has(t, ['owners','leaders','professionals','businesses like yours','people who','the kind of']),
    benefit:    has(t, ['so you','that means','which means','without','save','more ','less ','faster','easier']),
    simple:     h1len > 0 && h1len <= 12,                         // punchy headline
    memorable:  !!d.title && d.title.length <= 60 && /[a-z]/i.test(d.title),
    concise:    words > 60 && words < 1200                        // not thin, not a wall of text
  };
  let s = 0;
  s += checks.emotion ? 20 : 0;
  s += checks.desire ? 18 : 0;
  s += checks.identity ? 14 : 0;
  s += checks.benefit ? 16 : 0;
  s += checks.simple ? 14 : 0;
  s += checks.memorable ? 10 : 0;
  s += checks.concise ? 8 : 0;
  return { score: clamp(s), checks, headlineWords: h1len };
}

// ---- Layer 4: Archetype Consistency (10%) ----
function archetype(d: ExtractedHtml) {
  const t = d.lower;
  const families: Record<string, string[]> = {
    Hero:      ['win','achieve','results','strong','power','bold','best','conquer','perform'],
    Caregiver: ['help','care','support','trust','protect','peace of mind','safe','handle'],
    Sage:      ['learn','guide','expert','proven','insight','strategy','knowledge','smart'],
    Everyman:  ['simple','easy','honest','real','straightforward','no fluff','down to earth'],
    Creator:   ['build','design','create','custom','craft','original','unique'],
    Ruler:     ['premium','leader','elite','luxury','exclusive','trusted','authority']
  };
  const scores: [string, number][] = Object.entries(families).map(([k, ws]) => [
    k,
    ws.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0),
  ]);
  scores.sort((a, b) => b[1] - a[1]);
  const top = scores[0], second = scores[1];
  const total = scores.reduce((n, s) => n + s[1], 0) || 1;
  const dominance = top[1] / total;
  let s = top[1] === 0 ? 30 : clamp(40 + dominance * 60);
  if (top[1] > 0 && second[1] > 0 && second[1] >= top[1]) s = clamp(s - 15);
  return { score: clamp(s), primary: top[1] ? top[0] : 'Undefined', dominance: Math.round(dominance * 100) };
}

const BANDS = [
  { min: 80, label: 'Strong',     note: 'Your message is doing real selling. Small refinements will compound.' },
  { min: 60, label: 'Developing', note: "You're on the right track, but buyers are slipping through clear gaps." },
  { min: 40, label: 'Weak',       note: 'Your marketing looks fine but quietly fails to convert. Fixable, fast.' },
  { min: 0,  label: 'Critical',   note: "Visitors can't tell what you do, why it matters, or what to do next." }
];

interface DiagnosisItem {
  area: string;
  score: number;
  fix: string;
}

function diagnose(layers: { sb7: { score: number }; hero: { score: number }; draper: { score: number }; archetype: { score: number } }) {
  const items: DiagnosisItem[] = [
    {
      area: 'StoryBrand clarity',
      score: layers.sb7.score,
      fix: 'A visitor should know what you do, who it\'s for, and the next step within 5 seconds. Lead with one clear one-liner and put a single obvious call-to-action above the fold.',
    },
    {
      area: 'Transformation story',
      score: layers.hero.score,
      fix: 'Show the before-and-after. Name where your customer is stuck and paint the outcome they get after working with you — not just a feature list.',
    },
    {
      area: 'Emotional pull',
      score: layers.draper.score,
      fix: 'Sell the feeling and the identity, not the mechanics. Tie every benefit to "so you can…" and tighten your headline to under a dozen words.',
    },
    {
      area: 'Brand voice consistency',
      score: layers.archetype.score,
      fix: 'Pick one voice and hold it across every page. Mixed tones make a brand forgettable and erode trust.',
    },
  ];
  items.sort((a, b) => a.score - b.score);
  return { weakest: items[0], ranked: items };
}

export interface AuditReport {
  overall: number;
  band: string;
  bandNote: string;
  layers: {
    storybrand: number;
    herosJourney: number;
    draper: number;
    archetype: number;
  };
  primaryArchetype: string;
  headline: string;
  weakest: { area: string; score: number; fix: string };
  fixes: { area: string; score: number; fix: string }[];
  salesHook: string;
}

export function scoreHtml(html: string): AuditReport {
  const d = extractHtmlData(html);
  const L = { sb7: sb7(d), hero: hero(d), draper: draper(d), archetype: archetype(d) };
  const overall = clamp(L.sb7.score * 0.35 + L.hero.score * 0.30 + L.draper.score * 0.25 + L.archetype.score * 0.10);
  const band = BANDS.find(b => overall >= b.min) || BANDS[BANDS.length - 1];
  const dx = diagnose(L);
  const hooks: Record<string, string> = {
    Critical:   "Right now you're paying to send people to a page that can't close. Let's fix the message first — it's the cheapest growth you'll ever buy.",
    Weak:       "You're closer than you think. A focused message overhaul could lift conversions without spending a dollar more on traffic.",
    Developing: "The foundation is there. Tightening your story and CTA is the fastest path to more booked calls from the same traffic.",
    Strong:     "Strong message. The next gains come from scaling what works — paid, social and AI visibility — on top of a page that already sells."
  };
  return {
    overall,
    band: band.label,
    bandNote: band.note,
    layers: {
      storybrand: L.sb7.score,
      herosJourney: L.hero.score,
      draper: L.draper.score,
      archetype: L.archetype.score
    },
    primaryArchetype: L.archetype.primary,
    headline: d.h1 || d.title || '(no clear headline found)',
    weakest: { area: dx.weakest.area, score: dx.weakest.score, fix: dx.weakest.fix },
    fixes: dx.ranked.map(r => ({ area: r.area, score: r.score, fix: r.fix })),
    salesHook: hooks[band.label] || hooks['Developing']
  };
}
