"use client";

import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import faqData from "../data/faq.json";
import { trackFAQOpen } from "@/lib/analytics";
import { useState } from "react";

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
      trackFAQOpen(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="relative bg-background py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tire suas dúvidas sobre a FlicAPP
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openItems.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => handleToggle(item.id)}
                >
                  <CollapsibleTrigger
                    className="flex w-full items-center justify-between rounded-lg border bg-card px-6 py-4 text-left hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span className="font-semibold">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    id={`faq-answer-${item.id}`}
                    className="px-6 py-4 text-muted-foreground"
                  >
                    {item.answer}
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
