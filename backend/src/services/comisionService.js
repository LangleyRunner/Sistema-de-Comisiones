import Decimal from "decimal.js";
import { snapshot } from "../models/comisionModel.js";
import { fail } from "../utils/validation.js";
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
export function calcular(vendedores, reglas) {
  const sorted = [...reglas].sort((a, b) =>
    new Decimal(a.monto_minimo).cmp(b.monto_minimo),
  );
  if (!sorted.length || !new Decimal(sorted[0].monto_minimo).eq(0))
    fail("Las reglas deben comenzar en cero", 500);
  sorted.forEach((r, i) => {
    const min = new Decimal(r.monto_minimo),
      max = r.monto_maximo === null ? null : new Decimal(r.monto_maximo),
      rate = new Decimal(r.porcentaje);
    if (
      min.lt(0) ||
      rate.lt(0) ||
      rate.gt(100) ||
      (max && max.lte(min)) ||
      (i < sorted.length - 1 &&
        (!max || !max.eq(sorted[i + 1].monto_minimo))) ||
      (i === sorted.length - 1 && max !== null)
    )
      fail(
        "Las reglas deben cubrir todos los montos sin huecos ni superposición",
        500,
      );
  });
  const resultados = vendedores.map((v) => {
    const total = new Decimal(v.total_vendido);
    if (total.lt(0)) fail("Total de ventas inválido", 500);
    const regla = sorted.find(
      (r) =>
        total.gte(r.monto_minimo) &&
        (r.monto_maximo === null || total.lt(r.monto_maximo)),
    );
    return {
      ...v,
      total_vendido: total.toFixed(2),
      porcentaje: new Decimal(regla.porcentaje).toFixed(2),
      comision: total.mul(regla.porcentaje).div(100).toFixed(2),
    };
  });
  const sum = (field) =>
    resultados
      .reduce((acc, v) => acc.plus(v[field]), new Decimal(0))
      .toFixed(2);
  return {
    resultados,
    totales: {
      total_vendido: sum("total_vendido"),
      total_comisiones: sum("comision"),
      numero_ventas: resultados.reduce(
        (sum, v) => sum + Number(v.numero_ventas),
        0,
      ),
      cantidad_vendedores: resultados.length,
    },
    reglas: sorted,
  };
}
export async function obtenerComisiones(filtros) {
  const data = await snapshot(filtros);
  if (filtros.vendedorId && !data.vendedores.length)
    fail("Vendedor no encontrado", 404);
  return {
    ...calcular(data.vendedores, data.reglas),
    periodo: { fechaInicio: filtros.start, fechaFin: filtros.end },
  };
}
