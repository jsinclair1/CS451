import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";

export default function LandingPage({ onNavigate }) {
  return (
    <div className="app-shell">
      <LandingNavbar onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
    </div>
  );
}