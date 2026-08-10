export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const UTM_STORAGE_KEY = "frenzy_utm";
const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

// Captures UTM params from the current URL on first landing and persists
// them for the session, so attribution survives a scroll-and-return visit
// even if the params aren't in the URL at submit time.
export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const fromUrl: UtmParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      fromUrl[key] = value;
      hasAny = true;
    }
  }

  if (hasAny) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams;
    } catch {
      return {};
    }
  }

  return {};
}
