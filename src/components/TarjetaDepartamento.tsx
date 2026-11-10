/**
 * Tarjeta de un departamento en la home (Server Component async).
 * Consulta SOLO el clima de la cabecera (1 llamada, cacheada 10 min).
 * Las 2 ciudades se muestran por nombre; su clima lo trae VerCiudades bajo demanda.
 * Se renderiza dentro de <Suspense> con TarjetaSkeleton como fallback.
 */
import Link from "next/link";
import IconoClima from "@/components/IconoClima";
import VerCiudades from "@/components/VerCiudades";
import { formatearHora } from "@/lib/formato";
import { getClimaActual } from "@/lib/openweather";
import type { Departamento } from "@/types/departamento";

export default async function TarjetaDepartamento({ departamento }: { departamento: Departamento }) {
  const clima = await getClimaActual(departamento.cabecera);

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-borde bg-superficie p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">
            <Link
              href={`/departamento/${departamento.slug}`}
              className="underline-offset-4 hover:text-primario hover:underline"
            >
              {departamento.nombre}
            </Link>
          </h3>
          <p className="text-sm text-texto-suave">Cabecera: {departamento.cabecera.nombre}</p>
        </div>
        <IconoClima icono={clima.icono} descripcion={clima.descripcion} />
      </header>

      <div>
        <p className="text-4xl font-bold md:text-5xl">{clima.temperatura}°C</p>
        <p className="capitalize text-texto-suave">{clima.descripcion}</p>
        <p className="text-xs text-texto-suave">
          Mín. {clima.min}° · Máx. {clima.max}° · Actualizado {formatearHora(clima.actualizado)}
        </p>
      </div>

      <p className="text-sm text-texto-suave">
        Ciudades: {departamento.ciudades.map((ciudad) => ciudad.nombre).join(" y ")}
      </p>

      <div className="mt-auto space-y-2">
        <VerCiudades slug={departamento.slug} nombreDepartamento={departamento.nombre} />
        <Link
          href={`/departamento/${departamento.slug}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primario px-3 text-sm font-semibold text-superficie transition-opacity hover:opacity-90"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
