import { Router } from "express";
import { resumen } from "../controllers/dashboardController.js";
const router = Router();
router.get("/resumen", resumen);
export default router;
