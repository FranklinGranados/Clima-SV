/**
 * /departamento/[nombre]/pronostico (Server Component).
 * Pide el pronóstico de 5 días (bloques de 3 h) de la cabecera: 1 llamada, cacheada 10 min.
 * agruparPorDia lo convierte en días locales y PronosticoDias (cliente) muestra las pestañas.
 * No tiene generateStaticParams a propósito: se renderiza bajo demanda (el shell estático
 * sale al instante y el pronóstico llega por streaming), así el build no gasta 14 llamadas más.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PronosticoDias from "@/components/PronosticoDias";
import SelectorUnidad from "@/components/SelectorUnidad";
import { getDepartamento } from "@/lib/departamentos";
import { getPronostico } from "@/lib/openweather";
import { agruparPorDia } from "@/lib/pronostico";
import type { Ciudad } from "@/types/departamento";

export async function generateMetadata({
  params,
}: PageProps<"/departamento/[nombre]/pronostico">): Promise<Metadata> {
  const departamento = getDepartamento((await params).nombre);
  if (!departamento) return { title: "Departamento no encontrado" };

  return {
    title: `Pronóstico de ${departamento.nombre}`,
    description: `Pronóstico de 5 días para ${departamento.cabecera.nombre}, ${departamento.nombre}, El Salvador.`,
  };
}

/** Consulta el pronóstico y lo agrupa por día. */
async function Pronostico({ ciudad }: { ciudad: Ciudad }) {
  const pronostico = await getPronostico(ciudad);
  return <PronosticoDias dias={agruparPorDia(pronostico.list)} />;
}

export default async function PronosticoPage({ params }: PageProps<"/departamento/[nombre]/pronostico">) {
  const { nombre } = await params;
  const departamento = getDepartamento(nombre);
  if (!departamento) notFound();

  return (
    <div className="space-y-8">
      <nav aria-label="Ruta de navegación" className="text-sm text-texto-suave">
        <Link href="/" className="text-primario underline-offset-4 hover:underline">
          Inicio
        </Link>{" "}
        /{" "}
        <Link href={`/departamento/${departamento.slug}`} className="text-primario underline-offset-4 hover:underline">
          {departamento.nombre}
        </Link>{" "}
        / Pronóstico
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold md:text-4xl">Pronóstico de {departamento.nombre}</h1>
          <p className="text-texto-suave">
            Próximos 5 días en {departamento.cabecera.nombre}, en bloques de 3 horas (hora de El Salvador).
          </p>
        </div>
        <SelectorUnidad />
      </header>

      <Suspense fallback={<div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-superficie-alta" />}>
        <Pronostico ciudad={departamento.cabecera} />
      </Suspense>
    </div>
  );
}
