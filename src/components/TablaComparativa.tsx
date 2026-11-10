/**
 * Tabla comparativa del clima de varios departamentos (sin hooks: servidor o cliente).
 * - Escritorio (md+): tabla con un departamento por columna.
 * - Móvil: tarjetas apiladas, una por departamento.
 * En cada métrica numérica se resalta el valor más alto (▲) y el más bajo (▼)
 * cuando hay al menos 2 departamentos con valores distintos.
 * Compara la CABECERA de cada departamento.
 */
import IconoClima from "@/components/IconoClima";
import Temperatura from "@/components/Temperatura";
import type { ClimaDepartamento, ClimaResumen } from "@/types/clima";

interface Metrica {
  etiqueta: string;
  valor: (clima: ClimaResumen) => number;
  mostrar: (clima: ClimaResumen) => React.ReactNode;
}

const METRICAS: readonly Metrica[] = [
  { etiqueta: "Temperatura", valor: (c) => c.temperatura, mostrar: (c) => <Temperatura celsius={c.temperatura} /> },
  { etiqueta: "Sensación térmica", valor: (c) => c.sensacion, mostrar: (c) => <Temperatura celsius={c.sensacion} /> },
  { etiqueta: "Mínima", valor: (c) => c.min, mostrar: (c) => <Temperatura celsius={c.min} /> },
  { etiqueta: "Máxima", valor: (c) => c.max, mostrar: (c) => <Temperatura celsius={c.max} /> },
  { etiqueta: "Humedad", valor: (c) => c.humedad, mostrar: (c) => `${c.humedad} %` },
  { etiqueta: "Viento", valor: (c) => c.vientoKmh, mostrar: (c) => `${c.vientoKmh} km/h` },
];

type Extremo = "alto" | "bajo" | null;

/** Indica si un valor es el más alto o el más bajo de su fila. */
function calcularExtremo(valor: number, todos: number[]): Extremo {
  const maximo = Math.max(...todos);
  const minimo = Math.min(...todos);
  if (todos.length < 2 || maximo === minimo) return null;
  if (valor === maximo) return "alto";
  if (valor === minimo) return "bajo";
  return null;
}

/** Valor de una celda con su marca de extremo (color + símbolo + texto para lectores de pantalla). */
function ValorMetrica({ contenido, extremo }: { contenido: React.ReactNode; extremo: Extremo }) {
  const estilos = {
    alto: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    bajo: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  };

  if (!extremo) return <span className="font-medium">{contenido}</span>;

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${estilos[extremo]}`}>
      <span aria-hidden="true">{extremo === "alto" ? "▲" : "▼"}</span>
      {contenido}
      <span className="sr-only">{extremo === "alto" ? " (el más alto)" : " (el más bajo)"}</span>
    </span>
  );
}

export default function TablaComparativa({ departamentos }: { departamentos: ClimaDepartamento[] }) {
  // Valores numéricos de cada fila, para calcular el más alto y el más bajo.
  const valoresPorMetrica = METRICAS.map((metrica) => departamentos.map((d) => metrica.valor(d.cabecera)));

  return (
    <>
      {/* Escritorio: tabla */}
      <div className="hidden overflow-x-auto rounded-2xl border border-borde bg-superficie md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Comparación del clima actual en las cabeceras departamentales</caption>
          <thead className="bg-superficie-alta">
            <tr>
              <th scope="col" className="p-3 font-semibold">
                Métrica
              </th>
              {departamentos.map((d) => (
                <th key={d.slug} scope="col" className="p-3">
                  <div className="flex items-center gap-2">
                    <IconoClima icono={d.cabecera.icono} descripcion={d.cabecera.descripcion} tamano={40} />
                    <div>
                      <p className="font-semibold">{d.nombre}</p>
                      <p className="text-xs font-normal capitalize text-texto-suave">{d.cabecera.descripcion}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {METRICAS.map((metrica, fila) => (
              <tr key={metrica.etiqueta}>
                <th scope="row" className="p-3 font-medium text-texto-suave">
                  {metrica.etiqueta}
                </th>
                {departamentos.map((d) => (
                  <td key={d.slug} className="p-3">
                    <ValorMetrica
                      contenido={metrica.mostrar(d.cabecera)}
                      extremo={calcularExtremo(metrica.valor(d.cabecera), valoresPorMetrica[fila] ?? [])}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Móvil: tarjetas apiladas */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {departamentos.map((d) => (
          <li key={d.slug} className="rounded-2xl border border-borde bg-superficie p-4">
            <div className="mb-3 flex items-center gap-2">
              <IconoClima icono={d.cabecera.icono} descripcion={d.cabecera.descripcion} tamano={48} />
              <div>
                <h3 className="font-semibold">{d.nombre}</h3>
                <p className="text-sm capitalize text-texto-suave">{d.cabecera.descripcion}</p>
              </div>
            </div>
            <dl className="divide-y divide-borde text-sm">
              {METRICAS.map((metrica, fila) => (
                <div key={metrica.etiqueta} className="flex items-center justify-between py-2">
                  <dt className="text-texto-suave">{metrica.etiqueta}</dt>
                  <dd>
                    <ValorMetrica
                      contenido={metrica.mostrar(d.cabecera)}
                      extremo={calcularExtremo(metrica.valor(d.cabecera), valoresPorMetrica[fila] ?? [])}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
