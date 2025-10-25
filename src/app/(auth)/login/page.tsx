import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
          </div>

          <LoginForm />

          <div className="text-center text-sm">
            <p>
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
