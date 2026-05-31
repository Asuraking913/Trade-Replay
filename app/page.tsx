import LandingHero from "@/components/Landing";
import LandingFeature from "@/components/Landing/Feature";
import LandingFeatures from "@/components/Landing/Features";
import LandingHowItWorks from "@/components/Landing/HowItWorks";
import LandingFAQ from "@/components/Landing/FAQ";
import LandingFooter from "@/components/Landing/Footer";

export default function Home() {
  return (
    <>
      <LandingHero />
      <LandingFeature />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingFAQ />
      <LandingFooter />
    </>
  );
}
