import { NextResponse } from "next/server";

/**
 * ReLaunch Studio — Internal QA Review API
 * Endpoint: /api/studio/review
 *
 * GET: Returns variants pending review (needs_review)
 * POST: Records human QA decision (approve / reject / recut)
 */

// In-memory state for dev preview when local Postgres is not running in Docker
let IN_MEMORY_VARIANTS = [
  {
    id: "var-02",
    clientName: "Chicago Dog House",
    batchName: "Batch #1 — Week of Oct 21",
    angle: "3 Reasons Why / Listicle",
    framework: "Listicle Benefit",
    targetPersona: "Foodie & Quick Lunch Crowd",
    hookText: "3 Hidden Reasons Why Traditional Hot Dogs Don't Compare",
    video9x16: "/videos/chicago-dog-social-1.mp4",
    video1x1: "/videos/chicago-dog-social-1.mp4",
    video4x5: "/videos/chicago-dog-social-1.mp4",
    thumbnail: "/images/studio/weekly-production.jpg",
    status: "needs_review",
    disclosureApplied: true,
    audioLufs: -13.8,
    scriptBody: "Reason 1: Authentic Vienna beef. Reason 2: Poppy seed bun steamed fresh. Reason 3: The neon green relish you can only find in Chicago.",
    ctaText: "Order Online for 15% Off",
    forbiddenClaims: ["No misleading ingredient claims"],
    createdAt: "2026-10-22T09:15:00Z",
  },
  {
    id: "var-03",
    clientName: "Dance Fusion AZ",
    batchName: "Batch #1 — Week of Oct 21",
    angle: "UGC Social Proof Testimonial",
    framework: "Social Proof Story",
    targetPersona: "Fitness Enthusiast / Fun Workout",
    hookText: "I replaced boring cardio with dance classes for 30 days.",
    video9x16: "/videos/dance-fusion/dance-reel-2.mp4",
    video1x1: "/videos/dance-fusion/dance-reel-2.mp4",
    video4x5: "/videos/dance-fusion/dance-reel-2.mp4",
    thumbnail: "/images/studio/weekly-production.jpg",
    status: "needs_review",
    disclosureApplied: true,
    audioLufs: -14.0,
    scriptBody: "I used to dread the treadmill. At Dance Fusion, you burn 500 calories before you even realize you're working out.",
    ctaText: "Book Your First Class",
    forbiddenClaims: ["No before/after unrealistic claims"],
    createdAt: "2026-10-22T10:00:00Z",
  },
  {
    id: "var-04",
    clientName: "Dance Fusion AZ",
    batchName: "Batch #1 — Week of Oct 21",
    angle: "Studio Energy & Community",
    framework: "Lifestyle Community Discovery",
    targetPersona: "Adult Beginners & Community Seekers",
    hookText: "Adult beginner dance classes that actually feel like a weekend party.",
    video9x16: "/videos/dance-fusion/dance-reel-3.mp4",
    video1x1: "/videos/dance-fusion/dance-reel-3.mp4",
    video4x5: "/videos/dance-fusion/dance-reel-3.mp4",
    thumbnail: "/images/studio/weekly-production.jpg",
    status: "needs_review",
    disclosureApplied: true,
    audioLufs: -14.1,
    scriptBody: "No auditions. No judgment. Just 60 minutes of high-energy music, great instructors, and a community where you belong.",
    ctaText: "Claim Your $10 Intro Pass",
    forbiddenClaims: ["No unrealistic physical claims"],
    createdAt: "2026-10-22T10:30:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: IN_MEMORY_VARIANTS.filter((v) => v.status === "needs_review").length,
    variants: IN_MEMORY_VARIANTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, decision, reviewerName, notes, checklist } = body;

    if (!variantId || !decision) {
      return NextResponse.json(
        { error: "variantId and decision are required" },
        { status: 400 }
      );
    }

    const variant = IN_MEMORY_VARIANTS.find((v) => v.id === variantId);
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Update variant status
    variant.status = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "needs_review";

    console.log(`[QA Gate] Variant ${variantId} action: ${decision.toUpperCase()} by ${reviewerName || "Operator"}`);
    if (decision === "approve") {
      console.log(`[QA Gate] ✓ Variant ${variantId} approved. Simulated Frame.io push triggered.`);
    } else if (decision === "recut") {
      console.log(`[QA Gate] ⚡ Variant ${variantId} recut queued. Notes: ${notes}`);
    }

    return NextResponse.json({
      ok: true,
      decision,
      variantId,
      updatedStatus: variant.status,
      timestamp: new Date().toISOString(),
      frameioDeliveryQueued: decision === "approve",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process review decision" }, { status: 500 });
  }
}
