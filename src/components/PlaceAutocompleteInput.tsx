"use client";

import { useRef, useState } from "react";
import { loadGooglePlaces } from "@/lib/googleMaps";

type Props = {
  id?: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: { lat: number | null; lng: number | null }) => void;
};

// Renders a plain text input until the field is first focused, then swaps
// in Google's PlaceAutocompleteElement — keeps the Maps JS bundle out of
// the initial page load entirely (only visitors who reach this field pay
// for it), per the perf requirement.
//
// The target <div> for the Google element is always mounted (just hidden
// until ready), never conditionally rendered — the async script load can
// finish well after the initial render, and a conditionally-rendered div
// wouldn't exist yet when the "gmp-select" wiring tries to attach to it.
export default function PlaceAutocompleteInput({
  id,
  value,
  disabled,
  placeholder,
  className,
  onChange,
  onPlaceSelected,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleFocus() {
    if (ready || loading) return;
    setLoading(true);

    loadGooglePlaces()
      .then((maps) => {
        if (!containerRef.current) return;

        const el = new maps.places.PlaceAutocompleteElement();
        if (id) el.id = id;
        el.classList.add("fpwc-place-autocomplete");
        if (placeholder) el.setAttribute("placeholder", placeholder);

        el.addEventListener("gmp-select", async (event) => {
          try {
            const place = (
              event as GoogleMapsPlaces.PlaceAutocompleteSelectEvent
            ).placePrediction.toPlace();
            await place.fetchFields({ fields: ["formattedAddress", "displayName", "location"] });
            const description = place.formattedAddress ?? place.displayName ?? "";
            onChange(description);
            onPlaceSelected?.({
              lat: place.location?.lat() ?? null,
              lng: place.location?.lng() ?? null,
            });
          } catch (err) {
            console.error("Failed to resolve selected place", err);
          }
        });

        containerRef.current.replaceChildren(el);
        setReady(true);
        setLoading(false);
        // Swapping DOM nodes drops focus — hand it back so the keystroke
        // that triggered the load isn't lost on the user.
        el.focus();
      })
      .catch((err) => {
        console.error("Failed to load Google Places", err);
        setLoading(false);
      });
  }

  return (
    <>
      <input
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onFocus={handleFocus}
        onChange={(e) => onChange(e.target.value)}
        style={ready ? { display: "none" } : undefined}
      />
      {/* The Google element renders its own boxed input internally, so the
          wrapper here only needs to control layout width, not repeat the
          border/padding classes used for the plain-input state above. */}
      <div ref={containerRef} className="w-full" style={ready ? undefined : { display: "none" }} />
    </>
  );
}
