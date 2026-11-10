"use client";

/**
 * Error global (Client Component, obligatorio en Next).
 * Muestra un mensaje claro en español y "Reintentar", que llama a retry() (Next 16.3+).
 */
import MensajeError from "@/components/MensajeError";

export default function ErrorPagina({ retry }: { error: unknown; retry: () => void }) {
  return (
    <MensajeError
      titulo="No pudimos cargar el clima"
      descripcion="El servicio del clima no respondió o hubo un problema de conexión. Espera unos segundos e inténtalo de nuevo."
      onReintentar={retry}
    />
  );
}
