"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5511999999999"; // Placeholder - replace with actual number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppFloat() {
  const handleClick = () => {
    trackWhatsAppClick("float_button");
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 transition-colors"
      aria-label="Falar no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" />
    </motion.button>
  );
}

