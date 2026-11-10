/**
 * Clima actual de una ciudad del departamento (Server Component async).
 * Hace 1 llamada (cacheada 10 min por coordenada). Va dentro de <Suspense>.
 */
import IconoClima from "@/components/IconoClima";
import Temperatura from "@/components/Temperatura";
import { getClimaActual } from "@/lib/openweather";
import type { Ciudad } from "@/types/departamento";

export default async function TarjetaCiudad({ ciudad }: { ciudad: Ciudad }) {
  const clima = await getClimaActual(ciudad);

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-borde bg-superficie p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{clima.ciudad}</h3>
        <IconoClima icono={clima.icono} descripcion={clima.descripcion} />
      </header>
      <div>
        <p className="text-3xl font-bold">
          <Temperatura celsius={clima.temperatura} />
        </p>
        <p className="capitalize text-texto-suave">{clima.descripcion}</p>
      </div>
      <dl className="mt-auto grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-texto-suave">Sensación</dt>
          <dd className="font-medium">
            <Temperatura celsius={clima.sensacion} conUnidad={false} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-texto-suave">Humedad</dt>
          <dd className="font-medium">{clima.humedad} %</dd>
        </div>
        <div>
          <dt className="text-xs text-texto-suave">Viento</dt>
          <dd className="font-medium">{clima.vientoKmh} km/h</dd>
        </div>
      </dl>
    </article>
  );
}
