/**
 * Carga de /departamento/[nombre]/pronostico (Server Component).
 * Imita las pestañas de días y el panel de bloques de 3 h.
 */
export default function LoadingPronostico() {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando el pronóstico">
      <div aria-hidden="true" className="space-y-2">
        <div className="h-4 w-48 animate-pulse rounded bg-superficie-alta" />
        <div className="h-10 w-72 max-w-full animate-pulse rounded bg-superficie-alta" />
      </div>
      <div aria-hidden="true" className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }, (_, indice) => (
          <div key={indice} className="h-40 min-w-28 flex-1 animate-pulse rounded-xl bg-superficie-alta" />
        ))}
      </div>
      <div aria-hidden="true" className="h-64 animate-pulse rounded-2xl bg-superficie-alta" />
      <span className="sr-only">Cargando el pronóstico…</span>
    </div>
  );
}
