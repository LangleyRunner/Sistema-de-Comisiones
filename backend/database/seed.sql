BEGIN;
INSERT INTO vendedores(nombre,apellido,correo,fecha_ingreso) VALUES
 ('Ana','Torres','ana@example.com','2026-01-10'),('Carlos','Vega','carlos@example.com','2026-02-01'),('Lucía','Mora','lucia@example.com','2026-03-15');
INSERT INTO ventas(vendedor_id,fecha_venta,monto_centavos,descripcion) VALUES
 ((SELECT id FROM vendedores WHERE correo='ana@example.com'),'2026-10-01',50000,'Venta de equipos'),
 ((SELECT id FROM vendedores WHERE correo='ana@example.com'),'2026-10-02',70000,'Servicio técnico'),
 ((SELECT id FROM vendedores WHERE correo='ana@example.com'),'2026-10-03',130000,'Licencias empresariales'),
 ((SELECT id FROM vendedores WHERE correo='carlos@example.com'),'2026-10-05',500000,'Proyecto corporativo'),
 ((SELECT id FROM vendedores WHERE correo='lucia@example.com'),'2026-10-06',99999,'Accesorios');
COMMIT;
