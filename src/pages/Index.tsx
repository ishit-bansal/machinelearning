import { Hero } from "@/components/Hero";
import { WhatIsML } from "@/components/WhatIsML";
import { MagicOfPatterns } from "@/components/MagicOfPatterns";
import { DigitRecognizer } from "@/components/DigitRecognizer";
import { RealWorld } from "@/components/RealWorld";
import { MLMistakes } from "@/components/MLMistakes";
import { HumansAndMachines } from "@/components/HumansAndMachines";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Easter egg: typing "learn" triggers neural animation
    let typedKeys = "";
    const handleKeyPress = (e: KeyboardEvent) => {
      typedKeys += e.key.toLowerCase();
      if (typedKeys.includes("learn")) {
        document.body.classList.add("neural-burst");
        setTimeout(() => {
          document.body.classList.remove("neural-burst");
          typedKeys = "";
        }, 3000);
      }
      if (typedKeys.length > 10) {
        typedKeys = typedKeys.slice(-10);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  return (
    <div className="relative overflow-hidden">
        <Hero />
        <WhatIsML />
        <MagicOfPatterns />
        <DigitRecognizer />
        <RealWorld />
        <MLMistakes />
      <HumansAndMachines />
    </div>
  );
};

export default Index;
