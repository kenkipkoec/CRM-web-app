import { Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import LoginPage from "./pages/LoginPage";
import ContactsPage from "./pages/ContactsPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import CalendarPage from "./pages/CalendarPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";

function App({
  mode,
  setMode,
  user,
  setUser,
}: {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
  user: string | null;
  setUser: (u: string | null) => void;
}) {
  return (
    <>
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
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/">
                Tasks
              </Button>
              <Button color="inherit" component={RouterLink} to="/contacts">
                Contacts
              </Button>
              <Tooltip title="Profile / Dashboard">
                <IconButton
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  sx={{ ml: 1 }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
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
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={user ? <TasksPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/contacts"
          element={user ? <ContactsPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage user={user} /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/calendar"
          element={user ? <CalendarPage /> : <LoginPage setUser={setUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
