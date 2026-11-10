"use client";

/**
 * Error del segmento /departamento/[nombre] (Client Component, obligatorio).
 * El header y el footer siguen visibles; solo se reemplaza el contenido.
 * "Reintentar" usa retry() (Next 16.3+): vuelve a pedir los datos del segmento.
 */
import Link from "next/link";

export default function ErrorDepartamento({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <span aria-hidden="true" className="text-6xl">⛈️</span>
      <h1 className="text-2xl font-bold md:text-3xl">No pudimos cargar el clima de este departamento</h1>
      <p className="text-texto-suave">
        El servicio del clima no respondió. Puedes intentarlo de nuevo o volver al inicio.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center rounded-lg bg-primario px-6 font-semibold text-superficie transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg border border-borde px-6 font-semibold hover:bg-superficie-alta"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
