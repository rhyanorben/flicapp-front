"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackCTAClick, trackWhatsAppClick } from "@/lib/analytics";
import Link from "next/link";
import copyData from "../data/copy.json";

const WHATSAPP_NUMBER = "5511999999999"; // Placeholder
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function CTAFinal() {
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const triggerConfetti = async () => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;
    const canvas = confettiRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#25D366", "#128C7E", "#075E54"],
    });
  };

  const handlePrimaryClick = () => {
    triggerConfetti();
    trackCTAClick("final", "primary");
  };

  const handleSecondaryClick = () => {
    trackWhatsAppClick("final_cta");
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-32 grain-overlay">
      <canvas ref={confettiRef} className="pointer-events-none fixed inset-0 z-50" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {copyData.ctaFinal.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {copyData.ctaFinal.subheadline}
          </p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Button
              size="lg"
              asChild
              onClick={handlePrimaryClick}
              className="min-w-[200px] text-lg h-12"
            >
              <Link href="/register">{copyData.ctaFinal.ctaPrimary}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleSecondaryClick}
              className="min-w-[200px] text-lg h-12"
            >
              {copyData.ctaFinal.ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

