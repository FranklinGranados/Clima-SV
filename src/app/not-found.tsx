/**
 * Página 404 en español (Server Component).
 * Se muestra en rutas inexistentes y cuando una página llama a notFound()
 * (por ejemplo, un departamento que no está en la lista blanca).
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <span aria-hidden="true" className="text-6xl">🌫️</span>
      <p className="text-sm font-semibold uppercase tracking-wide text-primario">Error 404</p>
      <h1 className="text-3xl font-bold md:text-4xl">No encontramos esta página</h1>
      <p className="text-texto-suave">
        Puede que el enlace esté mal escrito o que el departamento no exista. Revisa la dirección o vuelve al inicio
        para ver los 14 departamentos.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-primario px-6 font-semibold text-superficie transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
