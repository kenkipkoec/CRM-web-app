import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import LoginPage from "./pages/LoginPage";
import ContactsPage from "./pages/ContactsPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function App({ mode, setMode }: { mode: "light" | "dark"; setMode: (m: "light" | "dark") => void }) {
  return (
    <BrowserRouter>
      <AppBar
        position="static"
        elevation={3}
        sx={{
          backdropFilter: "blur(12px)",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(90deg, #e3f0ff 60%, #005478 100%)"
              : "linear-gradient(90deg, rgba(24,28,36,0.7) 60%, rgba(0,84,120,0.2) 100%)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          borderBottom: "1px solid #005478",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            <span role="img" aria-label="logo">💎</span> MyCRM
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Tasks
          </Button>
          <Button color="inherit" component={RouterLink} to="/contacts">
            Contacts
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
          <IconButton
            sx={{ ml: 2 }}
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<TasksPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
