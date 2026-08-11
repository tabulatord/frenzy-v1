// Lazily loads the Google Maps JS API (places library only) on first use —
// never at page load, per the perf constraint. Cached so repeated calls
// (e.g. re-focusing the field) reuse the same script/library instance.

let loadPromise: Promise<GoogleMapsApi> | null = null;

export function loadGooglePlaces(): Promise<GoogleMapsApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadGooglePlaces can only run in the browser"));
  }
  if (loadPromise) return loadPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
  }

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = "__fpwcGoogleMapsLoaded";

    (window as unknown as Record<string, () => void>)[callbackName] = async () => {
      try {
        await window.google!.maps.importLibrary("places");
        resolve(window.google!.maps);
      } catch (err) {
        reject(err);
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load the Google Maps script"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
