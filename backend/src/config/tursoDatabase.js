import { createClient } from "@libsql/client/web";
import { readFileSync } from "node:fs";
const url = process.env.TURSO_DATABASE_URL;
if (!url.startsWith("file:") && !process.env.TURSO_AUTH_TOKEN)
  throw new Error("Configura TURSO_AUTH_TOKEN como secreto en Render");
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
function normalize(error) {
  if (String(error.code).includes("CONSTRAINT_UNIQUE")) error.errcode = 2067;
  if (
    String(error.code).includes("CONSTRAINT_FOREIGNKEY") ||
    error.message.includes("FOREIGN KEY constraint failed")
  )
    error.errcode = 787;
  if (String(error.code).includes("CONSTRAINT_CHECK")) error.errcode = 275;
  return error;
}
export async function executeScript(sql) {
  try {
    await client.executeMultiple(sql);
  } catch (e) {
    throw normalize(e);
  }
}
export async function query(sql, params = []) {
  const args = [];
  const text = sql.replace(/\$(\d+)/g, (_, n) => {
    args.push(
      typeof params[n - 1] === "boolean"
        ? Number(params[n - 1])
        : params[n - 1],
    );
    return "?";
  });
  try {
    const r = await client.execute({ sql: text, args });
    return {
      rows: r.rows.map((row) => ({
        ...row,
        ...("activo" in row ? { activo: !!row.activo } : {}),
      })),
    };
  } catch (e) {
    throw normalize(e);
  }
}
export async function readSnapshot(statements) {
  try {
    return (await client.batch(statements, "read")).map((result) =>
      result.rows.map((row) => ({ ...row })),
    );
  } catch (e) {
    throw normalize(e);
  }
}
await executeScript(
  readFileSync(new URL("../../database/schema.sql", import.meta.url), "utf8"),
);
const tx = await client.transaction("write");
try {
  if (
    !(await tx.execute("SELECT COUNT(*) AS n FROM reglas_comision")).rows[0].n
  )
    await tx.execute(
      "INSERT INTO reglas_comision(monto_minimo,monto_maximo,porcentaje) VALUES ('0','1000','5'),('1000','5000','8'),('5000',NULL,'12')",
    );
  await tx.commit();
} catch (e) {
  await tx.rollback();
  throw normalize(e);
} finally {
  tx.close();
}
export const pool = { query, end: async () => client.close() };
