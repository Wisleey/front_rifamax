import type React from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="ml-8 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Sistema de Rifas</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/raffles"
                className="transition-colors hover:text-foreground/80"
              >
                Rifas Disponíveis
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav className="sticky top-16 py-4" />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
      <footer className="border-t bg-muted/40 py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold text-primary">Sistema de Rifas</span> —
              Conquiste sua sorte!
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/termos"
              className="hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/sobre"
              className="hover:text-primary transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
