import { StrictMode, useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useNavigate, useLocation, BrowserRouter } from "react-router-dom";

function MainWithRedirect() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<string | null>(null);
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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect to "/" if coming from login or signup
    if (
      user &&
      (location.pathname === "/login" || location.pathname === "/signup")
    ) {
      navigate("/");
    }
  }, [user, navigate, location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} setMode={setMode} user={user} setUser={setUser} />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MainWithRedirect />
    </BrowserRouter>
  </StrictMode>
);
