import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background" id="contato">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            © 2025 FlicApp - Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              href="#"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.8A4.2 4.2 0 1 0 16.2 12 4.205 4.205 0  0 0 12 7.8zm0 2A2.2 2.2 0 1 1 9.8 12 2.2 2.2 0 0 1 12 9.8zM17.5 6.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
              </svg>
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6.94 6.5A1.44 1.44 0 1 1 5.5 5.06 1.44 1.44 0  0 1 6.94 6.5zM7 8.75H4v11.25h3zM13.25 8.5c-1.7 0-3 .83-3.5 1.75V8.75H6.75V20h3v-6c0-1 .5-2 1.75-2s1.75 1 1.75 2v6h3v-6.5c0-2.75-1.5-5-3.99-5z" />
              </svg>
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M22 5.8a8.3 8.3 0 0 1-2.36.65 4.11 4.11 0 0 0 1.8-2.28 8.22 8.22 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74A11.64 11.64 0 0 1 3.15 4.9a4.1 4.1 0 0 0 1.27 5.48A4.07 4.07 0 0 1 2.8 9.9v.05a4.1 4.1 0 0 0 3.29 4 4.1 4.1 0  0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 19.54a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68v-.53A8.34 8.34 0 0 0 22 5.8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
