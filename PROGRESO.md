# Progreso — Clima SV

Plan completo en [PLAN.md](PLAN.md). Reglas en [CLAUDE.md](CLAUDE.md).

| # | Iteración | Estado |
|---|---|---|
| 1 | Tipos y datos (sin UI) | ✅ Hecha (pendiente de commit) |
| 2 | Capa de API segura + Route Handler + validación de coordenadas | ⏳ Pendiente |
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

### Pendiente
- Iteración 2: `src/lib/openweather.ts`, `src/lib/pronostico.ts`, `src/app/api/clima/[departamento]/route.ts` y la tabla de validación de coordenadas (campo `name`).
