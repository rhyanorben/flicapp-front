import { ForgotPasswordForm } from "./_components/forgot-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4 z-10">
        <ToggleTheme />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo-flicapp-horizontal.png"
              alt="FlicApp Logo"
              width={180}
              height={42}
              priority
              className="h-auto w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Recupere o acesso à sua conta
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-xl border-2">
          <CardContent className="pt-6">
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
