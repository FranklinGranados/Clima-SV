/**
 * Resumen de un día del pronóstico: día, icono, mínima, máxima y % de lluvia.
 * No usa hooks, así que funciona en servidor y dentro de PronosticoDias (cliente).
 * Las temperaturas usan <Temperatura> para respetar la unidad °C/°F elegida.
 */
import IconoClima from "@/components/IconoClima";
import Temperatura from "@/components/Temperatura";
import { formatearFechaCorta } from "@/lib/formato";
import type { PronosticoDia } from "@/types/clima";

export default function TarjetaDiaPronostico({ dia }: { dia: PronosticoDia }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-sm font-semibold capitalize">{dia.diaSemana}</p>
      <p className="text-xs text-texto-suave">{formatearFechaCorta(dia.fecha)}</p>
      <IconoClima icono={dia.icono} descripcion={dia.descripcion} tamano={48} />
      <p className="text-sm">
        <span className="font-semibold">
          <Temperatura celsius={dia.max} conUnidad={false} />
        </span>{" "}
        <span className="text-texto-suave">
          <Temperatura celsius={dia.min} conUnidad={false} />
        </span>
      </p>
      <p className="text-xs text-texto-suave">
        <span aria-hidden="true">💧</span> {dia.probLluvia} %
        <span className="sr-only"> de probabilidad de lluvia</span>
      </p>
    </div>
  );
}
