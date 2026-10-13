CREATE TABLE IF NOT EXISTS vendedores (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nombre TEXT NOT NULL CHECK(length(trim(nombre)) BETWEEN 1 AND 80),
 apellido TEXT NOT NULL CHECK(length(trim(apellido)) BETWEEN 1 AND 80),
 correo TEXT NOT NULL,
 fecha_ingreso TEXT NOT NULL,
 activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))
);
CREATE UNIQUE INDEX IF NOT EXISTS vendedores_correo_unique ON vendedores(lower(correo));
-- Importes en centavos enteros, nunca REAL.
CREATE TABLE IF NOT EXISTS ventas (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 vendedor_id INTEGER NOT NULL REFERENCES vendedores(id) ON DELETE RESTRICT,
 fecha_venta TEXT NOT NULL,
 monto_centavos INTEGER NOT NULL CHECK(typeof(monto_centavos)='integer' AND monto_centavos > 0 AND monto_centavos <= 99999999999999),
 descripcion TEXT NOT NULL DEFAULT '' CHECK(length(descripcion)<=500)
);
CREATE INDEX IF NOT EXISTS ventas_vendedor_fecha ON ventas(vendedor_id,fecha_venta);
CREATE INDEX IF NOT EXISTS ventas_fecha ON ventas(fecha_venta);
CREATE TABLE IF NOT EXISTS reglas_comision (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 monto_minimo TEXT NOT NULL,
 monto_maximo TEXT,
 porcentaje TEXT NOT NULL,
 CHECK(CAST(monto_minimo AS NUMERIC)>=0),
 CHECK(monto_maximo IS NULL OR CAST(monto_maximo AS NUMERIC)>CAST(monto_minimo AS NUMERIC)),
 CHECK(CAST(porcentaje AS NUMERIC) BETWEEN 0 AND 100)
);
CREATE TRIGGER IF NOT EXISTS reglas_no_superpuestas_insert BEFORE INSERT ON reglas_comision
WHEN EXISTS(SELECT 1 FROM reglas_comision r WHERE (NEW.monto_maximo IS NULL OR CAST(r.monto_minimo AS NUMERIC)<CAST(NEW.monto_maximo AS NUMERIC)) AND (r.monto_maximo IS NULL OR CAST(NEW.monto_minimo AS NUMERIC)<CAST(r.monto_maximo AS NUMERIC)))
BEGIN SELECT RAISE(ABORT,'Reglas superpuestas'); END;
CREATE TRIGGER IF NOT EXISTS reglas_no_superpuestas_update BEFORE UPDATE ON reglas_comision
WHEN EXISTS(SELECT 1 FROM reglas_comision r WHERE r.id<>NEW.id AND (NEW.monto_maximo IS NULL OR CAST(r.monto_minimo AS NUMERIC)<CAST(NEW.monto_maximo AS NUMERIC)) AND (r.monto_maximo IS NULL OR CAST(NEW.monto_minimo AS NUMERIC)<CAST(r.monto_maximo AS NUMERIC)))
BEGIN SELECT RAISE(ABORT,'Reglas superpuestas'); END;
