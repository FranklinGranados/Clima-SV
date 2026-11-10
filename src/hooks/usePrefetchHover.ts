"use client";

/**
 * Hook de precarga al pasar el puntero (también con foco de teclado o toque).
 * Espera 150 ms antes de precargar: si el puntero solo "barre" el elemento,
 * se cancela y no se hace ninguna petición.
 * La petición va a nuestro Route Handler, que a su vez usa el caché de 10 min del servidor.
 */
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { opcionesClimaDepartamento } from "@/lib/consultasClima";

const ESPERA_MS = 150;

export function usePrefetchHover(slug: string) {
  const queryClient = useQueryClient();
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelar = useCallback(() => {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
  }, []);

  const programar = useCallback(() => {
    cancelar();
    temporizador.current = setTimeout(() => {
      // prefetchQuery no repite la petición si los datos siguen frescos (staleTime).
      void queryClient.prefetchQuery(opcionesClimaDepartamento(slug));
    }, ESPERA_MS);
  }, [cancelar, queryClient, slug]);

  // Limpieza: si el componente se desmonta con un temporizador pendiente, se cancela.
  useEffect(() => cancelar, [cancelar]);

  return {
    onMouseEnter: programar,
    onMouseLeave: cancelar,
    onFocus: programar,
    onBlur: cancelar,
    onTouchStart: programar,
  };
}
