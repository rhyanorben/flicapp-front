import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function ResetPasswordFormWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

export default function ResetPasswordPage() {
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
            Redefina sua senha
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-xl border-2">
          <CardContent className="pt-6">
            <ResetPasswordFormWrapper />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
