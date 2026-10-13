# Minicore MVC — Sistema de Comisiones con SQLite

Aplicación académica original para administrar vendedores, registrar ventas y calcular comisiones por período. **Esta versión usa SQLite por solicitud del usuario; no requiere PostgreSQL, Docker, contraseñas ni un servidor de base de datos.** La base se crea automáticamente en `backend/data/comisiones.sqlite` al iniciar la API.

## Inicio rápido

Requisito: Node.js **24** (incluye `node:sqlite`). Desde SistemaComisionesMVC:

```powershell
npm install
npm run db:seed
npm run build
npm start
```

Abrir **http://localhost:5173**. API: http://localhost:3001/api; salud: http://localhost:3001/api/health. `npm start` inicia API y vista previa juntos; si aún no existe build lo genera. Usa Ctrl+C para detener ambos. Los puertos 3001 y 5173 deben estar libres. No hace falta crear un .env para uso local.

`db:seed` es opcional: agrega datos de demostración a la base real y debe ejecutarse **solo una vez**. El esquema y tasas se crean automáticamente; `npm run db:init` permite comprobar la inicialización sin borrar registros. El seed contiene ventas del **1 al 6 de octubre de 2026**; consulta 2026-10-01 a 2026-10-31 para obtener **8.499,99 vendidos y 850,00 de comisiones**. Si ya hay vendedores con los correos del ejemplo, el seed se rechaza y se revierte. No hay datos ficticios en el frontend: los ejemplos se guardan en SQLite y se leen mediante la API.

Para desarrollo, en terminales separadas: `npm run dev:backend` y `npm run dev:frontend`. Si el sandbox bloquea la precompilación de Vite, usa build + `npm start`, que sirve los archivos compilados. Después de modificar React, ejecuta nuevamente `npm run build` para actualizar la vista previa.

## Objetivo y tecnologías

El minicore demuestra arquitectura MVC y centraliza un cálculo financiero verificable. Vista: React, Vite, JavaScript, Material UI, Axios, React Router y Recharts. API: Node.js, Express, dotenv y cors. Persistencia: SQLite incorporado en Node; precisión decimal: Decimal.js. Pruebas: node:test y Supertest. Npm workspaces comparte instalación y lockfile.

## Arquitectura y archivos

```text
backend/src/config/database.js     SQLite, esquema y conexión
backend/src/models/               acceso parametrizado a datos
backend/src/controllers/          validación HTTP y coordinación
backend/src/routes/               API REST
backend/src/services/             comisionService.js, minicore
backend/src/utils/                validación de fechas, IDs y cuerpos
backend/database/                schema.sql y seed.sql (SQLite)
backend/test/                    pruebas unitarias, HTTP e integración
frontend/src/components/         formularios, filtros, tablas y métricas
frontend/src/pages/              Dashboard, Vendedores, Ventas, Comisiones
frontend/src/services/api.js      Axios
scripts/start.js                 arranque local de API y frontend
```

**Modelo:** consulta y modifica SQLite. **Vista:** React presenta tablas, gráficos, formularios y mensajes. **Controlador:** recibe la petición, valida parámetros y coordina operaciones. **Servicio:** selecciona tasas y calcula comisiones. Flujo: React → Axios → ruta → controlador → modelo → servicio → JSON → React. Dashboard y Comisiones comparten `comisionService.js`; el frontend nunca calcula las tasas.

## Modelo relacional y consultas

Vendedores: id, nombre, apellido, correo, fecha_ingreso y activo. Ventas: id, vendedor_id, fecha_venta, **monto_centavos** y descripcion. Relación vendedor 1:N ventas, con FK restrictiva. Reglas: id, monto_minimo, monto_maximo y porcentaje.

SQLite no garantiza un tipo NUMERIC decimal fijo como PostgreSQL: por eso los importes se almacenan como **centavos enteros**. Una venta de 500,25 se guarda como 50025; la API conserva el campo `monto` como cadena decimal para React. Las tasas y límites se almacenan como cadenas y el servicio usa Decimal.js. Se evita sumar importes en coma flotante; el modelo agrega los centavos con Decimal para evitar overflow de SUM cuando hay muchos registros.

Todas las consultas usan parámetros. `query` traduce marcadores `$1`, `$2` a enlaces `?` de SQLite, sin interpolar entradas del usuario. Fechas ISO YYYY-MM-DD permiten comparar períodos inclusivos. El reporte lee vendedores, ventas y reglas en una transacción; incluye vendedores sin ventas y devuelve total cero. Los índices de fechas y vendedor/fecha aceleran la selección.

Correo único sin distinguir mayúsculas; importes positivos y enteros; activo restringido a 0/1; triggers impiden superponer reglas tanto al insertar como al actualizar. El servicio comprueba cobertura desde cero hasta infinito sin huecos. Un vendedor con ventas no se puede borrar: desactívalo para conservar historial. Los vendedores inactivos siguen en los reportes y pueden recibir registros históricos.

Cambiar las reglas con SQL recalcula reportes anteriores con las tasas vigentes. No existen liquidaciones guardadas ni versiones históricas de tasas. Node utiliza SQLite síncrono; esta solución es apropiada para la actividad y un servicio de una sola instancia.

## Fórmula de comisiones

**comisión = redondear(total acumulado del vendedor × porcentaje / 100, 2)**.

| Total | Tasa |
| --- | --- |
| Desde 0 hasta menos de 1.000 | 5% |
| Desde 1.000 hasta menos de 5.000 | 8% |
| Desde 5.000 en adelante | 12% |

Una sola tasa se aplica al total del período. Ejemplo: 500 + 700 + 1.300 = 2.500 → 8% → **200**. A 1.000 corresponde 8%; a 5.000 corresponde 12%. Redondeo HALF_UP por vendedor; los totales suman las comisiones redondeadas. Sin ventas: comisión cero.

## API REST y validaciones

Éxito: `{ "data": ... }`. Error: `{ "error": { "message": "..." } }`.

| Ruta | Métodos y filtros |
| --- | --- |
| /api/vendedores | GET, POST |
| /api/vendedores/:id | GET, PUT, DELETE |
| /api/ventas | GET, POST; filtros opcionales fechaInicio, fechaFin, vendedorId |
| /api/ventas/:id | GET, PUT, DELETE |
| /api/comisiones | GET; fechaInicio y fechaFin obligatorias, vendedorId opcional |
| /api/dashboard/resumen | GET; mismos filtros opcionales; sin fechas usa todo el historial |
| /api/health | GET; comprueba conexión SQLite |

Vendedor: nombre, apellido, correo, fecha_ingreso, activo booleano. Venta: vendedor_id, fecha_venta, monto decimal positivo con dos decimales como máximo, descripcion. PUT reemplaza los campos editables. La API valida fechas reales, límites de texto, monto, ID, correo y rangos; códigos 201, 400, 404, 409 y 500. React muestra carga, éxito, errores y estados vacíos; confirma eliminaciones y conserva el formulario si hay errores.

## Configuración opcional

`backend/.env.example`: PORT, CORS_ORIGINS y DATABASE_FILE opcional. Si DATABASE_FILE es relativo, se resuelve desde el directorio de trabajo del backend; usa ruta absoluta si cambias la ubicación. Valor predeterminado estable: backend/data/comisiones.sqlite. `frontend/.env.example`: VITE_API_URL; localmente la API predeterminada es http://localhost:3001/api. El archivo SQLite y .env están ignorados por Git. Respaldar el archivo con la API detenida; no borrar la base para reiniciar la aplicación.

## Pruebas

```powershell
npm test
npm run build
```

Todas las pruebas usan SQLite real en memoria, una base aislada por proceso; **no modifican los datos locales** y no requieren configuración. Incluyen límites 999,99/1.000/1.000,01 y 4.999,99/5.000/5.000,01, redondeo, totales, cobertura de reglas, validación HTTP y **CRUD integrado con SQLite**, filtros, dashboard, FK y correo único. Resultados reales en VERIFICACION.md.

## Despliegue gratuito: Render + Netlify + Turso

La configuración actual usa Render **plan free** para Express, Netlify para React y Turso Free para SQLite persistente. No utiliza discos de pago ni PostgreSQL. Las cuotas de los planes gratuitos siguen aplicando y Render puede suspender la API cuando está inactiva.

Consulta DESPLIEGUE.md. En Render configurar TURSO_DATABASE_URL y TURSO_AUTH_TOKEN como secretos y CORS_ORIGINS con el origen real de Netlify. En Netlify configurar VITE_API_URL con la URL real de Render terminada en /api y recompilar.

Localmente continúa usando el archivo SQLite sin credenciales. Si TURSO_DATABASE_URL está configurada, la capa de datos utiliza el cliente HTTP @libsql/client/web; el modelo obtiene una instantánea transaccional y el cálculo sigue en comisionService.js. Las pruebas limpian la configuración remota y usan únicamente bases locales de memoria.

Las 21 pruebas locales pasan. La conexión remota y publicación requieren cuentas y credenciales reales y aún no se han verificado. No se han creado recursos de pago. No hay autenticación de usuarios en esta actividad; utiliza datos académicos de demostración para la API pública.

## Referencias y cambio de requisito

Las referencias adicionales de JossuEL55/Video-MVC y NicolasBosak/minicore se registran en [REFERENCIAS.md](REFERENCIAS.md), con una comparación de funcionalidades y el alcance real de la revisión. Se mantienen MVC, cálculo por fechas, reglas visibles y la elección de SQLite.

Se revisaron los README de [Carlooosfif/MINICORE-Sistema-Comisiones](https://github.com/Carlooosfif/MINICORE-Sistema-Comisiones) (React/Node, vendedor/ventas/reglas y filtros) y [Anahi606/Minicore](https://github.com/Anahi606/Minicore) (React/Supabase con las mismas entidades). No se copió su código. La URL minicore-one.vercel.app no pudo leerse. Esta implementación sigue las tasas 5/8/12 del enunciado.

El enunciado original pedía PostgreSQL; esta entrega **lo sustituye por SQLite siguiendo la instrucción posterior del usuario**. La presentación y documentación describen SQLite y no afirman utilizar PostgreSQL.
