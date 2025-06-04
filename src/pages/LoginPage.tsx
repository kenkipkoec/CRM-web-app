import { useState } from "react";
import { Paper, Typography, Box, TextField, Button, Link, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function LoginPage({ setUser }: { setUser: (u: string) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
      });
      localStorage.setItem("token", res.token);
      setUser(res.user.username);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, minWidth: 300 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Welcome to our Interpark Customer Relation Management site where we handle your tasks and errands.<br />
          Login if you have an account. If not, register with us by clicking on <b>register with us</b>.
        </Alert>
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <TextField
          label="Username or Email"
          value={login}
          onChange={e => setLogin(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your username or email"
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(v => !v)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          New user?{" "}
          <Link href="/signup" underline="hover">
            Register with us
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}