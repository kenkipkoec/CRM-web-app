import { useState } from "react";
import { Contact } from "../types/contact";
import { Paper, Typography, Box, TextField, Button, List, ListItem, ListItemText, Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const addContact = () => {
    if (name.trim()) {
      setContacts([
        ...contacts,
        { id: Date.now().toString(), name, email, phone, company, notes },
      ]);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setNotes("");
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
                : "rgba(40,44,52,0.92)", // lighter and more opaque in dark mode
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                : "0 8px 32px 0 rgba(0,0,0,0.45)", // stronger shadow in dark mode
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Contacts
          </Typography>
          <Grid container spacing={2} columns={12} mb={2}>
            <Grid columns={6}>
              <TextField label="Name" value={name} onChange={e => setName(e.target.value)} size="small" fullWidth />
            </Grid>
            <Grid columns={6}>
              <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} size="small" fullWidth />
            </Grid>
            <Grid columns={6}>
              <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} size="small" fullWidth />
            </Grid>
            <Grid columns={6}>
              <TextField label="Company" value={company} onChange={e => setCompany(e.target.value)} size="small" fullWidth />
            </Grid>
            <Grid columns={12}>
              <TextField label="Notes" value={notes} onChange={e => setNotes(e.target.value)} size="small" fullWidth />
            </Grid>
            <Grid columns={12}>
              <Button variant="contained" onClick={addContact} fullWidth>Add</Button>
            </Grid>
          </Grid>
          <List>
            {contacts.map(contact => (
              <ListItem
                key={contact.id}
                sx={{
                  transition: "background 0.2s",
                  "&:hover": {
                    background: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(0,84,120,0.06)"
                        : "rgba(255,255,255,0.04)",
                    boxShadow: "0 2px 8px 0 rgba(31,38,135,0.08)",
                  },
                }}
              >
                <AccountCircleIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
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
        </Paper>
    </Box>
  );
}