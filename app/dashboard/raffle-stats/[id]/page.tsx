"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Comprador {
  nome: string;
  quantidade: number;
  totalGasto: number;
}

interface RaffleStats {
  vendidos: number;
  totalVendido: number;
  titulo: string;
  totalNumeros: number;
  numerosVendidos: number;
  valorPorNumero: number;
  ranking: Comprador[];
}

export default function RaffleStatsPage() {
  const params = useParams();
  const raffleId = params?.id as string;
  const [stats, setStats] = useState<RaffleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3333/rifas/${raffleId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar estatísticas");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (raffleId) {
      fetchStats();
    }
  }, [raffleId]);

  if (isLoading) {
    return <p>Carregando estatísticas...</p>;
  }

  if (!stats) {
    return <p>Estatísticas não encontradas.</p>;
  }

  const vendidos = stats.numerosVendidos ?? 0;
  const total = stats.totalNumeros ?? 0;

  // Progresso de vendas em percentual
  const progress = total > 0 ? (vendidos / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/dashboard/my-raffles">Voltar</Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Estatísticas da Rifa
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho da sua rifa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{stats.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold">
                Total vendido: R$ {(stats?.totalVendido ?? 0).toFixed(2)}
              </p>

              <p className="text-sm font-medium">
                Total de números: {stats.totalNumeros}
              </p>
              <p className="text-sm font-medium">
                Vendidos: {stats.numerosVendidos}
              </p>
            </div>
            <Badge>{progress.toFixed(0)}% vendido</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm">Progresso de vendas</p>
            <Progress value={progress} max={100} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Ranking de Compradores</h2>
        {stats.ranking.length > 0 ? (
          <div className="space-y-2">
            {stats.ranking.map((comprador, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-medium">{comprador.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {comprador.quantidade} números comprados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    R$ {comprador.totalGasto.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma compra realizada ainda.</p>
        )}
      </div>
    </div>
  );
}
