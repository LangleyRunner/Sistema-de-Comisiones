# Guion de video — 7 minutos · versión SQLite

Antes de grabar: `npm install`, ejecutar seed una sola vez, `npm run build`, `npm start`. Abrir localhost:5173 y seleccionar octubre de 2026. Tener disponibles schema.sql, modelo, controlador y comisionService.js. No mostrar secretos.

Referencias adicionales: consultar REFERENCIAS.md. En la introducción se puede indicar que Video-MVC muestra el mismo problema de comisiones con Laravel y que este proyecto lo implementa con React, Express y SQLite. No atribuir tasas o detalles a los videos sin haberlos revisado ni utilizar sus despliegues como si fueran propios.

## 0:00–0:40 · Problema y objetivo

«Minicore MVC administra vendedores y ventas y calcula sus comisiones por período, evitando sumas y tasas manuales». Mostrar dashboard y navegación.

## 0:40–1:40 · Arquitectura MVC

«React es la vista; Axios llama a Express; las rutas dirigen al controlador, que valida y coordina el modelo. El modelo consulta SQLite. El servicio concentra tasas y cálculo». Mostrar carpetas y recorrer Comisiones.jsx → api.js → ruta → controlador → modelo → servicio → JSON → tabla. Dashboard reutiliza el servicio.

## 1:40–2:30 · Base de datos

«Usamos SQLite: un archivo local creado automáticamente, sin servidor ni contraseñas. Vendedores y ventas tienen relación uno a muchos. FK protege historial; correo es único. Los montos se guardan como centavos enteros para evitar errores de coma flotante. Reglas definen mínimo inclusivo y máximo exclusivo». Mostrar schema.sql y consultas parametrizadas. Explicar que PostgreSQL del planteamiento inicial se sustituyó por SQLite por decisión del proyecto.

## 2:30–3:50 · CRUD

Crear vendedor, buscar por nombre y editar. Registrar una venta seleccionando vendedor; editarla; filtrar por fechas. Recargar para comprobar persistencia. Eliminar una venta con confirmación. Explicar que un vendedor con ventas debe desactivarse para conservar su historial. Usar un vendedor de demostración, dejando intactas las ventas del seed de Ana.

## 3:50–5:00 · Minicore

Consultar 2026-10-01 a 2026-10-31. «Ana tiene 500 + 700 + 1.300 = 2.500. Se aplica una sola tasa de 8% al total: 200. Carlos llega a 5.000 y recibe 12%: 600. Lucía vendió 999,99 y obtiene 50,00 tras redondear. Total vendido: 8.499,99; comisión: 850,00».

Mostrar filtro de Ana, período sin ventas y tasas del servicio. «No son tramos progresivos ni tasas por transacción. Decimal.js calcula exactamente; redondeamos cada comisión a dos decimales y luego sumamos».

## 5:00–5:40 · Calidad

Ejecutar npm test. Explicar límites 1.000 y 5.000, fechas reales, montos positivos, validación HTTP, consultas parametrizadas y prueba CRUD con SQLite aislado en memoria. Mostrar npm run build y VERIFICACION.md.

## 5:40–6:35 · Publicación

Si existe despliegue real: abrir dominio Netlify, salud de Render y repetir registro/consulta; explicar VITE_API_URL, CORS_ORIGINS y SQLite persistente en Turso Free. Mostrar que datos sobreviven recargas y reinicios del servicio.

Si no está publicado: «La ejecución mostrada es local; configuramos Netlify y Render pero falta conectar las cuentas. la configuración gratuita usa Turso para conservar los datos SQLite fuera del disco efímero de Render». No presentar una URL de referencia como propia. Para cumplir demostración en nube, completar despliegue antes de grabar la versión definitiva.

## 6:35–7:00 · Conclusión

«MVC permite separar vista, datos y coordinación; el minicore centraliza reglas verificadas. SQLite simplifica la ejecución local y conserva persistencia. Como mejoras se podrían agregar autenticación y liquidaciones con tasas históricas».
