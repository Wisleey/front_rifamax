"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Edit, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function MyRafflesPage() {
  const [raffles, setRaffles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMyRifas() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        const response = await fetch("http://localhost:3333/rifas/minhas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar rifas");
        }

        const data = await response.json();
        setRaffles(data);
      } catch (error) {
        console.error("Erro ao buscar rifas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyRifas();
  }, []);
  async function handleUpgradeAndCreate() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para criar uma rifa.",
        });
        return;
      }

      const response = await fetch("http://localhost:3333/auth/upgrade", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar para criador");
      }

      // Sucesso: redireciona para criar a rifa
      router.push("/dashboard/create-raffle");
    } catch (error) {
      console.error("Erro ao virar criador:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar para criador.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Rifas</h1>
          <p className="text-muted-foreground">
            Gerencie as rifas que você criou.
          </p>
        </div>
        <Button onClick={handleUpgradeAndCreate}>Criar Nova Rifa</Button>
      </div>

      {isLoading ? (
        <p>Carregando rifas...</p>
      ) : (
        <div className="grid gap-6">
          {raffles.length > 0 ? (
            raffles.map((raffle) => (
              <Card key={raffle.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="w-[100px] h-[100px] rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={raffle.imagem?.[0] || "/placeholder.svg"}
                      alt={raffle.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle>{raffle.titulo}</CardTitle>
                      <Badge
                        variant={
                          raffle.status === "EM_ANDAMENTO"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {raffle.status === "EM_ANDAMENTO"
                          ? "Ativa"
                          : "Finalizada"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Criada em{" "}
                      {new Date(raffle.createdAt).toLocaleDateString("pt-BR")} •
                      Encerra em{" "}
                      {new Date(raffle.dataEncerramento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </CardDescription>
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        Valor por número: R$ {raffle.valorPorNumero.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Total de números: {raffle.totalNumeros}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso de vendas</span>
                      <span>{raffle.numerosVendidos || 0} vendidos</span>
                    </div>
                    <Progress
                      value={
                        (raffle.numerosVendidos / raffle.totalNumeros) * 100 ||
                        0
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/raffles/${raffle.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    {raffle.status === "EM_ANDAMENTO" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/edit-raffle/${raffle.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/dashboard/raffle-stats/${raffle.id}`}>
                      <BarChart className="mr-2 h-4 w-4" />
                      Estatísticas
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>Você ainda não criou nenhuma rifa.</p>
          )}
        </div>
      )}
    </div>
  );
}
