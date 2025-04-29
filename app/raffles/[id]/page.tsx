"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // Se você usa shadcn/ui

interface Rifa {
  id: string;
  titulo: string;
  descricao: string;
  valorPorNumero: number;
  totalNumeros: number;
  dataEncerramento: string;
  imagem: string[];
  status: string;
  createdAt: string;
}

export default function RaffleDetailPage() {
  const params = useParams();
  const raffleId = params?.id as string;
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [quantidade, setQuantidade] = useState(1); // << novo estado

  useEffect(() => {
    async function fetchRifa() {
      try {
        const res = await fetch(`http://localhost:3333/rifas/${raffleId}`);
        const data = await res.json();
        setRifa(data);
      } catch (error) {
        console.error("Erro ao buscar rifa:", error);
      }
    }

    if (raffleId) {
      fetchRifa();
    }
  }, [raffleId]);

  async function handleBuyRifa() {
    if (quantidade <= 0) {
      toast.error("Escolha uma quantidade válida!");
      return;
    }

    try {
      setIsBuying(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3333/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rifaId: raffleId,
          quantidade: quantidade,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao realizar a compra");
      }

      toast.success(`✅ Você comprou ${quantidade} número(s)! 🍀 Boa sorte!`);

      setQuantidade(1); // Reseta para 1 depois de comprar
    } catch (error) {
      console.error(error);
      toast.error("Erro ao comprar número. Tente novamente.");
    } finally {
      setIsBuying(false);
    }
  }

  if (!rifa) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <Button asChild variant="outline">
        <Link href="/raffles">← Voltar</Link>
      </Button>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{rifa.titulo}</h1>
          <Badge variant="default">
            {rifa.status === "EM_ANDAMENTO" ? "Ativa" : "Finalizada"}
          </Badge>
          <span className="text-muted-foreground text-sm">
            Criada em {new Date(rifa.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <p className="text-muted-foreground">{rifa.descricao}</p>

        <div className="rounded-lg overflow-hidden shadow-md">
          <Swiper
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="w-full h-[400px]"
          >
            {rifa.imagem.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-md border mt-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground">
              Valor por número
            </h4>
            <p className="text-lg font-bold text-black">
              R$ {rifa.valorPorNumero.toFixed(2)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground">
              Total de números
            </h4>
            <p className="text-lg font-bold text-black">{rifa.totalNumeros}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground">
              Encerramento
            </h4>
            <p className="text-lg font-bold text-black">
              {new Date(rifa.dataEncerramento).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-32"
              placeholder="Quantidade"
            />
            <Button
              onClick={handleBuyRifa}
              disabled={isBuying}
              className="w-full"
            >
              {isBuying ? "Comprando..." : "Comprar Número(s)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
