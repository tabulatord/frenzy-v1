export const RATINGS = ["No Rating", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0+"] as const;
export type Rating = (typeof RATINGS)[number];

export const DISCIPLINES = [
  { value: "mens_singles", label: "Men's Singles" },
  { value: "womens_singles", label: "Women's Singles" },
  { value: "mens_doubles", label: "Men's Doubles" },
  { value: "womens_doubles", label: "Women's Doubles" },
  { value: "mixed_doubles", label: "Mixed Doubles" },
  { value: "45plus_mixed_doubles", label: "45+ Mixed Doubles" },
] as const;
export type DisciplineValue = (typeof DISCIPLINES)[number]["value"];

export const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;

export const MINOR_AGE_CUTOFF = 18;

export type RegistrationPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string; // ISO yyyy-mm-dd
  gender: string;
  country_code: string;
  country_name: string;
  region: string;
  city: string;
  postal_code: string;
  rating: string;
  disciplines: string[];
  usual_pickleball_location: string;
  usual_pickleball_lat: number | null;
  usual_pickleball_lng: number | null;
  location_not_listed: boolean;
  consent_terms: boolean;
  consent_marketing: boolean;
  guardian_email: string;
  guardian_consent: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // Honeypot: must arrive empty. Named to look like a normal optional field.
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose E.164-ish check: a leading "+", a country code, then the rest of
// the number — deliberately not a strict per-country validator.
const PHONE_RE = /^\+[1-9]\d{6,14}$/;

export function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  return (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

export function isMinor(dateOfBirth: string): boolean {
  if (!dateOfBirth) return false;
  const age = computeAge(dateOfBirth);
  return !Number.isNaN(age) && age < MINOR_AGE_CUTOFF;
}

export type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> };

export function validateRegistration(data: RegistrationPayload): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.first_name?.trim()) errors.first_name = "First name is required.";
  if (!data.last_name?.trim()) errors.last_name = "Last name is required.";
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim())) {
    errors.email = "A valid email is required.";
  }
  if (!data.phone?.trim() || !PHONE_RE.test(data.phone.trim().replace(/[\s()-]/g, ""))) {
    errors.phone = "Enter a valid phone number with country code (e.g. +1 555 123 4567).";
  }

  let age: number | null = null;
  if (!data.date_of_birth) {
    errors.date_of_birth = "Date of birth is required.";
  } else {
    const dob = new Date(data.date_of_birth);
    age = computeAge(data.date_of_birth);
    if (Number.isNaN(dob.getTime()) || age < 5 || age > 100) {
      errors.date_of_birth = "Enter a valid date of birth.";
    }
  }

  if (!data.gender?.trim()) errors.gender = "Please select a gender.";
  if (!data.country_code?.trim()) errors.country_code = "Please select a country.";
  if (!data.country_name?.trim()) errors.country_code = "Please select a country.";
  if (!data.city?.trim()) errors.city = "City is required.";
  if (!data.region?.trim()) errors.region = "State / region is required.";
  if (!data.postal_code?.trim()) errors.postal_code = "Postal code is required.";

  if (!RATINGS.includes(data.rating as Rating)) errors.rating = "Please select your level.";

  if (!Array.isArray(data.disciplines) || data.disciplines.length === 0) {
    errors.disciplines = "Select at least one discipline.";
  } else {
    const valid = new Set(DISCIPLINES.map((d) => d.value));
    if (data.disciplines.some((d) => !valid.has(d as DisciplineValue))) {
      errors.disciplines = "Invalid discipline selected.";
    }
  }

  if (!data.location_not_listed && !data.usual_pickleball_location?.trim()) {
    errors.usual_pickleball_location =
      "Enter your usual pickleball location, or check \"My location isn't listed\".";
  }

  if (!data.consent_terms) {
    errors.consent_terms = "You must accept the pre-registration terms to continue.";
  }

  if (age !== null && !Number.isNaN(age) && age < MINOR_AGE_CUTOFF) {
    if (!data.guardian_email?.trim() || !EMAIL_RE.test(data.guardian_email.trim())) {
      errors.guardian_email = "A valid parent/guardian email is required for players under 18.";
    }
    if (!data.guardian_consent) {
      errors.guardian_consent = "Parent/guardian authorization is required for players under 18.";
    }
  }

  if (data.website && data.website.trim() !== "") {
    errors.website = "Spam detected.";
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true };
}
