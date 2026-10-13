import { readSnapshot } from "../config/database.js";
import Decimal from "decimal.js";
export async function snapshot({ start, end, vendedorId }) {
  const [vendedores, sales, reglas] = await readSnapshot([
    {
      sql: "SELECT * FROM vendedores WHERE (? IS NULL OR id=?) ORDER BY apellido,nombre",
      args: [vendedorId, vendedorId],
    },
    {
      sql: "SELECT vendedor_id,monto_centavos FROM ventas WHERE (? IS NULL OR fecha_venta>=?) AND (? IS NULL OR fecha_venta<=?) AND (? IS NULL OR vendedor_id=?)",
      args: [start, start, end, end, vendedorId, vendedorId],
    },
    {
      sql: "SELECT * FROM reglas_comision ORDER BY CAST(monto_minimo AS NUMERIC)",
      args: [],
    },
  ]);
  const totals = new Map();
  for (const s of sales) {
    const t = totals.get(s.vendedor_id) || { sum: new Decimal(0), count: 0 };
    t.sum = t.sum.plus(s.monto_centavos);
    t.count++;
    totals.set(s.vendedor_id, t);
  }
  return {
    vendedores: vendedores.map((v) => ({
      ...v,
      activo: !!v.activo,
      numero_ventas: totals.get(v.id)?.count || 0,
      total_vendido: (totals.get(v.id)?.sum || new Decimal(0))
        .div(100)
        .toFixed(2),
    })),
    reglas,
  };
}
