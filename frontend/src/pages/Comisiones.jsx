import { useEffect, useState } from "react";
import { Alert, Box, Chip, Typography } from "@mui/material";
import { get, errorMessage } from "../services/api.js";
import {
  Heading,
  Status,
  Filters,
  Metrics,
  DataTable,
  money,
  initialDates,
  cleanParams,
} from "../components/Common.jsx";
export default function Comisiones() {
  const [f, setF] = useState(initialDates),
    [vendors, setVendors] = useState([]),
    [data, setData] = useState(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    get("/vendedores")
      .then(setVendors)
      .catch((e) => setError(errorMessage(e)));
  }, []);
  async function load() {
    setLoading(true);
    setError("");
    setData(null);
    try {
      setData(await get("/comisiones", cleanParams(f)));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Heading
        title="Comisiones"
        subtitle="Convierte las ventas del período en resultados claros."
      />
      <Filters
        value={f}
        onChange={setF}
        vendedores={vendors}
        onSubmit={load}
        loading={loading}
      />
      <Status loading={loading} error={error} />
      {data ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Resultado del {data.periodo.fechaInicio} al {data.periodo.fechaFin}.
            Se aplica una sola tasa al total acumulado de cada vendedor.
          </Alert>
          <Metrics totales={data.totales} />
          <DataTable
            rows={data.resultados}
            columns={[
              {
                key: "nombre",
                label: "Vendedor",
                render: (r) => `${r.nombre} ${r.apellido}`,
              },
              { key: "numero_ventas", label: "Ventas" },
              {
                key: "total_vendido",
                label: "Total vendido",
                render: (r) => money(r.total_vendido),
              },
              {
                key: "porcentaje",
                label: "Tasa aplicada",
                render: (r) => (
                  <Chip
                    label={`${r.porcentaje}%`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ),
              },
              {
                key: "comision",
                label: "Comisión",
                render: (r) => (
                  <Typography fontWeight={700} color="primary">
                    {money(r.comision)}
                  </Typography>
                ),
              },
            ]}
          />
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight={700}>Reglas utilizadas</Typography>
            {data.reglas.map((r) => (
              <Chip
                key={r.id || r.monto_minimo}
                label={`${money(r.monto_minimo)} ${r.monto_maximo === null ? "en adelante" : `a menos de ${money(r.monto_maximo)}`} · ${r.porcentaje}%`}
                sx={{ mt: 1, mr: 1 }}
              />
            ))}
          </Box>
        </>
      ) : (
        !loading &&
        !error && (
          <Alert severity="info">
            Selecciona las fechas y pulsa Consultar para calcular las
            comisiones.
          </Alert>
        )
      )}
    </>
  );
}
