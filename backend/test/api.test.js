import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/config/database.js";
after(() => pool.end());
test("404 JSON consistente", async () => {
  const r = await request(app).get("/api/desconocida");
  assert.equal(r.status, 404);
  assert.ok(r.body.error.message);
});
test("CORS bloquea origen desconocido", async () => {
  const r = await request(app)
    .get("/api/vendedores")
    .set("Origin", "https://desconocido.example");
  assert.equal(r.status, 403);
});
test("Rangos obligatorios y fechas imposibles", async () => {
  for (const q of [
    "",
    "?fechaInicio=2026-02-30&fechaFin=2026-03-01",
    "?fechaInicio=2026-10-12&fechaFin=2026-10-01",
    "?fechaInicio=2026-10-01&fechaFin=2026-10-12&vendedorId=abc",
  ]) {
    const r = await request(app).get("/api/comisiones" + q);
    assert.equal(r.status, 400);
  }
});
test("IDs inválidos nunca llegan a SQL", async () => {
  for (const id of ["0", "-1", "abc", "2147483648"]) {
    assert.equal((await request(app).get("/api/vendedores/" + id)).status, 400);
  }
});
test("Rechaza ventas negativas, cero y decimales excesivos", async () => {
  for (const monto of ["-1", "0", "1.001", "1e4"]) {
    const r = await request(app).post("/api/ventas").send({
      vendedor_id: 1,
      fecha_venta: "2026-10-01",
      monto,
      descripcion: "",
    });
    assert.equal(r.status, 400);
  }
});
test("Valida correo y activo", async () => {
  const r = await request(app).post("/api/vendedores").send({
    nombre: "Ana",
    apellido: "Torres",
    correo: "incorrecto",
    fecha_ingreso: "2026-10-01",
    activo: true,
  });
  assert.equal(r.status, 400);
});
test("JSON inválido retorna 400", async () => {
  const r = await request(app)
    .post("/api/ventas")
    .set("Content-Type", "application/json")
    .send("{");
  assert.equal(r.status, 400);
});
