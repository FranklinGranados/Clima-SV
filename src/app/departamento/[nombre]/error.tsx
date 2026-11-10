"use client";

/**
 * Error del segmento /departamento/[nombre] (Client Component, obligatorio).
 * El header y el footer siguen visibles; solo se reemplaza el contenido.
 */
import MensajeError from "@/components/MensajeError";

export default function ErrorDepartamento({ retry }: { error: unknown; retry: () => void }) {
  return (
    <MensajeError
      titulo="No pudimos cargar el clima de este departamento"
      descripcion="El servicio del clima no respondió. Puedes intentarlo de nuevo o volver al inicio."
      onReintentar={retry}
      volver={{ href: "/", etiqueta: "Volver al inicio" }}
    />
  );
}
