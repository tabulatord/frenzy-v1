import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Pre-Registration Terms — FRENZY" };

export default function TermsPage() {
  return (
    <LegalLayout title="Pre-Registration Terms" updated="August 2026">
      <p>
        These terms govern your free pre-registration for FRENZY, the Road to Paris 2027
        amateur pickleball competition. By submitting the pre-registration form, you agree
        to the terms below.
      </p>

      <section>
        <h2 className="text-base font-bold text-black">1. What pre-registration is</h2>
        <p className="mt-2">
          Pre-registration is free and does not require any payment, account creation, or
          purchase. It expresses your interest in participating in FRENZY and reserves no
          spot, ranking, or guarantee of entry into any future stage of the competition.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">2. Eligibility</h2>
        <p className="mt-2">
          Pre-registration is open globally. If you are under the age of majority in your
          country of residence, you confirm that a parent or legal guardian has reviewed
          and agreed to these terms on your behalf.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">3. No payment, no wallet, no purchase</h2>
        <p className="mt-2">
          FRENZY pre-registration never asks for payment information, a crypto wallet
          connection, or any form of purchase. Any message asking you to pay to
          pre-register is not from FRENZY.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">4. What happens next</h2>
        <p className="mt-2">
          After pre-registering, you may receive email updates about the Road to Paris
          2027 competition, including future registration, qualification, and event
          details, if you opted in to marketing communications. Further participation
          requirements will be announced as the competition structure is finalized.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">5. Changes</h2>
        <p className="mt-2">
          FRENZY may update the competition format, categories, timeline, or these terms
          as the Road to Paris 2027 is built out. We will communicate material changes to
          pre-registered players where reasonably possible.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">6. Data</h2>
        <p className="mt-2">
          Information you submit is handled according to our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">7. Contact</h2>
        <p className="mt-2">
          Questions about these terms? Email{" "}
          <a href="mailto:hello@frenzy.gg" className="underline">
            hello@frenzy.gg
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
