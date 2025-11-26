"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import Lottie from "lottie-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, { message: "O código deve ter 6 dígitos" })
    .max(6, { message: "O código deve ter 6 dígitos" })
    .regex(/^\d+$/, { message: "O código deve conter apenas números" }),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

const loadingAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.833], y: [0.833] },
              o: { x: [0.167], y: [0.167] },
              t: 0,
              s: [0],
            },
            { t: 60, s: [360] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [40, 40] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse Path 1",
            },
            {
              ty: "st",
              c: { a: 0, k: [0.2, 0.4, 0.8, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2,
              ml: 4,
              bm: 0,
              nm: "Stroke 1",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 1",
          mn: "ADBE Vector Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const userId = searchParams.get("userId");

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  // GSAP animations
  useEffect(() => {
    if (shouldReduceMotion) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    if (formRef.current) {
      const fields = formRef.current.querySelectorAll("[data-field]");
      gsap.set(fields, { opacity: 0, y: 20 });
      gsap.to(fields, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, [shouldReduceMotion]);

  async function onSubmit(formData: VerifyEmailFormValues) {
    if (!userId) {
      form.setError("code", {
        type: "manual",
        message: "userId não encontrado na URL",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/email-verification/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: formData.code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        form.setError("code", {
          type: "manual",
          message: data.message || "Código inválido ou expirado",
        });
        setIsLoading(false);
        return;
      }

      // Redirecionar para login após verificação bem-sucedida
      router.push("/login?verified=true");
    } catch (error) {
      console.error("Error verifying email:", error);
      form.setError("code", {
        type: "manual",
        message: "Erro ao verificar código. Tente novamente.",
      });
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!userId) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch("/api/email-verification/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        form.setError("code", {
          type: "manual",
          message: data.error || "Erro ao reenviar código",
        });
      }
    } catch (error) {
      console.error("Error resending code:", error);
      form.setError("code", {
        type: "manual",
        message: "Erro ao reenviar código. Tente novamente.",
      });
    } finally {
      setIsResending(false);
    }
  }

  if (!userId) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">
          userId não encontrado. Por favor, acesse através do link enviado por
          email.
        </p>
        <Button onClick={() => router.push("/register")}>
          Voltar para registro
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold">Verificar Email</h2>
          <p className="text-sm text-muted-foreground">
            Digite o código de 6 dígitos enviado para seu email
          </p>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => {
            const hasError = !!form.formState.errors.code;
            return (
              <motion.div
                data-field
                animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <FormItem>
                  <FormLabel>Código de Verificação</FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Input
                        placeholder="000000"
                        maxLength={6}
                        {...field}
                        disabled={isLoading}
                        className={cn(
                          "text-center text-2xl tracking-widest",
                          hasError
                            ? "border-destructive"
                            : "border-blue-100 dark:border-white/15 bg-white/70 dark:bg-white/5 focus-visible:border-[#1d4ed8] focus-visible:ring-[#1d4ed8] dark:focus-visible:border-white"
                        )}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </motion.div>
            );
          }}
        />

        <motion.div data-field>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-[#1d4ed8] hover:bg-[#153a9c] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  {!shouldReduceMotion ? (
                    <div className="mr-2 h-4 w-4">
                      <Lottie
                        animationData={loadingAnimationData}
                        loop={true}
                        autoplay={true}
                        style={{ width: 16, height: 16 }}
                      />
                    </div>
                  ) : (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verificando...
                </div>
              ) : (
                "Verificar"
              )}
            </Button>
          </motion.div>
        </motion.div>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : resendSuccess ? (
              "Código reenviado com sucesso!"
            ) : (
              "Não recebeu o código? Reenviar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

