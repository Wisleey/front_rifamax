"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Raffle {
  id: string;
  titulo: string;
  valorPorNumero: number;
  totalNumeros: number;
  numerosVendidos: number;
  imagem: string[];
  criador: {
    nome: string;
  };
}

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRaffles() {
      try {
        const response = await fetch("http://localhost:3333/rifas");
        const data = await response.json();
        setRaffles(data);
      } catch (error) {
        console.error("Erro ao buscar rifas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRaffles();
  }, []);

  return (
    <div className="container py-10 space-y-8 flex flex-col items-center">
      {/* Botão Voltar alinhado melhor */}
      <div className="w-full max-w-7xl mx-auto pl-4 mb-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">← Voltar</Link>
        </Button>
      </div>

      {/* Título e subtítulo centralizados */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Rifas Disponíveis</h1>
        <p className="text-muted-foreground text-lg">
          Escolha uma rifa e compre seus números para concorrer.
        </p>
      </div>

      {/* Cards Centralizados */}
      {isLoading ? (
        <p className="text-center mt-10">Carregando rifas...</p>
      ) : (
        <div className="mt-8 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {raffles.map((raffle) => (
            <Card key={raffle.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[3/2] w-full overflow-hidden">
                <img
                  src={raffle.imagem?.[0] || "/placeholder.svg"}
                  alt={raffle.titulo}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{raffle.titulo}</CardTitle>
                  <Badge>R$ {raffle.valorPorNumero.toFixed(2)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Criado por {raffle.criador.nome}
                </p>
              </CardHeader>
              <CardContent className="flex-grow text-sm">
                <p>
                  Números vendidos: {raffle.numerosVendidos} de{" "}
                  {raffle.totalNumeros}
                </p>
                <p>
                  Disponíveis:{" "}
                  {raffle.totalNumeros - raffle.numerosVendidos >= 0
                    ? raffle.totalNumeros - raffle.numerosVendidos
                    : 0}{" "}
                  números
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full transition-transform hover:scale-105 duration-300"
                >
                  <Link href={`/raffles/${raffle.id}`}>Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
