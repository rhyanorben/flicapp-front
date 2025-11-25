"use client";

import React from "react";
import { StepContent } from "../types";

interface StepSectionProps {
  step: StepContent;
  isActive: boolean;
  isVisible?: boolean;
}

export const StepSection = React.memo(
  ({ step, isActive }: StepSectionProps) => {
    const Icon = step.icon;
    const alignment =
      step.alignment === "right"
        ? {
            wrapper: "justify-end",
            text: "text-right",
            iconFloat: "md:ml-auto",
          }
        : {
            wrapper: "justify-start",
            text: "",
            iconFloat: "",
          };

    return (
      <section
        ref={step.ref}
        id={step.anchorId}
        className="relative min-h-[80vh] md:h-[200vh] flex items-center py-12 md:py-16 pointer-events-auto md:pointer-events-none z-40 transition-colors text-slate-900 dark:text-white"
      >
        <div
          className={`w-full px-4 sm:px-6 md:px-16 flex ${alignment.wrapper}`}
        >
          <div
            className={`w-full max-w-2xl mx-auto md:mx-0 md:w-[35%] ${
              alignment.text
            } transition-all duration-700 transform ${
              isActive
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-100 md:opacity-80 translate-x-0 scale-100"
            }`}
          >
            <div className="md:sticky md:top-1/2 md:-translate-y-1/2 space-y-4 md:space-y-6">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg border ${step.iconContainerClass} ${alignment.iconFloat}`}
              >
                <Icon size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h2 className="text-2xl md:text-5xl font-bold text-[#0b1c39] dark:text-white mb-3 md:mb-6">
                  {step.title}
                </h2>
                <p className="text-base md:text-xl text-slate-600 dark:text-slate-200 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

StepSection.displayName = "StepSection";
