import "server-only";
import { Resend } from "resend";
import { DISCIPLINES } from "@/lib/registration";

const FROM = process.env.RESEND_FROM_EMAIL ?? "FPWC <hello@fpwc.gg>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://frenzy-v1.vercel.app";
const SEND_ATTEMPTS = 2;

function disciplineLabel(value: string): string {
  return DISCIPLINES.find((d) => d.value === value)?.label ?? value;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderConfirmationEmailHtml(params: {
  firstName: string;
  rating: string;
  disciplinesText: string;
}): string {
  const firstName = escapeHtml(params.firstName);
  const rating = escapeHtml(params.rating);
  const disciplinesText = escapeHtml(params.disciplinesText);
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-size:22px;font-weight:900;letter-spacing:-0.02em;margin:0 0 24px;">FPWC</p>

      <h1 style="font-size:26px;font-weight:900;line-height:1.15;margin:0 0 16px;">You&rsquo;re in, ${firstName}.</h1>

      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
        Your pre-registration for the <strong>Frenzy Pickleball World Championship (FPWC)</strong>
        &mdash; Road to Paris 2027 &mdash; is confirmed.
      </p>

      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;background-color:#f5f5f5;border-radius:12px;">
        <tr>
          <td style="padding:16px 20px;font-size:13px;color:#666;">Level</td>
          <td style="padding:16px 20px;font-size:14px;font-weight:700;text-align:right;">${rating}</td>
        </tr>
        <tr>
          <td style="padding:0 20px 16px;font-size:13px;color:#666;">Discipline(s)</td>
          <td style="padding:0 20px 16px;font-size:14px;font-weight:700;text-align:right;">${disciplinesText}</td>
        </tr>
      </table>

      <h2 style="font-size:16px;font-weight:800;margin:0 0 12px;">What happens next</h2>
      <p style="font-size:15px;line-height:1.6;margin:0 0 12px;">
        Global pre-registration runs for 45 days. Once it closes, we spend about 15 days
        analyzing where players are concentrated around the world, then announce the first
        qualifiers based on player demand.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
        The path: <strong>Local &rarr; Regional &rarr; National &rarr; Paris 2027</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
        There&rsquo;s nothing else to do right now &mdash; we&rsquo;ll email you directly as soon
        as a qualifier opens in your area. We don&rsquo;t have exact dates yet, but you&rsquo;ll be
        among the first to know.
      </p>

      <a href="${SITE_URL}" style="display:inline-block;background-color:#0a0a0a;color:#c6ff2f;font-weight:800;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;margin:0 0 32px;">
        Follow the Road to Paris
      </a>

      <p style="font-size:12px;color:#999;line-height:1.6;margin:32px 0 0;border-top:1px solid #eee;padding-top:20px;">
        You&rsquo;re receiving this because you pre-registered at ${siteHost}.
        FPWC &mdash; Frenzy Pickleball World Championship.
      </p>
    </div>
  </body>
</html>`;
}

export async function sendConfirmationEmail(params: {
  to: string;
  firstName: string;
  rating: string;
  disciplines: string[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — skipping confirmation email", {
      to: params.to,
    });
    return;
  }

  const resend = new Resend(apiKey);
  const disciplinesText = params.disciplines.map(disciplineLabel).join(", ") || "—";
  const html = renderConfirmationEmailHtml({
    firstName: params.firstName,
    rating: params.rating,
    disciplinesText,
  });

  for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt++) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: params.to,
        subject: "You're in — FPWC Road to Paris 2027 confirmed",
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
