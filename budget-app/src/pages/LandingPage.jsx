import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage({ onNavigate }) {
  return (
    <div className="app-shell">
      <LandingNavbar onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <CTASection onNavigate={onNavigate} />
      <LandingFooter />
    </div>
  );
}