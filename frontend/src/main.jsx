import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./App.jsx";
const theme = createTheme({
  palette: {
    primary: { main: "#163a65" },
    secondary: { main: "#368ee8" },
    background: { default: "#f4f7fb" },
  },
  typography: {
    fontFamily: "Inter, Segoe UI, sans-serif",
    h4: { fontWeight: 750 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 650 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
