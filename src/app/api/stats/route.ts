import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SHOW_PLAYER_COUNT } from "@/lib/config";

export async function GET() {
  // Counting happens internally regardless, but we only expose the number
  // once the public counter is explicitly enabled.
  if (!SHOW_PLAYER_COUNT) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("pre_registrations")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("stats query failed", error);
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
