/**
 * Carga de /departamento/[nombre] (Server Component): misma forma que la página.
 */
import TarjetaSkeleton from "@/components/TarjetaSkeleton";

export default function LoadingDepartamento() {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando el departamento">
      <div aria-hidden="true" className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-superficie-alta" />
        <div className="h-10 w-64 max-w-full animate-pulse rounded bg-superficie-alta" />
      </div>
      <div aria-hidden="true" className="h-64 animate-pulse rounded-2xl bg-superficie-alta" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TarjetaSkeleton />
        <TarjetaSkeleton />
      </div>
      <span className="sr-only">Cargando el clima del departamento…</span>
    </div>
  );
}
