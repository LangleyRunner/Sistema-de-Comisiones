import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular } from "../src/services/comisionService.js";
const reglas = [
  { monto_minimo: "0", monto_maximo: "1000", porcentaje: "5" },
  { monto_minimo: "1000", monto_maximo: "5000", porcentaje: "8" },
  { monto_minimo: "5000", monto_maximo: null, porcentaje: "12" },
];
for (const [total, tasa, comision] of [
  ["0", "5.00", "0.00"],
  ["999.99", "5.00", "50.00"],
  ["1000", "8.00", "80.00"],
  ["1000.01", "8.00", "80.00"],
  ["4999.99", "8.00", "400.00"],
  ["5000", "12.00", "600.00"],
  ["5000.01", "12.00", "600.00"],
  ["2500", "8.00", "200.00"],
  ["0.10", "5.00", "0.01"],
])
  test(`Total ${total}: tasa ${tasa}% y comisión ${comision}`, () => {
    const r = calcular(
      [{ id: 1, total_vendido: total, numero_ventas: 3 }],
      reglas,
    ).resultados[0];
    assert.equal(r.porcentaje, tasa);
    assert.equal(r.comision, comision);
  });
test("Suma de comisiones redondeadas por vendedor y ventas", () => {
  const r = calcular(
    [
      { id: 1, total_vendido: "2500", numero_ventas: 3 },
      { id: 2, total_vendido: "5000", numero_ventas: 1 },
    ],
    reglas,
  );
  assert.deepEqual(r.totales, {
    total_vendido: "7500.00",
    total_comisiones: "800.00",
    numero_ventas: 4,
    cantidad_vendedores: 2,
  });
});
test("Resultado vacío", () =>
  assert.equal(calcular([], reglas).totales.total_comisiones, "0.00"));
test("Rechaza reglas con huecos, solapamientos o sin cobertura final", () => {
  assert.throws(() => calcular([], []));
  assert.throws(() =>
    calcular(
      [],
      [{ monto_minimo: "0", monto_maximo: "1000", porcentaje: "5" }],
    ),
  );
  assert.throws(() =>
    calcular(
      [],
      [reglas[0], { ...reglas[1], monto_minimo: "1001" }, reglas[2]],
    ),
  );
  assert.throws(() =>
    calcular([], [reglas[0], { ...reglas[1], monto_minimo: "999" }, reglas[2]]),
  );
});
test("Las reglas de base de datos son configurables", () =>
  assert.equal(
    calcular(
      [{ total_vendido: "1000", numero_ventas: 1 }],
      [{ monto_minimo: "0", monto_maximo: null, porcentaje: "10" }],
    ).resultados[0].comision,
    "100.00",
  ));
