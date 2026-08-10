// Pluggable analytics abstraction. V1 ships with zero third-party pixels —
// this just defines the seam so Meta Pixel / TikTok Pixel / GA can be
// dropped in later (in loadProviders + track) without touching call sites.

export type AnalyticsEvent = "page_view" | "form_start" | "pre_register_success";

let providersLoaded = false;

export function loadAnalyticsProviders() {
  if (providersLoaded || typeof window === "undefined") return;
  if (!hasMarketingConsent()) return;

  // Example future wiring, gated behind env vars so nothing loads until
  // real pixel IDs are configured:
  // if (process.env.NEXT_PUBLIC_META_PIXEL_ID) { ...inject Meta Pixel... }
  // if (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) { ...inject TikTok Pixel... }
  // if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) { ...inject GA... }

  providersLoaded = true;
}

export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!hasMarketingConsent()) return;

  loadAnalyticsProviders();

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, data);
  }

  // Future: window.fbq?.("track", ...), window.ttq?.track(...), gtag(...)
}

const CONSENT_KEY = "frenzy_cookie_consent";
export type ConsentState = "accepted" | "declined" | null;

const consentListeners = new Set<() => void>();

// For useSyncExternalStore: subscribes to both same-tab consent changes
// (via setConsentState below) and cross-tab changes (native storage event).
export function subscribeToConsent(listener: () => void) {
  consentListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    consentListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function getConsentServerSnapshot(): ConsentState {
  return null;
}

export function setConsentState(state: Exclude<ConsentState, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, state);
  consentListeners.forEach((listener) => listener());
}

export function hasMarketingConsent(): boolean {
  return getConsentState() === "accepted";
}
