import { readFileSync } from "node:fs";
import { executeScript, pool } from "../src/config/database.js";
const action = process.argv[2];
if (!["schema", "seed"].includes(action)) throw new Error("Usa schema o seed");
try {
  await executeScript(
    readFileSync(
      new URL("../database/" + action + ".sql", import.meta.url),
      "utf8",
    ),
  );
  console.log(action + " aplicado correctamente");
} finally {
  await pool.end();
}
