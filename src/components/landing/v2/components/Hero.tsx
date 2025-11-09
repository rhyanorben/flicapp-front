"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollIndicator } from "./ScrollIndicator";
import { trackCTAClick } from "@/lib/analytics";
import Link from "next/link";
import Image from "next/image";
import copyData from "../data/copy.json";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleCTAClick = (type: "primary" | "secondary") => {
    trackCTAClick("hero", type);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
        {/* Hero background image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/landing-v2/images/backgrounds/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            id="main-heading"
          >
            {copyData.hero.h1}
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {copyData.hero.subheadline}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              size="lg"
              asChild
              onClick={() => handleCTAClick("primary")}
              className="min-w-[200px]"
            >
              <Link href="/register">{copyData.hero.ctaPrimary}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                handleCTAClick("secondary");
                const element = document.getElementById("como-funciona");
                element?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="min-w-[200px]"
            >
              {copyData.hero.ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator targetId="como-funciona" />
    </section>
  );
}
