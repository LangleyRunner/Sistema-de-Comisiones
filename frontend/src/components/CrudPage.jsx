import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Snackbar,
} from "@mui/material";
import { api, get, errorMessage } from "../services/api.js";
import {
  Heading,
  Status,
  DataTable,
  Filters,
  initialDates,
  cleanParams,
  today,
  money,
} from "./Common.jsx";
export default function CrudPage({ type }) {
  const sales = type === "ventas",
    title = sales ? "Ventas" : "Vendedores";
  const [rows, setRows] = useState([]),
    [vendors, setVendors] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [filters, setFilters] = useState(initialDates),
    [form, setForm] = useState(null),
    [deleting, setDeleting] = useState(null),
    [saving, setSaving] = useState(false),
    [formError, setFormError] = useState(""),
    [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await get("/" + type, sales ? cleanParams(filters) : undefined);
      setRows(r);
      if (sales) setVendors(await get("/vendedores"));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [type]);
  function edit(row) {
    setFormError("");
    setForm(
      row
        ? {
            ...row,
            ...(sales
              ? { fecha_venta: row.fecha_venta.slice(0, 10) }
              : { fecha_ingreso: row.fecha_ingreso.slice(0, 10) }),
          }
        : sales
          ? {
              vendedor_id: "",
              fecha_venta: today(),
              monto: "",
              descripcion: "",
            }
          : {
              nombre: "",
              apellido: "",
              correo: "",
              fecha_ingreso: today(),
              activo: true,
            },
    );
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = sales
        ? {
            vendedor_id: form.vendedor_id,
            fecha_venta: form.fecha_venta,
            monto: form.monto,
            descripcion: form.descripcion,
          }
        : {
            nombre: form.nombre,
            apellido: form.apellido,
            correo: form.correo,
            fecha_ingreso: form.fecha_ingreso,
            activo: form.activo,
          };
      if (form.id) await api.put(`/${type}/${form.id}`, payload);
      else await api.post("/" + type, payload);
      setForm(null);
      setNotice("Registro guardado correctamente");
      await load();
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    setSaving(true);
    setFormError("");
    try {
      await api.delete(`/${type}/${deleting.id}`);
      setDeleting(null);
      setNotice("Registro eliminado");
      await load();
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }
  const field = (key, value) => setForm({ ...form, [key]: value });
  const input = (key, label, options = {}) => (
    <TextField
      key={key}
      fullWidth
      label={label}
      value={form[key]}
      onChange={(e) => field(key, e.target.value)}
      {...options}
    />
  );
  const actions = {
    key: "actions",
    label: "Acciones",
    render: (r) => (
      <Stack direction="row">
        <Button size="small" onClick={() => edit(r)}>
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => {
            setDeleting(r);
            setFormError("");
          }}
        >
          Eliminar
        </Button>
      </Stack>
    ),
  };
  const columns = sales
    ? [
        { key: "vendedor", label: "Vendedor" },
        {
          key: "fecha_venta",
          label: "Fecha",
          render: (r) => r.fecha_venta.slice(0, 10),
        },
        { key: "monto", label: "Monto", render: (r) => money(r.monto) },
        { key: "descripcion", label: "Descripción" },
        actions,
      ]
    : [
        {
          key: "nombre",
          label: "Nombre",
          render: (r) => `${r.nombre} ${r.apellido}`,
        },
        { key: "correo", label: "Correo" },
        {
          key: "fecha_ingreso",
          label: "Ingreso",
          render: (r) => r.fecha_ingreso.slice(0, 10),
        },
        {
          key: "activo",
          label: "Estado",
          render: (r) => (
            <Chip
              size="small"
              label={r.activo ? "Activo" : "Inactivo"}
              color={r.activo ? "success" : "default"}
              variant="outlined"
            />
          ),
        },
        actions,
      ];
  return (
    <>
      <Heading
        title={title}
        subtitle={
          sales
            ? "Registra y administra las transacciones de tu equipo."
            : "Administra tu equipo comercial y conserva su historial."
        }
        action={
          <Button variant="contained" onClick={() => edit(null)}>
            + {sales ? "Registrar venta" : "Crear vendedor"}
          </Button>
        }
      />
      {sales ? (
        <Filters
          value={filters}
          onChange={setFilters}
          vendedores={vendors}
          onSubmit={load}
          loading={loading}
        />
      ) : (
        <TextField
          label="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, width: { xs: "100%", sm: 360 } }}
        />
      )}
      <Status loading={loading} error={error} />
      {!loading && !error && (
        <DataTable
          columns={columns}
          rows={
            sales
              ? rows
              : rows.filter((r) =>
                  `${r.nombre} ${r.apellido}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
          }
        />
      )}
      <Dialog
        open={!!form}
        onClose={() => !saving && setForm(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form?.id ? "Editar" : "Crear"} {sales ? "venta" : "vendedor"}
        </DialogTitle>
        {form && (
          <form onSubmit={save}>
            <DialogContent>
              <Stack gap={2} sx={{ pt: 1 }}>
                {formError && <Alert severity="error">{formError}</Alert>}
                {sales ? (
                  <>
                    {input("vendedor_id", "Vendedor", {
                      select: true,
                      required: true,
                      children: vendors.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.nombre} {v.apellido}
                          {!v.activo ? " (inactivo)" : ""}
                        </MenuItem>
                      )),
                    })}
                    {input("fecha_venta", "Fecha de venta", {
                      type: "date",
                      required: true,
                      slotProps: { inputLabel: { shrink: true } },
                    })}
                    {input("monto", "Monto (USD)", {
                      type: "number",
                      required: true,
                      slotProps: {
                        htmlInput: {
                          min: "0.01",
                          max: "999999999999.99",
                          step: "0.01",
                        },
                      },
                    })}
                    {input("descripcion", "Descripción", {
                      multiline: true,
                      rows: 3,
                      slotProps: { htmlInput: { maxLength: 500 } },
                    })}
                  </>
                ) : (
                  <>
                    {input("nombre", "Nombre", {
                      required: true,
                      slotProps: { htmlInput: { maxLength: 80 } },
                    })}
                    {input("apellido", "Apellido", {
                      required: true,
                      slotProps: { htmlInput: { maxLength: 80 } },
                    })}
                    {input("correo", "Correo electrónico", {
                      required: true,
                      type: "email",
                      slotProps: { htmlInput: { maxLength: 254 } },
                    })}
                    {input("fecha_ingreso", "Fecha de ingreso", {
                      required: true,
                      type: "date",
                      slotProps: { inputLabel: { shrink: true } },
                    })}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.activo}
                          onChange={(e) => field("activo", e.target.checked)}
                        />
                      }
                      label="Vendedor activo"
                    />
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button disabled={saving} onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
      <Dialog open={!!deleting} onClose={() => !saving && setDeleting(null)}>
        <DialogTitle>¿Eliminar este registro?</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            La eliminación es permanente.
            {!sales &&
              " Los vendedores con ventas deben desactivarse para conservar el historial."}
          </Alert>
          {formError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={saving}
            onClick={remove}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!notice}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
      >
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      </Snackbar>
    </>
  );
}
