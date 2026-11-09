# Clima SV — Reglas del proyecto

## Contexto
Es una aplicacion diseñada para consumir una API que provee datos sobre el clima en el salvador
la aplicacion se encarga de presentar los datos de manera estilizada y ordenada.

## Stack obligatorio
- Next.js 16 con App Router, TypeScript estricto, Tailwind CSS
- OpenWeather API

## Requisitos de la tarea
- Mínimo 4 rutas: (/, /departamento/[nombre], /departamento/[nombre]/pronostico, /comparar, /acerca)
- Server Components y Client Components combinados
- useState y useEffect en los componentes de cliente
- loading.tsx y error.tsx
- Diseño responsive (móvil y escritorio)


## Reglas de seguridad
- La API key solo vive en .env.local y SOLO se usa en el servidor (Route Handler)
- Utilizar solo librerias y paquetes vigentes, que cuenten con soporte o actualizaciones recientes
- Nunca subir contraseñas ni API Key, ni otro tipo de credenciales a git
- Las claves no pueden empezar con NEXT_PUBLIC_
- Antes de instalar cualquier paquete, verifica que exista en npm y pedime permiso.


## Reglas de trabajo
- Siempre consulta este archivo para recordar las reglas.
- Deja comentarios en codigo para mejor entendimiento.
- No hagas commits; yo los hago al aprobar cada iteracion
- Si se encuentra un riesgo de seguridad, no apliques cambios sin antes tener la aprobacion humana.
- No dejes console.log de depuracion en el codigo final. Si hace falta registrar un error en el servidor, usar console.error sin datos sensibles (nunca la API key ni URLs con la key). Al usuario mostrarle mensajes claros con error.tsx
- Al terminar cada iteración, actualiza el PROGRESO.md con lo que se hizo y lo pendiente
- Antes de cambios grandes, proponé un plan y esperá mi aprobación
- La logica que consulta la API va en src/lib/, los tipos en src/types/ y los componentes en src/components/
- Aplica Clean Code
- Al terminar cada iteracion, agrega a VIBE_CODING.md: el prompt principal que te de (textual), que hiciste y que problemas hubo. Yo agrego mis decisiones.
- La interfaz va en español; la API se consulta con units=metric y lang=es