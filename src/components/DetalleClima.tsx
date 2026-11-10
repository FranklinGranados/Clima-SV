/**
 * Panel de métricas del clima de la cabecera (Server Component).
 * Las temperaturas usan <Temperatura> (cliente) para respetar la unidad elegida.
 */
import IconoClima from "@/components/IconoClima";
import Temperatura from "@/components/Temperatura";
import { formatearFecha, formatearHora } from "@/lib/formato";
import type { ClimaResumen } from "@/types/clima";

interface Metrica {
  etiqueta: string;
  valor: React.ReactNode;
}

export default function DetalleClima({ clima }: { clima: ClimaResumen }) {
  const metricas: Metrica[] = [
    { etiqueta: "Sensación térmica", valor: <Temperatura celsius={clima.sensacion} /> },
    { etiqueta: "Humedad", valor: `${clima.humedad} %` },
    { etiqueta: "Viento", valor: `${clima.vientoKmh} km/h` },
    {
      etiqueta: "Mín. / Máx.",
      valor: (
        <>
          <Temperatura celsius={clima.min} conUnidad={false} /> / <Temperatura celsius={clima.max} conUnidad={false} />
        </>
      ),
    },
    { etiqueta: "Amanecer", valor: formatearHora(clima.amanecer) },
    { etiqueta: "Atardecer", valor: formatearHora(clima.atardecer) },
  ];

  return (
    <section aria-labelledby="titulo-cabecera" className="space-y-6 rounded-2xl border border-borde bg-superficie p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="titulo-cabecera" className="text-lg font-semibold">
            {clima.ciudad} <span className="font-normal text-texto-suave">(cabecera)</span>
          </h2>
          <p className="text-sm text-texto-suave">
            Actualizado el {formatearFecha(clima.actualizado)} a las {formatearHora(clima.actualizado)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <IconoClima icono={clima.icono} descripcion={clima.descripcion} tamano={80} />
          <div>
            <p className="text-3xl font-bold md:text-5xl">
              <Temperatura celsius={clima.temperatura} />
            </p>
            <p className="capitalize text-texto-suave">{clima.descripcion}</p>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {metricas.map((metrica) => (
          <div key={metrica.etiqueta} className="rounded-xl bg-superficie-alta p-3">
            <dt className="text-xs text-texto-suave">{metrica.etiqueta}</dt>
            <dd className="text-lg font-semibold">{metrica.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
