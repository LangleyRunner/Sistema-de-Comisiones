import { range } from "../utils/validation.js";
import { obtenerComisiones } from "../services/comisionService.js";
export const resumen = async (req, res) =>
  res.json({ data: await obtenerComisiones(range(req.query)) });
