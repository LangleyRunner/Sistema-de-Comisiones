import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const vite = fileURLToPath(
  new URL("../node_modules/vite/bin/vite.js", import.meta.url),
);
const frontend = fileURLToPath(new URL("../frontend/", import.meta.url));
if (!existsSync(new URL("../frontend/dist/index.html", import.meta.url))) {
  const result = spawnSync(
    process.execPath,
    [vite, "build", "--configLoader", "native"],
    { cwd: frontend, stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status || 1);
}
const children = [
  spawn(process.execPath, ["src/server.js"], {
    cwd: fileURLToPath(new URL("../backend/", import.meta.url)),
    stdio: "inherit",
  }),
  spawn(
    process.execPath,
    [
      vite,
      "preview",
      "--configLoader",
      "native",
      "--host",
      "127.0.0.1",
      "--port",
      "5173",
      "--strictPort",
    ],
    { cwd: frontend, stdio: "inherit" },
  ),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
for (const child of children) {
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => stop(code || 0));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
console.log("Minicore: http://localhost:5173 · API: http://localhost:3001/api");
