import { Router } from "express";
import * as c from "../controllers/vendedorController.js";
const router = Router();
router
  .get("/", c.list)
  .get("/:id", c.get)
  .post("/", c.create)
  .put("/:id", c.update)
  .delete("/:id", c.remove);
export default router;
