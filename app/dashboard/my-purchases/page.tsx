// app/dashboard/my-purchases/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NumeroRifa {
  numero: number;
}

interface Compra {
  id: string;
  rifa: {
    id: string;
    titulo: string;
    imagem: string[];
    valorPorNumero: number;
  };
  numeros: NumeroRifa[];
  totalPago: number;
}

export default function MyPurchasesPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompras() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3333/compras/minhas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error("Erro ao buscar compras:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompras();
  }, []);

  if (isLoading) {
    return <p>Carregando suas compras...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <Button asChild variant="outline">
        <Link href="/dashboard">← Voltar</Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Minhas Compras</h1>

      {compras.length === 0 ? (
        <p className="text-muted-foreground">
          Você ainda não comprou nenhuma rifa.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {compras.map((compra) => (
            <Card key={compra.id} className="flex flex-col overflow-hidden">
              <div className="aspect-[3/2] w-full overflow-hidden">
                <img
                  src={compra.rifa.imagem[0]}
                  alt={compra.rifa.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{compra.rifa.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  Valor pago: <strong>R$ {compra.totalPago.toFixed(2)}</strong>
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Seus números:</p>
                  <div className="flex flex-wrap gap-2">
                    {compra.numeros.length > 0 ? (
                      compra.numeros
                        .map((n) => n.numero)
                        .sort((a, b) => a - b)
                        .map((numero, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                          >
                            {numero}
                          </span>
                        ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Nenhum número encontrado.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
