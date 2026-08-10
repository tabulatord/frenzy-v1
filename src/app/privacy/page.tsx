import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy — FPWC" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 2026">
      <p>
        This Privacy Policy explains what information FPWC (Frenzy Pickleball World
        Championship) collects during the global pre-registration period for the Road to
        Paris 2027 competition, and how that information is used.
      </p>

      <section>
        <h2 className="text-base font-bold text-black">1. Information we collect</h2>
        <p className="mt-2">
          When you pre-register, we collect: first and last name, email address, phone /
          WhatsApp number, date of birth, gender, country, region, city, postal code,
          pickleball rating, preferred disciplines, and your usual pickleball location.
          We also record whether you agreed to our pre-registration terms and whether you
          opted in to marketing communications.
        </p>
        <p className="mt-2">
          We automatically capture UTM parameters (source, medium, campaign, content,
          term) from the link you used to reach this page, so we can understand which
          channels are driving pre-registrations.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">2. How we use your information</h2>
        <p className="mt-2">
          We use this information to build the FPWC pre-registration list, plan the
          Road to Paris 2027 competition, and — if you opted in — send you updates about
          FPWC. We do not use this information for any automated decision-making that
          produces legal effects.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">3. Who can access your data</h2>
        <p className="mt-2">
          Your data is stored with our database provider and is only accessible to the
          FPWC team. We do not sell your personal information. We may share aggregated,
          non-identifying statistics (e.g. total pre-registrations by country) publicly
          or with partners.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">4. Cookies</h2>
        <p className="mt-2">
          We use a minimal set of cookies to remember your consent choice and to
          understand how visitors reach this page (UTM attribution). Non-essential
          cookies, including any future analytics or advertising pixels, only load after
          you accept them in the cookie banner.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">5. Your rights</h2>
        <p className="mt-2">
          You can ask us to access, correct, or delete your personal data at any time by
          contacting us at{" "}
          <a href="mailto:privacy@fpwc.gg" className="underline">
            privacy@fpwc.gg
          </a>
          . Depending on where you live, you may have additional rights under local data
          protection law (e.g. GDPR, CCPA).
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">6. Data retention</h2>
        <p className="mt-2">
          We retain pre-registration data for as long as needed to run the Road to Paris
          2027 pre-registration and the stages that follow, or until you ask us to delete
          it.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-black">7. Contact</h2>
        <p className="mt-2">
          Questions about this policy? Email{" "}
          <a href="mailto:privacy@fpwc.gg" className="underline">
            privacy@fpwc.gg
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
