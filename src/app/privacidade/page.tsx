"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Home, ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export default function PrivacidadePage() {
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
            Política de Privacidade
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
          <motion.p
            className="text-muted-foreground text-sm mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A FlicAPP está comprometida em proteger sua privacidade e garantir a
            segurança dos seus dados pessoais, em conformidade com a Lei Geral
            de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </motion.p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8 space-y-8">
              {/* Seção 1 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    1. Informações Coletadas
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Coletamos diferentes tipos de informações para fornecer e
                  melhorar nossos serviços:
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  1.1. Informações Fornecidas por Você
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    <strong>Dados de cadastro:</strong> nome completo, e-mail,
                    telefone, CPF, data de nascimento
                  </li>
                  <li>
                    <strong>Dados de localização:</strong> endereço completo,
                    CEP, cidade, estado
                  </li>
                  <li>
                    <strong>Dados de pagamento:</strong> informações de cartão
                    de crédito (processadas por parceiros seguros)
                  </li>
                  <li>
                    <strong>Dados profissionais:</strong> para prestadores,
                    incluímos qualificações, certificados e histórico de
                    trabalho
                  </li>
                  <li>
                    <strong>Comunicações:</strong> mensagens trocadas através da
                    plataforma
                  </li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  1.2. Informações Coletadas Automaticamente
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Endereço IP e informações do dispositivo</li>
                  <li>Dados de navegação e interação com a plataforma</li>
                  <li>Cookies e tecnologias similares</li>
                  <li>Localização geográfica aproximada (quando permitido)</li>
                </ul>
              </section>

              {/* Seção 2 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    2. Como Utilizamos suas Informações
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Utilizamos suas informações pessoais para os seguintes fins:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    <strong>Prestação de serviços:</strong> conectar clientes e
                    prestadores, processar pagamentos, facilitar comunicações
                  </li>
                  <li>
                    <strong>Melhoria da plataforma:</strong> analisar uso,
                    identificar problemas e desenvolver novas funcionalidades
                  </li>
                  <li>
                    <strong>Comunicações:</strong> enviar notificações sobre
                    serviços, atualizações importantes e suporte
                  </li>
                  <li>
                    <strong>Segurança:</strong> prevenir fraudes, verificar
                    identidades e proteger contra atividades suspeitas
                  </li>
                  <li>
                    <strong>Marketing:</strong> enviar ofertas e novidades
                    (apenas com seu consentimento explícito)
                  </li>
                  <li>
                    <strong>Conformidade legal:</strong> cumprir obrigações
                    legais e regulatórias
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Todas as informações são processadas de acordo com a LGPD,
                  garantindo que tenhamos base legal adequada para cada tipo de
                  processamento.
                </p>
              </section>

              {/* Seção 3 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    3. Compartilhamento de Informações
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Compartilhamos suas informações apenas nas seguintes
                  situações:
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  3.1. Prestadores de Serviço
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Quando você contrata um serviço, compartilhamos informações
                  necessárias (nome, contato, endereço do serviço) com o
                  prestador selecionado para que ele possa executar o trabalho.
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  3.2. Prestadores de Serviços Terceirizados
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Trabalhamos com parceiros confiáveis que nos ajudam a operar a
                  plataforma:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    Processadores de pagamento (para transações financeiras)
                  </li>
                  <li>Provedores de hospedagem e infraestrutura de TI</li>
                  <li>
                    Serviços de análise e marketing (com dados anonimizados
                    quando possível)
                  </li>
                  <li>Prestadores de serviços de suporte ao cliente</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Todos os parceiros são contratualmente obrigados a proteger
                  suas informações e utilizá-las apenas para os fins
                  especificados.
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6">
                  3.3. Requisitos Legais
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos divulgar informações quando exigido por lei, ordem
                  judicial ou processo legal, ou para proteger nossos direitos,
                  propriedade ou segurança, bem como dos nossos usuários.
                </p>
              </section>

              {/* Seção 4 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    4. Segurança dos Dados
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Implementamos medidas técnicas e organizacionais robustas para
                  proteger suas informações:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    Criptografia de dados em trânsito (SSL/TLS) e em repouso
                  </li>
                  <li>
                    Controles de acesso rigorosos e autenticação multifator
                  </li>
                  <li>
                    Monitoramento contínuo de segurança e detecção de ameaças
                  </li>
                  <li>
                    Backups regulares e planos de recuperação de desastres
                  </li>
                  <li>
                    Treinamento regular de equipe em segurança da informação
                  </li>
                  <li>Auditorias e testes de segurança periódicos</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Embora nenhum método de transmissão pela internet ou
                  armazenamento eletrônico seja 100% seguro, nos esforçamos para
                  usar meios comercialmente aceitáveis para proteger suas
                  informações pessoais.
                </p>
              </section>

              {/* Seção 5 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    5. Seus Direitos (LGPD)
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você
                  tem os seguintes direitos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    <strong>Confirmação e acesso:</strong> saber se tratamos
                    seus dados e acessar seus dados pessoais
                  </li>
                  <li>
                    <strong>Correção:</strong> solicitar a correção de dados
                    incompletos, inexatos ou desatualizados
                  </li>
                  <li>
                    <strong>Anonimização, bloqueio ou eliminação:</strong>{" "}
                    solicitar a remoção de dados desnecessários ou excessivos
                  </li>
                  <li>
                    <strong>Portabilidade:</strong> solicitar a portabilidade de
                    seus dados para outro fornecedor
                  </li>
                  <li>
                    <strong>Eliminação:</strong> solicitar a eliminação de dados
                    tratados com seu consentimento
                  </li>
                  <li>
                    <strong>Informação:</strong> obter informações sobre
                    entidades públicas e privadas com as quais compartilhamos
                    dados
                  </li>
                  <li>
                    <strong>Revogação do consentimento:</strong> revogar seu
                    consentimento a qualquer momento
                  </li>
                  <li>
                    <strong>Oposição:</strong> opor-se ao tratamento de dados em
                    certas circunstâncias
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para exercer seus direitos, entre em contato conosco através
                  do e-mail: <strong>privacidade@flicapp.com.br</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Responderemos sua solicitação no prazo de 15 (quinze) dias,
                  conforme previsto na LGPD. Se você não estiver satisfeito com
                  nossa resposta, pode apresentar uma reclamação à Autoridade
                  Nacional de Proteção de Dados (ANPD).
                </p>
              </section>

              {/* Seção 6 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Cookies e Tecnologias Similares
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Utilizamos cookies e tecnologias similares para melhorar sua
                  experiência na plataforma:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    <strong>Cookies essenciais:</strong> necessários para o
                    funcionamento da plataforma
                  </li>
                  <li>
                    <strong>Cookies de desempenho:</strong> coletam informações
                    sobre como você usa a plataforma
                  </li>
                  <li>
                    <strong>Cookies de funcionalidade:</strong> lembram suas
                    preferências e personalizam sua experiência
                  </li>
                  <li>
                    <strong>Cookies de marketing:</strong> usados para fornecer
                    anúncios relevantes (apenas com consentimento)
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Você pode gerenciar suas preferências de cookies através das
                  configurações do seu navegador. Note que desabilitar certos
                  cookies pode afetar a funcionalidade da plataforma.
                </p>
              </section>

              {/* Seção 7 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. Alterações nesta Política
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Podemos atualizar esta Política de Privacidade periodicamente
                  para refletir mudanças em nossas práticas ou por motivos
                  legais, operacionais ou regulatórios. Quando fizermos
                  alterações significativas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>
                    Atualizaremos a data de &quot;última atualização&quot; no
                    topo desta página
                  </li>
                  <li>
                    Enviaremos uma notificação por e-mail para usuários
                    registrados
                  </li>
                  <li>Exibiremos um aviso destacado na plataforma</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Recomendamos que você revise esta política periodicamente para
                  se manter informado sobre como protegemos suas informações.
                </p>
              </section>

              {/* Seção 8 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Se você tiver dúvidas, preocupações ou solicitações
                  relacionadas a esta Política de Privacidade ou ao tratamento
                  de seus dados pessoais, entre em contato conosco:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-muted-foreground">
                    <strong>E-mail:</strong> privacidade@flicapp.com.br
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Encarregado de Proteção de Dados (DPO):</strong>{" "}
                    dpo@flicapp.com.br
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Endereço:</strong> [Endereço da empresa], São Paulo
                    - SP, CEP [CEP]
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Estamos comprometidos em responder suas solicitações de forma
                  rápida e transparente, sempre respeitando seus direitos
                  conforme a LGPD.
                </p>
              </section>

              {/* Footer da página */}
              <div className="border-t pt-8 mt-12">
                <p className="text-sm text-muted-foreground mb-4">
                  Esta Política de Privacidade deve ser lida em conjunto com
                  nossos{" "}
                  <Link
                    href="/termos"
                    className="font-medium text-primary hover:underline"
                  >
                    Termos de Uso
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
