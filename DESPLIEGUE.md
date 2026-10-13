# Publicación gratuita: Render + Netlify + Turso

Repositorio del usuario: https://github.com/LangleyRunner/Sistema-de-Comisiones

## Estado

**Aplicación publicada:** https://creative-twilight-9fe0c4.netlify.app

**API y salud:** https://minicore-comisiones-ui07.onrender.com/api/health

Despliegue verificado el 13 de octubre de 2026: Render Free, Netlify (producción pública, previews privadas) y Turso Free. Salud, CORS, CRUD y comisiones remotas aprobados. Servicio Render: srv-db7b81bbc2fs73ehedkg; base Turso: minicore-comisiones. Secretos guardados solo en Render. No se ha creado ningún recurso de pago.

## 1. Conexiones y repositorio

En Codex habilitar GitHub y Render usando sus opciones de instalación/conexión; iniciar sesión y autorizar acceso al repositorio indicado. La autorización de lectura de archivos/red no sustituye OAuth de las plataformas. No enviar contraseñas o tokens en el chat.

El repositorio debe contener el contenido de SistemaComisionesMVC en su raíz: backend, frontend, scripts, package.json, package-lock.json, render.yaml y netlify.toml. Excluir node_modules, dist, backend/data y .env. Descomprimir el ZIP antes de subir archivos: el ZIP solo no es un repositorio desplegable.

## 2. Crear SQLite gratuita en Turso

Abrir https://app.turso.tech/ e iniciar sesión. Si no hay cuenta, el usuario debe completar el registro y aceptación de términos. Elegir **Free**, sin activar facturación por excedentes ni un plan de pago. Crear una base para este proyecto. Obtener:

- URL de la base (libsql://… proporcionada por Turso).
- Token de autenticación generado por el proveedor.

Guardar estos valores directamente como variables secretas del servicio Render. El token nunca va en Git ni en VITE_API_URL. La base cloud es nueva: los datos del archivo local no se transfieren automáticamente. Se puede usar seed opcional o registrar datos desde la interfaz.

## 3. API en Render Free

New → Blueprint → repositorio Sistema-de-Comisiones. Revisar render.yaml: **plan free**, sin disk. No seleccionar Starter. Variables:

| Variable | Valor |
| --- | --- |
| TURSO_DATABASE_URL | URL real de la base Turso |
| TURSO_AUTH_TOKEN | Token real, secreto |
| CORS_ORIGINS | Origen HTTPS real de Netlify, sin ruta ni barra final |
| NODE_ENV | production |
| NODE_VERSION | 24.21.0 |

Build: `npm ci --workspace backend --include-workspace-root`.
Start: `npm start --workspace backend`.
Health: `/api/health`.

El proveedor asigna PORT. Esquema y reglas se inicializan en Turso al arrancar. No hay archivo SQLite que conservar en el disco efímero de Render. Esperar Live y verificar /api/health en la URL real. Si responde error, revisar credenciales y logs sin publicar el token. La primera petición tras inactividad puede tardar por la reactivación del servicio gratuito.

## 4. Interfaz en Netlify

Importar el repositorio. Directorio base: raíz; build: `npm run build`; publish: `frontend/dist`. Variable pública **VITE_API_URL**: URL real de Render terminada en `/api`. netlify.toml contiene fallback para React Router. No usar localhost en producción.

Una vez asignado el dominio Netlify, guardar ese origen exacto en CORS_ORIGINS de Render y redeploy. Si cambia VITE_API_URL, recompilar Netlify.

## 5. Comprobación antes de grabar

Comprobar salud, rutas directas /ventas y /comisiones, crear vendedor/venta, recargar, consultar y revisar comisión. Verificar persistencia después de reiniciar Render: los datos están en Turso. Las pruebas automatizadas locales no sustituyen esta comprobación de credenciales y proveedor remoto.

La configuración original con disco de pago quedó sustituida por esta alternativa gratuita. No aceptar cobros al crear servicios. Las cuotas pueden limitar disponibilidad; el uso gratuito depende de mantener los planes Free y sus condiciones. Mostrar solo URLs propias realmente publicadas en el video.

Fuentes: [Turso Free](https://turso.tech/pricing), [cliente JavaScript](https://docs.turso.tech/sdk/ts/reference), [Render Free](https://render.com/docs/free), [Netlify Vite](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/).

