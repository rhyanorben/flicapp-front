"use client";

import { useEffect } from "react";
import { Hero } from "../components/landing/v2/components/Hero";
import { PinnedPanels } from "../components/landing/v2/components/PinnedPanels";
import { ValueProps } from "../components/landing/v2/components/ValueProps";
import { StickyStepper } from "../components/landing/v2/components/StickyStepper";
import { Trust } from "../components/landing/v2/components/Trust";
import { Testimonials } from "../components/landing/v2/components/Testimonials";
import { Pricing } from "../components/landing/v2/components/Pricing";
import { CTAFinal } from "../components/landing/v2/components/CTAFinal";
import { FAQ } from "../components/landing/v2/components/FAQ";
import { ProgressBar } from "../components/landing/v2/components/ProgressBar";
import { WhatsAppFloat } from "../components/landing/v2/components/WhatsAppFloat";
import { trackPageView } from "@/lib/analytics";
import { Footer } from "../components/landing/v2/components/Footer";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export default function Home() {
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
      <div className="fixed top-4 right-4 z-50">
        <ToggleTheme />
      </div>
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
