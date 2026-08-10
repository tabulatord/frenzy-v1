"use client";

import { useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  getConsentState,
  setConsentState,
  subscribeToConsent,
} from "@/lib/analytics";

export default function ConsentBanner() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentState,
    getConsentServerSnapshot
  );
  const visible = consent === null;

  if (!visible) return null;

  function handle(choice: "accepted" | "declined") {
    setConsentState(choice);
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 border-t border-black/10 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:bottom-0">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-xs text-black/70 sm:text-left">
          We use cookies to understand traffic and improve FRENZY. Read our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => handle("declined")}
            className="rounded-full border border-black/20 px-4 py-2 text-xs font-bold"
          >
            Decline
          </button>
          <button
            onClick={() => handle("accepted")}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold text-accent"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
