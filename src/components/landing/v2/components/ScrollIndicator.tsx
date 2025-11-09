"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ScrollIndicatorProps {
  targetId?: string;
}

export function ScrollIndicator({
  targetId = "como-funciona",
}: ScrollIndicatorProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      trackEvent({
        action: "click",
        category: "navigation",
        label: "scroll_indicator",
        section: "hero",
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-2"
      aria-label="Rolar para baixo"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <span className="text-xs font-medium">Rolar</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </motion.button>
  );
}
