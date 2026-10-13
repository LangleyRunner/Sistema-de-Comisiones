# Referencias adicionales para la actividad MVC

Referencias proporcionadas por el usuario y revisadas el 13 de octubre de 2026. Se usan como orientación académica; no se copió código ni se cambió la decisión de utilizar SQLite.

## 1. JossuEL55 — Video-MVC

- [Repositorio](https://github.com/JossuEL55/Video-MVC)
- [Video indicado](https://youtu.be/ICz5vPndHkQ)
- [Despliegue indicado](https://video-mvc.onrender.com)

El README público describe una aplicación Laravel 12 de comisiones: migraciones para vendedores, ventas y reglas; seeders; un controlador que filtra por fechas y calcula comisiones; una vista responsiva con filtros, vendedores, reglas y resultados. Se pudo leer el README y observar la estructura del repositorio. No se pudo consultar el contenido del video ni verificar la aplicación desplegada; tampoco se verificó el código del controlador. Por tanto, no se atribuye a esa referencia una fórmula ni tasas concretas.

| Elemento descrito en la referencia | Correspondencia en esta entrega |
| --- | --- |
| Vendedores, ventas y reglas | Tablas SQLite con relaciones e índices en schema.sql |
| Migraciones y seeders | Creación automática del esquema y seed.sql opcional |
| Filtro por rango de fechas | Fechas inclusivas validadas por el controlador |
| Coordinación desde controlador | Controllers Express coordinan modelos y servicio |
| Cálculo por vendedor | comisionService.js aplica una tasa al total del período |
| Tabla de vendedores | Página Vendedores con CRUD y búsqueda |
| Reglas y resultados visibles | Página Comisiones muestra tasas utilizadas y resultados |
| Vista responsiva | React y Material UI, navegación móvil y tablas |
| Publicación | Configuración propia Netlify/Render; aún sin despliegue realizado |

La arquitectura y el problema sirven como referencia. Se mantiene la implementación original React/Express/SQLite y las tasas **5%, 8% y 12%** solicitadas. El cálculo está en un servicio separado para explicarlo y probarlo de forma independiente.

## 2. NicolasBosak — minicore

- [Repositorio indicado](https://github.com/NicolasBosak/minicore)
- [Video indicado](https://youtu.be/CopTvzy5eu8)
- [Despliegue indicado](http://minicorecasamen.mnz.dom.my.id/)

El repositorio devolvió 404 en la consulta web; la búsqueda pública no permitió recuperar su contenido. Los enlaces de video y despliegue no pudieron consultarse con la herramienta disponible. Se conservan como referencias aportadas, pero **no se afirma haber revisado su implementación, entidades, fórmula o interfaz**. Si posteriormente están accesibles, la comparación debe basarse en su contenido real.

## Cómo utilizarlas en la presentación

Explicar primero el problema común y después recorrer una solicitud propia: React → Axios → ruta Express → controlador → modelo SQLite → servicio de comisión → JSON → vista. Mostrar esquema/seed, CRUD, filtros, tasas y resultados. Aclarar que la referencia usa Laravel y que esta entrega conserva MVC con tecnologías distintas; las funciones y separación de responsabilidades son lo que se compara.

Los videos enlazados son material de referencia, no el video de esta entrega. Sus despliegues pertenecen a otros proyectos y no deben presentarse como una publicación propia. El guion GUIA_VIDEO.md mantiene la demostración del proyecto propio y exige mostrar una URL propia solo después del despliegue real.
