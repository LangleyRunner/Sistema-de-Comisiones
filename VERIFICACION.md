# Verificación final — 13 de octubre de 2026

Aplicación: https://creative-twilight-9fe0c4.netlify.app
API: https://minicore-comisiones-ui07.onrender.com/api/health
Repositorio: https://github.com/LangleyRunner/Sistema-de-Comisiones

- 21 pruebas automatizadas locales aprobadas, sin fallos ni omisiones. Cubren cálculo decimal, límites, validación HTTP y CRUD con SQLite real en memoria.
- Build de React/Vite aprobado localmente y en Netlify.
- Render Free desplegado; Turso Free conserva SQLite sin discos de pago ni PostgreSQL.
- Salud de API: status ok, database connected. CORS permite el dominio publicado de Netlify.
- Prueba real de CRUD remoto aprobada: creación/edición de vendedor y venta; venta 1.000 produjo 80 de comisión, actualización a 5.000 produjo 600. Se eliminaron únicamente los registros temporales creados para la prueba.
- Quedan 3 vendedores y 5 ventas académicas de ejemplo en Turso. Total vendido: 8.499,99; total comisiones: 850,00.
- Dashboard y gráficos verificados en el navegador desde Netlify con datos recibidos de la API.
- Netlify: producción Public, Deploy Preview Private. Token Turso almacenado como secreto solo en Render; nunca incluido en código, Git ni archivos de entrega.
- Evidencia adicional: outputs/verificacion-nube.json y captura de la aplicación publicada en la entrega local.

La primera petición tras inactividad de Render Free puede tardar por reactivación. No se crearon recursos de pago. Las cuotas gratuitas siguen aplicando.

El modo dev de Vite encontró restricciones de lectura del sandbox en la primera entrega; build y preview funcionaron. El cliente nativo libSQL no soportó el binario Windows ARM disponible, así que el acceso remoto utiliza el cliente HTTP @libsql/client/web. La prueba real remota aprobada confirma el funcionamiento de esa ruta.

SQLite local continúa disponible sin cuentas ni credenciales. El sistema académico no incluye autenticación de usuarios: usar datos de demostración en la aplicación pública.
