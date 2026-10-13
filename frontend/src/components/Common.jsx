import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  MenuItem,
} from "@mui/material";
export const money = (v) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(
    Number(v || 0),
  );
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const initialDates = () => ({
  fechaInicio: today().slice(0, 8) + "01",
  fechaFin: today(),
  vendedorId: "",
});
export function Heading({ title, subtitle, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      gap={2}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
export function Status({ loading, error }) {
  return (
    <>
      {loading && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress aria-label="Cargando" />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
export function DataTable({
  columns,
  rows,
  empty = "No hay registros para mostrar.",
}) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#edf3fa" }}>
            {columns.map((c) => (
              <TableCell
                key={c.key}
                sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {c.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              {columns.map((c) => (
                <TableCell key={c.key}>
                  {c.render ? c.render(r) : r[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ py: 6, color: "text.secondary" }}
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export function Filters({
  value,
  onChange,
  vendedores = [],
  onSubmit,
  loading,
}) {
  const field = (key, v) => onChange({ ...value, [key]: v });
  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      variant="outlined"
      sx={{ p: 2.5, mb: 3 }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          required
          type="date"
          label="Fecha inicial"
          slotProps={{ inputLabel: { shrink: true } }}
          value={value.fechaInicio}
          onChange={(e) => field("fechaInicio", e.target.value)}
        />
        <TextField
          required
          type="date"
          label="Fecha final"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: value.fechaInicio },
          }}
          value={value.fechaFin}
          onChange={(e) => field("fechaFin", e.target.value)}
        />
        <TextField
          select
          label="Vendedor"
          value={value.vendedorId}
          onChange={(e) => field("vendedorId", e.target.value)}
          sx={{ minWidth: 220, flex: 1 }}
        >
          <MenuItem value="">Todos los vendedores</MenuItem>
          {vendedores.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.nombre} {v.apellido}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" disabled={loading}>
          Consultar
        </Button>
      </Stack>
    </Paper>
  );
}
export function Metrics({ totales }) {
  const metrics = [
    ["Total vendido", money(totales.total_vendido)],
    ["Comisiones generadas", money(totales.total_comisiones)],
    ["Vendedores", totales.cantidad_vendedores],
    ["Transacciones", totales.numero_ventas],
  ];
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4,1fr)" },
        gap: 2,
        mb: 3,
      }}
    >
      {metrics.map(([label, value], i) => (
        <Paper
          key={label}
          variant="outlined"
          sx={{
            p: 3,
            borderTop: `3px solid ${i === 1 ? "#368ee8" : "#163a65"}`,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 23, md: 30 }, mt: 1.5 }}
          >
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Rango consultado
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
export const cleanParams = (v) =>
  Object.fromEntries(Object.entries(v).filter(([, x]) => x !== ""));
