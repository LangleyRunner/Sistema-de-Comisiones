import express from "express";
import cors from "cors";
import { query } from "./config/database.js";
import vendedores from "./routes/vendedorRoutes.js";
import ventas from "./routes/ventaRoutes.js";
import comisiones from "./routes/comisionRoutes.js";
import dashboard from "./routes/dashboardRoutes.js";
export const app = express();
app.disable("x-powered-by");
const origins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((x) => x.trim());
app.use(
  cors({
    origin(origin, cb) {
      cb(
        origin && !origins.includes(origin)
          ? Object.assign(new Error("Origen no permitido"), { status: 403 })
          : null,
        true,
      );
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ data: { status: "ok", database: "connected" } });
  } catch {
    res.status(503).json({ error: { message: "Base de datos no disponible" } });
  }
});
app.use("/api/vendedores", vendedores);
app.use("/api/ventas", ventas);
app.use("/api/comisiones", comisiones);
app.use("/api/dashboard", dashboard);
app.use((req, res) =>
  res.status(404).json({ error: { message: "Ruta no encontrada" } }),
);
app.use((err, req, res, next) => {
  let status = err.status || 500,
    message = err.message;
  if (err.errcode === 2067) {
    status = 409;
    message = "El correo ya está registrado";
  }
  if (
    err.errcode === 787 ||
    (err.errcode === 1811 && err.message.includes("FOREIGN KEY"))
  ) {
    status = 409;
    message =
      req.method === "DELETE"
        ? "El vendedor tiene ventas. Desactívalo para conservar su historial."
        : "El vendedor seleccionado no existe";
  }
  if (err.errcode === 275) {
    status = 400;
    message = "Datos inválidos";
  }
  if (status >= 500) {
    console.error("Error de API:", err.code || err.name);
    message =
      "No se pudo completar la operación. Revisa la conexión y configuración de la base de datos.";
  }
  res.status(status).json({ error: { message } });
});
