/**
 * Funciones puras de formato. No usan la API key: sirven en servidor y cliente.
 * Todas las fechas se muestran en la hora de El Salvador, sin importar
 * la zona horaria del servidor o del navegador.
 */

/** Zona horaria IANA de El Salvador (UTC-6, sin horario de verano). */
export const ZONA_HORARIA_SV = "America/El_Salvador";

const LOCALE = "es-SV";

/** Redondea una temperatura a entero (evita mostrar "-0"). */
export function redondearTemperatura(grados: number): number {
  const redondeado = Math.round(grados);
  return Object.is(redondeado, -0) ? 0 : redondeado;
}

/** Convierte °C a °F, redondeado a entero (para el selector de unidad). */
export function celsiusAFahrenheit(celsius: number): number {
  return redondearTemperatura((celsius * 9) / 5 + 32);
}

/** Convierte metros por segundo (units=metric) a km/h, redondeado. */
export function msAKmh(metrosPorSegundo: number): number {
  return Math.round(metrosPorSegundo * 3.6);
}

/** Convierte un timestamp Unix en segundos a Date. */
function desdeUnix(segundosUnix: number): Date {
  return new Date(segundosUnix * 1000);
}

/** Hora local de El Salvador, ej. "15:00". */
export function formatearHora(segundosUnix: number): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZONA_HORARIA_SV,
  }).format(desdeUnix(segundosUnix));
}

/** Fecha legible, ej. "sábado, 8 de noviembre". */
export function formatearFecha(segundosUnix: number): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONA_HORARIA_SV,
  }).format(desdeUnix(segundosUnix));
}

/** Nombre del día de la semana, ej. "lunes". */
export function formatearDiaSemana(segundosUnix: number): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    timeZone: ZONA_HORARIA_SV,
  }).format(desdeUnix(segundosUnix));
}

/** Fecha local en formato ISO "YYYY-MM-DD" (para agrupar el pronóstico por día). */
export function fechaIsoLocal(segundosUnix: number): string {
  // "en-CA" produce el formato YYYY-MM-DD de forma nativa.
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ZONA_HORARIA_SV,
  }).format(desdeUnix(segundosUnix));
}

/** Fecha corta a partir de "YYYY-MM-DD" (fecha local de El Salvador), ej. "9 nov". */
export function formatearFechaCorta(fechaIso: string): string {
  // Se fija el mediodía en UTC-6 para que el día no cambie al formatear en otra zona horaria.
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: ZONA_HORARIA_SV,
  }).format(new Date(`${fechaIso}T12:00:00-06:00`));
}
