# Planificación: plan inicial
Lee el archivo claude.md, ahí encontrarás el objetivo del proyecto junto con las rutas y las reglas a seguir. En todo el transcurso de la construcción de este proyecto, dale un vistazo a la estructura actual, ya que me encargué de crear el proyecto basado en next.js. Aparte de eso, necesito que crees un plan para la construcción dividido en iteraciones pequeñas. En las cuales yo tenga que aprobar y hacer commit de manera manual. Esto quiere decir que no utilizaremos el modo automático, sino el modo manual. Y cada vez que me indiques qué vas a realizar, por favor dame datos como qué archivos vas a crear o modificar con la ruta y qué hace cada uno y si es componente de servidor o componente de cliente. Y en el plan trata de incluir los tipos de TypeScript que se va a definir para la respuesta de OpenWeather. Y cómo funcionará el route handler que protege la API key, ya que está alojada en el .env.local. Esa trata de no leerla ni demostrarla. Ya tiene sus datos cargados para echarla a andar. La aplicación podrá listar en la raíz o página principal los 14 departamentos de El Salvador y tener diseño responsivo. Con sus ciudades de cada uno. Aún no vayas a aplicar cambios. Si hace falta información o más contexto, pregúntame antes de proponer el plan.

# Decision
Se degrado de cabecera y 6 ciudades a cabecera y 2 ciudades por departamento, debido a que son demasiadas consultas y se esta asegurando de evitar coordenadas inventadas. EL PLAN QUEDA MODIFICADO

# Planificación: ajustes (2 ciudades y TanStack Query)
Usemos tanstack query para precarga de datos

# Decision
Aceptamos instalar @tanstack/react-query@5.107.1 como dependencia

# Iteración 1 — Tipos y datos
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
- Decisión: corregí San Salvador (estaba desviada unos 3 km) 


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
Use modo automático solo para /comparar porque era UI y no tocaba la API key. 
Antes del commit revisé con git diff que openweather.ts y route.ts no cambiaran.

# Iteración 8 — Documentación (README)
## Prompt
Escribe el README.md en español. Debe incluir:
- Descripción breve de la app y captura o lista de sus páginas
- Tecnologías usadas
- Requisitos (Node.js y una API key gratuita de OpenWeather)
- Instalación local: clonar, npm install, copiar .env.example a .env.local
  y poner la key, npm run dev
- Despliegue en Vercel: importar el repo y agregar OPENWEATHER_API_KEY
  en Environment Variables antes del primer deploy
- Sección "Despliegue" con la URL pública (déjala como pendiente por ahora)
- Enlace a VIBE_CODING.md, donde está el proceso de vibe coding
- Nota de seguridad: la API key solo se usa en el servidor
No toques ningún otro archivo.

## Qué hizo Claude
- Reemplazó el README de la plantilla por uno en español con: descripción, tabla de las 5 páginas, tecnologías, requisitos (Node 20.9 o superior, verificado en el `package.json` de Next 16, y la API key gratuita), instalación local (con el comando de copia para Bash y para PowerShell), comandos, despliegue en Vercel, URL pública pendiente, seguridad de la API key y enlace a este archivo.
- En un segundo prompt agregó los pasos de Vercel tal como los sigo yo: iniciar sesión con GitHub → **Add New… → Project** → **Import Git Repository** → **Environment Variables** (Key `OPENWEATHER_API_KEY` sin el `=`, Value = la API key) → **Deploy**.
- Aclaró que para que el repositorio aparezca en Vercel hay que **subirlo con `git push`** (no `git fetch`, que solo descarga) y, si no aparece, dar permiso a la GitHub App de Vercel.
- Corrigió el `cd` del README para que coincida con la carpeta que crea `git clone`. Después, cuando renombré el repositorio de `Clima-SV-` a `Clima-SV`, reconstruyó el README con el nombre nuevo. Comprobó que el proyecto está en la raíz del repo, así que en Vercel no hay que cambiar *Root Directory*.
- Ante mi duda de si otras personas tendrían que hacer `git fetch` a mi repositorio para verlo en Vercel, explicó que no: Vercel solo lista los repositorios de la cuenta propia, así que lo que hace falta es un **fork**. Lo agregó como "Paso 0" del despliegue, con el botón **Sync fork** para traer cambios nuevos.

## Problemas
- No hay navegador en la sesión para tomar capturas; se usó una tabla con las páginas.
- El `cd` del README no coincidía con el nombre de la carpeta que crea `git clone`.

# Decision
Renombré el repositorio de Clima-SV- a Clima-SV porque Vercel daba problemas con el guion final, y desplegué con OPENWEATHER_API_KEY configurada antes del primer deploy.” Con eso también queda registrado el despliegue.

# Desafíos y decisiones del proyecto

## 1. El desfase de coordenadas
Al validar las 42 ciudades contra el campo `name` de OpenWeather, 6 no coincidían. La cabecera de San Salvador estaba desviada unos 3 km y OpenWeather la reconocía como "Antiguo Cuscatlán". Pedí una tabla con la distancia de cada ciudad al centro real (OpenStreetMap) para decidir con datos y no a ojo. Corregí San Salvador y acepté las otras 5, que estaban a menos de 0.5 km o tenían un nombre oficial distinto (San Francisco Gotera → "San Francisco"): ahí la diferencia era el etiquetado de OpenWeather, no un error de coordenadas. Aprendí que una coordenada "aproximada" generada por IA hay que verificarla siempre, y que un cambio de coordenadas se tiene que revisar con `git diff` antes del commit (en la iteración 5 entró por error la coordenada vieja de San Salvador y se corrigió después).

## 2. El build depende de la API
Como Next prerenderiza la home y los 14 detalles durante el build, `npm run build` llama a OpenWeather unas 42 veces. En la iteración 7 un corte de red hizo fallar el build, aunque el código estaba bien. Eso significa que en Vercel un deploy puede fallar si la API no responde o si falta la variable de entorno. Por eso el pronóstico se dejó bajo demanda (no suma llamadas al build) y en el README quedó claro que la variable se configura **antes** del primer deploy.

## 3. La regla de ESLint sobre setState en efectos
`react-hooks/set-state-in-effect` marcó el `setState` dentro del `useEffect` que restaura la unidad °C/°F desde `localStorage`. Se probó quitar la excepción y la regla falla. La decisión fue no apagar la regla en todo el proyecto: se dejó una excepción en **una sola línea**, con su justificación (leer `localStorage` después de hidratar es sincronizar con un sistema externo, el caso legítimo), y se eliminó un segundo efecto, guardando la preferencia en el clic. En /comparar se evitó el problema desde el diseño: la URL se lee al crear el estado y el efecto solo escribe en ella.

## 4. De la credencial en web.config a la clave protegida
En un proyecto anterior en .NET, cuando todavía no conocía las variables de entorno, dejé las credenciales de la base de datos escritas en el `web.config`, expuestas a cualquiera con acceso al código. En este proyecto la clave:
- vive solo en `.env.local`, que está en `.gitignore`, y en las *Environment Variables* de Vercel, nunca en el repositorio;
- no lleva el prefijo `NEXT_PUBLIC_`, así que Next no la incluye en el código del navegador;
- solo la lee `src/lib/openweather.ts`, protegido con `import "server-only"`, y el navegador pasa por un Route Handler con lista blanca;
- se verificó en cada iteración que "appid" no aparezca en el HTML ni en `.next/static`, y los logs nunca incluyen la URL con la clave.

La diferencia no es solo técnica: antes la seguridad dependía de que nadie viera el archivo; ahora el diseño impide que la clave salga del servidor.


