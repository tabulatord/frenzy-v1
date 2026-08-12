// Central place for launch config so nothing is hard-coded in components.

export const PREREG_CLOSE_DATE = process.env.PREREG_CLOSE_DATE ?? null;

export function isPreRegistrationClosed(): boolean {
  if (!PREREG_CLOSE_DATE) return false;
  const closeTime = new Date(PREREG_CLOSE_DATE).getTime();
  if (Number.isNaN(closeTime)) return false;
  return Date.now() >= closeTime;
}

export const SHOW_PLAYER_COUNT = process.env.NEXT_PUBLIC_SHOW_PLAYER_COUNT === "true";
export const PLAYER_COUNT_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_PLAYER_COUNT_THRESHOLD ?? 1000
);

export const CLOSED_MESSAGE =
  "GLOBAL PRE-REGISTRATION IS NOW CLOSED. We're building the Road to Paris. Next stage coming soon.";

// Off by default until the Anthropic account has billing credits — flip to
// "true" in Vercel once /api/assistant is confirmed working.
export const SHOW_ASSISTANT = process.env.NEXT_PUBLIC_SHOW_ASSISTANT === "true";
