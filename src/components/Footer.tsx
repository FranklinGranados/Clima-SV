/**
 * Pie de página (Server Component): créditos y fuente de los datos.
 * No usa new Date() para el año: con cacheComponents eso volvería dinámico el layout.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-borde bg-superficie">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-texto-suave sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Clima SV · Tarea semana 21 · Bootcamp Full Stack Junior UTEC</p>
        <p>
          Datos:{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primario underline-offset-4 hover:underline"
          >
            OpenWeather
          </a>
        </p>
      </div>
    </footer>
  );
}
