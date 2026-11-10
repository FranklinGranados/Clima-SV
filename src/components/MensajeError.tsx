"use client";

/**
 * Mensaje de error reutilizable por los error.tsx (Client Component).
 * Muestra un título y una explicación en español, "Reintentar" (retry de Next 16.3+)
 * y, opcionalmente, un enlace para volver. Nunca muestra el detalle técnico del error.
 */
import Link from "next/link";

interface MensajeErrorProps {
  titulo: string;
  descripcion: string;
  /** retry() del error.tsx: vuelve a pedir los datos y re-renderiza el segmento. */
  onReintentar: () => void;
  /** Enlace secundario opcional, ej. volver al inicio o al departamento. */
  volver?: { href: string; etiqueta: string };
}

export default function MensajeError({ titulo, descripcion, onReintentar, volver }: MensajeErrorProps) {
  return (
    <section role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <span aria-hidden="true" className="text-6xl">⛈️</span>
      <h1 className="text-2xl font-bold md:text-3xl">{titulo}</h1>
      <p className="text-texto-suave">{descripcion}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReintentar}
          className="inline-flex min-h-11 items-center rounded-lg bg-primario px-6 font-semibold text-superficie transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
        {volver && (
          <Link
            href={volver.href}
            className="inline-flex min-h-11 items-center rounded-lg border border-borde px-6 font-semibold hover:bg-superficie-alta"
          >
            {volver.etiqueta}
          </Link>
        )}
      </div>
    </section>
  );
}
