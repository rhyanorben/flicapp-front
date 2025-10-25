import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { RolesProvider } from "@/contexts/roles-context";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FlicAPP",
  description: "FlicAPP - Seu App de Serviços",
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
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.className}>
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
