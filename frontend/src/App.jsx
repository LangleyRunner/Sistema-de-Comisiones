import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import {
  DashboardOutlined,
  PeopleOutline,
  ReceiptLongOutlined,
  CalculateOutlined,
  Menu,
} from "@mui/icons-material";
import Dashboard from "./pages/Dashboard.jsx";
import Vendedores from "./pages/Vendedores.jsx";
import Ventas from "./pages/Ventas.jsx";
import Comisiones from "./pages/Comisiones.jsx";
const items = [
  ["/", "Dashboard", DashboardOutlined],
  ["/vendedores", "Vendedores", PeopleOutline],
  ["/ventas", "Ventas", ReceiptLongOutlined],
  ["/comisiones", "Comisiones", CalculateOutlined],
];
export default function App() {
  const [open, setOpen] = useState(false);
  const content = (
    <Box sx={{ height: "100%", bgcolor: "#102b50", color: "white", p: 2.5 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>
        ◈ minicore
      </Typography>
      <Typography variant="caption" sx={{ color: "#a6bbd8" }}>
        SISTEMA DE COMISIONES
      </Typography>
      <List sx={{ mt: 5 }}>
        {items.map(([path, label, Icon]) => (
          <ListItemButton
            component={NavLink}
            end={path === "/"}
            to={path}
            key={path}
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: "#b9cce4",
              "&.active": { bgcolor: "#254b76", color: "white" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 8, p: 2, border: "1px solid #345174", borderRadius: 3 }}>
        <Typography fontWeight={600}>Tu desempeño, claro.</Typography>
        <Typography variant="body2" sx={{ color: "#a6bbd8", mt: 1 }}>
          Ventas y comisiones en un solo lugar.
        </Typography>
        <Chip
          label="MVC · SQLite"
          size="small"
          sx={{ mt: 2, color: "#d4e7ff", bgcolor: "#254b76" }}
        />
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 250,
          "& .MuiDrawer-paper": { width: 250, border: 0 },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 250 } }}
      >
        {content}
      </Drawer>
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid #e4eaf2",
            px: { xs: 2, md: 4 },
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            aria-label="Abrir navegación"
            onClick={() => setOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Gestión comercial / Minicore MVC
          </Typography>
          <Chip label="Panel de gestión" variant="outlined" size="small" />
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1500, mx: "auto" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendedores" element={<Vendedores />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/comisiones" element={<Comisiones />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
