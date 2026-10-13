import { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { get, errorMessage } from "../services/api.js";
import {
  Heading,
  Status,
  Metrics,
  Filters,
  initialDates,
  cleanParams,
  money,
} from "../components/Common.jsx";
export default function Dashboard() {
  const [f, setF] = useState(initialDates),
    [vendors, setVendors] = useState([]),
    [data, setData] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const [d, v] = await Promise.all([
        get("/dashboard/resumen", cleanParams(f)),
        get("/vendedores"),
      ]);
      setData(d);
      setVendors(v);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const chart =
    data?.resultados.map((v) => ({
      ...v,
      label: `${v.nombre} ${v.apellido}`,
      total_vendido: Number(v.total_vendido),
      comision: Number(v.comision),
    })) || [];
  return (
    <>
      <Heading
        title="Resumen comercial"
        subtitle="Una mirada a tus ventas y al rendimiento de tu equipo."
        action={
          <Button component={Link} to="/ventas" variant="contained">
            + Registrar venta
          </Button>
        }
      />
      <Filters
        value={f}
        onChange={setF}
        vendedores={vendors}
        onSubmit={load}
        loading={loading}
      />
      <Status loading={loading} error={error} />
      {data && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Período aplicado: {data.periodo.fechaInicio} —{" "}
            {data.periodo.fechaFin}
          </Typography>
          <Metrics totales={data.totales} />
          {!chart.length ? (
            <Alert severity="info">
              Crea tu primer vendedor para comenzar.
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 3,
              }}
            >
              {[
                ["Ventas por vendedor", "total_vendido", "#368ee8"],
                ["Comisiones por vendedor", "comision", "#163a65"],
              ].map(([title, key, color]) => (
                <Paper key={key} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6">{title}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Distribución en el período seleccionado
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chart} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => money(v)} />
                        <Bar
                          dataKey={key}
                          name={title}
                          fill={color}
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}
    </>
  );
}
