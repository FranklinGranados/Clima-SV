/**
 * Transforma el pronóstico crudo (bloques de 3 h en UTC) en días locales
 * de El Salvador. Funciones puras: sin API key ni efectos secundarios.
 */
import {
  fechaIsoLocal,
  formatearDiaSemana,
  formatearHora,
  redondearTemperatura,
} from "@/lib/formato";
import type { PronosticoBloque, PronosticoDia } from "@/types/clima";
import type { OWPronosticoItem } from "@/types/openweather";

/** Hora local (0-23) de referencia para elegir el icono y la descripción del día. */
const HORA_REPRESENTATIVA = 12;

/** Hora local (0-23) de un bloque, usando la misma zona horaria que el formato. */
function horaLocal(item: OWPronosticoItem): number {
  return Number(formatearHora(item.dt).slice(0, 2));
}

/** Convierte un bloque crudo en el modelo de la app. */
function aBloque(item: OWPronosticoItem): PronosticoBloque {
  return {
    hora: formatearHora(item.dt),
    temperatura: redondearTemperatura(item.main.temp),
    icono: item.weather[0]?.icon ?? "01d",
    probLluvia: Math.round(item.pop * 100),
  };
}

/** Elige el bloque más cercano al mediodía: representa mejor el clima del día. */
function bloqueRepresentativo(items: OWPronosticoItem[]): OWPronosticoItem {
  return items.reduce((mejor, actual) =>
    Math.abs(horaLocal(actual) - HORA_REPRESENTATIVA) <
    Math.abs(horaLocal(mejor) - HORA_REPRESENTATIVA)
      ? actual
      : mejor,
  );
}

/** Resume todos los bloques de un mismo día local. */
function resumirDia(fecha: string, items: OWPronosticoItem[]): PronosticoDia {
  const representativo = bloqueRepresentativo(items);
  return {
    fecha,
    diaSemana: formatearDiaSemana(representativo.dt),
    min: redondearTemperatura(Math.min(...items.map((item) => item.main.temp_min))),
    max: redondearTemperatura(Math.max(...items.map((item) => item.main.temp_max))),
    icono: representativo.weather[0]?.icon ?? "01d",
    descripcion: representativo.weather[0]?.description ?? "sin datos",
    probLluvia: Math.round(Math.max(...items.map((item) => item.pop)) * 100),
    bloques: items.map(aBloque),
  };
}

/** Agrupa los bloques de 3 h por día local, en orden cronológico. */
export function agruparPorDia(lista: OWPronosticoItem[]): PronosticoDia[] {
  // Map conserva el orden de inserción, que ya viene cronológico desde la API.
  const porFecha = new Map<string, OWPronosticoItem[]>();
  for (const item of lista) {
    const fecha = fechaIsoLocal(item.dt);
    porFecha.set(fecha, [...(porFecha.get(fecha) ?? []), item]);
  }

  return Array.from(porFecha, ([fecha, items]) => resumirDia(fecha, items));
}
