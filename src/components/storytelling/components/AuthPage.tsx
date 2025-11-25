"use client";

import React, { useState } from "react";
import { ArrowLeft, Github, Globe, Lock, Mail, User, Zap } from "lucide-react";

interface AuthPageProps {
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#e8f1ff] dark:bg-[#010817] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300 transition-colors">
      <div className="bg-white dark:bg-[#04122d] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-blue-100 dark:border-white/10 text-slate-900 dark:text-white">
        <div className="bg-[#0b2b6b] p-8 text-center relative">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap size={32} className="text-[#0b2b6b]" fill="currentColor" />
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
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                  Nome Completo
                </label>
                <div className="flex items-center border border-blue-100 dark:border-white/15 rounded-xl px-3 py-2 focus-within:border-[#1d4ed8] focus-within:ring-1 focus-within:ring-[#1d4ed8] dark:focus-within:border-white focus-within:ring-offset-0 transition-all bg-white/70 dark:bg-white/5">
                  <User
                    size={18}
                    className="text-gray-400 dark:text-white/70 mr-2"
                  />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                E-mail
              </label>
              <div className="flex items-center border border-blue-100 dark:border-white/15 rounded-xl px-3 py-2 focus-within:border-[#1d4ed8] focus-within:ring-1 focus-within:ring-[#1d4ed8] dark:focus-within:border-white transition-all bg-white/70 dark:bg-white/5">
                <Mail
                  size={18}
                  className="text-gray-400 dark:text-white/70 mr-2"
                />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                Senha
              </label>
              <div className="flex items-center border border-blue-100 dark:border-white/15 rounded-xl px-3 py-2 focus-within:border-[#1d4ed8] focus-within:ring-1 focus-within:ring-[#1d4ed8] dark:focus-within:border-white transition-all bg-white/70 dark:bg-white/5">
                <Lock
                  size={18}
                  className="text-gray-400 dark:text-white/70 mr-2"
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50"
                />
              </div>
            </div>

            <button className="w-full bg-[#1d4ed8] hover:bg-[#153a9c] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200/60 hover:shadow-blue-300/70 transition-transform active:scale-95 mt-4">
              {isLogin ? "Acessar Dashboard" : "Criar Conta Grátis"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Ao entrar, você terá acesso ao histórico completo de serviços e
              notas fiscais.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-300">
              Ou continue com
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button className="w-10 h-10 rounded-full border border-blue-100 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-colors">
                <Globe size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-blue-100 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-colors">
                <Github size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
