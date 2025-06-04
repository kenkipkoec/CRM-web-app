import { useState } from "react";
import { Paper, Typography, Box, TextField, Button, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone: string) {
  return /^\d{10,15}$/.test(phone);
}
function validatePassword(password: string) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [botChecked, setBotChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!firstName.trim()) {
      setError("First Name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last Name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(contact)) {
      setError("Please enter a valid contact number (10-15 digits).");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include a letter and a number.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!botChecked) {
      setError("Please verify you are not a bot.");
      return;
    }
    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, firstName, lastName, email, contact, password }),
      });
      localStorage.setItem("token", res.token);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Signup failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, minWidth: 300 }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Choose a username"
        />
        <TextField
          label="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your first name"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your last name"
        />
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your email"
        />
        <TextField
          label="Contact"
          value={contact}
          onChange={e => setContact(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter your phone number"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Create a password"
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={botChecked}
              onChange={e => setBotChecked(e.target.checked)}
            />
          }
          label="I'm not a bot"
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSignup}>
          Sign Up
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </Typography>
      </Paper>
    </Box>
  );
}