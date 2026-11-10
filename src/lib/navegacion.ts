/**
 * Enlaces de la navegación principal.
 * Se definen en un solo lugar para que el Header (escritorio) y el MenuMovil
 * muestren siempre las mismas rutas. Módulo compartido: no usa la API key.
 */
export interface EnlaceNavegacion {
  href: string;
  etiqueta: string;
}

export const ENLACES_NAVEGACION: readonly EnlaceNavegacion[] = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/comparar", etiqueta: "Comparar" },
  { href: "/acerca", etiqueta: "Acerca" },
];

/**
 * Indica si un enlace corresponde a la ruta actual.
 * "/" solo se marca en la raíz exacta; el resto también se marca en sus subrutas.
 */
export function esRutaActiva(href: string, rutaActual: string): boolean {
  if (href === "/") return rutaActual === "/";
  return rutaActual === href || rutaActual.startsWith(`${href}/`);
}
