"use client";

/**
 * Menú hamburguesa para móvil (Client Component).
 * - useState: controla si el panel está abierto.
 * - useEffect: mientras está abierto, cierra el menú con la tecla Escape.
 * - Cada enlace cierra el menú al navegar y resalta la ruta activa (EnlaceNav).
 * Se oculta desde md:, donde el Header muestra los enlaces en línea.
 */
import { Suspense, useEffect, useState } from "react";
import EnlaceNav, { EnlaceNavEstatico } from "@/components/EnlaceNav";
import { ENLACES_NAVEGACION } from "@/lib/navegacion";

const CLASES_ENLACE = "flex min-h-11 items-center rounded-lg px-4 text-base transition-colors";

export default function MenuMovil() {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  useEffect(() => {
    if (!abierto) return;

    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", alPresionarTecla);
    // Limpieza: se quita el listener al cerrar el menú o desmontar el componente.
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [abierto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="inline-flex size-11 items-center justify-center rounded-lg text-texto hover:bg-superficie-alta"
      >
        {/* Icono hamburguesa / X dibujado con SVG para no depender de librerías */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Navegación principal"
          className="absolute inset-x-0 top-16 border-b border-borde bg-superficie px-4 py-3 shadow-lg"
        >
          <ul className="flex flex-col gap-1">
            {ENLACES_NAVEGACION.map((enlace) => (
              <li key={enlace.href}>
                <Suspense fallback={<EnlaceNavEstatico {...enlace} className={CLASES_ENLACE} />}>
                  <EnlaceNav {...enlace} className={CLASES_ENLACE} onNavegar={cerrar} />
                </Suspense>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
