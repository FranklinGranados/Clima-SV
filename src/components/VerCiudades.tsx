"use client";

/**
 * Botón "Ver ciudades" de cada tarjeta de la home (Client Component).
 * - Al pasar el puntero, enfocar o tocar, precarga el clima del departamento (usePrefetchHover).
 * - Al hacer clic, despliega (useState) el clima de sus 2 ciudades con useQuery.
 *   Si ya se precargó, se muestra al instante sin repetir la petición.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IconoClima from "@/components/IconoClima";
import { usePrefetchHover } from "@/hooks/usePrefetchHover";
import { opcionesClimaDepartamento } from "@/lib/consultasClima";

interface VerCiudadesProps {
  slug: string;
  nombreDepartamento: string;
}

export default function VerCiudades({ slug, nombreDepartamento }: VerCiudadesProps) {
  const [abierto, setAbierto] = useState(false);
  const precarga = usePrefetchHover(slug);

  // enabled: solo consulta cuando el panel está abierto (la precarga se encarga del hover).
  const { data, isPending, isError, error, refetch } = useQuery({
    ...opcionesClimaDepartamento(slug),
    enabled: abierto,
  });

  const idPanel = `ciudades-${slug}`;

  return (
    <div>
      <button
        type="button"
        {...precarga}
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        aria-controls={idPanel}
        className="inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-borde px-3 text-sm font-medium text-texto transition-colors hover:bg-superficie-alta"
      >
        {abierto ? "Ocultar ciudades" : "Ver ciudades"}
        <span aria-hidden="true" className={`transition-transform ${abierto ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {abierto && (
        <div id={idPanel} aria-live="polite" className="mt-2">
          {isPending && <p className="py-2 text-sm text-texto-suave">Cargando ciudades…</p>}

          {isError && (
            <div className="space-y-1 py-2 text-sm">
              <p className="text-red-600 dark:text-red-400">{error.message}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="min-h-11 font-medium text-primario underline-offset-4 hover:underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {data && (
            <ul aria-label={`Clima en ciudades de ${nombreDepartamento}`} className="divide-y divide-borde">
              {data.ciudades.map((ciudad) => (
                <li key={ciudad.ciudad} className="flex items-center gap-2 py-1">
                  <IconoClima icono={ciudad.icono} descripcion={ciudad.descripcion} tamano={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ciudad.ciudad}</p>
                    <p className="truncate text-xs capitalize text-texto-suave">{ciudad.descripcion}</p>
                  </div>
                  <p className="text-lg font-semibold">{ciudad.temperatura}°C</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
