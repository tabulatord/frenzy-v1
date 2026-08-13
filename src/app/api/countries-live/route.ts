import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Public endpoint — returns only the distinct set of countries that have
// at least one pre-registration, never a count. The raw per-country
// volume stays private; see /lib/config.ts SHOW_PLAYER_COUNT for the
// separate, still-gated total counter.
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pre_registrations")
    .select("country_code")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("countries-live query failed", error);
    return NextResponse.json({ error: "Could not load countries." }, { status: 500 });
  }

  const seen = new Set<string>();
  for (const row of data) {
    if (row.country_code) seen.add(row.country_code);
  }

  return NextResponse.json(
    { countries: Array.from(seen) },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } }
  );
}
