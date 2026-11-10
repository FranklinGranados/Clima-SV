"use client";

/**
 * Interruptor °C / °F (Client Component).
 * Cambia la preferencia global del UnidadProvider, que la guarda en localStorage.
 */
import { type Unidad, useUnidad } from "@/components/providers/UnidadProvider";

const OPCIONES: readonly { valor: Unidad; etiqueta: string; nombre: string }[] = [
  { valor: "C", etiqueta: "°C", nombre: "Celsius" },
  { valor: "F", etiqueta: "°F", nombre: "Fahrenheit" },
];

export default function SelectorUnidad() {
  const { unidad, setUnidad } = useUnidad();

  return (
    <div role="group" aria-label="Unidad de temperatura" className="inline-flex rounded-lg border border-borde bg-superficie p-1">
      {OPCIONES.map((opcion) => {
        const activa = unidad === opcion.valor;
        return (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => setUnidad(opcion.valor)}
            aria-pressed={activa}
            aria-label={opcion.nombre}
            className={`min-h-11 min-w-11 rounded-md px-3 text-sm font-semibold transition-colors ${
              activa ? "bg-primario text-superficie" : "text-texto-suave hover:bg-superficie-alta"
            }`}
          >
            {opcion.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
