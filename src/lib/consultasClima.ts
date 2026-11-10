/**
 * Consultas del NAVEGADOR (TanStack Query) hacia nuestro Route Handler.
 * No usa la API key: solo llama a /api/clima/[departamento], que vive en el servidor.
 * La home y /comparar comparten la misma query key, así lo precargado en una
 * página ya está en caché en la otra.
 */
import type { ClimaDepartamento } from "@/types/clima";

/** Fábrica de query keys para no escribir los arreglos a mano. */
export const climaKeys = {
  departamento: (slug: string) => ["clima", slug] as const,
};

/** Pide el clima de un departamento. Lanza un error si la respuesta no es 2xx. */
export async function fetchClimaDepartamento(
  slug: string,
  signal?: AbortSignal,
): Promise<ClimaDepartamento> {
  const respuesta = await fetch(`/api/clima/${encodeURIComponent(slug)}`, { signal });

  if (!respuesta.ok) {
    // El Route Handler responde { error: "mensaje en español" }; si no viene, se usa uno genérico.
    const cuerpo = (await respuesta.json().catch(() => null)) as { error?: string } | null;
    throw new Error(cuerpo?.error ?? "No pudimos obtener el clima.");
  }

  return (await respuesta.json()) as ClimaDepartamento;
}

/** Opciones de la consulta, reutilizables en useQuery, useQueries y prefetchQuery. */
export function opcionesClimaDepartamento(slug: string) {
  return {
    queryKey: climaKeys.departamento(slug),
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchClimaDepartamento(slug, signal),
  };
}
