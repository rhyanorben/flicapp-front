"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToggleTheme } from "../ui/toggle-theme";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <ToggleTheme />
        </div>

        <div className="flex items-center gap-2">
          <Image
            src="/flicapp_logo.png"
            alt="Logo FlicApp"
            width={28}
            height={28}
            className="rounded"
            priority
          />
          <Link href="/" className="text-lg font-semibold">
            FlicApp
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
