# Progreso — Clima SV

Plan completo en [PLAN.md](PLAN.md). Reglas en [CLAUDE.md](CLAUDE.md).

| # | Iteración | Estado |
|---|---|---|
| 1 | Tipos y datos (sin UI) | ✅ Hecha |
| 2 | Capa de API segura + Route Handler + validación de coordenadas | ✅ Hecha (pendiente de commit) |
| 3 | Layout, navegación y /acerca | ⏳ Pendiente |
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
- Iteración 3: layout en español, Header, `MenuMovil` (cliente), Footer, `/acerca` y `not-found.tsx`.
