/**
 * Modelos de la app ya NORMALIZADOS: es lo que reciben los componentes
 * y lo que responde el Route Handler /api/clima/[departamento].
 * No contienen URLs ni la API key.
 */

/** Clima actual de una ciudad, listo para mostrar. */
export interface ClimaResumen {
  ciudad: string;
  /** Temperaturas en °C, redondeadas. */
  temperatura: number;
  sensacion: number;
  min: number;
  max: number;
  /** Humedad relativa en %. */
  humedad: number;
  vientoKmh: number;
  /** Descripción en español (lang=es), ej. "nubes dispersas". */
  descripcion: string;
  /** Código de icono de OpenWeather, ej. "04d". */
  icono: string;
  /** Hora de la medición en segundos Unix. */
  actualizado: number;
  /** Amanecer y atardecer en segundos Unix. */
  amanecer: number;
  atardecer: number;
}

/** Clima de un departamento: su cabecera y sus 2 ciudades. */
export interface ClimaDepartamento {
  slug: string;
  nombre: string;
  cabecera: ClimaResumen;
  ciudades: ClimaResumen[];
}

/** Un bloque de 3 h dentro de un día del pronóstico. */
export interface PronosticoBloque {
  /** Hora local de El Salvador, ej. "15:00". */
  hora: string;
  temperatura: number;
  icono: string;
  /** Probabilidad de lluvia en % (0-100). */
  probLluvia: number;
}

/** Resumen de un día del pronóstico, agrupando sus bloques de 3 h. */
export interface PronosticoDia {
  /** Fecha local en formato ISO "YYYY-MM-DD" (sirve como key). */
  fecha: string;
  /** Nombre del día en español, ej. "lunes". */
  diaSemana: string;
  min: number;
  max: number;
  icono: string;
  descripcion: string;
  /** Probabilidad de lluvia máxima del día en %. */
  probLluvia: number;
  bloques: PronosticoBloque[];
}
