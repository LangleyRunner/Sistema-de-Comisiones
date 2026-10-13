import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const filename =
  process.env.DATABASE_FILE ||
  fileURLToPath(new URL("../../data/comisiones.sqlite", import.meta.url));
if (filename !== ":memory:")
  mkdirSync(dirname(resolve(filename)), { recursive: true });
export const database = new DatabaseSync(filename);
database.exec("PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
if (filename !== ":memory:") database.exec("PRAGMA journal_mode=WAL;");
database.exec(
  readFileSync(new URL("../../database/schema.sql", import.meta.url), "utf8"),
);
export async function query(sql, params = []) {
  const values = [];
  const statement = database.prepare(
    sql.replace(/\$(\d+)/g, (_, n) => {
      values.push(
        typeof params[n - 1] === "boolean"
          ? Number(params[n - 1])
          : params[n - 1],
      );
      return "?";
    }),
  );
  return {
    rows: statement.all(...values).map((row) => ({
      ...row,
      ...("activo" in row ? { activo: !!row.activo } : {}),
    })),
  };
}
export const pool = { query, end: async () => database.close() };
if (!database.prepare("SELECT COUNT(*) AS n FROM reglas_comision").get().n) {
  database.exec(
    "INSERT INTO reglas_comision(monto_minimo,monto_maximo,porcentaje) VALUES ('0','1000','5'),('1000','5000','8'),('5000',NULL,'12')",
  );
}
