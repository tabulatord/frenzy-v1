"use client";

import { useState } from "react";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Status = "idle" | "locating" | "searching" | "results" | "error";

const SEARCH_RADIUS_METERS = 25000;

export default function NearbyClubsFinder({
  onSelect,
}: {
  onSelect: (place: { description: string; lat: number; lng: number }) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [places, setPlaces] = useState<Place[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  function handleFind() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setStatus("error");
      setErrorMessage("Location search isn't available right now.");
      return;
    }

    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorMessage("Your browser doesn't support location search.");
      return;
    }

    setStatus("locating");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus("searching");
        try {
          const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.displayName,places.formattedAddress,places.location",
            },
            body: JSON.stringify({
              textQuery: "pickleball courts",
              maxResultCount: 5,
              locationBias: {
                circle: {
                  center: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                  radius: SEARCH_RADIUS_METERS,
                },
              },
            }),
          });

          if (!res.ok) throw new Error("search failed");
          const body = await res.json();
          const results: Place[] = (body.places ?? []).map(
            (p: {
              displayName?: { text?: string };
              formattedAddress?: string;
              location?: { latitude: number; longitude: number };
            }) => ({
              name: p.displayName?.text ?? "Pickleball courts",
              address: p.formattedAddress ?? "",
              lat: p.location?.latitude ?? 0,
              lng: p.location?.longitude ?? 0,
            })
          );

          if (results.length === 0) {
            setStatus("error");
            setErrorMessage("No pickleball courts found nearby — enter your location manually.");
            return;
          }

          setPlaces(results);
          setStatus("results");
        } catch {
          setStatus("error");
          setErrorMessage("Couldn't search right now — enter your location manually.");
        }
      },
      () => {
        setStatus("error");
        setErrorMessage("Location permission denied — enter your location manually.");
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="mt-2">
      {status !== "results" && (
        <button
          type="button"
          onClick={handleFind}
          disabled={status === "locating" || status === "searching"}
          className="text-sm font-semibold text-accent-dark underline underline-offset-2 disabled:opacity-50"
        >
          {status === "locating"
            ? "Finding your location…"
            : status === "searching"
              ? "Looking for places to play nearby…"
              : "📍 Where can I play pickleball near me?"}
        </button>
      )}

      {status === "error" && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}

      {status === "results" && (
        <div className="mt-2 space-y-1.5">
          <p className="text-xs font-semibold text-black/50">
            Places to play pickleball near you — pick one, or keep typing above:
          </p>
          {places.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const description = p.address ? `${p.name}, ${p.address}` : p.name;
                onSelect({ description, lat: p.lat, lng: p.lng });
                setStatus("idle");
                setPlaces([]);
              }}
              className="block w-full rounded-xl border border-black/15 px-3 py-2 text-left text-sm hover:border-black hover:bg-accent/10"
            >
              <span className="font-semibold">{p.name}</span>
              {p.address && <span className="block text-xs text-black/50">{p.address}</span>}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setPlaces([]);
            }}
            className="text-xs font-semibold text-black/40 underline"
          >
            None of these
          </button>
        </div>
      )}
    </div>
  );
}
