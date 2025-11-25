"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegister } from "@/lib/queries/auth";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Lottie from "lottie-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(5, { message: "O nome deve ter pelo menos 5 caracteres" }),
    email: z.email({ message: "Email inválido" }),
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

type SignupFormValues = z.infer<typeof registerSchema>;

// Função para traduzir mensagens de erro para português
function translateErrorMessage(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Mapeamento de mensagens comuns do better-auth
  const translations: Record<string, string> = {
    "invalid password": "Senha inválida",
    "invalid email or password": "Email ou senha inválidos",
    "invalid credentials": "Credenciais inválidas",
    "incorrect password": "Senha incorreta",
    "wrong password": "Senha incorreta",
    "user not found": "Usuário não encontrado",
    "email not found": "Email não encontrado",
    "invalid email": "Email inválido",
    "email already exists": "Este email já está em uso",
    "email already registered": "Este email já está cadastrado",
    "this email is already in use": "Este email já está em uso",
    "user already exists": "Usuário já existe",
  };

  // Verifica se há uma tradução exata
  for (const [key, value] of Object.entries(translations)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  // Se não encontrar tradução, retorna a mensagem original
  return message;
}

// Simple loading animation data (fallback if Lottie file not available)
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

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // GSAP stagger animation para campos
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

  // Confetti no sucesso
  useEffect(() => {
    if (registerMutation.isSuccess && !shouldReduceMotion) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!prefersReducedMotion) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [registerMutation.isSuccess, shouldReduceMotion]);

  // Tratamento de erros da mutation
  useEffect(() => {
    if (registerMutation.error) {
      const rawErrorMessage =
        registerMutation.error.message || "Erro ao cadastrar";
      const errorMessage = translateErrorMessage(rawErrorMessage);
      const lowerMessage = errorMessage.toLowerCase();

      // Limpa erros anteriores
      form.clearErrors();

      // Tenta identificar qual campo está com erro baseado na mensagem
      // Erros de email duplicado
      if (
        lowerMessage.includes("já está em uso") ||
        lowerMessage.includes("já existe") ||
        lowerMessage.includes("already exists") ||
        lowerMessage.includes("email já") ||
        (lowerMessage.includes("email") &&
          (lowerMessage.includes("cadastrado") ||
            lowerMessage.includes("registrado")))
      ) {
        form.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }
      // Erros de senha
      else if (
        lowerMessage.includes("senha") ||
        lowerMessage.includes("password") ||
        lowerMessage.includes("confirmação")
      ) {
        form.setError("password", {
          type: "manual",
          message: errorMessage,
        });
      }
      // Erros de nome
      else if (lowerMessage.includes("nome") || lowerMessage.includes("name")) {
        form.setError("name", {
          type: "manual",
          message: errorMessage,
        });
      }
      // Erros genéricos - mostra no campo de email por padrão
      else {
        form.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  }, [registerMutation.error, form]);

  function onSubmit(formData: SignupFormValues) {
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            const hasError = !!form.formState.errors.name;
            return (
              <motion.div
                data-field
                animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
                        placeholder="Seu nome completo"
                        {...field}
                        disabled={registerMutation.isPending}
                        className={cn(
                          hasError
                            ? "border-destructive"
                            : "border-blue-100 dark:border-white/15 bg-white/70 dark:bg-white/5 focus-visible:border-[#1d4ed8] focus-visible:ring-[#1d4ed8] dark:focus-visible:border-white"
                        )}
                      />
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
          name="email"
          render={({ field }) => {
            const hasError = !!form.formState.errors.email;
            return (
              <motion.div
                data-field
                animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                        placeholder="seu@email.com"
                        type="email"
                        {...field}
                        disabled={registerMutation.isPending}
                        className={cn(
                          hasError
                            ? "border-destructive"
                            : "border-blue-100 dark:border-white/15 bg-white/70 dark:bg-white/5 focus-visible:border-[#1d4ed8] focus-visible:ring-[#1d4ed8] dark:focus-visible:border-white"
                        )}
                      />
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
                  <FormLabel>Senha</FormLabel>
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
                        maxLength={20}
                        disabled={registerMutation.isPending}
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
                        disabled={registerMutation.isPending}
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
                        <span className="sr-only">
                          {showPassword ? "Esconder senha" : "Mostrar senha"}
                        </span>
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
                  <FormLabel>Confirmar Senha</FormLabel>
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
                        maxLength={20}
                        disabled={registerMutation.isPending}
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
                        disabled={registerMutation.isPending}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={
                              showConfirmPassword
                                ? "eye-off-confirm"
                                : "eye-confirm"
                            }
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
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Esconder senha"
                            : "Mostrar senha"}
                        </span>
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
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
                  Cadastrando...
                </div>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div data-field className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </motion.div>

        <motion.div data-field>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-white text-[#3c4043] border border-gray-300 hover:bg-gray-100 hover:text-[#3c4043]"
              onClick={async () => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.18A80,80,0,1,0,207.6,136H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Z"></path>
              </svg>
              Entrar com Google
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}
