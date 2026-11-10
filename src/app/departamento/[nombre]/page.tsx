/**
 * /departamento/[nombre] (Server Component).
 * - generateStaticParams: prerenderiza los 14 departamentos en el build.
 * - notFound() si el slug no está en la lista blanca (muestra src/app/not-found.tsx).
 * - Detalle de la cabecera + tarjetas de sus 2 ciudades (3 llamadas, cacheadas 10 min).
 * Con cacheComponents no existe `dynamicParams`, por eso se valida el slug a mano.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DetalleClima from "@/components/DetalleClima";
import SelectorUnidad from "@/components/SelectorUnidad";
import TarjetaCiudad from "@/components/TarjetaCiudad";
import TarjetaSkeleton from "@/components/TarjetaSkeleton";
import { getDepartamento, getSlugs } from "@/lib/departamentos";
import { getClimaActual } from "@/lib/openweather";
import type { Ciudad } from "@/types/departamento";

export function generateStaticParams() {
  return getSlugs().map((nombre) => ({ nombre }));
}

export async function generateMetadata({ params }: PageProps<"/departamento/[nombre]">): Promise<Metadata> {
  const departamento = getDepartamento((await params).nombre);
  if (!departamento) return { title: "Departamento no encontrado" };

  return {
    title: `Clima en ${departamento.nombre}`,
    description: `Clima actual de ${departamento.cabecera.nombre} y otras ciudades de ${departamento.nombre}, El Salvador.`,
  };
}

/** Consulta la cabecera y muestra su panel de métricas. */
async function ClimaCabecera({ ciudad }: { ciudad: Ciudad }) {
  const clima = await getClimaActual(ciudad);
  return <DetalleClima clima={clima} />;
}

export default async function DepartamentoPage({ params }: PageProps<"/departamento/[nombre]">) {
  const { nombre } = await params;
  const departamento = getDepartamento(nombre);
  if (!departamento) notFound();

  return (
    <div className="space-y-8">
      <nav aria-label="Ruta de navegación" className="text-sm text-texto-suave">
        <Link href="/" className="text-primario underline-offset-4 hover:underline">
          Inicio
        </Link>{" "}
        / {departamento.nombre}
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-primario">Zona {departamento.zona}</p>
          <h1 className="text-3xl font-bold md:text-4xl">{departamento.nombre}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SelectorUnidad />
          <Link
            href={`/departamento/${departamento.slug}/pronostico`}
            className="inline-flex min-h-11 items-center rounded-lg bg-primario px-4 text-sm font-semibold text-superficie transition-opacity hover:opacity-90"
          >
            Ver pronóstico de 5 días
          </Link>
        </div>
      </header>

      <Suspense fallback={<div aria-hidden="true" className="h-64 animate-pulse rounded-2xl bg-superficie-alta" />}>
        <ClimaCabecera ciudad={departamento.cabecera} />
      </Suspense>

      <section aria-labelledby="titulo-ciudades" className="space-y-4">
        <h2 id="titulo-ciudades" className="text-xl font-semibold">
          Otras ciudades de {departamento.nombre}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {departamento.ciudades.map((ciudad) => (
            <li key={ciudad.nombre}>
              <Suspense fallback={<TarjetaSkeleton />}>
                <TarjetaCiudad ciudad={ciudad} />
              </Suspense>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
