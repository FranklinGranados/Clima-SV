/**
 * Capa de acceso a OpenWeather. ÚNICO archivo que lee la API key.
 *
 * - `import "server-only"` hace que el build falle si un Client Component
 *   lo importa, así la key nunca llega al bundle del navegador.
 * - Cada función pública usa 'use cache' + cacheLife (10 min) para respetar
 *   el límite de solicitudes del plan gratuito.
 * - Nunca se registra la URL completa (contiene la key).
 */
import "server-only";

import { cacheLife } from "next/cache";

import { getDepartamento } from "@/lib/departamentos";
import { msAKmh, redondearTemperatura } from "@/lib/formato";
import type { ClimaDepartamento, ClimaResumen } from "@/types/clima";
import type { Ciudad } from "@/types/departamento";
import type { OWClimaActual, OWPronostico } from "@/types/openweather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

/** Segundos que se reutiliza una respuesta antes de volver a consultar. */
const REVALIDAR_SEGUNDOS = 600;

/** Endpoints que usa la app (plan gratuito). */
type Endpoint = "weather" | "forecast";

/**
 * Error controlado de OpenWeather. Solo guarda el código HTTP y el endpoint,
 * nunca la URL ni la key, para poder registrarlo sin riesgo.
 */
export class OpenWeatherError extends Error {
  constructor(
    readonly status: number,
    readonly endpoint: Endpoint,
  ) {
    super(`OpenWeather respondió ${status} en /${endpoint}`);
    this.name = "OpenWeatherError";
  }
}

/** Lee la key del entorno del servidor. Si falta, falla sin mostrar valores. */
function obtenerApiKey(): string {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Falta la variable de entorno OPENWEATHER_API_KEY");
  }
  return apiKey;
}

/** Hace la petición a OpenWeather por coordenadas, en °C y en español. */
async function consultarOpenWeather<T>(endpoint: Endpoint, ciudad: Ciudad): Promise<T> {
  const parametros = new URLSearchParams({
    lat: String(ciudad.lat),
    lon: String(ciudad.lon),
    units: "metric",
    lang: "es",
    appid: obtenerApiKey(),
  });

  const respuesta = await fetch(`${BASE_URL}/${endpoint}?${parametros}`);
  if (!respuesta.ok) {
    throw new OpenWeatherError(respuesta.status, endpoint);
  }
  return (await respuesta.json()) as T;
}

/** Convierte la respuesta cruda en el modelo que usan los componentes. */
function normalizarClimaActual(ciudad: Ciudad, datos: OWClimaActual): ClimaResumen {
  const condicion = datos.weather[0];
  return {
    ciudad: ciudad.nombre,
    temperatura: redondearTemperatura(datos.main.temp),
    sensacion: redondearTemperatura(datos.main.feels_like),
    min: redondearTemperatura(datos.main.temp_min),
    max: redondearTemperatura(datos.main.temp_max),
    humedad: datos.main.humidity,
    vientoKmh: msAKmh(datos.wind.speed),
    descripcion: condicion?.description ?? "sin datos",
    icono: condicion?.icon ?? "01d",
    actualizado: datos.dt,
    amanecer: datos.sys.sunrise,
    atardecer: datos.sys.sunset,
  };
}

/** Clima actual de una ciudad (cacheado 10 min por coordenada). */
export async function getClimaActual(ciudad: Ciudad): Promise<ClimaResumen> {
  "use cache";
  cacheLife({ revalidate: REVALIDAR_SEGUNDOS });

  const datos = await consultarOpenWeather<OWClimaActual>("weather", ciudad);
  return normalizarClimaActual(ciudad, datos);
}

/**
 * Clima de un departamento: cabecera + sus 2 ciudades (3 consultas en paralelo).
 * Devuelve null si el slug no está en la lista blanca.
 */
export async function getClimaDepartamento(slug: string): Promise<ClimaDepartamento | null> {
  const departamento = getDepartamento(slug);
  if (!departamento) return null;

  // Cada llamada ya está cacheada por ciudad, así no se repiten consultas
  // aunque la cabecera se pida también desde la home.
  const [cabecera, ...ciudades] = await Promise.all(
    [departamento.cabecera, ...departamento.ciudades].map(getClimaActual),
  );

  return { slug: departamento.slug, nombre: departamento.nombre, cabecera, ciudades };
}

/** Pronóstico crudo de 5 días / 3 h (cacheado 10 min). Se agrupa con agruparPorDia. */
export async function getPronostico(ciudad: Ciudad): Promise<OWPronostico> {
  "use cache";
  cacheLife({ revalidate: REVALIDAR_SEGUNDOS });

  return consultarOpenWeather<OWPronostico>("forecast", ciudad);
}
