/**
 * Página principal "/" (Server Component).
 * Lista los 14 departamentos agrupados por zona. Cada tarjeta es un Server Component
 * async dentro de su propio <Suspense>, así una tarjeta lenta no bloquea a las demás.
 * Presupuesto: 14 llamadas (solo cabeceras), cacheadas 10 min en el servidor.
 */
import { Suspense } from "react";
import BuscadorDepartamentos, { type GrupoZona } from "@/components/BuscadorDepartamentos";
import TarjetaDepartamento from "@/components/TarjetaDepartamento";
import TarjetaSkeleton from "@/components/TarjetaSkeleton";
import { DEPARTAMENTOS, getDepartamentosPorZona, ZONAS } from "@/lib/departamentos";

export default function HomePage() {
  // Se arma en el servidor: datos estáticos + tarjetas ya envueltas en Suspense.
  const grupos: GrupoZona[] = ZONAS.map((zona) => ({
    id: zona.id,
    nombre: zona.nombre,
    departamentos: getDepartamentosPorZona(zona.id).map((departamento) => ({
      slug: departamento.slug,
      nombres: [departamento.nombre, departamento.cabecera.nombre, ...departamento.ciudades.map((c) => c.nombre)],
      tarjeta: (
        <Suspense fallback={<TarjetaSkeleton />}>
          <TarjetaDepartamento departamento={departamento} />
        </Suspense>
      ),
    })),
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold md:text-4xl">El clima en El Salvador</h1>
        <p className="text-texto-suave">
          Temperatura actual en la cabecera de los {DEPARTAMENTOS.length} departamentos. Pasa el puntero (o toca) «Ver
          ciudades» para ver sus otras 2 ciudades.
        </p>
      </header>

      <BuscadorDepartamentos grupos={grupos} />
    </div>
  );
}
