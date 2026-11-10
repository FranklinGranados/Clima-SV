"use client";

/**
 * Error global (Client Component, obligatorio en Next).
 * Muestra un mensaje claro en español y "Reintentar", que llama a retry()
 * (Next 16.3+): vuelve a pedir los datos y re-renderiza el segmento.
 * No se muestra el detalle técnico del error al usuario.
 */
export default function ErrorPagina({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <span aria-hidden="true" className="text-6xl">⛈️</span>
      <h1 className="text-3xl font-bold md:text-4xl">No pudimos cargar el clima</h1>
      <p className="text-texto-suave">
        El servicio del clima no respondió o hubo un problema de conexión. Espera unos segundos e inténtalo de nuevo.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex min-h-11 items-center rounded-lg bg-primario px-6 font-semibold text-superficie transition-opacity hover:opacity-90"
      >
        Reintentar
      </button>
    </section>
  );
}
