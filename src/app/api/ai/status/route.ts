// GET /api/ai/status, one place to confirm the Anthropic key is loaded for the
// whole app (the public chatbot and the CRM bot read it).
import { NextResponse } from "next/server";
import { hasAnthropicKey } from "@/lib/ai";

export const runtime = "nodejs";

export function GET() {
  const present = hasAnthropicKey();
  return NextResponse.json({
    hasKey: present,
    model: "claude-opus-4-8",
    powers: {
      chatbot: present,
      crmBot: present,
    },
    note: present
      ? "Anthropic key detected. Both surfaces use Claude; without it they fall back to rule-based replies."
      : "ANTHROPIC_API_KEY is empty/missing in .env.local. Put the full key after the = on the ANTHROPIC_API_KEY line, then restart the dev server.",
  });
}
