"use client";

import { useEffect } from "react";
import { Hero } from "./(marketing)/landing-v2/components/Hero";
import { PinnedPanels } from "./(marketing)/landing-v2/components/PinnedPanels";
import { ValueProps } from "./(marketing)/landing-v2/components/ValueProps";
import { StickyStepper } from "./(marketing)/landing-v2/components/StickyStepper";
import { Trust } from "./(marketing)/landing-v2/components/Trust";
import { Testimonials } from "./(marketing)/landing-v2/components/Testimonials";
import { Pricing } from "./(marketing)/landing-v2/components/Pricing";
import { CTAFinal } from "./(marketing)/landing-v2/components/CTAFinal";
import { FAQ } from "./(marketing)/landing-v2/components/FAQ";
import { ProgressBar } from "./(marketing)/landing-v2/components/ProgressBar";
import { WhatsAppFloat } from "./(marketing)/landing-v2/components/WhatsAppFloat";
import { trackPageView } from "@/lib/analytics";
import { Footer } from "./(marketing)/landing-v2/components/Footer";

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
