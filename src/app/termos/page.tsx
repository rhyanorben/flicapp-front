"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export default function TermosPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="absolute top-4 right-4 z-10">
        <ToggleTheme />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Termos de Uso
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Última atualização:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </motion.p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8 space-y-8">
              {/* Seção 1 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ao acessar e utilizar a plataforma FlicAPP, você concorda em
                  cumprir e estar vinculado a estes Termos de Uso. Se você não
                  concorda com alguma parte destes termos, não deve utilizar
                  nossos serviços.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Estes termos constituem um acordo legal entre você e a
                  FlicAPP. Ao criar uma conta ou utilizar nossos serviços, você
                  confirma que leu, compreendeu e aceita todos os termos aqui
                  descritos.
                </p>
              </section>

              {/* Seção 2 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. Descrição do Serviço
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A FlicAPP é uma plataforma digital que conecta clientes a
                  prestadores de serviços verificados. Nossa missão é facilitar
                  a contratação de serviços de qualidade, oferecendo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Matching inteligente entre clientes e prestadores</li>
                  <li>Sistema de avaliações e recomendações</li>
                  <li>Chat integrado para comunicação direta</li>
                  <li>Processo de pagamento seguro e transparente</li>
                  <li>Suporte ao cliente durante todo o processo</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  A FlicAPP atua como intermediária na conexão entre clientes e
                  prestadores, não sendo responsável pela execução dos serviços
                  contratados.
                </p>
              </section>

              {/* Seção 3 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. Cadastro e Conta de Usuário
                </h2>
                <h3 className="text-xl font-medium mb-3">
                  3.1. Requisitos para Cadastro
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para utilizar a plataforma, você deve:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Ter pelo menos 18 anos de idade</li>
                  <li>
                    Fornecer informações verdadeiras, precisas e completas
                  </li>
                  <li>Manter a segurança de sua conta e senha</li>
                  <li>
                    Notificar-nos imediatamente sobre qualquer uso não
                    autorizado
                  </li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  3.2. Contas de Prestadores
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Prestadores de serviço devem passar por um processo de
                  verificação que inclui:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Validação de documentos pessoais</li>
                  <li>Verificação de qualificações profissionais</li>
                  <li>Aprovação de perfil e serviços oferecidos</li>
                  <li>Conformidade com políticas de qualidade</li>
                </ul>
              </section>

              {/* Seção 4 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. Uso da Plataforma
                </h2>
                <h3 className="text-xl font-medium mb-3">
                  4.1. Condutas Permitidas
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você concorda em utilizar a plataforma de forma ética e
                  responsável, respeitando outros usuários e seguindo todas as
                  leis aplicáveis.
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  4.2. Condutas Proibidas
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  É expressamente proibido:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Fornecer informações falsas ou enganosas</li>
                  <li>
                    Realizar transações fora da plataforma para evitar taxas
                  </li>
                  <li>Manipular avaliações ou criar perfis falsos</li>
                  <li>Utilizar a plataforma para atividades ilegais</li>
                  <li>Interferir no funcionamento da plataforma</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Assediar, ameaçar ou prejudicar outros usuários</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  A violação destas regras pode resultar em suspensão ou
                  encerramento permanente da conta, sem direito a reembolso.
                </p>
              </section>

              {/* Seção 5 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. Responsabilidades
                </h2>
                <h3 className="text-xl font-medium mb-3">
                  5.1. Responsabilidades da FlicAPP
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A FlicAPP se compromete a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    Manter a plataforma funcionando de forma segura e estável
                  </li>
                  <li>
                    Proteger os dados pessoais dos usuários conforme a LGPD
                  </li>
                  <li>
                    Mediar conflitos entre clientes e prestadores quando
                    necessário
                  </li>
                  <li>Fornecer suporte adequado aos usuários</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  5.2. Limitações de Responsabilidade
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A FlicAPP não se responsabiliza por:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Qualidade, segurança ou legalidade dos serviços prestados
                  </li>
                  <li>
                    Disputas entre clientes e prestadores sobre a execução dos
                    serviços
                  </li>
                  <li>
                    Danos resultantes do uso ou impossibilidade de uso da
                    plataforma
                  </li>
                  <li>
                    Perdas de dados ou informações devido a falhas técnicas
                  </li>
                </ul>
              </section>

              {/* Seção 6 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Propriedade Intelectual
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Todo o conteúdo da plataforma FlicAPP, incluindo textos,
                  gráficos, logos, ícones, imagens, clipes de áudio, downloads
                  digitais e compilações de dados, é propriedade da FlicAPP ou
                  de seus fornecedores de conteúdo e está protegido pelas leis
                  de direitos autorais brasileiras e internacionais.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Você não pode reproduzir, distribuir, modificar, criar
                  trabalhos derivados, exibir publicamente, executar
                  publicamente, republicar, baixar, armazenar ou transmitir
                  qualquer material de nosso site sem o consentimento prévio e
                  por escrito da FlicAPP.
                </p>
              </section>

              {/* Seção 7 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. Modificações nos Termos
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Reservamo-nos o direito de modificar estes Termos de Uso a
                  qualquer momento. Alterações significativas serão comunicadas
                  aos usuários através de:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Notificação por e-mail</li>
                  <li>Aviso na plataforma</li>
                  <li>
                    Atualização da data de &quot;última atualização&quot; nesta
                    página
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  O uso continuado da plataforma após as modificações constitui
                  aceitação dos novos termos. Se você não concordar com as
                  alterações, deve encerrar sua conta e deixar de utilizar
                  nossos serviços.
                </p>
              </section>

              {/* Seção 8 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  8. Lei Aplicável e Foro
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Estes Termos de Uso são regidos pelas leis da República
                  Federativa do Brasil. Qualquer disputa relacionada a estes
                  termos será resolvida no foro da comarca de São Paulo, Estado
                  de São Paulo, renunciando as partes a qualquer outro, por mais
                  privilegiado que seja.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Antes de recorrer à justiça, as partes se comprometem a tentar
                  resolver quaisquer disputas através de mediação ou arbitragem,
                  conforme previsto na legislação brasileira.
                </p>
              </section>

              {/* Footer da página */}
              <div className="border-t pt-8 mt-12">
                <p className="text-sm text-muted-foreground mb-4">
                  Ao utilizar a plataforma FlicAPP, você também concorda com
                  nossa{" "}
                  <Link
                    href="/privacidade"
                    className="font-medium text-primary hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Voltar ao início
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Criar conta
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
