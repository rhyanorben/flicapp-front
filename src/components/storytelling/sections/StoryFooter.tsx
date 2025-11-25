import Image from "next/image";
import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { STORY_SECTION_IDS } from "../constants";

export const StoryFooter = () => (
  <footer className="bg-[#03102a] dark:bg-[#01040b] text-slate-200 pt-16 pb-8 border-t border-blue-900/40 dark:border-white/10 transition-colors">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Image
              src="/logo-flicapp-horizontal.png"
              alt="FlicApp Logo"
              width={160}
              height={48}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Simplificando a contratação de serviços com a rapidez do WhatsApp e
            a segurança da IA.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/flicapp"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#0a1f44] transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com/flicapp"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#0a1f44] transition-colors"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com/company/flicapp"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#0a1f44] transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://facebook.com/flicapp"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#0a1f44] transition-colors"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
            Produto
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`#${STORY_SECTION_IDS.hero}`}
                className="hover:text-blue-300 transition-colors"
              >
                Como Funciona
              </a>
            </li>
            <li>
              <a
                href={`#${STORY_SECTION_IDS.dashboard}`}
                className="hover:text-blue-300 transition-colors"
              >
                Para Profissionais
              </a>
            </li>
            <li>
              <a
                href={`#${STORY_SECTION_IDS.steps[2]}`}
                className="hover:text-blue-300 transition-colors"
              >
                Segurança
              </a>
            </li>
            <li>
              <a
                href={`#${STORY_SECTION_IDS.faq}`}
                className="hover:text-blue-300 transition-colors"
              >
                Preços
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
            Empresa
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`#${STORY_SECTION_IDS.about}`}
                className="hover:text-blue-300 transition-colors"
              >
                Sobre Nós
              </a>
            </li>
            <li>
              <a
                href="mailto:contato@flicapp.com"
                className="hover:text-blue-300 transition-colors"
              >
                Carreiras
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-blue-300 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a
                href="/press"
                className="hover:text-blue-300 transition-colors"
              >
                Imprensa
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/terms"
                className="hover:text-blue-300 transition-colors"
              >
                Termos de Uso
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-blue-300 transition-colors"
              >
                Política de Privacidade
              </a>
            </li>
            <li>
              <a
                href="/cookies"
                className="hover:text-blue-300 transition-colors"
              >
                Cookies
              </a>
            </li>
            <li>
              <a
                href="/help-center"
                className="hover:text-blue-300 transition-colors"
              >
                Central de Ajuda
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-900/40 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400">
          © 2024 FlicApp Tecnologia Ltda. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-400">Sistemas Operacionais</span>
        </div>
      </div>
    </div>
  </footer>
);
