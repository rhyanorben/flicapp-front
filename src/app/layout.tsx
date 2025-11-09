import type { Metadata } from "next";
import "./globals.css";
import "./(marketing)/landing-v2/styles/animations.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { RolesProvider } from "@/contexts/roles-context";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FlicAPP - Encontre serviços confiáveis em minutos",
  description: "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro. Resolva seus problemas hoje.",
  keywords: ["prestadores de serviço", "marketplace de serviços", "contratar serviços", "serviços locais", "matching inteligente"],
  authors: [{ name: "FlicAPP" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://flicapp.com.br",
    title: "FlicAPP - Encontre serviços confiáveis em minutos",
    description: "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro.",
    siteName: "FlicAPP",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlicAPP - Encontre serviços confiáveis em minutos",
    description: "Marketplace que conecta você a prestadores verificados. Matching inteligente, chat integrado e pagamento seguro.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/flicapp_logo.png",
    shortcut: "/flicapp_logo.png",
    apple: "/flicapp_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://flicapp.com.br/#website",
        url: "https://flicapp.com.br",
        name: "FlicAPP",
        description: "Marketplace que conecta clientes a prestadores de serviço locais",
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
        description: "Plataforma de marketplace para conectar clientes e prestadores de serviços",
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
    ],
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <NextTopLoader />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RolesProvider>{children}</RolesProvider>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
