import { readFileSync } from "node:fs";
import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { executeScript, pool } from "../src/config/database.js";
after(() => pool.end());
// Ejecutar exclusivamente en una BD de pruebas inicializada con schema + seed.
test(
  "SQLite: CRUD, filtros, comisiones, dashboard y restricciones",
  {},
  async () => {
    await executeScript(
      readFileSync(new URL("../database/seed.sql", import.meta.url), "utf8"),
    );
    let seller, sale;
    try {
      assert.equal((await request(app).get("/api/health")).status, 200);
      const seed = await request(app).get(
        "/api/comisiones?fechaInicio=2026-10-01&fechaFin=2026-10-31",
      );
      assert.equal(seed.status, 200);
      assert.equal(seed.body.data.totales.total_vendido, "8499.99");
      assert.equal(seed.body.data.totales.total_comisiones, "850.00");
      let r = await request(app)
        .post("/api/vendedores")
        .send({
          nombre: "Prueba",
          apellido: "Integración",
          correo: `test-${Date.now()}@example.com`,
          fecha_ingreso: "2026-01-01",
          activo: true,
        });
      assert.equal(r.status, 201);
      seller = r.body.data;
      assert.equal(
        (await request(app).get("/api/vendedores/" + seller.id)).status,
        200,
      );
      assert.equal(
        (await request(app).post("/api/vendedores").send(seller)).status,
        409,
      );
      r = await request(app)
        .put("/api/vendedores/" + seller.id)
        .send({
          ...seller,
          nombre: "Actualizado",
          fecha_ingreso: "2026-01-01",
        });
      assert.equal(r.status, 200);
      const body = {
        vendedor_id: seller.id,
        fecha_venta: "2026-10-01",
        monto: "1000",
        descripcion: "Integración",
      };
      r = await request(app).post("/api/ventas").send(body);
      assert.equal(r.status, 201);
      sale = r.body.data;
      assert.equal(
        (await request(app).get("/api/ventas/" + sale.id)).status,
        200,
      );
      r = await request(app).get(
        `/api/comisiones?fechaInicio=2026-10-01&fechaFin=2026-10-01&vendedorId=${seller.id}`,
      );
      assert.equal(r.body.data.resultados[0].comision, "80.00");
      assert.equal(r.body.data.resultados[0].numero_ventas, 1);
      r = await request(app)
        .put("/api/ventas/" + sale.id)
        .send({ ...body, monto: "5000" });
      assert.equal(r.status, 200);
      r = await request(app).get(
        `/api/ventas?fechaInicio=2026-10-01&fechaFin=2026-10-01&vendedorId=${seller.id}`,
      );
      assert.equal(r.body.data.length, 1);
      r = await request(app).get(
        `/api/dashboard/resumen?fechaInicio=2026-10-01&fechaFin=2026-10-01&vendedorId=${seller.id}`,
      );
      assert.equal(r.body.data.totales.total_comisiones, "600.00");
      r = await request(app).get(
        `/api/comisiones?fechaInicio=2026-10-02&fechaFin=2026-10-03&vendedorId=${seller.id}`,
      );
      assert.equal(r.body.data.totales.numero_ventas, 0);
      assert.equal(
        (await request(app).delete("/api/vendedores/" + seller.id)).status,
        409,
      );
      await assert.rejects(
        pool.query(
          "INSERT INTO reglas_comision(monto_minimo,monto_maximo,porcentaje) VALUES (999,1001,10)",
        ),
        (e) => e.message.includes("Reglas superpuestas"),
      );
      assert.equal(
        (await request(app).delete("/api/ventas/" + sale.id)).status,
        200,
      );
      sale = null;
      assert.equal(
        (await request(app).delete("/api/vendedores/" + seller.id)).status,
        200,
      );
      seller = null;
    } finally {
      if (sale) await pool.query("DELETE FROM ventas WHERE id=$1", [sale.id]);
      if (seller)
        await pool.query("DELETE FROM vendedores WHERE id=$1", [seller.id]);
    }
  },
);
