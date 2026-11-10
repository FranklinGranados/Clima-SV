"use client";

/**
 * Buscador de la home (Client Component).
 * Filtra con useState sobre la lista ESTÁTICA de departamentos (sin llamar a la API).
 * Las tarjetas llegan ya renderizadas desde el servidor (prop `tarjeta`), así que
 * el cliente solo decide cuáles mostrar; no vuelve a pedir el clima.
 * Busca por departamento, cabecera o ciudad, ignorando tildes y mayúsculas.
 */
import { useState } from "react";

export interface DepartamentoBuscable {
  slug: string;
  /** Nombres del departamento, su cabecera y sus ciudades. */
  nombres: string[];
  /** Tarjeta renderizada en el servidor (dentro de su <Suspense>). */
  tarjeta: React.ReactNode;
}

export interface GrupoZona {
  id: string;
  nombre: string;
  departamentos: DepartamentoBuscable[];
}

/** "Ahuachapán" → "ahuachapan": quita tildes y pasa a minúsculas. */
function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export default function BuscadorDepartamentos({ grupos }: { grupos: GrupoZona[] }) {
  const [busqueda, setBusqueda] = useState("");
  const termino = normalizar(busqueda);

  const gruposFiltrados = grupos
    .map((grupo) => ({
      ...grupo,
      departamentos: grupo.departamentos.filter((d) => d.nombres.some((n) => normalizar(n).includes(termino))),
    }))
    .filter((grupo) => grupo.departamentos.length > 0);

  return (
    <div className="space-y-8">
      <div className="max-w-md">
        <label htmlFor="buscador" className="mb-1 block text-sm font-medium">
          Buscar departamento o ciudad
        </label>
        <input
          id="buscador"
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Ej.: Santa Ana, Metapán…"
          className="min-h-11 w-full rounded-lg border border-borde bg-superficie px-3 text-texto placeholder:text-texto-suave focus:outline-2 focus:outline-primario"
        />
      </div>

      {gruposFiltrados.length === 0 && (
        <p role="status" className="text-texto-suave">
          No hay departamentos ni ciudades que coincidan con «{busqueda}».
        </p>
      )}

      {gruposFiltrados.map((grupo) => (
        <section key={grupo.id} aria-labelledby={`zona-${grupo.id}`} className="space-y-4">
          <h2 id={`zona-${grupo.id}`} className="text-xl font-semibold">
            {grupo.nombre}
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {grupo.departamentos.map((d) => (
              <li key={d.slug}>{d.tarjeta}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
