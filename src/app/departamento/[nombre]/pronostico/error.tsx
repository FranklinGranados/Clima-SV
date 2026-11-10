"use client";

/**
 * Error del segmento /departamento/[nombre]/pronostico (Client Component, obligatorio).
 * Ofrece reintentar o volver al detalle del departamento (useParams da el slug actual).
 */
import { useParams } from "next/navigation";
import MensajeError from "@/components/MensajeError";

export default function ErrorPronostico({ retry }: { error: unknown; retry: () => void }) {
  const { nombre } = useParams<{ nombre: string }>();

  return (
    <MensajeError
      titulo="No pudimos cargar el pronóstico"
      descripcion="El servicio del clima no respondió. Puedes intentarlo de nuevo o volver al detalle del departamento."
      onReintentar={retry}
      volver={{ href: `/departamento/${nombre}`, etiqueta: "Volver al departamento" }}
    />
  );
}
