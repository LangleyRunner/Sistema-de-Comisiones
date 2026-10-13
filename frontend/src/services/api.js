import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 15000,
});
export const errorMessage = (e) =>
  e.response?.data?.error?.message ||
  "No se pudo conectar con la API. Comprueba que el backend esté disponible.";
export const get = async (path, params) =>
  (await api.get(path, { params })).data.data;
