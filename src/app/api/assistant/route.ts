import { NextRequest, NextResponse } from "next/server";
import { askAssistant, type ChatMessage } from "@/lib/assistant";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return false;
  }
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: NextRequest) {
  let body: { messages?: unknown; language_override?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidHistory(body.messages)) {
    return NextResponse.json({ error: "Invalid conversation history." }, { status: 422 });
  }

  const languageOverride =
    typeof body.language_override === "string" && body.language_override.trim()
      ? body.language_override.trim()
      : undefined;

  let result;
  try {
    result = await askAssistant(body.messages, languageOverride);
  } catch (err) {
    console.error("assistant call failed", err);
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please try again." },
      { status: 502 }
    );
  }

  if (result.escalate && result.escalation_email && result.proposed_response) {
    const lastQuestion =
      [...body.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from("assistant_escalations").insert({
        user_email: result.escalation_email.trim().toLowerCase(),
        question: lastQuestion,
        proposed_response: result.proposed_response,
        status: "pending",
      });
      if (error) {
        console.error("failed to log assistant escalation", error);
      }
    } catch (err) {
      console.error("failed to log assistant escalation", err);
    }
  }

  return NextResponse.json({ reply: result.reply });
}
