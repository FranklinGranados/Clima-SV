# Progreso — Clima SV

Plan completo en [PLAN.md](PLAN.md). Reglas en [CLAUDE.md](CLAUDE.md).

> **Punto de retorno (2026-11-09):** iteraciones 1 y 2 con commit (`053dbf4`); iteración 3 terminada, **pendiente de commit**.
> Siguiente: **iteración 4** (página principal + TanStack Query).
> Para retomar en una sesión nueva: "lee CLAUDE.md, PLAN.md y PROGRESO.md y continúa con la iteración 4".

| # | Iteración | Estado |
|---|---|---|
| 1 | Tipos y datos (sin UI) | ✅ Hecha |
| 2 | Capa de API segura + Route Handler + validación de coordenadas | ✅ Hecha (commit `053dbf4`) |
| 3 | Layout, navegación y /acerca | ✅ Hecha (pendiente de commit) |
| 4 | Página principal + TanStack Query (precarga al pasar el puntero) | ⏳ Pendiente |
| 5 | /departamento/[nombre] | ⏳ Pendiente |
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
- `src/app/page.tsx` sigue siendo la plantilla de create-next-app; se reemplaza en la iteración 4.
- Falta la revisión visual en 375 / 768 / 1280 px con DevTools (no tengo navegador en esta sesión).
