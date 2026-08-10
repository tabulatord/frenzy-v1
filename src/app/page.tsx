import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Tagline from "@/components/Tagline";
import RoadSection from "@/components/RoadSection";
import BattleSection from "@/components/BattleSection";
import CategoriesSection from "@/components/CategoriesSection";
import RegistrationSection from "@/components/RegistrationSection";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";
import ConsentBanner from "@/components/ConsentBanner";
import { isPreRegistrationClosed } from "@/lib/config";

// Revalidate periodically so the closed-registration state (driven by
// PREREG_CLOSE_DATE) flips on its own without waiting for a redeploy.
export const revalidate = 300;

export default function Home() {
  const closed = isPreRegistrationClosed();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Tagline />
        <RoadSection />
        <BattleSection />
        <CategoriesSection />
        <RegistrationSection isClosed={closed} />
      </main>
      <Footer />
      {!closed && <StickyMobileCta />}
      <ConsentBanner />
    </>
  );
}
