import * as model from "../models/vendedorModel.js";
import { id, vendedor, fail } from "../utils/validation.js";
const found = (value) => value || fail("Vendedor no encontrado", 404);
export const list = async (req, res) => res.json({ data: await model.list() });
export const get = async (req, res) =>
  res.json({ data: found(await model.find(id(req.params.id))) });
export const create = async (req, res) =>
  res.status(201).json({ data: await model.create(vendedor(req.body)) });
export const update = async (req, res) =>
  res.json({
    data: found(await model.update(id(req.params.id), vendedor(req.body))),
  });
export const remove = async (req, res) =>
  res.json({ data: found(await model.remove(id(req.params.id))) });
