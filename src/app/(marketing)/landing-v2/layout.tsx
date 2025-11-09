import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/animations.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FlicAPP - Encontre serviços confiáveis em minutos",
  description:
    "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro. Resolva seus problemas hoje.",
  keywords: [
    "prestadores de serviço",
    "marketplace de serviços",
    "contratar serviços",
    "serviços locais",
    "matching inteligente",
  ],
  authors: [{ name: "FlicAPP" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://flicapp.com.br/landing-v2",
    title: "FlicAPP - Encontre serviços confiáveis em minutos",
    description:
      "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro.",
    siteName: "FlicAPP",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlicAPP - Encontre serviços confiáveis em minutos",
    description:
      "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://flicapp.com.br/#website",
        url: "https://flicapp.com.br",
        name: "FlicAPP",
        description:
          "Marketplace que conecta clientes a prestadores de serviço locais",
      },
      {
        "@type": "Organization",
        "@id": "https://flicapp.com.br/#organization",
        name: "FlicAPP",
        url: "https://flicapp.com.br",
        logo: {
          "@type": "ImageObject",
          url: "https://flicapp.com.br/flicapp_logo.png",
        },
      },
      {
        "@type": "Product",
        name: "FlicAPP Marketplace",
        description:
          "Plataforma de marketplace para conectar clientes e prestadores de serviços",
        brand: {
          "@type": "Brand",
          name: "FlicAPP",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "5000",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Como funciona o matching inteligente?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nossa IA analisa seu pedido (tipo de serviço, localização, urgência) e cruza com o perfil dos prestadores cadastrados (especialidades, avaliações, histórico, disponibilidade). Você recebe apenas propostas relevantes e de prestadores verificados.",
            },
          },
          {
            "@type": "Question",
            name: "Como funciona a segurança dos pagamentos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O pagamento fica retido de forma segura até você confirmar que o serviço foi concluído conforme combinado. Se houver algum problema, nossa equipe de suporte pode intermediar. Aceitamos cartões de crédito e débito.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

