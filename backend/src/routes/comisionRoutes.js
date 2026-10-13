import { Router } from "express";
import { list } from "../controllers/comisionController.js";
const router = Router();
router.get("/", list);
export default router;
