import Decimal from "decimal.js";
import { query } from "../config/database.js";
const row = (r) =>
  r
    ? { ...r, monto: new Decimal(r.monto_centavos).div(100).toFixed(2) }
    : undefined;
const cents = (values) => [
  values[0],
  values[1],
  new Decimal(values[2]).mul(100).toNumber(),
  values[3],
];
export const list = async ({ start, end, vendedorId }) =>
  (
    await query(
      "SELECT s.*,v.nombre||' '||v.apellido AS vendedor FROM ventas s JOIN vendedores v ON v.id=s.vendedor_id WHERE ($1 IS NULL OR s.fecha_venta >= $1) AND ($2 IS NULL OR s.fecha_venta <= $2) AND ($3 IS NULL OR s.vendedor_id=$3) ORDER BY s.fecha_venta DESC,s.id DESC",
      [start, end, vendedorId],
    )
  ).rows.map(row);
export const find = async (id) =>
  row((await query("SELECT * FROM ventas WHERE id=$1", [id])).rows[0]);
export const create = async (values) =>
  row(
    (
      await query(
        "INSERT INTO ventas(vendedor_id,fecha_venta,monto_centavos,descripcion) VALUES($1,$2,$3,$4) RETURNING *",
        cents(values),
      )
    ).rows[0],
  );
export const update = async (id, values) =>
  row(
    (
      await query(
        "UPDATE ventas SET vendedor_id=$1,fecha_venta=$2,monto_centavos=$3,descripcion=$4 WHERE id=$5 RETURNING *",
        [...cents(values), id],
      )
    ).rows[0],
  );
export const remove = async (id) =>
  (await query("DELETE FROM ventas WHERE id=$1 RETURNING id", [id])).rows[0];
