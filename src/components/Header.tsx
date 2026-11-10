/**
 * Encabezado del sitio (Server Component).
 * - Escritorio (md+): logo y enlaces en línea.
 * - Móvil: logo y botón hamburguesa (MenuMovil, componente de cliente).
 */
import Link from "next/link";
import { Suspense } from "react";
import EnlaceNav, { EnlaceNavEstatico } from "@/components/EnlaceNav";
import MenuMovil from "@/components/MenuMovil";
import { ENLACES_NAVEGACION } from "@/lib/navegacion";

// Área táctil mínima de 44 px de alto (regla de diseño responsive del plan).
const CLASES_ENLACE = "inline-flex min-h-11 items-center rounded-lg px-4 text-sm transition-colors";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-superficie/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-lg font-bold text-texto">
          <span aria-hidden="true" className="text-2xl">⛅</span>
          Clima <span className="text-primario">SV</span>
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {ENLACES_NAVEGACION.map((enlace) => (
              <li key={enlace.href}>
                <Suspense fallback={<EnlaceNavEstatico {...enlace} className={CLASES_ENLACE} />}>
                  <EnlaceNav {...enlace} className={CLASES_ENLACE} />
                </Suspense>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navegación móvil */}
        <MenuMovil />
      </div>
    </header>
  );
}
