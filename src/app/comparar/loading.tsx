/**
 * Carga de /comparar (Server Component): título, chips y tabla vacíos.
 */
export default function LoadingComparar() {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando el comparador">
      <div aria-hidden="true" className="space-y-2">
        <div className="h-10 w-80 max-w-full animate-pulse rounded bg-superficie-alta" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-superficie-alta" />
      </div>
      <div aria-hidden="true" className="flex flex-wrap gap-2">
        {Array.from({ length: 14 }, (_, indice) => (
          <span key={indice} className="h-11 w-28 animate-pulse rounded-full bg-superficie-alta" />
        ))}
      </div>
      <div aria-hidden="true" className="h-64 animate-pulse rounded-2xl bg-superficie-alta" />
      <span className="sr-only">Cargando el comparador…</span>
    </div>
  );
}
