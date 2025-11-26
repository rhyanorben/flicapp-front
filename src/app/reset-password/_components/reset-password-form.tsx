"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
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

const resetPasswordSchema = z
  .object({
    code: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "A confirmação de senha deve ter pelo menos 6 caracteres",
      })
      .max(20, {
        message: "A confirmação de senha deve ter no máximo 20 caracteres",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

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

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Validar token ou código na montagem
  useEffect(() => {
    async function validateToken() {
      if (token) {
        // Validar token
        try {
          const response = await fetch("/api/password-reset/validate-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();
          if (data.success) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          setIsValid(false);
        } finally {
          setIsValidating(false);
        }
      } else {
        // Se não tiver token, o usuário precisa inserir código
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

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

  async function onSubmit(formData: ResetPasswordFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/password-reset/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token || undefined,
          code: formData.code || undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        form.setError("password", {
          type: "manual",
          message: data.error || "Erro ao redefinir senha",
        });
        setIsLoading(false);
        return;
      }

      // Sucesso - redirecionar para login
      router.push("/login?passwordReset=true");
    } catch (error) {
      console.error("Error resetting password:", error);
      form.setError("password", {
        type: "manual",
        message: "Erro ao redefinir senha. Tente novamente.",
      });
      setIsLoading(false);
    }
  }

  if (isValidating) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Validando...</p>
      </div>
    );
  }

  if (token && !isValid) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">
          Token inválido ou expirado. Por favor, solicite um novo link de
          recuperação.
        </p>
        <Button onClick={() => router.push("/forgot-password")}>
          Solicitar novo link
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
          <h2 className="text-2xl font-bold">Redefinir Senha</h2>
          <p className="text-sm text-muted-foreground">
            {token
              ? "Digite sua nova senha"
              : "Digite o código recebido por email e sua nova senha"}
          </p>
        </div>

        {!token && (
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
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            const hasError = !!form.formState.errors.password;
            return (
              <motion.div
                data-field
                animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                        className={cn(
                          hasError
                            ? "border-destructive"
                            : "border-blue-100 dark:border-white/15 bg-white/70 dark:bg-white/5 focus-visible:border-[#1d4ed8] focus-visible:ring-[#1d4ed8] dark:focus-visible:border-white"
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showPassword ? "eye-off" : "eye"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </motion.div>
            );
          }}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => {
            const hasError = !!form.formState.errors.confirmPassword;
            return (
              <motion.div
                data-field
                animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Input
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                        className={cn(
                          hasError
                            ? "border-destructive"
                            : "border-blue-100 dark:border-white/15 bg-white/70 dark:bg-white/5 focus-visible:border-[#1d4ed8] focus-visible:ring-[#1d4ed8] dark:focus-visible:border-white"
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showConfirmPassword ? "eye-off" : "eye"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </Button>
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
                  Redefinindo...
                </div>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </motion.div>
        </motion.div>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={() => router.push("/login")}
            className="text-sm"
          >
            Voltar para login
          </Button>
        </div>
      </form>
    </Form>
  );
}
