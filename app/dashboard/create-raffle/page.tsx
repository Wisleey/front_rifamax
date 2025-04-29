"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const createRaffleSchema = z.object({
  titulo: z
    .string()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
  descricao: z
    .string()
    .min(20, { message: "A descrição deve ter pelo menos 20 caracteres." }),
  valorPorNumero: z.coerce
    .number()
    .positive({ message: "O valor deve ser positivo." }),
  totalNumeros: z.coerce
    .number()
    .int()
    .positive({ message: "O total de números deve ser positivo." }),
  dataEncerramento: z.string(),
  imagens: z.any(),
});

export default function CreateRafflePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof createRaffleSchema>>({
    resolver: zodResolver(createRaffleSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      valorPorNumero: 0,
      totalNumeros: 100,
      dataEncerramento: "",
      imagens: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createRaffleSchema>) {
    const formData = new FormData();
    formData.append("titulo", values.titulo);
    formData.append("descricao", values.descricao);
    formData.append("valorPorNumero", String(values.valorPorNumero));
    formData.append("totalNumeros", String(values.totalNumeros));
    formData.append("dataEncerramento", values.dataEncerramento);

    if (values.imagens && values.imagens.length > 0) {
      for (let i = 0; i < values.imagens.length; i++) {
        formData.append("imagens", values.imagens[i]);
      }
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3333/rifas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao criar rifa.");
      }

      toast({ title: "Rifa criada com sucesso!" });
      router.push("/dashboard/my-raffles");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a rifa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Criar Nova Rifa</h1>
        <p className="text-muted-foreground">
          Preencha os campos para criar uma nova rifa.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da rifa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição detalhada da rifa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="valorPorNumero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor por Número (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalNumeros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de Números</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dataEncerramento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Encerramento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagens da Rifa</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Rifa"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
