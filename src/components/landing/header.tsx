"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/flicapp_logo.png"
            alt="Logo FlicAPP"
            width={28}
            height={28}
            className="rounded"
            priority
          />
          <a href="/" className="text-lg font-semibold">FlicApp</a>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="hover:text-primary">Como Funciona</a>
          <a href="#contato" className="hover:text-primary">Contato</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline">Entrar</Button>
          <Button>Cadastre-se</Button>
        </div>
      </div>
    </header>
  )
}


