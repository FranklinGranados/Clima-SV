"use client";

/**
 * Proveedor de TanStack Query (Client Component).
 * El QueryClient se crea con useState(() => ...) para que haya UNO por pestaña
 * del navegador y no se comparta entre usuarios cuando se renderiza en el servidor.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/** 10 minutos: igual que el caché del servidor (cacheLife en src/lib/openweather.ts). */
const DIEZ_MINUTOS_MS = 600_000;

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DIEZ_MINUTOS_MS,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
