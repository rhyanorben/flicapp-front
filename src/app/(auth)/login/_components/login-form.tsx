"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const emailFieldRef = useRef<HTMLDivElement>(null);
  const passwordFieldRef = useRef<HTMLDivElement>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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

  async function onSubmit(formData: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.replace("/dashboard");
          setIsLoading(false);
        },
        onError: (context: { error?: { message?: string } }) => {
          const rawErrorMessage = context?.error?.message || "Erro ao logar";
          const errorMessage = translateErrorMessage(rawErrorMessage);

          // Limpa erros anteriores
          form.clearErrors();

          // Tenta identificar se o erro é relacionado ao email ou senha
          const lowerMessage = errorMessage.toLowerCase();

          // PRIMEIRO: Verifica mensagens específicas de senha inválida (mais comum)
          if (
            lowerMessage.includes("invalid password") ||
            lowerMessage.includes("senha inválida") ||
            lowerMessage.includes("password inválido") ||
            lowerMessage.includes("senha incorreta") ||
            lowerMessage.includes("incorrect password") ||
            lowerMessage.includes("wrong password")
          ) {
            form.setError("password", {
              type: "manual",
              message: errorMessage,
            });
          }
          // SEGUNDO: Verifica mensagens genéricas de credenciais inválidas
          // (essas mensagens mencionam tanto email quanto senha, mas devem aparecer no campo de senha)
          else if (
            lowerMessage.includes("email or password") ||
            lowerMessage.includes("email ou senha") ||
            lowerMessage.includes("email and password") ||
            lowerMessage.includes("email e senha") ||
            lowerMessage.includes("invalid email or password") ||
            lowerMessage.includes("email ou senha inválido") ||
            lowerMessage.includes("credenciais inválidas") ||
            lowerMessage.includes("invalid credentials")
          ) {
            form.setError("password", {
              type: "manual",
              message: errorMessage,
            });
          }
          // TERCEIRO: Verifica outros erros que mencionam senha ou credenciais
          else if (
            lowerMessage.includes("senha") ||
            lowerMessage.includes("password") ||
            lowerMessage.includes("credenciais") ||
            lowerMessage.includes("credentials") ||
            lowerMessage.includes("incorrect") ||
            lowerMessage.includes("incorreto") ||
            lowerMessage.includes("wrong") ||
            lowerMessage.includes("errado") ||
            lowerMessage.includes("inválido") ||
            lowerMessage.includes("invalid")
          ) {
            form.setError("password", {
              type: "manual",
              message: errorMessage,
            });
          }
          // SEGUNDO: Erros MUITO específicos de email (usuário não encontrado)
          else if (
            lowerMessage.includes("usuário não encontrado") ||
            lowerMessage.includes("user not found") ||
            lowerMessage.includes("email não encontrado") ||
            lowerMessage.includes("email não existe")
          ) {
            form.setError("email", {
              type: "manual",
              message: errorMessage,
            });
          }
          // TERCEIRO: Para TODOS os outros erros genéricos, mostra no campo de senha
          // (erros como "Erro ao logar", "Falha na autenticação", etc)
          else {
            form.setError("password", {
              type: "manual",
              message: errorMessage,
            });
          }

          setIsLoading(false);
        },
      }
    );
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
          name="email"
          render={({ field }) => {
            const hasError = !!form.formState.errors.email;
            return (
              <motion.div
                ref={emailFieldRef}
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
                        disabled={isLoading}
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
                ref={passwordFieldRef}
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

        <motion.div data-field>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-[#1d4ed8] hover:bg-[#153a9c] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white"
              disabled={form.formState.isSubmitting || isLoading}
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
                  Entrando...
                </div>
              ) : (
                "Entrar"
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
