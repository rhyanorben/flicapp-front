"use client";

import { useEffect } from "react";
import { Hero } from "./components/Hero";
import { PinnedPanels } from "./components/PinnedPanels";
import { ValueProps } from "./components/ValueProps";
import { StickyStepper } from "./components/StickyStepper";
import { Trust } from "./components/Trust";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { CTAFinal } from "./components/CTAFinal";
import { FAQ } from "./components/FAQ";
import { ProgressBar } from "./components/ProgressBar";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { trackPageView } from "@/lib/analytics";
import { Footer } from "./components/Footer";

export default function LandingV2Page() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <main className="relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Pular para conteúdo principal
      </a>
      <ProgressBar />
      <div
        id="main-content"
        className="sr-only"
        aria-label="Conteúdo principal"
      />
      <Hero />
      <PinnedPanels />
      <ValueProps />
      <StickyStepper />
      <Trust />
      <Testimonials />
      <Pricing />
      <CTAFinal />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
