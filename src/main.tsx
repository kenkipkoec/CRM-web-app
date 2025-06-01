import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function Main() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        shape: { borderRadius: 16 },
        typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
        palette: {
          mode,
          primary: { main: "#005478" },
          secondary: { main: "#ff9800" },
          background: {
            default: mode === "light" ? "#f5f6fa" : "#181c24",
            paper: mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(24,28,36,0.7)",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
