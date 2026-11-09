# Plan — Clima SV (Next.js 16 + OpenWeather)

## Contexto
Tarea semana 21: app en español que muestra el clima de El Salvador. La raíz lista los 14 departamentos
(cabecera + 2 ciudades cada uno, 42 en total) con temperatura actual; hay detalle por departamento,
pronóstico, comparador (hasta 4 departamentos) y página "acerca". Reglas en `clima-sv/CLAUDE.md`.
Trabajo **manual**: cada iteración se propone, el usuario aprueba, yo implemento y el usuario hace el commit.

### Estado actual detectado
- Next **16.4.5**, React 19.3, Tailwind v4 (`@tailwindcss/turbopack`), TS `strict`, alias `@/*` → `src/*`.
- `next.config.ts` tiene **`cacheComponents: true`** → el caché se hace con `'use cache'` + `cacheLife()`
  (no con `fetch({ next: { revalidate } })`), y los datos dinámicos necesitan `<Suspense>`/`loading.tsx`.
- En 16.4, `error.tsx` recibe `{ error: unknown, retry: () => void }`.

#### Verificado en `node_modules/next/dist/docs` (versión instalada: `node_modules/next/package.json` → **16.4.5**)
- **`cacheLife`** (`03-api-reference/04-functions/cacheLife.md`): requiere `cacheComponents: true` (ya activo). Se importa
  de `next/cache` y **solo** se puede llamar dentro de una función con `'use cache'`, no a nivel de módulo. La doc recomienda
  llamarlo en cada scope `'use cache'` y no esconderlo en utilidades compartidas. Acepta un perfil (`'minutes'`, `'hours'`…)
  u objeto `{ stale, revalidate, expire }` en segundos → usaremos `cacheLife({ revalidate: 600 })` dentro de cada función de `lib`.
- **`retry` en `error.tsx`** (`03-api-reference/03-file-conventions/error.md`): en el historial de versiones, `v16.2.0` agrega
  `unstable_retry` y `v16.3.0` lo declara estable como `retry` → **es válido en 16.4.5**. `retry()` vuelve a pedir los datos y
  re-renderiza el segmento; `reset()` todavía existe, pero la doc recomienda `retry()` en la mayoría de los casos. Firma: `{ error: unknown, retry: () => void }`.
- Route Handlers con Cache Components (`01-getting-started/15-route-handlers.md`): un `GET` que lee `request` se ejecuta en cada
  petición, y el caché lo aportan las funciones `'use cache'` de `lib` que llama.
- `.env.local` está ignorado por `.gitignore` (`.env*` con la excepción `!.env.example`). La variable es `OPENWEATHER_API_KEY`
  (sin `NEXT_PUBLIC_`). **No se lee ni se muestra el .env.local.**
- `server-only`: en Next es opcional instalarlo (Next lo resuelve internamente) → **no instalamos paquetes**.
- No existe `PROGRESO.md`; `VIBE_CODING.md` está vacío.

### Decisiones tomadas con el usuario
Plan gratuito de OpenWeather → `/data/2.5/weather` (clima actual) y `/data/2.5/forecast` (pronóstico de 5 días cada 3 h).
**Cabecera + 2 ciudades** por departamento, porque el límite de solicitudes a OpenWeather es bajo. La home muestra la temperatura. /comparar admite hasta 4 departamentos.

**TanStack Query** (`@tanstack/react-query@5.107.1`, MIT, actualizado el 2026-11-06, peer `react ^18 || ^19`; verificado en npm).
El usuario autorizó instalar **solo este paquete, sin devtools**. Se usa para **precargar al pasar el puntero** en dos lugares:
la home (botón "Ver ciudades" de cada tarjeta) y /comparar (opción de cada departamento). Las páginas de servidor no lo usan,
porque `<Link>` ya precarga la ruta y `partialPrefetching: true` está activo.

**Presupuesto de llamadas** (sin caché, peor caso): home = 14 (solo las cabeceras), detalle = 3, pronóstico = 1,
`/api/clima/[departamento]` = 3 (por departamento precargado o comparado).
Con `cacheLife({ revalidate: 600 })` cada coordenada se consulta como mucho una vez cada 10 min → **máximo 42 llamadas de clima actual
y 14 de pronóstico por ventana, sin importar cuántos hovers haya**, por debajo de las 60 por minuto del plan gratuito.
El hover le pega a nuestro Route Handler, no a OpenWeather. Además, en el cliente: `staleTime` de 10 min, espera de 150 ms
antes de precargar (para no disparar al barrer el mouse) y `retry: 1`.

---

## Arquitectura de la API key (Route Handler)

```
Server Components (home, detalle, pronóstico) ──► src/lib/openweather.ts ──► api.openweathermap.org
                                                     ▲   (import 'server-only', lee process.env.OPENWEATHER_API_KEY)
Client Components (home "Ver ciudades", /comparar)
   └─ TanStack Query (prefetch en hover, useQuery) ──fetch──► /api/clima/[departamento] ──┘
```
- **`src/lib/openweather.ts`** es el único archivo que toca `process.env.OPENWEATHER_API_KEY`. Lleva `import 'server-only'`:
  si un componente de cliente lo importa, el build falla, así que la key nunca llega al bundle del navegador.
- Los Server Components llaman a `lib` directamente (no a su propia API; es lo que recomienda Next y evita un salto HTTP extra).
- **`src/app/api/clima/[departamento]/route.ts`** (`GET`) es la puerta para el navegador:
  1. Firma `GET(_req: NextRequest, ctx: RouteContext<'/api/clima/[departamento]'>)`; hace `const { departamento } = await ctx.params`.
     `RouteContext` es global en Next 16 y está verificado en `route.md`.
  2. **Valida contra la lista blanca** con `getDepartamento(slug)` de `src/lib/departamentos.ts`. Si no existe, responde 404 con un mensaje en español.
     Así no sirve como proxy abierto: no acepta lat/lon ni texto libre.
  3. Llama a `getClimaActual()` de `lib` para la cabecera y sus 2 ciudades (`Promise.all`).
  4. Responde `Response.json(ClimaDepartamento)`: datos ya **normalizados** y sin la URL ni la key.
  5. Ante un error de OpenWeather registra `console.error('[api/clima]', status, endpoint)` sin URL ni key, y responde 502 con un mensaje genérico.
- Una sola forma de respuesta por departamento: la query key `['clima', slug]` es **la misma** en la home y en /comparar,
  así que lo que se precargó en una página ya está en caché en la otra. El límite de 4 en /comparar se aplica en el cliente.
- Caché: las funciones de `lib` usan `'use cache'` + `cacheLife({ revalidate: 600 })` (10 min), lo que protege el límite gratuito de 60 llamadas por minuto.
- La URL a OpenWeather se arma con `URLSearchParams` (`lat`, `lon`, `appid`, `units=metric`, `lang=es`) y nunca se registra en logs.

## Diseño responsive (mobile-first, se aplica en todas las iteraciones con UI)
- **Mobile-first con Tailwind**: los estilos base son para móvil (≥ 360 px) y se amplían con `sm:` (640), `md:` (768), `lg:` (1024) y `xl:` (1280).
- **Layout**: contenedor `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`. El header usa menú hamburguesa (`MenuMovil`) en móvil y enlaces en línea desde `md:`.
- **Grillas**: home `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; ciudades del detalle `grid-cols-1 sm:grid-cols-2`;
  métricas `grid-cols-2 md:grid-cols-4`.
- **Pronóstico**: pestañas de días con scroll horizontal (`overflow-x-auto snap-x`) en móvil; los bloques de 3 h pasan de lista vertical a fila desde `md:`.
- **Comparar**: tarjetas apiladas en móvil y tabla desde `md:` (`hidden md:table` / `md:hidden`). Los chips hacen `flex-wrap`.
- **Táctil**: botones y chips de al menos 44×44 px, sin depender del hover. La precarga en móvil usa `onTouchStart`/`onFocus`, y "Ver ciudades" funciona con un toque.
- **Tipografía e imágenes**: tamaños escalonados (`text-3xl md:text-5xl` para la temperatura) y `next/image` con `sizes` para los iconos.
- `viewport` lo pone Next por defecto, así que no hace falta agregar la meta tag.
- **Verificación** en cada iteración con UI: DevTools en 375 px (iPhone SE), 768 px (tablet) y 1280 px (escritorio), sin scroll horizontal no deseado.

## Tipos TypeScript (`src/types/`)

**`openweather.ts`**: respuesta cruda de la API (solo los campos que usamos):
```ts
interface OWCoord { lat: number; lon: number }
interface OWCondicion { id: number; main: string; description: string; icon: string }
interface OWMain { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number }
interface OWViento { speed: number; deg: number; gust?: number }
interface OWClimaActual {             // GET /data/2.5/weather
  coord: OWCoord; weather: OWCondicion[]; main: OWMain; visibility: number;
  wind: OWViento; clouds: { all: number }; rain?: { '1h'?: number };
  dt: number; sys: { country: string; sunrise: number; sunset: number };
  timezone: number; id: number; name: string; cod: number;
}
interface OWPronosticoItem {          // un bloque de 3 h
  dt: number; main: OWMain; weather: OWCondicion[]; wind: OWViento;
  clouds: { all: number }; pop: number; rain?: { '3h'?: number }; dt_txt: string;
}
interface OWPronostico {              // GET /data/2.5/forecast
  cod: string; cnt: number; list: OWPronosticoItem[];
  city: { id: number; name: string; coord: OWCoord; timezone: number; sunrise: number; sunset: number };
}
interface OWError { cod: number | string; message: string }
```
**`clima.ts`**: modelos de la app ya normalizados (lo que reciben los componentes):
```ts
interface ClimaResumen { ciudad: string; temperatura: number; sensacion: number; min: number; max: number;
  humedad: number; vientoKmh: number; descripcion: string; icono: string; actualizado: number;
  nombreOW?: string /* temporal, solo en la iteración 2 para validar coordenadas */ }
interface ClimaDepartamento { slug: string; nombre: string; cabecera: ClimaResumen; ciudades: ClimaResumen[] }
interface PronosticoDia { fecha: string; diaSemana: string; min: number; max: number;
  icono: string; descripcion: string; probLluvia: number; bloques: PronosticoBloque[] }
interface PronosticoBloque { hora: string; temperatura: number; icono: string; probLluvia: number }
```
**`departamento.ts`**:
```ts
interface Ciudad { nombre: string; lat: number; lon: number }
interface Departamento { slug: string; nombre: string; zona: 'occidental' | 'central' | 'paracentral' | 'oriental';
  cabecera: Ciudad; ciudades: [Ciudad, Ciudad] /* tupla: exactamente 2 */ }
```
Las ciudades se consultan por **lat/lon**, no por nombre, porque hay nombres repetidos (por ejemplo "San Rafael" o "Concepción").

---

## Iteraciones (cada una termina con: PROGRESO.md + VIBE_CODING.md actualizados → el usuario revisa → commit manual)

### Iteración 1 — Tipos y datos (sin UI)
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/types/openweather.ts` | crear | Tipos crudos de la API | — (solo tipos) |
| `src/types/clima.ts` | crear | Modelos normalizados | — |
| `src/types/departamento.ts` | crear | `Ciudad`, `Departamento` | — |
| `src/lib/departamentos.ts` | crear | Los 14 departamentos con cabecera y 2 ciudades (lat/lon), más `getDepartamento(slug)` y `getSlugs()` | módulo compartido (sin key) |
| `src/lib/formato.ts` | crear | Pasar m/s a km/h, formatear fechas en `es-SV` y redondear temperaturas | compartido |
| `PROGRESO.md` | crear | Bitácora de avance | — |
| `VIBE_CODING.md` | modificar | Entrada de la iteración | — |
Verificación: `npx tsc --noEmit` y `npm run lint`.

### Iteración 2 — Capa de API segura y Route Handler
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/lib/openweather.ts` | crear | `import 'server-only'`, `getClimaActual(ciudad)`, `getClimaDepartamento(slug)` (cabecera + 2 ciudades), `getPronostico(ciudad)` con `'use cache'`+`cacheLife`, y la clase `OpenWeatherError`. Normaliza la respuesta cruda a los modelos | **solo servidor** |
| `src/lib/pronostico.ts` | crear | `agruparPorDia(list)`: convierte los bloques de 3 h en `PronosticoDia[]` (hora de El Salvador, UTC-6) | compartido (función pura) |
| `src/app/api/clima/[departamento]/route.ts` | crear | `GET` con lista blanca, como se describe arriba | **Route Handler (servidor)** |

Verificación:
1. `npm run dev` y `curl localhost:3000/api/clima/san-salvador` → JSON con la cabecera y 2 ciudades; `curl localhost:3000/api/clima/xyz` → 404.
2. La key no debe aparecer en la respuesta ni en la consola.
3. **Validación de coordenadas (campo `name`)**: `ClimaResumen` incluye temporalmente `nombreOW` (el `name` que devuelve OpenWeather).
   Se consultan las 42 ciudades con 14 `curl` (uno por departamento) y se arma una tabla
   *ciudad esperada → `name` de OpenWeather → ¿coincide?*. La comparación ignora tildes y mayúsculas, y también acepta que `name`
   sea la cabecera vecina o el nombre del cantón, revisado a mano. Las que no coincidan se corrigen en `src/lib/departamentos.ts`
   y se vuelven a probar. La tabla queda registrada en `PROGRESO.md`. Al cerrar la iteración se quita `nombreOW` (o se deja solo
   en el tipo crudo `OWClimaActual.name`) para no exponer datos innecesarios.
   *Nota:* esta verificación necesita 42 llamadas. Se hace una sola vez y aprovecha el caché de 10 min, así que no se pasa del límite.

### Iteración 3 — Layout, navegación y /acerca
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/app/layout.tsx` | modificar | `lang="es"`, metadata en español, Header y Footer | Servidor |
| `src/app/globals.css` | modificar | Paleta (tokens `@theme`) y fuente Geist | — |
| `src/components/Header.tsx` | crear | Logo y enlaces | Servidor |
| `src/components/MenuMovil.tsx` | crear | Menú hamburguesa con `useState`; resalta la ruta activa con `usePathname` | **Cliente** |
| `src/components/Footer.tsx` | crear | Créditos y "Datos: OpenWeather" | Servidor |
| `src/app/acerca/page.tsx` | crear | Info del proyecto, stack y fuente de datos | Servidor |
| `src/app/not-found.tsx` | crear | Página 404 en español | Servidor |

### Iteración 4 — Página principal (14 departamentos)
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/app/page.tsx` | reemplazar | Grid responsive (1/2/3/4 columnas) agrupado por zona | Servidor |
| `src/components/TarjetaDepartamento.tsx` | crear | Nombre, temperatura y estado de la cabecera, sus 2 ciudades (solo nombres, **sin** llamar a la API por ellas) y enlace al detalle. Se renderiza async dentro de `<Suspense>` | Servidor (async) |
| `src/components/TarjetaSkeleton.tsx` | crear | Placeholder de carga | Servidor |
| `src/components/IconoClima.tsx` | crear | `next/image` del icono de OpenWeather | Servidor |
| `src/components/BuscadorDepartamentos.tsx` | crear | Filtro por nombre con `useState` sobre la lista estática | **Cliente** |
| `package.json` | modificar (con `npm install @tanstack/react-query@5.107.1`) | Agrega la dependencia autorizada | — |
| `src/components/providers/QueryProvider.tsx` | crear | Crea el `QueryClient` con `useState(() => new QueryClient({...}))`, para que haya uno por pestaña y no se comparta entre usuarios en el servidor. Defaults: `staleTime: 600_000`, `retry: 1`, `refetchOnWindowFocus: false` | **Cliente** |
| `src/app/layout.tsx` | modificar | Envuelve `{children}` con `<QueryProvider>` | Servidor |
| `src/lib/consultasClima.ts` | crear | `climaKeys.departamento(slug)` y `fetchClimaDepartamento(slug, signal)`, que hace `fetch('/api/clima/'+slug)`, lanza un error si `!res.ok` y devuelve `ClimaDepartamento`. Sin key: solo llama a nuestra ruta | compartido (cliente) |
| `src/hooks/usePrefetchHover.ts` | crear | Devuelve `onMouseEnter`/`onMouseLeave`/`onFocus`/`onTouchStart`: tras 150 ms llama a `queryClient.prefetchQuery` y cancela el temporizador si el puntero sale antes | **Cliente** (hook) |
| `src/components/VerCiudades.tsx` | crear | Botón dentro de cada tarjeta que precarga al pasar el puntero; al hacer clic despliega (`useState`) el clima de las 2 ciudades con `useQuery` (con estado de carga y error) | **Cliente** |
| `src/app/loading.tsx` | crear | Skeleton global | Servidor |
| `src/app/error.tsx` | crear | Mensaje claro y botón "Reintentar" (`retry`) | **Cliente** (obligatorio) |
| `next.config.ts` | modificar | `images.remotePatterns` para `openweathermap.org/img/wn/**` | — |

### Iteración 5 — /departamento/[nombre]
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/app/departamento/[nombre]/page.tsx` | crear | `generateStaticParams` (14 slugs) y `notFound()` si el slug no existe. Muestra detalle de la cabecera (humedad, viento, sensación, amanecer) y tarjetas de sus 2 ciudades con su clima | Servidor |
| `src/app/departamento/[nombre]/loading.tsx` | crear | Skeleton | Servidor |
| `src/app/departamento/[nombre]/error.tsx` | crear | Error del segmento | **Cliente** |
| `src/components/DetalleClima.tsx` | crear | Panel de métricas | Servidor |
| `src/components/TarjetaCiudad.tsx` | crear | Clima de una ciudad | Servidor (async) |
| `src/components/SelectorUnidad.tsx` + `src/components/Temperatura.tsx` | crear | Cambio °C/°F con `useState`; `useEffect` guarda y restaura la preferencia en `localStorage` | **Cliente** |

### Iteración 6 — /departamento/[nombre]/pronostico
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/app/departamento/[nombre]/pronostico/page.tsx` | crear | Obtiene `getPronostico` de la cabecera y `agruparPorDia` | Servidor |
| `…/pronostico/loading.tsx`, `…/pronostico/error.tsx` | crear | Carga y error | Servidor / **Cliente** |
| `src/components/PronosticoDias.tsx` | crear | Pestañas por día (`useState`) que muestran los bloques de 3 h del día elegido | **Cliente** |
| `src/components/TarjetaDiaPronostico.tsx` | crear | Resumen diario: mínima, máxima y % de lluvia | Servidor-compatible (sin hooks) |

### Iteración 7 — /comparar (hasta 4 departamentos)
| Archivo | Acción | Qué hace | Tipo |
|---|---|---|---|
| `src/app/comparar/page.tsx` | crear | Encabezado; pasa la lista de departamentos (sin datos de clima) al cliente | Servidor |
| `src/components/Comparador.tsx` | crear | Chips para elegir de 1 a 4 departamentos (`useState`). Cada chip usa `usePrefetchHover`, así que al pasar el puntero se precarga. `useQueries` con `climaKeys.departamento(slug)` muestra los seleccionados (ya en caché si hubo hover o si se vieron en la home). `useEffect` sincroniza la selección con la URL (`?d=a,b`), para que se pueda compartir el enlace | **Cliente** |
| `src/components/TablaComparativa.tsx` | crear | Tabla en escritorio y tarjetas apiladas en móvil, resaltando el valor más alto y el más bajo | Servidor-compatible |
| `src/app/comparar/loading.tsx`, `error.tsx` | crear | Carga y error | Servidor / **Cliente** |

### Iteración 8 — Pulido y entrega
Revisión responsive (375 px / 768 px / 1280 px), accesibilidad (alt, contraste, foco), eliminar los `public/*.svg` de plantilla que no se usen,
`README.md` en español (cómo configurar `.env.local` a partir de `.env.example`), `npm run lint` y `npm run build` limpios,
y una búsqueda de `console.log` y de restos de la key (`grep`).

---

## Verificación end-to-end
1. `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.
2. `npm run dev`: recorrer `/`, `/departamento/san-salvador`, `/departamento/san-salvador/pronostico`, `/comparar`, `/acerca` y `/departamento/inexistente` (404).
3. Seguridad: en DevTools → Network/Sources buscar "appid" y la key, que no deben aparecer. Hacer `grep` de `OPENWEATHER_API_KEY` en `.next/static`, que debe dar 0 coincidencias.
4. Error: si la key es inválida o no hay red, se debe ver `error.tsx` con su botón de reintento (se prueba solo si el usuario lo autoriza, porque implica tocar `.env.local`).
5. Responsive con DevTools en móvil y escritorio.

## Notas
- Ciudades: se usan los nombres tradicionales de los municipios (desde la reforma de 2024 son "distritos"); se puede agregar una nota en /acerca.
- Paquetes: solo `@tanstack/react-query@5.107.1`, ya autorizado, y se instala en la iteración 4. Cualquier otro paquete se verifica en npm y se pide permiso antes.
- Prueba de la precarga: en DevTools → Network, al pasar el puntero sobre "Ver ciudades" o sobre un chip, debe aparecer `GET /api/clima/<slug>` una sola vez.
  Al hacer clic, la petición no se repite. Si el puntero solo pasa rápido (menos de 150 ms), no se dispara ninguna petición.
