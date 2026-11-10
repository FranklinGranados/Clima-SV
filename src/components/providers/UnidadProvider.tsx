"use client";

/**
 * Preferencia de unidad de temperatura (°C / °F) compartida por toda la app (Client Component).
 * - useState guarda la unidad elegida.
 * - useEffect la restaura desde localStorage al montar.
 * - Se guarda en localStorage en el mismo momento en que el usuario la cambia.
 * Se restaura en un efecto (y no al crear el estado) para que el HTML del servidor
 * y el primer render del cliente coincidan (°C) y no haya error de hidratación.
 */
import { createContext, useContext, useEffect, useState } from "react";

export type Unidad = "C" | "F";

const CLAVE_STORAGE = "clima-sv:unidad";

interface ContextoUnidad {
  unidad: Unidad;
  setUnidad: (unidad: Unidad) => void;
}

const UnidadContext = createContext<ContextoUnidad | null>(null);

function esUnidad(valor: string | null): valor is Unidad {
  return valor === "C" || valor === "F";
}

export default function UnidadProvider({ children }: { children: React.ReactNode }) {
  const [unidad, setUnidadEstado] = useState<Unidad>("C");

  // Al montar: restaura la preferencia guardada (si existe y es válida).
  useEffect(() => {
    const guardada = localStorage.getItem(CLAVE_STORAGE);
    // localStorage solo existe en el navegador: hay que leerlo después de hidratar.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronización única con un sistema externo
    if (esUnidad(guardada)) setUnidadEstado(guardada);
  }, []);

  // Cambia la unidad y la guarda al instante (sin un segundo efecto).
  const setUnidad = (nueva: Unidad) => {
    setUnidadEstado(nueva);
    localStorage.setItem(CLAVE_STORAGE, nueva);
  };

  return <UnidadContext.Provider value={{ unidad, setUnidad }}>{children}</UnidadContext.Provider>;
}

/** Hook para leer y cambiar la unidad. Debe usarse dentro de <UnidadProvider>. */
export function useUnidad(): ContextoUnidad {
  const contexto = useContext(UnidadContext);
  if (!contexto) throw new Error("useUnidad debe usarse dentro de <UnidadProvider>");
  return contexto;
}
