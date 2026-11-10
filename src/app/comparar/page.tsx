/**
 * /comparar (Server Component).
 * Arma la lista de departamentos (solo slug y nombre, sin clima) y se la pasa al
 * Comparador (cliente), que pide los datos a /api/clima/[departamento] con TanStack Query.
 * El Comparador usa useSearchParams, por eso va dentro de <Suspense>: el resto de la
 * página se prerenderiza y el comparador se completa en el navegador.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import Comparador, { type OpcionDepartamento } from "@/components/Comparador";
import SelectorUnidad from "@/components/SelectorUnidad";
import { DEPARTAMENTOS } from "@/lib/departamentos";

export const metadata: Metadata = {
  title: "Comparar departamentos",
  description: "Compara el clima actual de hasta 4 departamentos de El Salvador.",
};

const OPCIONES: OpcionDepartamento[] = DEPARTAMENTOS.map(({ slug, nombre }) => ({ slug, nombre }));

/** Fallback mientras se lee la URL: chips sin interacción, misma forma. */
function ComparadorSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-2">
      {OPCIONES.map((opcion) => (
        <span key={opcion.slug} className="h-11 w-28 animate-pulse rounded-full bg-superficie-alta" />
      ))}
    </div>
  );
}

export default function CompararPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold md:text-4xl">Comparar departamentos</h1>
          <p className="text-texto-suave">
            Compara el clima actual en la cabecera de hasta 4 departamentos. ▲ marca el valor más alto y ▼ el más
            bajo. Puedes compartir el enlace: la selección queda guardada en la dirección.
          </p>
        </div>
        <SelectorUnidad />
      </header>

      <Suspense fallback={<ComparadorSkeleton />}>
        <Comparador opciones={OPCIONES} />
      </Suspense>
    </div>
  );
}
