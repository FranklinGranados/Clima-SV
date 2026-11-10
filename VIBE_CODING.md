# Planificación: plan inicial
Lee el archivo claude.md, ahí encontrarás el objetivo del proyecto junto con las rutas y las reglas a seguir. En todo el transcurso de la construcción de este proyecto, dale un vistazo a la estructura actual, ya que me encargué de crear el proyecto basado en next.js. Aparte de eso, necesito que crees un plan para la construcción dividido en iteraciones pequeñas. En las cuales yo tenga que aprobar y hacer commit de manera manual. Esto quiere decir que no utilizaremos el modo automático, sino el modo manual. Y cada vez que me indiques qué vas a realizar, por favor dame datos como qué archivos vas a crear o modificar con la ruta y qué hace cada uno y si es componente de servidor o componente de cliente. Y en el plan trata de incluir los tipos de TypeScript que se va a definir para la respuesta de OpenWeather. Y cómo funcionará el route handler que protege la API key, ya que está alojada en el .env.local. Esa trata de no leerla ni demostrarla. Ya tiene sus datos cargados para echarla a andar. La aplicación podrá listar en la raíz o página principal los 14 departamentos de El Salvador y tener diseño responsivo. Con sus ciudades de cada uno. Aún no vayas a aplicar cambios. Si hace falta información o más contexto, pregúntame antes de proponer el plan.

# Decision
Se degrado de cabecera y 6 ciudades a cabecera y 2 ciudades por departamento, debido a que son demasiadas consultas y se esta asegurando de evitar coordenadas inventadas. EL PLAN QUEDA MODIFICADO

# Planificación: ajustes (2 ciudades y TanStack Query)
Usemos tanstack query para precarga de datos

# Decision
Aceptamos instalar @tanstack/react-query@5.107.1 como dependencia

# teración 1 — Tipos y datos
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
Revise las coordenadas de las 42 ciudades y las cabeceras, y las aprobé; la validación final con OpenWeather queda para la iteración 2

# Iteración 2 — Capa de API segura y Route Handler
## Prompt
commit realizado, continua

## Qué hizo Claude
- Creó `src/lib/openweather.ts` (solo servidor, con `import "server-only"`). Es el único archivo que lee `OPENWEATHER_API_KEY`. Tiene:
  - `getClimaActual`, `getClimaDepartamento` y `getPronostico`, con `'use cache'` + `cacheLife({ revalidate: 600 })`.
  - La clase `OpenWeatherError`, que solo guarda el código HTTP y el endpoint, nunca la URL.
- Creó `src/lib/pronostico.ts`: `agruparPorDia`, que convierte los bloques de 3 h en días locales de El Salvador.
- Creó `src/app/api/clima/[departamento]/route.ts`:
  - `GET` con lista blanca de slugs: 404 si no existe y 502 con un mensaje en español si falla OpenWeather.
  - `console.error` sin datos sensibles.
- Pruebas con `curl`: `/api/clima/xyz` → 404 y `/api/clima/san-salvador` → 200. La palabra "appid" aparece 0 veces en las respuestas y 0 en el log del servidor.
- Validó las 42 coordenadas con un campo temporal `nombreOW` (el `name` de OpenWeather) y lo quitó al terminar.
- Al levantar `npm run dev`, Next 16 generó por su cuenta un archivo `AGENTS.md`, por la opción `experimental.agentFeedback` de `next.config.ts`.

## Problemas
- Desafío: 5 de 42 ciudades no coincidían con el nombre que devuelve OpenWeather.
- Investigación: pedí una tabla con las distancias, contrastada con OpenStreetMap.
- Decisión: corregí San Salvador (estaba desviada unos 3 km) y acepté las otras 4, porque estaban a menos de 0.5 km del centro: el nombre distinto se debe al etiquetado de OpenWeather, no a un error de coordenadas.

# Decision
Se corrigio la coordenada para san salvador y las otras 4 se determinaron como revisadas a mano

# Iteración 3 — Layout, navegación y /acerca
## Prompt
lee CLAUDE.md, PLAN.md y PROGRESO.md y continúa con la iteración 3

## Qué hizo Claude
- Cambió el layout raíz a español (`lang="es"`, metadata con plantilla de título) y agregó Header y Footer.
- Definió la paleta en `globals.css` con variables CSS (modo claro y oscuro) expuestas a Tailwind con `@theme`.
- Creó `Header` (servidor), `MenuMovil` (cliente, `useState` + `useEffect` para cerrar con Escape), `EnlaceNav` (cliente, resalta la ruta activa) y `Footer` (servidor).
- Creó `src/lib/navegacion.ts` con la lista única de enlaces.
- Creó `/acerca` (estática) y `not-found.tsx` en español.
- Verificación: `tsc`, `eslint` y `next build` sin errores; con `next start`, `/` y `/acerca` dan 200 y una ruta inexistente da 404 con la página en español.

## Problemas
- Con `cacheComponents: true`, la doc de Next 16.4 avisa que `usePathname` puede suspender en rutas con params dinámicos y romper el build. Se envolvieron los enlaces activos en `<Suspense>` con un enlace sin resaltar como fallback.
- Se evitó `new Date()` en el Footer para no volver dinámico el layout.
- Se agregaron 2 archivos fuera del plan (`EnlaceNav.tsx` y `navegacion.ts`) para no duplicar los enlaces entre el Header y el menú móvil.
- `/comparar` todavía da 404: se crea en la iteración 7.


# Decision
Se aprobo a claude realizar pruebas con las paginas nuevas

# Iteración 4 — Página principal + TanStack Query
## Prompt
commit realizado, continua

## Qué hizo Claude
- Verificó `@tanstack/react-query@5.107.1` en npm y lo instaló con versión exacta (ya estaba autorizado).
- Reemplazó la home por los 14 departamentos agrupados por zona. Cada tarjeta es un Server Component async en su propio `<Suspense>` y consulta solo la cabecera.
- Creó el buscador (cliente, `useState`). Filtra tarjetas que ya vienen renderizadas desde el servidor, sin volver a llamar a la API.
- Creó `QueryProvider`, `consultasClima.ts`, el hook `usePrefetchHover` (150 ms, mouse/foco/toque) y `VerCiudades` (`useQuery` al desplegar).
- Creó `loading.tsx` y `error.tsx` (con `retry()`), y permitió en `next.config.ts` solo los iconos de OpenWeather.
- Verificación: `tsc`, `eslint` y `build` sin errores; con `next start`, la home muestra 14 temperaturas, los iconos cargan, y "appid" no aparece en el HTML ni en `.next/static`.

## Problemas
- El buscador es de cliente, pero las tarjetas son de servidor. Se resolvió pasando las tarjetas ya renderizadas como prop (`ReactNode`): el cliente solo decide cuáles mostrar.
- `npm install` avisó de vulnerabilidades en dependencias de desarrollo; en producción hay 0 (`npm audit --omit=dev`). No se tocaron.
- No se pudo probar la precarga al pasar el puntero en un navegador real desde esta sesión; queda para revisión manual en DevTools → Network.

# Decision
Se ha aceptado la manera en que claude aplico tanstack query, y se ha comprobado por primera vez el proyecto 

# Iteración 5 — /departamento/[nombre]
## Prompt
ok continuemos ya esta el commit

## Qué hizo Claude
- Creó la página de detalle con `generateStaticParams` (14 departamentos prerenderizados), `generateMetadata` y `notFound()` para slugs que no están en la lista blanca.
- Creó `DetalleClima` (6 métricas de la cabecera) y `TarjetaCiudad` (cada ciudad en su `<Suspense>`), además de `loading.tsx` y `error.tsx` del segmento.
- Creó el cambio °C/°F: `UnidadProvider` (`useState` + `useEffect` con `localStorage`), `SelectorUnidad` y `Temperatura`, y la función `celsiusAFahrenheit`.
- Verificación: `tsc`, `eslint` y `build` sin errores; las páginas de San Salvador y Morazán responden 200 con su contenido y sin "appid".

## Problemas
- `eslint` marca `setState` dentro de `useEffect` (`react-hooks/set-state-in-effect`). Se probó quitar la excepción y la regla falla; se dejó un `eslint-disable` en una sola línea, justificado: restaurar `localStorage` después de hidratar es el caso legítimo. Se quitó un segundo efecto: la unidad se guarda al hacer clic.
- Con `cacheComponents`, `dynamicParams` no existe, y un slug inexistente muestra la página 404 pero con estado HTTP 200 (el layout ya se estaba transmitiendo). Queda propuesto un `proxy.ts` para la iteración 8.
- Se detectó un cambio sin commit en `departamentos.ts`: la coordenada de San Salvador volvió a la que daba "Antiguo Cuscatlán". No se tocó; queda a confirmar.

# Decision
se aceptaron todos los cambios

# Desafío: 
al revisar, la coordenada de San Salvador no coincidía con su comentario de “corregida” por un cambio manual mío. Verifiqué el valor y lo dejé en el centro de la ciudad (13.6976, -89.1912).

# Iteración 6 — /departamento/[nombre]/pronostico
## Prompt
considero que no es necesario extender las temperaturas en Ver ciudades y las pruebas de mi parte pasan, continua

## Qué hizo Claude
- Creó la página del pronóstico (servidor) con `getPronostico` + `agruparPorDia`, en `<Suspense>`, con sus `loading.tsx` y `error.tsx`.
- Creó `PronosticoDias` (cliente): pestañas por día con `useState`, `useEffect` para centrar la pestaña en móvil y bloques de 3 h (vertical en móvil, en fila desde `md:`).
- Creó `TarjetaDiaPronostico` (sin hooks) y `formatearFechaCorta`.
- Creó `MensajeError` y refactorizó los `error.tsx` existentes para usarlo.
- Verificación: `tsc`, `eslint` y `build` sin errores; los pronósticos de San Salvador y La Unión responden 200 con 5 días y 8 bloques, sin "appid".

## Problemas
- Un comando de bash con varios heredocs falló por una comilla y no escribió nada; se rehízo archivo por archivo con la herramienta de escritura.
- El build mostró que el pronóstico no se prerenderiza: el `generateStaticParams` de la página padre no se hereda. Se dejó bajo demanda a propósito, para no sumar 14 llamadas a la API en cada build.
- `grid-cols-6` dejaba una columna vacía cuando la API devuelve 5 días; se cambió a `flex-1`.

# Decision
se aceptaron los cambios, no hay observaciones

# Iteración 7 — /comparar (hasta 4 departamentos)
## Prompt
si cumple y pasa la prueba sobre el desplazamiento de las pestañas, continua

## Qué hizo Claude
- Creó `/comparar` (servidor, estática), que le pasa al cliente solo los nombres y slugs de los departamentos.
- Creó `Comparador` (cliente):
  - Chips con precarga al pasar el puntero, máximo 4.
  - `useState` con la selección inicial leída de `?d=` y validada contra la lista blanca.
  - `useEffect` que escribe la selección en la URL con `history.replaceState`.
  - `useQueries` con la misma query key que la home.
- Creó `TablaComparativa`: tabla en escritorio y tarjetas en móvil, con ▲ para el valor más alto y ▼ para el más bajo.
- Creó `loading.tsx` y `error.tsx` de /comparar.
- Verificación: `tsc`, `eslint` y `build` sin errores; `/comparar` responde 200, la API responde para 4 departamentos y "appid" no aparece en el HTML ni en `.next/static`.

## Problemas
- El primer build falló por un timeout de red hacia OpenWeather al prerenderizar Santa Ana; al reintentar pasó. Esto muestra que el build depende de que la API responda.
- Para no usar `setState` dentro de un efecto (la regla de eslint lo marca), la URL se lee solo al crear el estado y el efecto solo escribe en ella.
- Una constante exportada desde un archivo `"use client"` llegaría al servidor como referencia y no como valor; se dejó sin exportar.

# Decision
se aceptaron los cambios, no se encuentran observaciones ni alucinaciones


