import { query } from "../config/database.js";
export const list = async () =>
  (await query("SELECT * FROM vendedores ORDER BY apellido,nombre")).rows;
export const find = async (id) =>
  (await query("SELECT * FROM vendedores WHERE id=$1", [id])).rows[0];
export const create = async (values) =>
  (
    await query(
      "INSERT INTO vendedores(nombre,apellido,correo,fecha_ingreso,activo) VALUES($1,$2,$3,$4,$5) RETURNING *",
      values,
    )
  ).rows[0];
export const update = async (id, values) =>
  (
    await query(
      "UPDATE vendedores SET nombre=$1,apellido=$2,correo=$3,fecha_ingreso=$4,activo=$5 WHERE id=$6 RETURNING *",
      [...values, id],
    )
  ).rows[0];
export const remove = async (id) =>
  (await query("DELETE FROM vendedores WHERE id=$1 RETURNING id", [id]))
    .rows[0];
