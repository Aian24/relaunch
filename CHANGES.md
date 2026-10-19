# relaunch.us: review fixes

## Round 4 (Oct 16, 2026): final copy pass

This zip contains every file changed since your Oct 16 build (rounds 2, 3 and 4), so copying it over your project brings you fully up to date. Then delete the files listed here and in round 3, build, and upload.

**Files to delete** (in addition to the round 3 list): `src/data/testimonials.ts`, `src/components/TestimonialsSection.tsx`

| Area | Change |
| --- | --- |
| Testimonials | All testimonials removed site-wide, by Robert's decision: the homepage quote, "What clients say" on /work, and the quote box on every case study page (`testimonialQuote` removed from `caseStudies.ts` and from `CaseStudyDetailClient.tsx`). |
| Homepage hero | New subhead naming what we do: "Websites, social media, ads, AI search and custom software for small businesses. Built to bring in more customers, with results you can see in your numbers." Second button is now "See our work" → /work (it used to open the same form as the first button). The pill under the buttons reads "Month-to-month · You own everything · (480) 779-9875" instead of repeating the eyebrow. |
| Homepage | "We Find the Problem. We Fix it. You Grow!" → "Four ways we bring you more customers." Results subhead → "Real clients. Real work. Real results." Brands subhead → "From single-location shops to franchise brands, hotels and a city government." |
| Naming | "get paid" → "get more customers" / "win more customers" (Services hero, homepage How we work, chat assistant), matching the "Get More Customers" service. |
| Case study pages | Headings now "The challenge", "What we did", "What changed", "What we delivered". Removed person names from the visible copy (Project focus lines, "Everything we handled for…", TurfLife and Swing Perfect intros) and "ReLaunch Advertising". Rewrote the challenge / what we did / results text for Chicago Dogs 42, Jacksonville, TurfLife, Swing Perfect and Aspiration in plain language, with the same facts. |
| Work page | Hero: "Real businesses, real work…". Card button "Ask How" → "Book a call" (now opens the form with "Not sure yet" instead of an invalid topic). |
| Studio | Removed "Never let ad fatigue kill your sales again" and "seamlessly"; "Four steps. New ads every week."; final CTA promises a planning call, not ads "running this week". |
| AI Recommendations | Step 1 and the final CTA no longer say "Sign up online" (the button opens the call form until recommend.relaunch.us is live). When it goes live, change those two lines back. |

## Round 3 (Oct 16, 2026): final pass for the demo site

Copy the files in this zip over your project (same folders), delete the files listed below, then build and upload. Production build passes; all 17 pages checked on desktop and phone with no console errors and no sideways scrolling.

**Files to delete** (unzipping does not remove them):
- From round 2, if still there: `src/app/admin/page.tsx`, `src/components/AdminAnalyticsDashboard.tsx`, `src/data/adminLeads.ts`
- Founder photo: `public/images/bobby-clark.jpg`
- Unused videos (about 30 MB, nothing references them): `public/ReLaunch #U2014 Marketing, AI & Digital Services _ Phoenix, AZ.mp4`, `public/ReLaunchSecond.mp4`, `public/ourwork.mp4`, `public/relaunch-hero.mp4`, `public/enterprise.mp4`

| Area | Change |
| --- | --- |
| No founder on the site (for now) | Homepage "Meet Bobby" section is now "How we work": no photo or name, same three promises, orange button. About page founder block is now "Why we exist" in team voice, no photo. Every "Bobby" in site copy now says "our team" / "we" (About, Social Audit table, booking form, chat assistant). `companyCreds.founder` in `offerings.ts` is now `companyCreds.team` (no name or photo). |
| No links to client sites | Removed every "Visit site" link and the `liveUrl` field from case studies (Chicago Dogs 42, Carmen Hotel, Jacksonville, TurfLife, Swing Perfect). Case studies are for viewing only. The only outbound links left are ReLaunch's own Social client portal on /social. |
| Testimonials | Deleted the "ACME Rewards Club" quote (placeholder). The QuinnLan and Phoenix Limo quotes are hidden until Robert confirms them: set `showGeneralTestimonials = true` in `src/data/testimonials.ts` to bring back "What clients say" on /work and the quote on the homepage. Case study quotes are unchanged. |
| Carmen Hotel | Removed the last KPI ("+10,000 new verified traveler followers" image caption). |
| Case study pages (all) | Bottom CTA reworded to plain copy ("Want results like these? Book a free 30-minute strategy call…"), "Measurable Business Impact" → "What changed", the fixed "Full lifecycle partnership…" line made accurate for every case. Image captions no longer say "high-converting". |
| Buttons | Six purple "Book a Strategy Call" buttons changed to the site's orange so every main CTA matches (homepage How it works, About ×2, Work, AI Recommendations, case study pages, Social section). Custom Software project cards now link to their own case pages instead of /work. Removed the second back-to-top button in the footer (the floating one stays). |
| Homepage | Removed the duplicate stats row under "The Brands We've Helped" (same numbers already show under the hero). "Chicago Dog 42" → "Chicago Dogs 42" to match the case study. |
| About | Timeline "Why it matters" notes no longer cut off on phones. "Defensible Track Record" → "Track Record". |
| Copy | Chat assistant no longer lists Phoenix as home base ("Fully remote"). "Guaranteed fixed-scope milestones" → "Fixed-scope milestones & delivery dates". "EST. 2008" → "SINCE 2008". |
| Videos | Re-encoded the three case study videos (same look): `carmen-hotel-body.mp4` 37→14 MB, `carmen-hotel-hero.mp4` 24→6 MB, `chicago-dog-pr.mp4` 51→10 MB (4K → 1080p). |

Still needed before going live: add `RESEND_API_KEY` (see "Before going live" below) so the booking form can send email.

## Round 2 (Oct 16, 2026), applied on top of the developer's Oct 16 build

**Files to delete** (unzipping does not remove them): `src/app/admin/page.tsx`, `src/components/AdminAnalyticsDashboard.tsx`, `src/data/adminLeads.ts`.

**Please build on this copy from now on.** The Oct 16 build did not include the round 1 fixes below, so they have been merged in again, keeping all of the developer's new work (case study pages, layout changes).

| Area | Change |
| --- | --- |
| Round 1 fixes | Re-applied: contact form emails robert@relaunch.us (`/api/contact`), honest confirmation and error messages, /admin removed, fake audit score removed, Social post counts, $497 audit price, footer button, Phoenix/2004 text, page title. |
| Product buttons (new `src/data/productLinks.ts`, `src/components/ProductCta.tsx`) | AI Recommendations, Studio and Social Audit main buttons open the strategy-call form with that product pre-selected, because their own sites are not live yet. When a site goes live, paste its address into `liveUrl` in `productLinks.ts` and the buttons switch to linking there. Previously these buttons went to /pricing, which has no price for those products. |
| Social Audit page | Copy no longer promises an instant score while the button goes to the form ("Get my free review"). |
| Aspiration Bank | Removed from the homepage results (replaced with City of Jacksonville) and from Custom Software projects. Kept on the Work page and its case page, with no "Visit site" link and no quote. |
| Carmen Hotel | Case page rewritten around branding. Removed the 15% bookings / 20% followers / 30% traffic figures and the $87,500 profit stat (those were goals on the original case page, not reported results). |
| Swing Perfect / Jacksonville | Replaced the "Labor $3,700" and "$65,000 bid / $85,000 budget" stat cards with non-financial facts. Removed Jacksonville deliverables not on the original case page (GIS parcel search, tax assessment tools). |
| New case study: Food Court Micro-Brands (`/work/micro-brands`) | Walt & Willy's Creamery, Get Cheezi, Berlin Barrel and Haweenie's on one page: names, logos, storefronts and counters, menus and signage, social posts. Images are in `public/showcase/microbrands/`. Adds an optional `brandShowcase` field to the case study type and a "The Brands" section to `CaseStudyDetailClient.tsx` (only shows when that field is set). No owner names, written as past work. Aspiration Bank moved to the end of the Work list. |
| Contact form topics | One list matching every button: Not sure yet, the four service groups, the four products, A bundle of services. |

## Round 1 (Oct 14, 2026)

Applied on top of the developer's latest build. Production build passes (`next build`, 18 routes).

## Before going live: set up email for the contact form

The "Book a Strategy Call" form now emails every request to robert@relaunch.us through `/api/contact`.
It uses Resend's HTTP API (no new npm package).

1. Create a free account at resend.com and verify the `relaunch.us` domain (adds a few DNS records).
2. In Vercel → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY` (required)
   - `CONTACT_TO_EMAIL` (optional, defaults to `robert@relaunch.us`)
   - `CONTACT_FROM_EMAIL` (optional, defaults to `ReLaunch Website <website@relaunch.us>`)
3. Redeploy, submit a test request, and confirm the email arrives. Replying to it goes to the visitor.

Until `RESEND_API_KEY` is set, the form shows visitors an error with the phone number and email instead of pretending it worked.

## What changed

| Area | Change |
| --- | --- |
| Contact form (`ContactModal.tsx`, new `app/api/contact/route.ts`) | Previously sent nothing: it saved to the visitor's own browser and showed a fake "Google Calendar invite sent" message. Now emails the request, shows an honest confirmation ("Bobby will email you within one business day"), and shows an error with phone/email if sending fails. Removed the AI Audit tab, "Google Calendar" wording, "Phoenix, AZ · Est. 2004" and the browser-storage lead log. Topic list now matches the four service groups and four products. Added a hidden spam trap. |
| `/admin` | Removed (page, dashboard component, sample lead data). Its login displayed the password on screen and showed no real leads. |
| Social Audit page | Removed the fake free score (it was calculated from the length of the typed URL and email). Buttons now go to `https://audit.relaunch.us`. Full audit price $497. |
| AI Recommendations | Subdomain changed to `https://recommend.relaunch.us`. |
| Starting prices (`offerings.ts`) | Get Found from $497/mo · Get Chosen from $297/mo · Get More Customers from $797/mo · Custom by quote. Full Social Audit $497. Chat assistant pricing answer updated to match. |
| Bundle calculator (`bundlePricing.ts`) | Services renamed and repriced to match the four groups (removed "Next.js" wording and the old $790/$590 items). Top tier renamed from "Mission Control" to "Full Team". |
| ReLaunch Social "You send the photos" plans | Launch 12 posts/mo · Presence 20 posts/mo · Velocity 30 posts/mo (daily). |
| Carmen Hotel case study | Rewritten around branding (voice, look, social presence, video). No KPIs. |
| Homepage | Hero eyebrow restored to "Helping small businesses grow since 2008 · U.S., Canada, UK & Australia". Proof strip (1,500+ projects · 18 years · 480+ campaigns) added under the hero. |
| Footer | "Book a Strategy Call" now opens the booking form (was a link to /pricing). Removed the duplicate "Based in Phoenix" line in the copyright. |
| Site metadata (`layout.tsx`) | Title no longer ends in "Phoenix, AZ"; description says small businesses across the U.S., Canada, the UK and Australia. |
| Services page | Buttons read "Ask About …" instead of "Inquire About …". |

## Still to do outside this code

- Point `recommend.relaunch.us`, `audit.relaunch.us` and `studio.relaunch.us` at their apps when those are ready. Until then those buttons lead to addresses that don't load yet.
- Several old components are no longer used by any page (e.g. `AiSection`, `DeliverablesSection`, `TickerBar`, `CaseStudiesSection`, `SellingMethodSection`). They still contain old copy ("Est. 2004", AEO/GEO). Safe to delete in a cleanup pass.
