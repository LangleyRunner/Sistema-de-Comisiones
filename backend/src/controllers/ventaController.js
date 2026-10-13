import * as model from "../models/ventaModel.js";
import { id, venta, range, fail } from "../utils/validation.js";
const found = (value) => value || fail("Venta no encontrada", 404);
export const list = async (req, res) =>
  res.json({ data: await model.list(range(req.query)) });
export const get = async (req, res) =>
  res.json({ data: found(await model.find(id(req.params.id))) });
export const create = async (req, res) =>
  res.status(201).json({ data: await model.create(venta(req.body)) });
export const update = async (req, res) =>
  res.json({
    data: found(await model.update(id(req.params.id), venta(req.body))),
  });
export const remove = async (req, res) =>
  res.json({ data: found(await model.remove(id(req.params.id))) });
