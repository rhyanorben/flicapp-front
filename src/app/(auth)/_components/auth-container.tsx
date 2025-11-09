"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "../login/_components/login-form";
import { RegisterForm } from "../register/_components/register-form";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

interface AuthContainerProps {
  defaultTab?: "login" | "register";
}

export function AuthContainer({ defaultTab = "login" }: AuthContainerProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const shouldReduceMotion = useReducedMotion();

  // Refs para animações GSAP
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loginContentRef = useRef<HTMLDivElement>(null);
  const registerContentRef = useRef<HTMLDivElement>(null);

  // Sincronizar tab com a rota atual
  useEffect(() => {
    if (pathname === "/register") {
      setActiveTab("register");
    } else if (pathname === "/login") {
      setActiveTab("login");
    }
  }, [pathname]);

  // Animações de entrada com GSAP
  useEffect(() => {
    if (shouldReduceMotion) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Logo e branding
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0, y: -20, scale: 0.9 });
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
      });
    }

    // Card de autenticação
    if (cardRef.current) {
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
      });
      tl.to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
        },
        "-=0.3"
      );
    }

    // Tabs com stagger
    if (tabsRef.current) {
      const tabs = tabsRef.current.querySelectorAll('[role="tab"]');
      gsap.set(tabs, { opacity: 0, y: 10 });
      tl.to(
        tabs,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
        },
        "-=0.4"
      );
    }

    return () => {
      tl.kill();
    };
  }, [shouldReduceMotion]);

  // Animações de transição entre tabs com GSAP
  useEffect(() => {
    if (shouldReduceMotion) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const currentContent =
      activeTab === "login"
        ? loginContentRef.current
        : registerContentRef.current;
    const previousContent =
      activeTab === "login"
        ? registerContentRef.current
        : loginContentRef.current;

    if (!currentContent) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // Fade out do conteúdo anterior
    if (previousContent) {
      tl.to(previousContent, {
        opacity: 0,
        x: activeTab === "login" ? 20 : -20,
        duration: 0.3,
      });
    }

    // Fade in do conteúdo atual
    gsap.set(currentContent, {
      opacity: 0,
      x: activeTab === "login" ? -20 : 20,
    });
    tl.to(
      currentContent,
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
      },
      previousContent ? "-=0.1" : 0
    );

    return () => {
      tl.kill();
    };
  }, [activeTab, shouldReduceMotion]);

  const handleTabChange = (value: string) => {
    const newTab = value as "login" | "register";
    setActiveTab(newTab);

    // Atualizar a URL sem recarregar a página
    const newPath = newTab === "login" ? "/login" : "/register";
    if (pathname !== newPath && typeof window !== "undefined") {
      // Usar replaceState para atualizar URL sem recarregar
      // Isso evita que o Next.js faça uma navegação completa
      window.history.replaceState(
        { ...window.history.state, pathname: newPath },
        "",
        newPath
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4"
    >
      <div className="absolute top-4 right-4 z-10">
        <ToggleTheme />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div ref={logoRef} className="flex flex-col items-center space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo-flicapp-horizontal.png"
              alt="FlicApp Logo"
              width={180}
              height={42}
              priority
              className="h-auto w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Conecte-se aos melhores prestadores de serviço
          </p>
        </div>

        {/* Auth Card */}
        <Card ref={cardRef} className="shadow-xl border-2">
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div ref={tabsRef}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
              </div>

              <div className="relative min-h-[580px]">
                <TabsContent
                  value="login"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div ref={loginContentRef} className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
                      <p className="text-sm text-muted-foreground">
                        Entre com suas credenciais para acessar sua conta
                      </p>
                    </div>
                    <LoginForm />
                  </div>
                </TabsContent>

                <TabsContent
                  value="register"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div ref={registerContentRef} className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">Crie sua conta</h2>
                      <p className="text-sm text-muted-foreground">
                        Cadastre-se para começar a usar o FlicApp
                      </p>
                    </div>
                    <RegisterForm />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center text-xs text-muted-foreground px-4">
          <p>
            Ao continuar, você concorda com nossos{" "}
            <Link
              href="/termos"
              className="font-medium text-primary hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link
              href="/privacidade"
              className="font-medium text-primary hover:underline"
            >
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
