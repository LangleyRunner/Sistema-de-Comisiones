# Verificación — SQLite · 12 de octubre de 2026

## Actualización del 13 de octubre: nube gratuita

Render.yaml usa ahora plan free sin disco y el backend admite Turso (SQLite/libSQL) mediante cliente HTTP, manteniendo SQLite local. Tras la adaptación pasaron las 21 pruebas locales con bases en memoria. La conexión real a Turso y los despliegues siguen pendientes de las autorizaciones y credenciales del proveedor. Una prueba exploratoria del cliente nativo libSQL en Windows ARM falló por falta de binario; se eliminó esa dependencia de ejecución usando @libsql/client/web para el acceso remoto. No se presenta esa prueba como una verificación cloud. Las notas de disco de pago que aparecen abajo pertenecen a la versión anterior y quedan sustituidas por DESPLIEGUE.md.

- PostgreSQL y pg eliminados de la aplicación. SQLite integrado en Node.js 24; sin servidor de BD ni credenciales.
- `npm test`: **21 pruebas aprobadas, 0 fallos, 0 omitidas**. Incluye integración real SQLite con CRUD, comisiones, filtros inclusivos, dashboard, correo único, FK y reglas superpuestas. Las pruebas usan bases en memoria aisladas y no cambian los datos locales.
- `npm run db:seed`: ejecutado correctamente en backend/data/comisiones.sqlite; tres vendedores y cinco ventas reales de demostración.
- `npm run build`: completado correctamente, tres bundles de menos de 500 kB.
- `npm start`: API y frontend iniciados con un único comando. Salud GET /api/health respondió con status ok y database connected.
- Navegador: vendedores cargados desde API, consulta de comisiones del 1 al 12 de octubre de 2026 correcta. Total vendido **8.499,99**, comisiones **850,00**, vendedores **3**, transacciones **5**. Ana: 2.500 → 8% → 200; Carlos: 5.000 → 12% → 600; Lucía: 999,99 → 5% → 50.
- Base local persistente creada en disco; datos de producción excluidos del ZIP y de Git. El ZIP contiene el seed para reproducir la demostración, no el archivo de datos local.
- Guía académica y archivos de despliegue actualizados a SQLite. Render necesita disco persistente; no se ha realizado publicación cloud ni se han creado recursos facturables.

El modo dev de Vite encontró restricciones de lectura del sandbox en la primera entrega. Build + vista previa funcionan y `npm start` usa esa ruta. Los cambios de React requieren volver a compilar para la vista previa.

Fuentes técnicas: [SQLite de Node.js](https://nodejs.org/api/sqlite.html) y [discos persistentes de Render](https://render.com/docs/disks). Render conserva el archivo únicamente si DATABASE_FILE apunta al disco montado; el Blueprint prepara /var/data/comisiones.sqlite. Verifica el plan antes de crear recursos.
