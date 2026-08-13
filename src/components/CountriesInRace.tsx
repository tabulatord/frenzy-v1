"use client";

import { useEffect, useRef, useState } from "react";
import { getCountryName } from "@/lib/countries";
import { CONTINENT_BY_COUNTRY, CONTINENT_LABELS, Continent, flagEmoji } from "@/lib/continents";

const POLL_INTERVAL_MS = 60_000;
const HIGHLIGHT_DURATION_MS = 8_000;
const CONTINENTS: Continent[] = ["americas", "europe", "asia"];

export default function CountriesInRace() {
  const [countries, setCountries] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());
  const initialized = useRef(false);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/countries-live");
        if (!res.ok) return;
        const body = await res.json();
        const next: string[] = body.countries ?? [];
        if (cancelled) return;

        if (!initialized.current) {
          // First load: show the current state with no "just arrived" flair.
          setCountries(next);
          initialized.current = true;
          setLoaded(true);
          return;
        }

        setCountries((prev) => {
          const prevSet = new Set(prev);
          const arrivals = next.filter((code) => !prevSet.has(code));
          if (arrivals.length > 0) {
            setRecentlyAdded((current) => {
              const updated = new Set(current);
              arrivals.forEach((code) => updated.add(code));
              return updated;
            });
            arrivals.forEach((code) => {
              const existing = timers.current.get(code);
              if (existing) clearTimeout(existing);
              const timeout = setTimeout(() => {
                setRecentlyAdded((current) => {
                  const updated = new Set(current);
                  updated.delete(code);
                  return updated;
                });
                timers.current.delete(code);
              }, HIGHLIGHT_DURATION_MS);
              timers.current.set(code, timeout);
            });
          }
          return next;
        });
      } catch {
        // Silent — this block is decorative, not worth surfacing an error for.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    const timersSnapshot = timers.current;
    return () => {
      cancelled = true;
      clearInterval(interval);
      timersSnapshot.forEach((t) => clearTimeout(t));
    };
  }, []);

  const byContinent: Record<Continent, string[]> = { americas: [], europe: [], asia: [] };
  for (const code of countries) {
    const continent = CONTINENT_BY_COUNTRY[code];
    if (continent) byContinent[continent].push(code);
  }
  for (const continent of CONTINENTS) {
    byContinent[continent].sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)));
  }

  if (countries.length === 0 && !loaded) return null;

  return (
    <section className="px-5 py-12">
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-black/50">
        Countries already in the race
      </h2>
      <div className="mx-auto mt-8 grid max-w-4xl gap-8 sm:grid-cols-3">
        {CONTINENTS.map((continent) => (
          <div key={continent}>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-black/40">
              {CONTINENT_LABELS[continent]}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {byContinent[continent].length === 0 && (
                <p className="text-xs text-black/30">Waiting for the first player&hellip;</p>
              )}
              {byContinent[continent].map((code) => (
                <span
                  key={code}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-1000 ${
                    recentlyAdded.has(code)
                      ? "animate-country-in border-accent-dark bg-accent/20"
                      : "border-black/15 bg-white"
                  }`}
                >
                  <span aria-hidden>{flagEmoji(code)}</span>
                  {getCountryName(code) || code}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-md text-center text-xs text-black/40">
        Total pre-registrations stay private until we reach a major milestone &mdash; for now,
        just the countries joining the Road to Paris 2027.
      </p>
    </section>
  );
}
