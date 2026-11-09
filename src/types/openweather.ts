/**
 * Tipos de las respuestas CRUDAS de OpenWeather (plan gratuito, API 2.5).
 * Solo se declaran los campos que la app usa; el resto se ignora.
 * Estos tipos solo deben usarse en el servidor (src/lib/openweather.ts),
 * los componentes reciben los modelos normalizados de src/types/clima.ts.
 */

/** Coordenadas geográficas. */
export interface OWCoord {
  lat: number;
  lon: number;
}

/** Condición del clima (ej. "nubes dispersas") e icono asociado. */
export interface OWCondicion {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Bloque principal de temperaturas (°C con units=metric) y humedad. */
export interface OWMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

/** Viento: velocidad en m/s (units=metric) y dirección en grados. */
export interface OWViento {
  speed: number;
  deg: number;
  gust?: number;
}

/** Respuesta de GET /data/2.5/weather (clima actual). */
export interface OWClimaActual {
  coord: OWCoord;
  weather: OWCondicion[];
  main: OWMain;
  visibility: number;
  wind: OWViento;
  clouds: { all: number };
  rain?: { "1h"?: number };
  /** Momento de la medición, en segundos Unix (UTC). */
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  /** Desfase respecto a UTC en segundos (El Salvador: -21600). */
  timezone: number;
  id: number;
  /** Nombre de la localidad según OpenWeather (sirve para validar coordenadas). */
  name: string;
  cod: number;
}

/** Un bloque de 3 horas del pronóstico. */
export interface OWPronosticoItem {
  dt: number;
  main: OWMain;
  weather: OWCondicion[];
  wind: OWViento;
  clouds: { all: number };
  /** Probabilidad de precipitación, de 0 a 1. */
  pop: number;
  rain?: { "3h"?: number };
  /** Fecha y hora en UTC, formato "YYYY-MM-DD HH:mm:ss". */
  dt_txt: string;
}

/** Respuesta de GET /data/2.5/forecast (5 días, bloques de 3 h). */
export interface OWPronostico {
  cod: string;
  cnt: number;
  list: OWPronosticoItem[];
  city: {
    id: number;
    name: string;
    coord: OWCoord;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/** Cuerpo que devuelve OpenWeather cuando algo falla (401, 404, 429...). */
export interface OWError {
  cod: number | string;
  message: string;
}
