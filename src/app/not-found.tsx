"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Background gradient similar to Hero */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated 404 number */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            <h1 className="text-8xl font-bold tracking-tight sm:text-9xl md:text-[12rem] bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <AlertCircle className="h-16 w-16 text-muted-foreground/50" />
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Página não encontrada
          </motion.h2>

          {/* Description */}
          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Oops! A página que você está procurando não existe ou foi movida.
            Que tal voltar para a página inicial?
          </motion.p>

          {/* Action buttons with stagger animation */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button size="lg" asChild className="min-w-[200px]">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Voltar ao início
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[200px]"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Ir para Dashboard
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
