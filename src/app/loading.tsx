/**
 * Carga global (Server Component): se muestra mientras se resuelve una página.
 * Usa la misma grilla que la home para que no "salte" el diseño.
 */
import TarjetaSkeleton from "@/components/TarjetaSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando el clima">
      <div className="space-y-2" aria-hidden="true">
        <div className="h-9 w-72 max-w-full animate-pulse rounded bg-superficie-alta" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-superficie-alta" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, indice) => (
          <TarjetaSkeleton key={indice} />
        ))}
      </div>
      <span className="sr-only">Cargando el clima…</span>
    </div>
  );
}
