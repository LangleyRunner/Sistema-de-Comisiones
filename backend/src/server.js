import { app } from "./app.js";
import { pool } from "./config/database.js";
const server = app.listen(process.env.PORT || 3001, () =>
  console.log("API Minicore iniciada"),
);
async function stop() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
