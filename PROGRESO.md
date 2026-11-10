# Progreso — Clima SV

Plan completo en [PLAN.md](PLAN.md). Reglas en [CLAUDE.md](CLAUDE.md).

> **Punto de retorno (2026-11-09):** iteraciones 1–4 con commit (`20fe89e`); iteración 5 terminada, **pendiente de commit**.
> Siguiente: **iteración 6** (/departamento/[nombre]/pronostico).
> Para retomar en una sesión nueva: "lee CLAUDE.md, PLAN.md y PROGRESO.md y continúa con la iteración 6".

| # | Iteración | Estado |
|---|---|---|
| 1 | Tipos y datos (sin UI) | ✅ Hecha |
| 2 | Capa de API segura + Route Handler + validación de coordenadas | ✅ Hecha (commit `053dbf4`) |
| 3 | Layout, navegación y /acerca | ✅ Hecha (commit `03b055e`) |
| 4 | Página principal + TanStack Query (precarga al pasar el puntero) | ✅ Hecha (commit `20fe89e`) |
| 5 | /departamento/[nombre] | ✅ Hecha (pendiente de commit) |
| 6 | /departamento/[nombre]/pronostico | ⏳ Pendiente |
| 7 | /comparar (hasta 4) | ⏳ Pendiente |
| 8 | Pulido, README y build final | ⏳ Pendiente |

---

## Iteración 1 — Tipos y datos (2026-11-08)

### Hecho
- `src/types/openweather.ts`: tipos crudos de `/data/2.5/weather` y `/data/2.5/forecast`.
- `src/types/clima.ts`: modelos normalizados (`ClimaResumen`, `ClimaDepartamento`, `PronosticoDia`, `PronosticoBloque`).
- `src/types/departamento.ts`: `Zona`, `Ciudad` y `Departamento` (con la tupla de 2 ciudades).
- `src/lib/departamentos.ts`: 14 departamentos y 42 ciudades con lat/lon, más `getDepartamento`, `getSlugs`, `getDepartamentosPorZona` y `ZONAS`.
- `src/lib/formato.ts`: `redondearTemperatura`, `msAKmh`, `formatearHora`, `formatearFecha`, `formatearDiaSemana` y `fechaIsoLocal`.
- Verificación: `tsc --noEmit` ✅, `eslint src` ✅.

### Cambios respecto al plan
- `ClimaResumen` incluye `amanecer` y `atardecer` (se usan en el detalle del departamento).
- El campo temporal `nombreOW` se agrega en la iteración 2, solo para la validación de coordenadas.

---

## Iteración 2 — Capa de API segura y Route Handler (2026-11-08)

### Hecho
- `src/lib/openweather.ts` (**solo servidor**, `import "server-only"`): `getClimaActual`, `getClimaDepartamento`, `getPronostico` con `'use cache'` + `cacheLife({ revalidate: 600 })`, y la clase `OpenWeatherError`.
- `src/lib/pronostico.ts`: `agruparPorDia` (bloques de 3 h → `PronosticoDia[]` en hora de El Salvador).
- `src/app/api/clima/[departamento]/route.ts` (**Route Handler**): lista blanca de slugs, 404 si no existe, 502 genérico si falla OpenWeather.
- Verificación: `next typegen` ✅, `tsc --noEmit` ✅, `eslint src` ✅, `curl /api/clima/xyz` → 404 ✅, `curl /api/clima/san-salvador` → 200 ✅.
- Seguridad: "appid" aparece 0 veces en las respuestas y 0 en el log del servidor; no hay `console.log` en `src/`.

### Validación de coordenadas (campo `name` de OpenWeather)
Resultado: **36 de 42 coincidían**. San Salvador se corrigió y 5 ciudades quedaron aceptadas tras revisarlas a mano.

| Departamento | Ciudad | `name` de OpenWeather | Distancia al centro real (OSM) | Resolución |
|---|---|---|---|---|
| San Salvador | San Salvador | Antiguo Cuscatlán | ≈ 3.0 km | **Corregida** a 13.6976, -89.1912 → ahora devuelve "San Salvador" ✅ |
| Chalatenango | La Palma | Llano de La Virgen | ≈ 0.4 km | Aceptada: es el etiquetado de OpenWeather |
| Cuscatlán | San Pedro Perulapán | Tecoluca (cantón) | ≈ 0.5 km | Aceptada |
| San Vicente | Tecoluca | Departamento de San Vicente | ≈ 0.5 km | Aceptada |
| Morazán | Perquín | La Chorrera | ≈ 0.1 km | Aceptada |
| Morazán | San Francisco Gotera | San Francisco | — | Aceptada: es el nombre oficial |

El campo temporal `nombreOW` se quitó de `ClimaResumen` y de `openweather.ts` al terminar.

### Notas
- `npm run dev` generó un archivo `AGENTS.md` por `experimental.agentFeedback` en `next.config.ts`. No lo creó Claude; queda a decisión del usuario si se versiona o se desactiva.

### Pendiente
- ~~Iteración 3~~ (hecha, ver abajo).

---

## Iteración 3 — Layout, navegación y /acerca (2026-11-09)

### Hecho
- `src/app/layout.tsx` (servidor): `lang="es"`, metadata en español con plantilla de título (`%s | Clima SV`), Header, `<main>` responsive y Footer.
- `src/app/globals.css`: paleta con variables CSS (claro y oscuro según el sistema) expuestas a Tailwind con `@theme` (`bg-fondo`, `text-primario`, `border-borde`…). Fuente Geist.
- `src/components/Header.tsx` (servidor): logo, enlaces en línea desde `md:` y botón de menú en móvil.
- `src/components/MenuMovil.tsx` (**cliente**): `useState` para abrir/cerrar y `useEffect` para cerrar con Escape; se cierra al navegar.
- `src/components/EnlaceNav.tsx` (**cliente**): enlace que resalta la ruta activa con `usePathname` y `aria-current="page"`.
- `src/lib/navegacion.ts`: lista única de enlaces (`Inicio`, `Comparar`, `Acerca`) y `esRutaActiva()`.
- `src/components/Footer.tsx` (servidor): créditos y enlace a OpenWeather.
- `src/app/acerca/page.tsx` (servidor, estática): funciones, stack, fuente de datos, nota sobre la clave y nota sobre los «distritos» (reforma 2024).
- `src/app/not-found.tsx` (servidor): 404 en español con botón "Volver al inicio".
- Verificación: `tsc --noEmit` ✅, `eslint src` ✅, `next build` ✅ (`/` y `/acerca` estáticas).
  Con `next start`: `/` 200, `/acerca` 200, `/no-existe` 404 con la página en español. "appid" y `OPENWEATHER_API_KEY` aparecen 0 veces en `.next/static`.

### Cambios respecto al plan
- Se agregaron `EnlaceNav.tsx` y `src/lib/navegacion.ts`, que no estaban en el plan: así el Header y el MenuMovil comparten los enlaces y el resaltado de la ruta activa sin duplicar código.
- Los enlaces que usan `usePathname` van dentro de `<Suspense>` con un enlace sin resaltar como fallback. La doc de Next 16.4 (`use-pathname.md`) indica que, con `cacheComponents`, `usePathname` puede suspender en rutas con params dinámicos, y sin `Suspense` el build fallaría.
- El Footer no calcula el año con `new Date()`: con `cacheComponents` eso volvería dinámico el layout.

### Pendiente / notas
- `/comparar` responde 404 hasta la iteración 7 (el enlace del menú ya existe).
- ~~`src/app/page.tsx` era la plantilla~~: reemplazada en la iteración 4.
- Falta la revisión visual en 375 / 768 / 1280 px con DevTools (no tengo navegador en esta sesión).

---

## Iteración 4 — Página principal + TanStack Query (2026-11-09)

### Hecho
- Instalado `@tanstack/react-query@5.107.1` (versión exacta, verificada en npm: MIT, modificada el 2026-11-06, peer React ^19). `npm audit --omit=dev`: 0 vulnerabilidades.
- `src/app/page.tsx` (servidor): 14 departamentos agrupados por zona. Cada tarjeta va en su propio `<Suspense>` con `TarjetaSkeleton`.
- `src/components/TarjetaDepartamento.tsx` (servidor async): clima de la cabecera (1 llamada), nombres de las 2 ciudades, "Ver ciudades" y "Ver detalle".
- `src/components/TarjetaSkeleton.tsx`, `src/components/IconoClima.tsx` (`next/image` con `sizes`).
- `src/components/BuscadorDepartamentos.tsx` (**cliente**, `useState`): filtra por departamento, cabecera o ciudad, ignorando tildes. Recibe las tarjetas ya renderizadas en el servidor, así que filtrar no vuelve a pedir el clima.
- `src/components/providers/QueryProvider.tsx` (**cliente**): `QueryClient` en `useState`, `staleTime` 10 min, `retry: 1`, sin refetch al enfocar la ventana. Envuelve el `<main>` en `layout.tsx`.
- `src/lib/consultasClima.ts`: `climaKeys`, `fetchClimaDepartamento` (solo llama a `/api/clima/[slug]`) y `opcionesClimaDepartamento`.
- `src/hooks/usePrefetchHover.ts` (**cliente**): precarga a los 150 ms con mouse, foco o toque; cancela si el puntero sale antes y limpia el temporizador al desmontar (`useEffect`).
- `src/components/VerCiudades.tsx` (**cliente**): precarga al pasar el puntero y al hacer clic despliega las 2 ciudades con `useQuery` (estados de carga, error y "Reintentar").
- `src/app/loading.tsx` (skeleton global) y `src/app/error.tsx` (**cliente**, botón "Reintentar" con `retry()`, sin mostrar detalles técnicos).
- `next.config.ts`: `images.remotePatterns` solo para `https://openweathermap.org/img/wn/**`.

### Verificación
- `tsc --noEmit` ✅, `eslint src` ✅, `next build` ✅. `/` queda **estática con revalidación cada 10 min** (`Revalidate 10m` en el build).
- Con `next start`: `/` 200 con 14 tarjetas, 14 temperaturas y 4 zonas; el icono vía `/_next/image` responde 200 `image/png`; `/api/clima/santa-ana` 200; `/api/clima/xyz` 404.
- "appid" aparece 0 veces en el HTML de la home y 0 en `.next/static`.

### Cambios respecto al plan
- Se agregó `opcionesClimaDepartamento()` en `consultasClima.ts` para reutilizar `queryKey` + `queryFn` en `useQuery`, `prefetchQuery` y (en la iteración 7) `useQueries`.
- El buscador también encuentra por nombre de ciudad, no solo de departamento.
- Se instaló con `--save-exact` para fijar la versión autorizada.

### Pendiente / notas
- **Falta probar en el navegador** (no tengo uno en esta sesión): la precarga en DevTools → Network (un solo `GET /api/clima/<slug>` al pasar el puntero, ninguno si pasa en menos de 150 ms, y que el clic no repita la petición), y el diseño en 375, 768 y 1280 px.
- "Ver detalle" lleva a `/departamento/[slug]`, que da 404 hasta la iteración 5.
- Si una sola cabecera falla, se muestra `error.tsx` para toda la página (como dice el plan). Se puede cambiar por un aviso dentro de la tarjeta si lo prefieres.

---

## Iteración 5 — /departamento/[nombre] (2026-11-09)

### Hecho
- `src/app/departamento/[nombre]/page.tsx` (servidor): `generateStaticParams` (14 slugs), `generateMetadata` ("Clima en …") y `notFound()` si el slug no está en la lista blanca. Muestra la ruta de navegación, la zona, el selector °C/°F, el enlace al pronóstico, el detalle de la cabecera y las 2 ciudades (cada bloque en su `<Suspense>`).
- `src/app/departamento/[nombre]/loading.tsx` (servidor) y `error.tsx` (**cliente**, "Reintentar" con `retry()` y "Volver al inicio").
- `src/components/DetalleClima.tsx` (servidor): temperatura, descripción, hora de actualización y 6 métricas (sensación, humedad, viento, mín./máx., amanecer, atardecer). Grilla de 2, 3 o 6 columnas según el ancho.
- `src/components/TarjetaCiudad.tsx` (servidor async): clima de una ciudad (1 llamada).
- `src/components/providers/UnidadProvider.tsx` (**cliente**): unidad °C/°F con `useState`; `useEffect` la restaura de `localStorage` al montar y se guarda al cambiarla. Va en `layout.tsx`.
- `src/components/SelectorUnidad.tsx` (**cliente**): botones °C/°F (`aria-pressed`, 44 px).
- `src/components/Temperatura.tsx` (**cliente**): muestra °C o °F según la preferencia.
- `src/lib/formato.ts`: nueva función `celsiusAFahrenheit`.

### Verificación
- `tsc` ✅, `eslint` ✅, `next build` ✅: los 14 departamentos se prerenderizan con revalidación cada 10 min.
- Con `next start`: `/departamento/san-salvador` y `/departamento/morazan` responden 200 con su título, el detalle y sus 2 ciudades. "appid" aparece 0 veces en el HTML y en `.next/static`.

### Cambios respecto al plan
- Se agregó `UnidadProvider` (contexto). Sin él, cada `<Temperatura>` tendría su propio estado y el selector no podría cambiarlas todas a la vez.
- `eslint` (`react-hooks/set-state-in-effect`) marca el `setState` dentro del `useEffect` que restaura `localStorage`. Se dejó un `eslint-disable` en esa sola línea, justificado: leer `localStorage` después de hidratar es el caso de uso legítimo (sincronizar con un sistema externo) y el plan pide `useEffect`. Guardar se hace en el evento del clic, no en un efecto.
- Con `cacheComponents` no existe `dynamicParams = false`; la lista blanca se valida con `getDepartamento` + `notFound()`.

### Pendiente / notas
- **`/departamento/inexistente` muestra la página 404 en español, pero responde HTTP 200.** Con `cacheComponents`, el layout ya empezó a transmitirse cuando se llama a `notFound()`; la doc de `not-found.md` lo describe así y Next agrega `<meta name="robots" content="noindex">`. Si se quiere un 404 real, la opción es un `proxy.ts` que valide el slug antes de renderizar. Se propone para la iteración 8.
- El selector °C/°F solo está en el detalle. La home y "Ver ciudades" siguen en °C (se puede extender en la iteración 8).
- "Ver pronóstico de 5 días" da 404 hasta la iteración 6.
- Falta probar en el navegador el cambio °C/°F y que se recuerde al recargar, y revisar el diseño en 375, 768 y 1280 px.
- **Cambio sin commit en `src/lib/departamentos.ts`** (no lo hizo Claude): la cabecera de San Salvador volvió a `13.6929, -89.2182`. En la iteración 2 esa coordenada devolvía "Antiguo Cuscatlán" y se había corregido a `13.6976, -89.1912`. El usuario confirma si es intencional.
