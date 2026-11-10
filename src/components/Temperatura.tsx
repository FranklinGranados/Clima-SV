"use client";

/**
 * Muestra una temperatura en la unidad elegida por el usuario (Client Component).
 * Recibe siempre °C (la API se consulta con units=metric) y convierte a °F si hace falta.
 */
import { useUnidad } from "@/components/providers/UnidadProvider";
import { celsiusAFahrenheit } from "@/lib/formato";

interface TemperaturaProps {
  celsius: number;
  /** Si es false, muestra solo "°" (útil para mín./máx. compactos). */
  conUnidad?: boolean;
}

export default function Temperatura({ celsius, conUnidad = true }: TemperaturaProps) {
  const { unidad } = useUnidad();
  const valor = unidad === "F" ? celsiusAFahrenheit(celsius) : celsius;

  return (
    <>
      {valor}°{conUnidad ? unidad : ""}
    </>
  );
}
