import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"; // ✅ Importa o Toaster corretamente
import { Providers } from "./providers"; // ✅ Mantém o Providers
import "./globals.css"; // ✅ Estilos globais

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Rifas",
  description: "Compre e crie rifas online",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#333",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
