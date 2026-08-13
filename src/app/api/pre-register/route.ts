import { NextRequest, NextResponse, after } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateRegistration, type RegistrationPayload } from "@/lib/registration";
import { isPreRegistrationClosed } from "@/lib/config";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (isPreRegistrationClosed()) {
    return NextResponse.json(
      { error: "Pre-registration is closed." },
      { status: 403 }
    );
  }

  let data: RegistrationPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateRegistration(data);
  if (!result.valid) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("pre_registrations").insert({
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    country_code: data.country_code,
    country_name: data.country_name,
    region: data.region.trim(),
    city: data.city.trim(),
    postal_code: data.postal_code.trim(),
    rating: data.rating,
    disciplines: data.disciplines,
    usual_pickleball_location: data.location_not_listed
      ? null
      : data.usual_pickleball_location?.trim() || null,
    usual_pickleball_lat: data.location_not_listed ? null : data.usual_pickleball_lat ?? null,
    usual_pickleball_lng: data.location_not_listed ? null : data.usual_pickleball_lng ?? null,
    location_not_listed: data.location_not_listed,
    consent_terms: data.consent_terms,
    consent_marketing: data.consent_marketing,
    guardian_email: data.guardian_email?.trim() || null,
    guardian_consent: data.guardian_consent,
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_content: data.utm_content || null,
    utm_term: data.utm_term || null,
  });

  if (error) {
    // Postgres unique_violation
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This email is already pre-registered." },
        { status: 409 }
      );
    }
    console.error("pre-register insert failed", error);
    return NextResponse.json({ error: "Could not save your pre-registration." }, { status: 500 });
  }

  // Fire after the response is sent so a slow/failing email provider never
  // delays or breaks the pre-registration itself.
  after(() =>
    sendConfirmationEmail({
      to: data.email.trim().toLowerCase(),
      firstName: data.first_name.trim(),
      countryCode: data.country_code,
      countryName: data.country_name,
    })
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
