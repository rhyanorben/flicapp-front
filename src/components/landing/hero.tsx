"use client"

import React from "react"
import { LoginForm } from "../login/login-form"

export default function Hero() {
  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Resolva seus problemas do dia a dia com um clique.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Conectamos você aos melhores prestadores de serviço da sua região de forma rápida, segura e com a ajuda de Inteligência Artificial.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


