import { z } from "zod";

/**
 * ReLaunch Studio — Claude 3.5 Sonnet Structured Output Client
 * Communicates with Anthropic API or provides deterministic mock responses in test environments
 */

export interface ClaudeRequestOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodType<T>;
  mockFallback: T;
  temperature?: number;
  maxTokens?: number;
}

export async function callClaudeStructured<T>(
  options: ClaudeRequestOptions<T>
): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key is configured, return the deterministic schema-compliant mock
  if (!apiKey || apiKey === "mock" || apiKey.startsWith("sk-ant-test")) {
    // Validate mock against schema to guarantee schema integrity
    return options.schema.parse(options.mockFallback);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature ?? 0.3,
        system: `${options.systemPrompt}\n\nIMPORTANT: You must respond ONLY with a raw, valid JSON object matching the requested schema. Do not enclose in markdown blocks (\`\`\`json), do not prefix or suffix with explanatory text.`,
        messages: [
          {
            role: "user",
            content: options.userPrompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Claude API] Non-200 status (${res.status}): ${errText}. Using validated fallback.`);
      return options.schema.parse(options.mockFallback);
    }

    const data = await res.json();
    const rawContent = data.content?.[0]?.text || "{}";

    // Clean any accidental markdown code fences
    const cleanJson = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsedJson = JSON.parse(cleanJson);
    return options.schema.parse(parsedJson);
  } catch (error) {
    console.warn(`[Claude API] Call failed or validation failed:`, error);
    return options.schema.parse(options.mockFallback);
  }
}
