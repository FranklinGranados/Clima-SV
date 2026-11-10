/**
 * /acerca (Server Component): información del proyecto, stack y fuente de datos.
 * Es contenido estático, así que se prerenderiza completo en el build.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { DEPARTAMENTOS } from "@/lib/departamentos";

export const metadata: Metadata = {
  title: "Acerca",
  description: "Qué es Clima SV, con qué tecnologías se construyó y de dónde salen los datos.",
};

// Total de ciudades consultadas: cabecera + 2 ciudades por departamento.
const TOTAL_CIUDADES = DEPARTAMENTOS.reduce((total, d) => total + 1 + d.ciudades.length, 0);

const STACK = [
  { nombre: "Next.js 16", detalle: "App Router, Server y Client Components, Cache Components" },
  { nombre: "React 19", detalle: "useState y useEffect en los componentes de cliente" },
  { nombre: "TypeScript", detalle: "Modo estricto, tipos para la respuesta de la API" },
  { nombre: "Tailwind CSS 4", detalle: "Diseño responsive mobile-first" },
  { nombre: "OpenWeather API", detalle: "Clima actual y pronóstico de 5 días (plan gratuito)" },
] as const;

export default function AcercaPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold md:text-4xl">Acerca de Clima SV</h1>
        <p className="text-lg text-texto-suave">
          Clima SV muestra el clima actual y el pronóstico de los {DEPARTAMENTOS.length} departamentos de El
          Salvador. Por cada departamento se consulta su cabecera y 2 ciudades más ({TOTAL_CIUDADES} en total).
        </p>
      </header>

      <section aria-labelledby="titulo-funciones" className="space-y-3">
        <h2 id="titulo-funciones" className="text-xl font-semibold">
          Qué puedes hacer
        </h2>
        <ul className="list-inside list-disc space-y-1 text-texto-suave">
          <li>Ver la temperatura actual de todos los departamentos en la página de inicio.</li>
          <li>Abrir el detalle de un departamento con humedad, viento y sensación térmica.</li>
          <li>Consultar el pronóstico de los próximos 5 días en bloques de 3 horas.</li>
          <li>
            <Link href="/comparar" className="font-medium text-primario underline-offset-4 hover:underline">
              Comparar
            </Link>{" "}
            hasta 4 departamentos lado a lado.
          </li>
        </ul>
      </section>

      <section aria-labelledby="titulo-stack" className="space-y-3">
        <h2 id="titulo-stack" className="text-xl font-semibold">
          Tecnologías
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STACK.map((tecnologia) => (
            <div key={tecnologia.nombre} className="rounded-xl border border-borde bg-superficie p-4">
              <dt className="font-semibold">{tecnologia.nombre}</dt>
              <dd className="text-sm text-texto-suave">{tecnologia.detalle}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="titulo-datos" className="space-y-3">
        <h2 id="titulo-datos" className="text-xl font-semibold">
          Fuente de los datos
        </h2>
        <p className="text-texto-suave">
          Los datos meteorológicos provienen de{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primario underline-offset-4 hover:underline"
          >
            OpenWeather
          </a>
          . Las ciudades se consultan por coordenadas (latitud y longitud) y los resultados se guardan en caché
          durante 10 minutos para respetar el límite del plan gratuito.
        </p>
        <p className="text-texto-suave">
          La clave de la API solo se usa en el servidor: el navegador consulta las rutas propias de la aplicación y
          nunca recibe la clave.
        </p>
      </section>

      <section aria-labelledby="titulo-nota" className="rounded-xl border border-acento/40 bg-acento/10 p-4">
        <h2 id="titulo-nota" className="font-semibold">
          Nota sobre los nombres
        </h2>
        <p className="text-sm text-texto-suave">
          Desde la reforma territorial de 2024, los antiguos municipios se llaman «distritos». En esta aplicación se
          usan los nombres tradicionales de las ciudades para que sean fáciles de reconocer.
        </p>
      </section>
    </article>
  );
}
