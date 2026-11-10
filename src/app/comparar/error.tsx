"use client";

/**
 * Error del segmento /comparar (Client Component, obligatorio).
 * Los fallos de la API por departamento se muestran dentro del Comparador;
 * este error.tsx cubre errores inesperados al renderizar la página.
 */
import MensajeError from "@/components/MensajeError";

export default function ErrorComparar({ retry }: { error: unknown; retry: () => void }) {
  return (
    <MensajeError
      titulo="No pudimos cargar el comparador"
      descripcion="Ocurrió un problema al mostrar la comparación. Inténtalo de nuevo o vuelve al inicio."
      onReintentar={retry}
      volver={{ href: "/", etiqueta: "Volver al inicio" }}
    />
  );
}
