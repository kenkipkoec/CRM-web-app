import { useState, useEffect } from "react";
import { Contact } from "../types/contact";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiFetch } from "../utils/api";

function normalizeContact(contact: any): Contact {
  return contact as Contact;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity?: "success" | "info" | "error";
  }>({ open: false, message: "" });

  useEffect(() => {
    apiFetch("/contacts")
      .then((data) => setContacts(data.map(normalizeContact)))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Failed to load contacts",
          severity: "error",
        })
      );
  }, []);

  const addContact = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setSnackbar({
        open: true,
        message: "Name, email, and phone are required.",
        severity: "error",
      });
      return;
    }
    try {
      const newContact = await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, company, notes }),
      });
      setContacts([...contacts, normalizeContact(newContact)]);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setNotes("");
      setSnackbar({
        open: true,
        message: "Contact added!",
        severity: "success",
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        setSnackbar({ open: true, message: err.message, severity: "error" });
      else
        setSnackbar({
          open: true,
          message: "Failed to add contact",
          severity: "error",
        });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await apiFetch(`/contacts/${id}`, { method: "DELETE" });
      setContacts(contacts.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: "Contact deleted!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete contact",
        severity: "error",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f5f6fa 60%, #e3f0ff 100%)"
            : "linear-gradient(135deg, #181c24 60%, #22334d 100%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          backdropFilter: "blur(16px)",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(40,44,52,0.92)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              : "0 8px 32px 0 rgba(0,0,0,0.45)",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contacts
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid>
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid>
            <TextField
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid>
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid>
            <Button variant="contained" onClick={addContact} fullWidth>
              Add Contact
            </Button>
          </Grid>
        </Grid>
        <List>
          {contacts.map((contact) => (
            <ListItem
              key={contact.id}
              secondaryAction={
                <Button
                  color="error"
                  onClick={() => deleteContact(contact.id)}
                >
                  Delete
                </Button>
              }
            >
              <ListItemText
                primary={contact.name}
                secondary={
                  <>
                    {contact.email && <span>Email: {contact.email} </span>}
                    {contact.phone && <span>Phone: {contact.phone} </span>}
                    {contact.company && <span>Company: {contact.company} </span>}
                    {contact.notes && <span>Notes: {contact.notes}</span>}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity || "info"} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}