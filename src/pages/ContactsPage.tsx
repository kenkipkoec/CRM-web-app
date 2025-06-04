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
        px: { xs: 0, sm: 2 },
        py: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 2, md: 4 },
          mt: { xs: 1, sm: 2, md: 8 },
          width: "100%",
          maxWidth: { xs: "100%", sm: 600, md: 900 },
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: { xs: "1.4rem", sm: "2rem" }, textAlign: "center" }}
        >
          Contacts
        </Typography>
        {/* Responsive form using CSS grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            size="small"
            sx={{ gridColumn: { xs: "1", sm: "1 / span 2", md: "auto" } }}
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            size="small"
            sx={{ gridColumn: { xs: "1", sm: "2 / span 1", md: "auto" } }}
          />
          <Button
            variant="contained"
            onClick={addContact}
            fullWidth
            sx={{
              height: { xs: 40, sm: "100%" },
              mt: { xs: 1, sm: 0 },
              gridColumn: { xs: "1", sm: "1 / span 2", md: "auto" },
            }}
          >
            Add Contact
          </Button>
        </Box>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <List sx={{ minWidth: 250 }}>
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
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  minWidth: 220,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                      {contact.name}
                    </Typography>
                  }
                  secondary={
                    <Box component="span" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                      {contact.email && <span>Email: {contact.email} </span>}
                      {contact.phone && <span>Phone: {contact.phone} </span>}
                      {contact.company && <span>Company: {contact.company} </span>}
                      {contact.notes && <span>Notes: {contact.notes}</span>}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
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