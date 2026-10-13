export function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}
export function id(value) {
  if (!/^[1-9]\d*$/.test(String(value)) || Number(value) > 2147483647)
    fail("Identificador inválido");
  return Number(value);
}
export function date(value, label = "Fecha") {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < "0001-01-01"
  )
    fail(`${label} inválida (YYYY-MM-DD)`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  )
    fail(`${label} inválida`);
  return value;
}
export function range(q, required = false) {
  const start =
    q.fechaInicio === undefined ? null : date(q.fechaInicio, "Fecha inicial");
  const end = q.fechaFin === undefined ? null : date(q.fechaFin, "Fecha final");
  if (required && (!start || !end))
    fail("Debes indicar fechaInicio y fechaFin");
  if (start && end && start > end)
    fail("La fecha inicial debe ser anterior o igual a la final");
  return {
    start,
    end,
    vendedorId: q.vendedorId === undefined ? null : id(q.vendedorId),
  };
}
function text(v, label, max) {
  if (typeof v !== "string" || !v.trim() || v.trim().length > max)
    fail(`${label} es obligatorio y admite hasta ${max} caracteres`);
  return v.trim();
}
export function vendedor(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    fail("Debes enviar un objeto JSON");
  const nombre = text(body.nombre, "Nombre", 80),
    apellido = text(body.apellido, "Apellido", 80),
    correo = text(body.correo, "Correo", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) fail("Correo inválido");
  if (typeof body.activo !== "boolean") fail("Activo debe ser booleano");
  return [nombre, apellido, correo, date(body.fecha_ingreso), body.activo];
}
export function venta(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    fail("Debes enviar un objeto JSON");
  const monto = String(body.monto);
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(monto) || Number(monto) <= 0)
    fail("Monto debe ser positivo con máximo 12 enteros y 2 decimales");
  if (typeof body.descripcion !== "string" || body.descripcion.length > 500)
    fail("Descripción inválida (máximo 500 caracteres)");
  return [
    id(body.vendedor_id),
    date(body.fecha_venta),
    monto,
    body.descripcion.trim(),
  ];
}
