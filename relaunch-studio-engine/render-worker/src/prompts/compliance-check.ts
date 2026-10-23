import { ComplianceReportSchema, type ComplianceReportData } from "./schemas.ts";
import { callClaudeStructured } from "./claude-client.ts";

/**
 * ReLaunch Studio — Node 4.3: Automated Compliance Pre-Check & Auto-Rewrite Engine
 * Audits short-form ad scripts against FTC guidelines, Meta Ads policies, and TikTok commercial rules.
 * Automatically rewrites flagged claims into high-converting, policy-compliant copy.
 */

export interface ComplianceAuditInput {
  scriptText: string;
  brandDoNotSay?: string[];
  productCategory?: string;
}

export async function auditAndRewriteCompliance(
  input: ComplianceAuditInput
): Promise<ComplianceReportData> {
  const systemPrompt = `You are the Lead Legal & Compliance Auditor at ReLaunch Studio.
Your responsibility is ensuring 100% advertising policy compliance across:
1. FTC Truth in Advertising & Endorsement Guides (16 CFR Part 255).
2. Meta Advertising Standards (Personal Health, Unrealistic Outcomes, Prohibited Claims).
3. TikTok Commercial Content Guidelines (Misleading claims, deceptive guarantees).

Rules to enforce:
- Health/Beauty/Wellness: No claims of "curing", "erasing", or "guaranteed 100% elimination" of medical conditions. Replace with cosmetic/appearance terms (e.g., "visibly softens", "helps support", "reveals smoother looking").
- Performance/Results: No absolute timelines ("lose 20 lbs in 7 days", "10x your income in 24 hours"). Replace with realistic customer experience framing ("helped me stay consistent", "a game changer for my routine").
- Testimonials: Must reflect typical consumer experience or include clear substantiation context.
- Brand Do-Not-Say: Strictly enforce any client-specific prohibited terms.

Whenever a claim is flagged:
1. Identify the exact offending phrase.
2. Cite the specific rule violated.
3. Automatically generate a high-converting, fully compliant rewrite that preserves the emotional sales punch without risking account bans.`;

  const userPrompt = `Audit and rewrite this ad script for compliance:

SCRIPT CONTENT:
${input.scriptText}

CLIENT DO-NOT-SAY GUARDRAILS:
${(input.brandDoNotSay || []).join("\n") || "None specified"}

PRODUCT CATEGORY:
${input.productCategory || "DTC Ecommerce / Social Commerce"}

Return the structured ComplianceReport JSON now:`;

  // Deterministic local rule engine for fallback
  const riskyTerms = [
    { pattern: /\bcure[s]?\b/i, rule: "FTC prohibition on unsubstantiated cure claims", cat: "health_cure" as const },
    { pattern: /\bguarantee[d]?\s+(income|results|cure)\b/i, rule: "Meta policy on guaranteed outcomes", cat: "financial_guarantee" as const },
    { pattern: /\blose\s+\d+\s*lbs\b/i, rule: "TikTok/Meta policy on unrealistic weight loss timelines", cat: "unrealistic_claim" as const },
    { pattern: /\b100%\s+guaranteed\b/i, rule: "Advertising standards on deceptive absolutes", cat: "superlative" as const },
  ];

  const detectedFlags = [];
  let rewrittenScript = input.scriptText;

  for (const item of riskyTerms) {
    if (item.pattern.test(input.scriptText)) {
      detectedFlags.push({
        claim: input.scriptText.match(item.pattern)?.[0] || "flagged term",
        rule: item.rule,
        category: item.cat,
        status: "rewritten" as const,
        suggested_rewrite: "verified customer favorite with proven satisfaction",
      });
      rewrittenScript = rewrittenScript.replace(item.pattern, "proven, customer-loved");
    }
  }

  const fallback: ComplianceReportData = {
    passed: detectedFlags.length === 0,
    flags: detectedFlags,
    original_script: input.scriptText,
    compliant_script: rewrittenScript,
  };

  return callClaudeStructured({
    systemPrompt,
    userPrompt,
    schema: ComplianceReportSchema,
    mockFallback: fallback,
    temperature: 0.1,
  });
}
