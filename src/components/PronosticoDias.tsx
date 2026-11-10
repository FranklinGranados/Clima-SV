"use client";

/**
 * Pestañas del pronóstico por día (Client Component).
 * - useState guarda el día seleccionado.
 * - useEffect desplaza la pestaña elegida a la vista (útil en móvil, donde hay scroll horizontal).
 * Debajo se muestran los bloques de 3 h del día elegido:
 * lista vertical en móvil y fila desde md:.
 */
import { useEffect, useRef, useState } from "react";
import IconoClima from "@/components/IconoClima";
import TarjetaDiaPronostico from "@/components/TarjetaDiaPronostico";
import Temperatura from "@/components/Temperatura";
import type { PronosticoDia } from "@/types/clima";

export default function PronosticoDias({ dias }: { dias: PronosticoDia[] }) {
  const [indice, setIndice] = useState(0);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const diaActivo = dias[indice];

  // Al cambiar de día, centra su pestaña si quedó fuera de la vista (scroll horizontal en móvil).
  useEffect(() => {
    pestanas.current[indice]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [indice]);

  if (!diaActivo) {
    return <p className="text-texto-suave">No hay datos de pronóstico disponibles.</p>;
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Días del pronóstico"
        className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:overflow-visible"
      >
        {dias.map((dia, i) => {
          const activo = i === indice;
          return (
            <button
              key={dia.fecha}
              ref={(boton) => {
                pestanas.current[i] = boton;
              }}
              type="button"
              role="tab"
              id={`pestana-${dia.fecha}`}
              aria-selected={activo}
              aria-controls="panel-pronostico"
              onClick={() => setIndice(i)}
              className={`min-w-28 shrink-0 snap-start rounded-xl border p-3 transition-colors md:min-w-0 md:flex-1 ${
                activo ? "border-primario bg-primario/10" : "border-borde bg-superficie hover:bg-superficie-alta"
              }`}
            >
              <TarjetaDiaPronostico dia={dia} />
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id="panel-pronostico"
        aria-labelledby={`pestana-${diaActivo.fecha}`}
        className="rounded-2xl border border-borde bg-superficie p-4 sm:p-6"
      >
        <h2 className="mb-4 text-lg font-semibold">
          <span className="capitalize">{diaActivo.diaSemana}</span>: {diaActivo.descripcion}
        </h2>
        <ol className="flex flex-col divide-y divide-borde md:flex-row md:divide-x md:divide-y-0 md:overflow-x-auto">
          {diaActivo.bloques.map((bloque) => (
            <li
              key={bloque.hora}
              className="flex items-center gap-3 py-2 md:min-w-24 md:flex-1 md:flex-col md:gap-1 md:px-2 md:py-0"
            >
              <p className="w-14 font-mono text-sm text-texto-suave md:w-auto">{bloque.hora}</p>
              <IconoClima icono={bloque.icono} descripcion={`Clima a las ${bloque.hora}`} tamano={40} />
              <p className="flex-1 text-lg font-semibold md:flex-none">
                <Temperatura celsius={bloque.temperatura} />
              </p>
              <p className="text-sm text-texto-suave">
                <span aria-hidden="true">💧</span> {bloque.probLluvia} %
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
