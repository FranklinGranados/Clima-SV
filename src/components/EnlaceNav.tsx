"use client";

/**
 * Enlace de navegación que se resalta cuando corresponde a la ruta actual.
 * Es de cliente porque usa usePathname. Con cacheComponents, usePathname puede
 * suspender en rutas con params dinámicos, por eso quien lo use debe envolverlo
 * en <Suspense> (ver Header y MenuMovil).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { esRutaActiva } from "@/lib/navegacion";

interface EnlaceNavProps {
  href: string;
  etiqueta: string;
  /** Clases extra según dónde se usa (barra de escritorio o menú móvil). */
  className?: string;
  /** Se ejecuta al hacer clic; el menú móvil lo usa para cerrarse. */
  onNavegar?: () => void;
}

export default function EnlaceNav({ href, etiqueta, className = "", onNavegar }: EnlaceNavProps) {
  const activo = esRutaActiva(href, usePathname());

  return (
    <Link
      href={href}
      onClick={onNavegar}
      aria-current={activo ? "page" : undefined}
      className={`${className} ${activo ? "bg-primario/10 font-semibold text-primario" : "text-texto-suave hover:bg-superficie-alta hover:text-texto"}`}
    >
      {etiqueta}
    </Link>
  );
}

/** Versión sin resaltado, usada como fallback de <Suspense> mientras se resuelve la ruta. */
export function EnlaceNavEstatico({ href, etiqueta, className = "" }: EnlaceNavProps) {
  return (
    <Link href={href} className={`${className} text-texto-suave hover:bg-superficie-alta hover:text-texto`}>
      {etiqueta}
    </Link>
  );
}
