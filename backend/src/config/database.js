import "dotenv/config";
const remote = !!process.env.TURSO_DATABASE_URL;
const adapter = await import(
  remote ? "./tursoDatabase.js" : "./sqliteLocal.js"
);
if (
  process.env.NODE_ENV === "production" &&
  !remote &&
  !process.env.DATABASE_FILE
)
  throw new Error(
    "Configura TURSO_DATABASE_URL y TURSO_AUTH_TOKEN para conservar los datos en la nube",
  );
export const database = adapter.database;
export const query = adapter.query;
export const pool = adapter.pool;
export async function executeScript(sql) {
  if (remote) return adapter.executeScript(sql);
  database.exec(sql);
}
export async function readSnapshot(statements) {
  if (remote) return adapter.readSnapshot(statements);
  database.exec("BEGIN");
  try {
    const rows = statements.map((s) => database.prepare(s.sql).all(...s.args));
    database.exec("COMMIT");
    return rows;
  } catch (e) {
    database.exec("ROLLBACK");
    throw e;
  }
}
