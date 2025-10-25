import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { RolesProvider } from "@/contexts/roles-context";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FlicApp",
  description: "FlicApp",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RolesProvider>
            {children}
          </RolesProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
