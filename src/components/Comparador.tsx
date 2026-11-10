"use client";

/**
 * Comparador de hasta 4 departamentos (Client Component).
 * - useState: departamentos seleccionados. El valor inicial sale de la URL (?d=a,b),
 *   validado contra la lista recibida (lista blanca), sin repetidos y como máximo 4.
 * - useEffect: cada vez que cambia la selección, la escribe en la URL con
 *   history.replaceState (se integra con el router de Next), así el enlace se puede compartir.
 * - Cada chip precarga su departamento al pasar el puntero (usePrefetchHover).
 * - useQueries pide los seleccionados con la MISMA query key que la home,
 *   así lo precargado allí ya está en caché aquí.
 * Usa useSearchParams: debe ir dentro de <Suspense> (ver src/app/comparar/page.tsx).
 */
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TablaComparativa from "@/components/TablaComparativa";
import { usePrefetchHover } from "@/hooks/usePrefetchHover";
import { opcionesClimaDepartamento } from "@/lib/consultasClima";

// No se exporta: un valor importado desde un archivo "use client" en el servidor
// llega como referencia de cliente, no como número.
const MAX_COMPARAR = 4;
const PARAMETRO_URL = "d";

export interface OpcionDepartamento {
  slug: string;
  nombre: string;
}

/** Lee ?d=a,b de la URL y deja solo slugs válidos, sin repetidos, máximo 4. */
function seleccionDesdeUrl(valor: string | null, validos: Set<string>): string[] {
  const slugs = (valor ?? "").split(",").filter((slug) => validos.has(slug));
  return [...new Set(slugs)].slice(0, MAX_COMPARAR);
}

/** Un chip seleccionable; precarga su clima al pasar el puntero, enfocar o tocar. */
function ChipDepartamento({
  opcion,
  seleccionado,
  deshabilitado,
  onAlternar,
}: {
  opcion: OpcionDepartamento;
  seleccionado: boolean;
  deshabilitado: boolean;
  onAlternar: () => void;
}) {
  const precarga = usePrefetchHover(opcion.slug);

  return (
    <button
      type="button"
      {...precarga}
      onClick={onAlternar}
      disabled={deshabilitado}
      aria-pressed={seleccionado}
      className={`inline-flex min-h-11 items-center gap-1 rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        seleccionado
          ? "border-primario bg-primario text-superficie"
          : "border-borde bg-superficie text-texto hover:bg-superficie-alta"
      }`}
    >
      {seleccionado && <span aria-hidden="true">✓</span>}
      {opcion.nombre}
    </button>
  );
}

export default function Comparador({ opciones }: { opciones: OpcionDepartamento[] }) {
  const searchParams = useSearchParams();
  const [seleccion, setSeleccion] = useState<string[]>(() =>
    seleccionDesdeUrl(searchParams.get(PARAMETRO_URL), new Set(opciones.map((o) => o.slug))),
  );

  // Sincroniza la selección con la URL (sistema externo) sin recargar ni agregar historial.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (seleccion.length > 0) {
      url.searchParams.set(PARAMETRO_URL, seleccion.join(","));
    } else {
      url.searchParams.delete(PARAMETRO_URL);
    }
    // Las comas se dejan legibles en la URL (?d=santa-ana,la-union).
    window.history.replaceState(null, "", `${url.pathname}${url.search.replaceAll("%2C", ",")}`);
  }, [seleccion]);

  const resultados = useQueries({
    queries: seleccion.map((slug) => opcionesClimaDepartamento(slug)),
  });

  const alternar = (slug: string) =>
    setSeleccion((actual) =>
      actual.includes(slug) ? actual.filter((s) => s !== slug) : [...actual, slug].slice(0, MAX_COMPARAR),
    );

  const lleno = seleccion.length >= MAX_COMPARAR;
  const cargados = resultados.flatMap((r) => (r.data ? [r.data] : []));
  const cargando = resultados.some((r) => r.isPending);
  const fallidos = seleccion.filter((_, i) => resultados[i]?.isError);
  const nombreDe = (slug: string) => opciones.find((o) => o.slug === slug)?.nombre ?? slug;

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          Elige hasta {MAX_COMPARAR} departamentos{" "}
          <span className="text-texto-suave">
            ({seleccion.length}/{MAX_COMPARAR})
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {opciones.map((opcion) => {
            const seleccionado = seleccion.includes(opcion.slug);
            return (
              <ChipDepartamento
                key={opcion.slug}
                opcion={opcion}
                seleccionado={seleccionado}
                deshabilitado={lleno && !seleccionado}
                onAlternar={() => alternar(opcion.slug)}
              />
            );
          })}
        </div>
        {seleccion.length > 0 && (
          <button
            type="button"
            onClick={() => setSeleccion([])}
            className="min-h-11 text-sm font-medium text-primario underline-offset-4 hover:underline"
          >
            Limpiar selección
          </button>
        )}
      </fieldset>

      <div aria-live="polite" className="space-y-4">
        {seleccion.length === 0 && (
          <p className="rounded-2xl border border-dashed border-borde p-8 text-center text-texto-suave">
            Selecciona al menos un departamento para ver la comparación.
          </p>
        )}

        {cargando && <p className="text-sm text-texto-suave">Cargando el clima…</p>}

        {fallidos.length > 0 && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
            <p>No pudimos obtener el clima de: {fallidos.map(nombreDe).join(", ")}.</p>
            <button
              type="button"
              onClick={() => resultados.forEach((r) => r.isError && void r.refetch())}
              className="min-h-11 font-medium text-primario underline-offset-4 hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {cargados.length > 0 && <TablaComparativa departamentos={cargados} />}
      </div>
    </div>
  );
}
