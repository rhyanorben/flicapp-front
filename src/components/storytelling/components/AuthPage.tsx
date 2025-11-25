"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/app/(auth)/login/_components/login-form";
import { RegisterForm } from "@/app/(auth)/register/_components/register-form";

interface AuthPageProps {
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#e8f1ff] dark:bg-[#010817] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300 transition-colors">
      <div className="bg-white dark:bg-[#04122d] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-blue-100 dark:border-white/10 text-slate-900 dark:text-white">
        <div className="bg-[#0b2b6b] dark:bg-[#1d4ed8] p-8 text-center relative">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-2">
            <Image
              src="/flicapp_logo.png"
              alt="FlicApp"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">FlicApp</h2>
          <p className="text-blue-100 text-sm">Acesse seu Painel de Controle</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8 bg-blue-50 dark:bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? "bg-white dark:bg-[#0A1B38] shadow-sm text-[#0c1f3f] dark:text-white"
                  : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? "bg-white dark:bg-[#0A1B38] shadow-sm text-[#0c1f3f] dark:text-white"
                  : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="space-y-4">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Ao entrar, você terá acesso ao histórico completo de serviços e
              notas fiscais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
