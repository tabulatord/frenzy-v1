import "server-only";
import { Resend } from "resend";
import { PREREG_CLOSE_DATE } from "@/lib/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const FROM = process.env.RESEND_FROM_EMAIL ?? "FPWC <hello@fpwc.gg>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://frenzy-v1.vercel.app";
// TODO(Laurent): confirm the real inbox for this before launch — see the
// "points encore à confirmer" note in the confirmation-email spec.
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@fpwc.gg";
const SEND_ATTEMPTS = 2;

// Simple volume-based status, per fpwc-organisation-globale.md §2.1 — no
// exact "structured" cutoff was specified there (only USA was called out
// by name), so this threshold is a placeholder assumption; tune freely.
const STRUCTURED_THRESHOLD = 1000;
const ESTABLISHED_THRESHOLD = 150;

type CountryStatus = "structured" | "established" | "building";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCloseDate(): string {
  if (!PREREG_CLOSE_DATE) return "soon";
  const date = new Date(PREREG_CLOSE_DATE);
  if (Number.isNaN(date.getTime())) return "soon";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

async function getCountryStatus(countryCode: string): Promise<CountryStatus> {
  try {
    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase
      .from("pre_registrations")
      .select("id", { count: "exact", head: true })
      .eq("country_code", countryCode);

    if (error || count == null) return "building";
    if (count >= STRUCTURED_THRESHOLD) return "structured";
    if (count >= ESTABLISHED_THRESHOLD) return "established";
    return "building";
  } catch {
    return "building";
  }
}

function pathToParisParagraph(status: CountryStatus, countryName: string): string {
  const country = escapeHtml(countryName);
  switch (status) {
    case "structured":
      return `As a player in ${country}, you'll compete through regional qualifiers, then the National Championship, then Paris 2027.`;
    case "established":
      return `As a player in ${country}, you'll compete in your national qualifier, then Paris 2027.`;
    case "building":
      return `As a player in ${country}, you may be grouped into a regional qualifier alongside neighboring countries, then Paris 2027, depending on how many players join from your region.`;
  }
}

function renderConfirmationEmailHtml(params: {
  firstName: string;
  countryName: string;
  pathParagraph: string;
  closeDate: string;
}): string {
  const firstName = escapeHtml(params.firstName);
  const country = escapeHtml(params.countryName);
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-size:22px;font-weight:900;letter-spacing:-0.02em;margin:0 0 24px;">FPWC</p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">Hey ${firstName},</p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
        Welcome to FPWC &mdash; you're now officially representing <strong>${country}</strong> on
        the Road to Paris 2027.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
        Pre-registration is open until <strong>${params.closeDate}</strong>. After that date,
        we'll send you everything you need to know about the tournament.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
        Pickleball is a sport for every age, every background &mdash; and the more of us there
        are, the bigger and better this gets. Talk to your friends, your family, your local
        club. Every player counts.
      </p>

      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 8px;background-color:#f5f5f5;border-radius:12px;">
        <tr>
          <td style="padding:18px 20px;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#666;">
              Your path to Paris
            </p>
            <p style="margin:0;font-size:14px;line-height:1.6;font-weight:600;">
              ${params.pathParagraph}
            </p>
          </td>
        </tr>
      </table>
      <p style="font-size:12px;line-height:1.5;color:#888;margin:0 0 24px;">
        *Some regions may combine qualifiers with neighboring countries depending on player
        numbers &mdash; this keeps every qualifier fair and competitive.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
        A small participation fee will apply when the real tournament registration opens
        (once qualifiers are announced) &mdash; don't worry, we're keeping it friendly, not
        breaking any piggy banks. It goes straight into growing pickleball around the world:
        helping local qualifiers get organized properly, and fueling the Road to Paris itself.
        The more of us there are, the wilder this amateur pickleball celebration gets.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
        And here's the best part: every national champion earns a fully-funded trip to Paris
        &mdash; flight, hotel, and meals included &mdash; to represent their country on the
        world stage.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 28px;">
        Questions? Just email us at
        <a href="mailto:${CONTACT_EMAIL}" style="color:#0a0a0a;">${CONTACT_EMAIL}</a>.
      </p>

      <p style="font-size:16px;font-weight:800;margin:0 0 28px;">
        $500,000 prize pool. One road. Paris 2027.
      </p>

      <p style="font-size:14px;margin:0 0 28px;">&mdash; The FPWC Team</p>

      <a href="${SITE_URL}" style="display:inline-block;background-color:#0a0a0a;color:#c6ff2f;font-weight:800;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;margin:0 0 32px;">
        Follow the Road to Paris
      </a>

      <p style="font-size:12px;color:#999;line-height:1.6;margin:32px 0 0;border-top:1px solid #eee;padding-top:20px;">
        <a href="${SITE_URL}/privacy" style="color:#999;">Privacy Policy</a> &middot;
        <a href="${SITE_URL}/terms" style="color:#999;">Terms</a>
        <br />
        You're receiving this because you pre-registered at ${siteHost}.
        FPWC &mdash; Frenzy Pickleball World Championship.
      </p>
    </div>
  </body>
</html>`;
}

export async function sendConfirmationEmail(params: {
  to: string;
  firstName: string;
  countryCode: string;
  countryName: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — skipping confirmation email", {
      to: params.to,
    });
    return;
  }

  const resend = new Resend(apiKey);
  const status = await getCountryStatus(params.countryCode);
  const pathParagraph = pathToParisParagraph(status, params.countryName);
  const html = renderConfirmationEmailHtml({
    firstName: params.firstName,
    countryName: params.countryName,
    pathParagraph,
    closeDate: formatCloseDate(),
  });

  for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt++) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: params.to,
        subject: `You're officially pre-registered for FPWC — Road to Paris 2027. Represent ${params.countryName}!`,
        html,
      });
      if (error) throw new Error(error.message);
      return;
    } catch (err) {
      const isLastAttempt = attempt === SEND_ATTEMPTS;
      if (isLastAttempt) {
        console.error("Failed to send FPWC confirmation email after retry", {
          to: params.to,
          err,
        });
      }
    }
  }
}
