"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import stepsData from "../data/steps.json";
import Image from "next/image";
import { trackStepView } from "@/lib/analytics";

interface StepMockupProps {
  step: (typeof stepsData)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  totalSteps: number;
}

function StepMockup({
  step,
  index,
  scrollYProgress,
  totalSteps,
}: StepMockupProps) {
  // Improved ranges with plateau for better visibility
  // Each step gets more space: fade in, stay visible, fade out
  const fadeInStart = (index - 0.3) / totalSteps;
  const fadeInEnd = (index - 0.1) / totalSteps;
  const fadeOutStart = (index + 0.9) / totalSteps;
  const fadeOutEnd = (index + 1.1) / totalSteps;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0.95, 1, 1, 0.95]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale }}
    >
      <Card className="w-full max-w-md overflow-hidden">
        <div className="relative aspect-[9/16] w-full bg-muted">
          <Image
            src={step.mockup}
            alt={step.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      </Card>
    </motion.div>
  );
}

export function StickyStepper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = Math.min(
        Math.floor(latest * stepsData.length),
        stepsData.length - 1
      );
      if (step !== activeStep) {
        setActiveStep(step);
        trackStepView(step + 1);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, activeStep]);

  return (
    <section
      ref={containerRef}
      className="relative bg-background py-20"
      id="como-funciona"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona em 4 passos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simples, rápido e seguro
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Sticky stepper */}
          <div
            className="lg:sticky lg:top-24 lg:h-[calc(100vh-12rem)] max-lg:mb-8"
            aria-label="Passos do processo"
          >
            <div className="space-y-8">
              {stepsData.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                          index <= activeStep
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                        }`}
                      >
                        {index < activeStep ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <span className="text-lg font-semibold">
                            {step.number}
                          </span>
                        )}
                      </div>
                      {index < stepsData.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 transition-colors ${
                            index < activeStep
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3
                        className={`text-xl font-semibold transition-colors ${
                          index <= activeStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Mockup images */}
          <div
            className="relative max-lg:hidden"
            style={{ height: `${stepsData.length * 100}vh` }}
          >
            <div className="sticky top-24 h-[80vh]">
              {stepsData.map((step, index) => (
                <StepMockup
                  key={step.id}
                  step={step}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  totalSteps={stepsData.length}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Show first mockup only */}
          <div className="lg:hidden mt-8">
            <Card className="w-full max-w-md mx-auto overflow-hidden">
              <div className="relative aspect-[9/16] w-full bg-muted">
                <Image
                  src={stepsData[activeStep]?.mockup || stepsData[0].mockup}
                  alt={stepsData[activeStep]?.title || stepsData[0].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
