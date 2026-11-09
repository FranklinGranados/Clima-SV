# Iteracion 1
Lee el archivo claude.md, ahí encontrarás el objetivo del proyecto junto con las rutas y las reglas a seguir. En todo el transcurso de la construcción de este proyecto, dale un vistazo a la estructura actual, ya que me encargué de crear el proyecto basado en next.js. Aparte de eso, necesito que crees un plan para la construcción dividido en iteraciones pequeñas. En las cuales yo tenga que aprobar y hacer commit de manera manual. Esto quiere decir que no utilizaremos el modo automático, sino el modo manual. Y cada vez que me indiques qué vas a realizar, por favor dame datos como qué archivos vas a crear o modificar con la ruta y qué hace cada uno y si es componente de servidor o componente de cliente. Y en el plan trata de incluir los tipos de TypeScript que se va a definir para la respuesta de OpenWeather. Y cómo funcionará el route handler que protege la API key, ya que está alojada en el .env.local. Esa trata de no leerla ni demostrarla. Ya tiene sus datos cargados para echarla a andar. La aplicación podrá listar en la raíz o página principal los 14 departamentos de El Salvador y tener diseño responsivo. Con sus ciudades de cada uno. Aún no vayas a aplicar cambios. Si hace falta información o más contexto, pregúntame antes de proponer el plan.

# Decision
Se degrado de cabecera y 6 ciudades a cabecera y 2 ciudades por departamento, debido a que son demasiadas consultas y se esta asegurando de evitar coordenadas inventadas. EL PLAN QUEDA MODIFICADO

# Iteracion 2
Usemos tanstack query para precarga de datos

# Decision
Aceptamos instalar @tanstack/react-query@5.107.1 como dependencia

# Iteracion 3 (Plan: Iteración 1 — Tipos y datos)
## Prompt
apruebo el plan, comienza

## Qué hizo Claude
- Creó los tipos de la respuesta cruda de OpenWeather en `src/types/openweather.ts` (`OWClimaActual`, `OWPronostico`, `OWPronosticoItem`, `OWError`, etc.).
- Creó los modelos normalizados en `src/types/clima.ts` (`ClimaResumen`, `ClimaDepartamento`, `PronosticoDia`, `PronosticoBloque`).
- Creó `src/types/departamento.ts`. `ciudades` es una tupla `[Ciudad, Ciudad]`, así TypeScript obliga a que sean exactamente 2.
- Creó `src/lib/departamentos.ts` con los 14 departamentos (cabecera + 2 ciudades, coordenadas lat/lon). Funciona como lista blanca para el Route Handler.
- Creó `src/lib/formato.ts` con funciones puras: km/h, redondeo y fechas en hora de El Salvador (`America/El_Salvador`).
- Creó `PROGRESO.md`.
- Verificación: `npx tsc --noEmit` y `npx eslint src` pasaron sin errores.

## Problemas
- Ninguno bloqueante. Las coordenadas son aproximadas y se validan en la siguiente iteración comparándolas con el campo `name` de OpenWeather.
- Se agregaron `amanecer` y `atardecer` a `ClimaResumen`, que el plan no tenía. Hacen falta para el detalle del departamento (iteración 5).

# Decision

