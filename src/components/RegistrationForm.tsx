"use client";

import { FormEvent, useEffect, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import {
  DISCIPLINES,
  GENDERS,
  RATINGS,
  RegistrationPayload,
  validateRegistration,
} from "@/lib/registration";
import { captureUtmParams } from "@/lib/utm";
import { track } from "@/lib/analytics";

const EMPTY: RegistrationPayload = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  country_code: "",
  country_name: "",
  region: "",
  city: "",
  postal_code: "",
  rating: "",
  disciplines: [],
  usual_pickleball_location: "",
  location_not_listed: false,
  consent_terms: false,
  consent_marketing: false,
  website: "",
};

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border-2 bg-white px-4 py-3 text-base outline-none transition focus:border-black ${
    hasError ? "border-red-500" : "border-black/15"
  }`;
}

export default function RegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [data, setData] = useState<RegistrationPayload>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [isEligibleFor45, setIsEligibleFor45] = useState(false);

  useEffect(() => {
    // One-time sync from the URL / sessionStorage on mount — not
    // derivable from props/state, so an effect is the right tool here.
    const utm = captureUtmParams();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData((d) => ({ ...d, ...utm }));
  }, []);

  const visibleDisciplines = DISCIPLINES.filter(
    (d) => d.value !== "45plus_mixed_doubles" || isEligibleFor45
  );

  function update<K extends keyof RegistrationPayload>(key: K, value: RegistrationPayload[K]) {
    if (!started) {
      setStarted(true);
      track("form_start");
    }
    if (key === "date_of_birth") {
      const dob = new Date(value as string);
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      setIsEligibleFor45(age >= 45);
    }
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggleDiscipline(value: string) {
    if (!started) {
      setStarted(true);
      track("form_start");
    }
    setData((d) => {
      const has = d.disciplines.includes(value);
      return {
        ...d,
        disciplines: has ? d.disciplines.filter((v) => v !== value) : [...d.disciplines, value],
      };
    });
  }

  function handleCountryChange(code: string) {
    const country = COUNTRIES.find((c) => c.code === code);
    setData((d) => ({ ...d, country_code: code, country_name: country?.name ?? "" }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const result = validateRegistration(data);
    if (!result.valid) {
      setErrors(result.errors);
      const firstError = document.getElementById(`field-${Object.keys(result.errors)[0]}`);
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ email: "This email is already pre-registered." });
        } else if (body?.errors) {
          setErrors(body.errors);
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
        return;
      }

      track("pre_register_success");
      onSuccess();
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-black/50">
          Personal
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div id="field-first_name">
            <input
              className={inputClass(!!errors.first_name)}
              placeholder="First name"
              value={data.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
            {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
          </div>
          <div id="field-last_name">
            <input
              className={inputClass(!!errors.last_name)}
              placeholder="Last name"
              value={data.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
            {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>}
          </div>
        </div>

        <div id="field-email">
          <input
            className={inputClass(!!errors.email)}
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div id="field-phone">
          <input
            className={inputClass(!!errors.phone)}
            type="tel"
            placeholder="Phone / WhatsApp"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div id="field-date_of_birth">
            <label className="mb-1 block text-xs font-semibold text-black/50">Date of birth</label>
            <input
              className={inputClass(!!errors.date_of_birth)}
              type="date"
              value={data.date_of_birth}
              onChange={(e) => update("date_of_birth", e.target.value)}
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-xs text-red-600">{errors.date_of_birth}</p>
            )}
          </div>
          <div id="field-gender">
            <label className="mb-1 block text-xs font-semibold text-black/50">Gender</label>
            <select
              className={inputClass(!!errors.gender)}
              value={data.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-black/50">
          Location
        </legend>
        <div id="field-country_code">
          <select
            className={inputClass(!!errors.country_code)}
            value={data.country_code}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="">Country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country_code && (
            <p className="mt-1 text-xs text-red-600">{errors.country_code}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className={inputClass(false)}
            placeholder="Region / State (optional)"
            value={data.region}
            onChange={(e) => update("region", e.target.value)}
          />
          <div id="field-city">
            <input
              className={inputClass(!!errors.city)}
              placeholder="City"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
            />
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
          </div>
        </div>

        <input
          className={inputClass(false)}
          placeholder="Postal code (optional)"
          value={data.postal_code}
          onChange={(e) => update("postal_code", e.target.value)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-black/50">
          Pickleball
        </legend>

        <div id="field-rating">
          <label className="mb-1 block text-xs font-semibold text-black/50">Level</label>
          <select
            className={inputClass(!!errors.rating)}
            value={data.rating}
            onChange={(e) => update("rating", e.target.value)}
          >
            <option value="">Select your level</option>
            {RATINGS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
        </div>

        <div id="field-disciplines">
          <label className="mb-2 block text-xs font-semibold text-black/50">
            Disciplines (select all that apply)
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {visibleDisciplines.map((d) => (
              <label
                key={d.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-black/15 px-4 py-3 has-[:checked]:border-black has-[:checked]:bg-accent/20"
              >
                <input
                  type="checkbox"
                  checked={data.disciplines.includes(d.value)}
                  onChange={() => toggleDiscipline(d.value)}
                  className="h-4 w-4 accent-black"
                />
                <span className="text-sm font-semibold">{d.label}</span>
              </label>
            ))}
          </div>
          {errors.disciplines && (
            <p className="mt-1 text-xs text-red-600">{errors.disciplines}</p>
          )}
        </div>

        <div id="field-usual_pickleball_location">
          <input
            className={inputClass(!!errors.usual_pickleball_location)}
            placeholder="Where do you usually play pickleball?"
            value={data.usual_pickleball_location}
            disabled={data.location_not_listed}
            onChange={(e) => update("usual_pickleball_location", e.target.value)}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-black/70">
            <input
              type="checkbox"
              checked={data.location_not_listed}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  location_not_listed: e.target.checked,
                  usual_pickleball_location: e.target.checked ? "" : d.usual_pickleball_location,
                }))
              }
              className="h-4 w-4 accent-black"
            />
            My location isn&rsquo;t listed
          </label>
          {errors.usual_pickleball_location && (
            <p className="mt-1 text-xs text-red-600">{errors.usual_pickleball_location}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <div id="field-consent_terms">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={data.consent_terms}
              onChange={(e) => update("consent_terms", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-black"
            />
            <span>
              I accept the{" "}
              <a href="/terms" target="_blank" className="underline">
                pre-registration terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="underline">
                privacy policy
              </a>
              . *
            </span>
          </label>
          {errors.consent_terms && (
            <p className="mt-1 text-xs text-red-600">{errors.consent_terms}</p>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm text-black/70">
          <input
            type="checkbox"
            checked={data.consent_marketing}
            onChange={(e) => update("consent_marketing", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-black"
          />
          <span>Keep me updated on FRENZY news, dates, and announcements.</span>
        </label>
      </fieldset>

      {submitError && <p className="text-sm font-semibold text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-black py-4 text-base font-extrabold text-accent transition disabled:opacity-50 sm:text-lg"
      >
        {submitting ? "Submitting…" : "PRE-REGISTER FREE"}
      </button>
    </form>
  );
}
