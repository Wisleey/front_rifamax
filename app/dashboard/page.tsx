"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, Ticket, PlusCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [rifasDisponiveis, setRifasDisponiveis] = useState(0);
  const [minhasCompras, setMinhasCompras] = useState(0);
  const [minhasRifas, setMinhasRifas] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        // Buscar rifas disponíveis
        const rifasResponse = await fetch("http://localhost:3333/rifas");
        if (!rifasResponse.ok) {
          throw new Error(`Erro ao buscar rifas: ${rifasResponse.status}`);
        }
        const rifasData = await rifasResponse.json();
        setRifasDisponiveis(rifasData.length);

        if (token) {
          // Buscar compras do usuário
          const comprasResponse = await fetch(
            "http://localhost:3333/compras/minhas",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!comprasResponse.ok) {
            throw new Error(
              `Erro ao buscar compras: ${comprasResponse.status}`
            );
          }
          const comprasData = await comprasResponse.json();
          setMinhasCompras(comprasData.length);

          // Buscar rifas criadas pelo usuário
          const minhasRifasResponse = await fetch(
            "http://localhost:3333/rifas/minhas",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!minhasRifasResponse.ok) {
            throw new Error(
              `Erro ao buscar minhas rifas: ${minhasRifasResponse.status}`
            );
          }
          const minhasRifasData = await minhasRifasResponse.json();
          setMinhasRifas(minhasRifasData.length);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle do Sistema de Rifas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rifas Disponíveis
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rifasDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Rifas disponíveis para compra
            </p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href="/raffles">
                Ver Rifas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Minhas Compras
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasCompras}</div>
            <p className="text-xs text-muted-foreground">
              Rifas que você comprou
            </p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/my-purchases">
                Ver Compras
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minhas Rifas</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasRifas}</div>
            <p className="text-xs text-muted-foreground">
              Rifas que você criou
            </p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/my-raffles">
                Ver Minhas Rifas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comprar Rifas</CardTitle>
            <CardDescription>
              Veja todas as rifas disponíveis e compre seus números
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link href="/raffles">Ver Rifas Disponíveis</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Rifa</CardTitle>
            <CardDescription>
              Crie sua própria rifa e comece a vender números
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link href="/dashboard/create-raffle">Criar Rifa</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
