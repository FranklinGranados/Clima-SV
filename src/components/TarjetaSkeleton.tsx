/**
 * Placeholder de carga con la misma forma que TarjetaDepartamento (Server Component).
 * animate-pulse da el efecto de "cargando"; aria-hidden porque no aporta contenido.
 */
export default function TarjetaSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full animate-pulse flex-col gap-4 rounded-2xl border border-borde bg-superficie p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-superficie-alta" />
          <div className="h-4 w-24 rounded bg-superficie-alta" />
        </div>
        <div className="size-16 rounded-full bg-superficie-alta" />
      </div>
      <div className="h-10 w-24 rounded bg-superficie-alta" />
      <div className="h-4 w-40 rounded bg-superficie-alta" />
      <div className="mt-auto space-y-2">
        <div className="h-11 rounded-lg bg-superficie-alta" />
        <div className="h-11 rounded-lg bg-superficie-alta" />
      </div>
    </div>
  );
}
