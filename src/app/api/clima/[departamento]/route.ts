/**
 * Route Handler GET /api/clima/[departamento]
 *
 * Es la puerta del NAVEGADOR hacia OpenWeather: los Client Components
 * (TanStack Query) llaman aquí y la API key queda en el servidor.
 *
 * - Solo acepta slugs de la lista blanca (src/lib/departamentos.ts):
 *   no recibe lat/lon ni texto libre, así no funciona como proxy abierto.
 * - Responde datos normalizados (ClimaDepartamento), nunca la URL ni la key.
 */
import type { NextRequest } from "next/server";

import { getClimaDepartamento, OpenWeatherError } from "@/lib/openweather";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/clima/[departamento]">,
) {
  const { departamento } = await ctx.params;

  try {
    const clima = await getClimaDepartamento(departamento);

    if (!clima) {
      return Response.json(
        { error: "El departamento solicitado no existe." },
        { status: 404 },
      );
    }

    return Response.json(clima);
  } catch (error) {
    // Registro seguro: solo código HTTP y endpoint, nunca la URL (contiene la key).
    const detalle =
      error instanceof OpenWeatherError
        ? `${error.status} /${error.endpoint}`
        : "error inesperado";
    console.error("[api/clima]", departamento, detalle);

    return Response.json(
      { error: "No pudimos obtener el clima en este momento. Intenta de nuevo más tarde." },
      { status: 502 },
    );
  }
}
