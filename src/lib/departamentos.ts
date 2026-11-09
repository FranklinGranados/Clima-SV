/**
 * Datos estáticos de los 14 departamentos de El Salvador.
 * Cada uno tiene su cabecera y 2 ciudades (42 en total), con coordenadas aproximadas
 * del casco urbano. Las coordenadas se validan en la iteración 2 comparando con el
 * campo "name" que devuelve OpenWeather.
 *
 * Este módulo NO usa la API key: se puede importar desde servidor y cliente.
 * También funciona como LISTA BLANCA del Route Handler: solo se aceptan estos slugs.
 */
import type { Departamento, Zona } from "@/types/departamento";

export const DEPARTAMENTOS: readonly Departamento[] = [
  // ---------- Zona occidental ----------
  {
    slug: "ahuachapan",
    nombre: "Ahuachapán",
    zona: "occidental",
    cabecera: { nombre: "Ahuachapán", lat: 13.9214, lon: -89.845 },
    ciudades: [
      { nombre: "Atiquizaya", lat: 13.9769, lon: -89.7522 },
      { nombre: "Tacuba", lat: 13.9011, lon: -89.9297 },
    ],
  },
  {
    slug: "santa-ana",
    nombre: "Santa Ana",
    zona: "occidental",
    cabecera: { nombre: "Santa Ana", lat: 13.9942, lon: -89.5597 },
    ciudades: [
      { nombre: "Chalchuapa", lat: 13.9867, lon: -89.6811 },
      { nombre: "Metapán", lat: 14.3333, lon: -89.45 },
    ],
  },
  {
    slug: "sonsonate",
    nombre: "Sonsonate",
    zona: "occidental",
    cabecera: { nombre: "Sonsonate", lat: 13.7189, lon: -89.7242 },
    ciudades: [
      { nombre: "Acajutla", lat: 13.5928, lon: -89.8275 },
      { nombre: "Izalco", lat: 13.7447, lon: -89.6731 },
    ],
  },

  // ---------- Zona central ----------
  {
    slug: "chalatenango",
    nombre: "Chalatenango",
    zona: "central",
    cabecera: { nombre: "Chalatenango", lat: 14.0333, lon: -88.9333 },
    ciudades: [
      { nombre: "Nueva Concepción", lat: 14.1333, lon: -89.3 },
      // Revisada a mano: a 0.4 km del centro; OpenWeather la etiqueta "Llano de La Virgen".
      { nombre: "La Palma", lat: 14.3167, lon: -89.1667 },
    ],
  },
  {
    slug: "la-libertad",
    nombre: "La Libertad",
    zona: "central",
    cabecera: { nombre: "Santa Tecla", lat: 13.6769, lon: -89.2797 },
    ciudades: [
      { nombre: "La Libertad", lat: 13.4883, lon: -89.3222 },
      { nombre: "Quezaltepeque", lat: 13.835, lon: -89.2744 },
    ],
  },
  {
    slug: "san-salvador",
    nombre: "San Salvador",
    zona: "central",
    // Corregida en la iteración 2: la anterior quedaba ~3 km al oeste (Antiguo Cuscatlán).
    cabecera: { nombre: "San Salvador", lat: 13.6976, lon: -89.1912 },
    ciudades: [
      { nombre: "Soyapango", lat: 13.71, lon: -89.1394 },
      { nombre: "Apopa", lat: 13.8072, lon: -89.1792 },
    ],
  },
  {
    slug: "cuscatlan",
    nombre: "Cuscatlán",
    zona: "central",
    cabecera: { nombre: "Cojutepeque", lat: 13.7167, lon: -88.9333 },
    ciudades: [
      { nombre: "Suchitoto", lat: 13.9381, lon: -89.0278 },
      // Revisada a mano: a 0.5 km del centro; OpenWeather la etiqueta "Tecoluca" (cantón).
      { nombre: "San Pedro Perulapán", lat: 13.7667, lon: -89.0333 },
    ],
  },

  // ---------- Zona paracentral ----------
  {
    slug: "la-paz",
    nombre: "La Paz",
    zona: "paracentral",
    cabecera: { nombre: "Zacatecoluca", lat: 13.5, lon: -88.8667 },
    ciudades: [
      { nombre: "Olocuilta", lat: 13.5697, lon: -89.1172 },
      { nombre: "San Pedro Masahuat", lat: 13.5431, lon: -89.0381 },
    ],
  },
  {
    slug: "cabanas",
    nombre: "Cabañas",
    zona: "paracentral",
    cabecera: { nombre: "Sensuntepeque", lat: 13.8667, lon: -88.6333 },
    ciudades: [
      { nombre: "Ilobasco", lat: 13.8411, lon: -88.85 },
      { nombre: "Victoria", lat: 13.95, lon: -88.6333 },
    ],
  },
  {
    slug: "san-vicente",
    nombre: "San Vicente",
    zona: "paracentral",
    cabecera: { nombre: "San Vicente", lat: 13.6333, lon: -88.8 },
    ciudades: [
      // Revisada a mano: a 0.5 km del centro; OpenWeather devuelve "Departamento de San Vicente".
      { nombre: "Tecoluca", lat: 13.5333, lon: -88.7833 },
      { nombre: "Apastepeque", lat: 13.6667, lon: -88.75 },
    ],
  },

  // ---------- Zona oriental ----------
  {
    slug: "usulutan",
    nombre: "Usulután",
    zona: "oriental",
    cabecera: { nombre: "Usulután", lat: 13.35, lon: -88.45 },
    ciudades: [
      { nombre: "Jiquilisco", lat: 13.3167, lon: -88.5833 },
      { nombre: "Santiago de María", lat: 13.4833, lon: -88.4667 },
    ],
  },
  {
    slug: "san-miguel",
    nombre: "San Miguel",
    zona: "oriental",
    cabecera: { nombre: "San Miguel", lat: 13.4833, lon: -88.1833 },
    ciudades: [
      { nombre: "Chinameca", lat: 13.5, lon: -88.35 },
      { nombre: "Ciudad Barrios", lat: 13.7667, lon: -88.2667 },
    ],
  },
  {
    slug: "morazan",
    nombre: "Morazán",
    zona: "oriental",
    // Revisada a mano: OpenWeather usa el nombre oficial "San Francisco".
    cabecera: { nombre: "San Francisco Gotera", lat: 13.7, lon: -88.1 },
    ciudades: [
      // Revisada a mano: a 0.1 km del centro; OpenWeather la etiqueta "La Chorrera".
      { nombre: "Perquín", lat: 13.9581, lon: -88.1622 },
      { nombre: "Jocoro", lat: 13.6167, lon: -88.0167 },
    ],
  },
  {
    slug: "la-union",
    nombre: "La Unión",
    zona: "oriental",
    cabecera: { nombre: "La Unión", lat: 13.3369, lon: -87.8439 },
    ciudades: [
      { nombre: "Santa Rosa de Lima", lat: 13.6247, lon: -87.8936 },
      { nombre: "Conchagua", lat: 13.3078, lon: -87.8647 },
    ],
  },
];

/** Orden y etiqueta de las zonas para mostrarlas agrupadas. */
export const ZONAS: readonly { id: Zona; nombre: string }[] = [
  { id: "occidental", nombre: "Zona occidental" },
  { id: "central", nombre: "Zona central" },
  { id: "paracentral", nombre: "Zona paracentral" },
  { id: "oriental", nombre: "Zona oriental" },
];

/** Busca un departamento por su slug. Devuelve undefined si no existe (lista blanca). */
export function getDepartamento(slug: string): Departamento | undefined {
  return DEPARTAMENTOS.find((departamento) => departamento.slug === slug);
}

/** Lista de slugs válidos, útil para generateStaticParams. */
export function getSlugs(): string[] {
  return DEPARTAMENTOS.map((departamento) => departamento.slug);
}

/** Departamentos de una zona, en el orden en que están declarados. */
export function getDepartamentosPorZona(zona: Zona): Departamento[] {
  return DEPARTAMENTOS.filter((departamento) => departamento.zona === zona);
}
