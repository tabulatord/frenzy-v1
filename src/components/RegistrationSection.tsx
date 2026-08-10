"use client";

import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import SuccessScreen from "./SuccessScreen";
import PlayerCounter from "./PlayerCounter";
import { CLOSED_MESSAGE } from "@/lib/config";

export default function RegistrationSection({ isClosed }: { isClosed: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="register" className="scroll-mt-20 px-5 py-16">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Pre-register free
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-black/50">
          Free &bull; No payment required
        </p>

        <div className="mt-8">
          {isClosed ? (
            <div className="rounded-3xl border-2 border-black bg-black/[0.03] p-8 text-center">
              <p className="text-lg font-bold leading-snug">{CLOSED_MESSAGE}</p>
            </div>
          ) : submitted ? (
            <SuccessScreen />
          ) : (
            <RegistrationForm onSuccess={() => setSubmitted(true)} />
          )}
        </div>

        <div className="mt-8">
          <PlayerCounter />
        </div>
      </div>
    </section>
  );
}
