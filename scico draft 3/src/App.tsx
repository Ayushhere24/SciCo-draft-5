import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/AboutSection";
import ExplorationsSection from "./components/sections/ExplorationsSection";
import TalksSection from "./components/sections/TalksSection";
import CollaborationSection from "./components/sections/CollaborationSection";
import { useEffect, useState } from "react";
import BallBounceIntro from "./components/intro/BallBounceIntro";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Safety timeout in case onComplete isn't called (e.g., reduced motion)
    const t = window.setTimeout(() => {
      setShowIntro(false);
      setIntroComplete(true);
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Small delay to ensure smooth transition
    setTimeout(() => setIntroComplete(true), 100);
  };

  return (
    <>
      {showIntro && <BallBounceIntro onComplete={handleIntroComplete} />}
      <Navbar />
      <div className="app-shell" aria-hidden={showIntro}>
        <HomeSection video="/videos/DNA.mp4" introComplete={introComplete} />
        <AboutSection />
        <ExplorationsSection />
        <TalksSection />
        <CollaborationSection />
      </div>
    </>
  );
}
