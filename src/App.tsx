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
import AccountsPage from "./pages/AccountPage";
import JournalPage from "./pages/JournalPage";
import TrialBalancePage from "./pages/TrialBalancePage";
import IncomeStatementPage from "./pages/IncomeStatementPage";
import BalanceSheetPage from "./pages/BalanceSheetPage";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Tasks", to: "/" },
    { label: "Contacts", to: "/contacts" },
    { label: "Accounts", to: "/accounts" },
    { label: "Journal", to: "/journal" },
    { label: "Trial Balance", to: "/trial-balance" },
    { label: "Income Statement", to: "/income-statement" },
    { label: "Balance Sheet", to: "/balance-sheet" },
  ];

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
            isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  PaperProps={{
                    sx: { width: 220 }
                  }}
                >
                  <List>
                    {navLinks.map((link) => (
                      <ListItem key={link.to} disablePadding>
                        <ListItemButton
                          component={RouterLink}
                          to={link.to}
                          onClick={() => setDrawerOpen(false)}
                        >
                          <ListItemText primary={link.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to="/dashboard"
                        onClick={() => setDrawerOpen(false)}
                      >
                        <AccountCircleIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Dashboard" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Drawer>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Button
                    key={link.to}
                    color="inherit"
                    component={RouterLink}
                    to={link.to}
                  >
                    {link.label}
                  </Button>
                ))}
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
            )
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
          element={<DashboardPage user={user} setUser={setUser} />}
        />
        <Route
          path="/calendar"
          element={user ? <CalendarPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/accounts"
          element={user ? <AccountsPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/journal"
          element={user ? <JournalPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/trial-balance"
          element={user ? <TrialBalancePage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/income-statement"
          element={user ? <IncomeStatementPage /> : <LoginPage setUser={setUser} />}
        />
        <Route
          path="/balance-sheet"
          element={user ? <BalanceSheetPage /> : <LoginPage setUser={setUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
