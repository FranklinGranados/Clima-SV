# ⛅ Clima SV

Aplicación web que muestra el **clima actual y el pronóstico de 5 días de los 14 departamentos de El Salvador**, con datos de [OpenWeather](https://openweathermap.org/). Por cada departamento se consulta su cabecera y 2 ciudades más (42 ciudades en total). La interfaz está en español y se adapta a móvil y escritorio.

Proyecto de la tarea de la semana 21 del Bootcamp Full Stack Junior.

## Páginas

| Ruta | Qué muestra |
|---|---|
| `/` | Los 14 departamentos agrupados por zona, con la temperatura actual de su cabecera. Tiene un buscador por departamento o ciudad y un botón **"Ver ciudades"**, que precarga el clima de las otras 2 ciudades al pasar el puntero. |
| `/departamento/[nombre]` | Detalle del departamento: temperatura, sensación térmica, humedad, viento, mínima y máxima, amanecer y atardecer de la cabecera, más el clima de sus 2 ciudades. Permite cambiar entre °C y °F, y la preferencia se recuerda. Ejemplo: `/departamento/san-salvador`. |
| `/departamento/[nombre]/pronostico` | Pronóstico de 5 días en pestañas, con bloques de 3 horas en hora de El Salvador. Ejemplo: `/departamento/san-salvador/pronostico`. |
| `/comparar` | Compara hasta 4 departamentos lado a lado y marca el valor más alto (▲) y el más bajo (▼). La selección queda en la URL (`/comparar?d=santa-ana,la-union`), así el enlace se puede compartir. |
| `/acerca` | Información del proyecto, tecnologías y fuente de los datos. |

Además, la app tiene una página 404 en español, pantallas de carga (`loading.tsx`) y mensajes de error con un botón para reintentar (`error.tsx`).

## Tecnologías

- **[Next.js 16](https://nextjs.org/)** con App Router y Cache Components (`'use cache'` + `cacheLife`). Combina Server Components y Client Components.
- **React 19**: `useState` y `useEffect` en los componentes de cliente.
- **TypeScript** en modo estricto, con tipos para las respuestas de la API.
- **Tailwind CSS 4**, con diseño responsive mobile-first y modo oscuro según el sistema.
- **[TanStack Query 5](https://tanstack.com/query)**: precarga y caché en el navegador para "Ver ciudades" y `/comparar`.
- **[OpenWeather API](https://openweathermap.org/api)** (plan gratuito): `/data/2.5/weather` y `/data/2.5/forecast`, con `units=metric` y `lang=es`.

## Requisitos

- **[Node.js](https://nodejs.org/) 20.9 o superior** (lo exige Next.js 16). Se probó con Node 22.
- **Una API key gratuita de OpenWeather**:
  1. Crea una cuenta en [openweathermap.org](https://home.openweathermap.org/users/sign_up).
  2. Copia tu clave desde [API keys](https://home.openweathermap.org/api_keys).
  3. Una clave nueva puede tardar un rato (hasta un par de horas) en activarse. Mientras tanto, la API responde `401`.

## Instalación local

1. **Clona el repositorio** y entra en la carpeta:

   ```bash
   git clone https://github.com/FranklinGranados/Clima-SV.git
   cd Clima-SV
   ```

   > Para correrlo en tu computadora basta con clonar: no necesitas cuenta de GitHub ni hacer fork.

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura la API key.** Copia el archivo de ejemplo:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local

   # Windows (PowerShell)
   Copy-Item .env.example .env.local
   ```

   Abre `.env.local` y reemplaza el valor de ejemplo por tu clave:

   ```env
   OPENWEATHER_API_KEY=tu_clave_aqui
   ```

   > El nombre de la variable debe ser exactamente `OPENWEATHER_API_KEY` y **no** debe empezar con `NEXT_PUBLIC_`.
   > `.env.local` está en `.gitignore`: nunca se sube al repositorio.

4. **Levanta el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila la versión de producción. Durante el build se consultan las cabeceras y ciudades para prerenderizar las páginas, así que **necesita la API key y conexión a internet**. |
| `npm run start` | Sirve la versión compilada (después de `npm run build`). |
| `npm run lint` | Revisa el código con ESLint. |

## Despliegue en Vercel

Vercel no lee tu computadora: importa el proyecto **desde un repositorio de tu cuenta de GitHub**. La lista **Import Git Repository** solo muestra los repositorios de la cuenta con la que iniciaste sesión, así que el repositorio de otra persona no aparece ahí.

### Paso 0: tener el repositorio en tu cuenta de GitHub

**Si eres el dueño del repositorio** (`FranklinGranados/Clima-SV`): solo asegúrate de haber subido los últimos cambios.

```bash
git push origin master
```

**Si eres otra persona**, primero haz un **fork**, es decir, una copia del repositorio en tu propia cuenta:

1. Inicia sesión en [github.com](https://github.com/).
2. Abre [github.com/FranklinGranados/Clima-SV](https://github.com/FranklinGranados/Clima-SV).
3. Presiona **Fork** (arriba a la derecha) y luego **Create fork**.
4. Ahora tienes `tu-usuario/Clima-SV` en tu cuenta. Ese es el que vas a importar en Vercel.

> Si más adelante quieres traer a tu fork los cambios nuevos del repositorio original, usa el botón **Sync fork** en la página de tu fork. Vercel vuelve a desplegar solo.

### Pasos en Vercel

1. **Inicia sesión** en [vercel.com](https://vercel.com/) con **Continue with GitHub**, usando la misma cuenta donde está tu repositorio o tu fork, y autoriza a Vercel.
2. En el panel, presiona **Add New…** y elige **Project**.
3. En la sección **Import Git Repository**, busca `Clima-SV` (el de tu cuenta) y presiona **Import**.
   - Si no aparece, presiona **Adjust GitHub App Permissions** (o *Configure GitHub App*) y dale acceso a ese repositorio. Luego vuelve a la lista.
4. En **Configure Project** deja los valores que Vercel detecta: *Framework Preset* **Next.js** y *Root Directory* `./` (el proyecto está en la raíz del repositorio). No hace falta cambiar el comando de build ni la carpeta de salida.
5. Despliega la sección **Environment Variables** y agrega la clave. El archivo [`.env.example`](.env.example) tiene esta línea:

   ```env
   OPENWEATHER_API_KEY=tu_clave_aqui
   ```

   En Vercel se separa en dos campos:

   | Campo | Qué pegar |
   |---|---|
   | **Key** | `OPENWEATHER_API_KEY` (solo el nombre, **sin** el signo `=`) |
   | **Value** | tu API key de OpenWeather, la que generaste en [API keys](https://home.openweathermap.org/api_keys) |

   Presiona **Add**.

   > ⚠️ Este paso es obligatorio **antes del primer deploy**. El build prerenderiza páginas con datos del clima y falla si la clave no existe.
   > Pega la clave solo en Vercel: nunca en `.env.example`, en el código ni en un commit.

6. Presiona **Deploy** y espera a que termine el build (1 o 2 minutos). Vercel te muestra la URL pública, del tipo `https://clima-sv.vercel.app/`.

### Después del primer deploy

- Cada `git push` a la rama principal genera un nuevo deploy automático.
- Si agregas o cambias la variable después (en **Settings → Environment Variables**), haz un **Redeploy** desde la pestaña **Deployments** para que se aplique.
- Si el build falla con `Falta la variable de entorno OPENWEATHER_API_KEY`, revisa que el nombre de la variable esté bien escrito.
- Si falla con `401`, la clave es incorrecta o todavía no se activa.

## Despliegue

- **URL pública:** _pendiente_

## Seguridad de la API key

- La clave **solo se usa en el servidor**. El único archivo que la lee es [`src/lib/openweather.ts`](src/lib/openweather.ts), que importa `server-only`: si un componente de cliente intentara importarlo, el build fallaría.
- El navegador nunca habla con OpenWeather. Llama a la ruta propia `/api/clima/[departamento]` (un Route Handler), que:
  - solo acepta los 14 departamentos de una lista blanca (no recibe coordenadas ni texto libre);
  - devuelve datos ya procesados, sin la URL ni la clave.
- Los errores se registran en el servidor solo con el código HTTP y el endpoint, nunca con la URL completa (que contiene la clave).
- Las respuestas se guardan en caché 10 minutos, para no pasarse del límite del plan gratuito (60 llamadas por minuto).

## Proceso de desarrollo

Este proyecto se construyó con *vibe coding*, en iteraciones aprobadas una por una. El proceso completo está en **[VIBE_CODING.md](VIBE_CODING.md)**: los prompts, lo que hizo la IA, los problemas que surgieron y las decisiones tomadas.

El avance por iteración está en [PROGRESO.md](PROGRESO.md) y el plan original en [PLAN.md](PLAN.md).

## Créditos

- Datos meteorológicos: [OpenWeather](https://openweathermap.org/).
- Los nombres de las ciudades son los tradicionales de los municipios. Desde la reforma territorial de 2024 se llaman «distritos».
