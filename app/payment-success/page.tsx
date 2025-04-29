"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const compraId = searchParams.get("compra");
  const [compra, setCompra] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompra() {
      if (!compraId) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        const response = await fetch(
          `http://localhost:3333/compras/${compraId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar detalhes da compra");
        }

        const data = await response.json();
        setCompra(data);
      } catch (error) {
        console.error("Erro ao buscar compra:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompra();
  }, [compraId]);

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-screen">
        Carregando detalhes da compra...
      </div>
    );
  }

  if (!compra) {
    return (
      <div className="container flex justify-center items-center min-h-screen">
        Compra não encontrada.
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua compra foi processada com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Detalhes da Compra</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Rifa:</div>
              <div className="font-medium">{compra.rifa?.titulo || "Rifa"}</div>
              <div>Quantidade:</div>
              <div className="font-medium">
                {compra.numeros.length} número(s)
              </div>
              <div>Valor Total:</div>
              <div className="font-medium">
                R$ {compra.totalPago.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Seus Números</h3>
            <div className="flex flex-wrap gap-2">
              {compra.numeros.map((numero: any) => (
                <Badge key={numero.id} variant="outline" className="text-sm">
                  {numero.numero}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Guarde seus números! O sorteio será realizado na data prevista.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/dashboard/my-purchases">Ver Minhas Compras</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/raffles">Comprar Mais Rifas</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
