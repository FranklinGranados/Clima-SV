/**
 * Tipos de los datos ESTÁTICOS de la app: departamentos y ciudades.
 * Las ciudades se consultan por lat/lon (no por nombre) porque en El Salvador
 * hay nombres repetidos y OpenWeather podría devolver otra localidad.
 */

/** Zona geográfica usada para agrupar los departamentos en la home. */
export type Zona = "occidental" | "central" | "paracentral" | "oriental";

/** Una ciudad con sus coordenadas. */
export interface Ciudad {
  nombre: string;
  lat: number;
  lon: number;
}

/** Un departamento: su cabecera y exactamente 2 ciudades adicionales. */
export interface Departamento {
  /** Identificador para la URL, ej. "san-salvador". */
  slug: string;
  nombre: string;
  zona: Zona;
  cabecera: Ciudad;
  /** Tupla: TypeScript obliga a que sean exactamente 2 (límite de solicitudes). */
  ciudades: [Ciudad, Ciudad];
}
