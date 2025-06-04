import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { JournalEntry, JournalLine, Account } from "../types/accounting";
import {
  Paper, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"});
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [editForm, setEditForm] = useState<Partial<JournalEntry>>({});
  const [editLines, setEditLines] = useState<JournalLine[]>([]);
  const [errorDialog, setErrorDialog] = useState<{open: boolean, message: string}>({open: false, message: ""});

  // --- Add Entry State ---
  const [addForm, setAddForm] = useState<{date: string, description: string}>({date: "", description: ""});
  const [addLines, setAddLines] = useState<JournalLine[]>([]);

  useEffect(() => {
    apiFetch("/journal").then(setEntries);
    apiFetch("/accounts").then(setAccounts);
  }, []);

  // --- Add Entry Logic ---
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({...addForm, [e.target.name]: e.target.value});
  };
  const handleAddLineChange = (idx: number, field: keyof JournalLine, value: any) => {
    setAddLines(lines =>
      lines.map((l, i) => i === idx ? { ...l, [field]: field === "account_id" ? Number(value) : value } : l)
    );
  };
  const addAddLine = () => {
    setAddLines([...addLines, { account_id: accounts[0]?.id || 0, debit: 0, credit: 0 }]);
  };
  const removeAddLine = (idx: number) => {
    setAddLines(addLines.filter((_, i) => i !== idx));
  };
  const saveAdd = async () => {
    if (!addForm.date || !addForm.description || addLines.length < 2) {
      setErrorDialog({open: true, message: "Date, description, and at least two lines are required."});
      return;
    }
    try {
      await apiFetch("/journal", {
        method: "POST",
        body: JSON.stringify({ ...addForm, lines: addLines }),
      });
      setSnackbar({open: true, message: "Journal entry added!", severity: "success"});
      setAddForm({date: "", description: ""});
      setAddLines([]);
      setEntries(await apiFetch("/journal"));
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to add journal entry"});
    }
  };

  // --- Edit Entry Logic (unchanged) ---
  const deleteEntry = async (id: number) => {
    try {
      await apiFetch(`/journal/${id}`, { method: "DELETE" });
      setEntries(entries.filter(e => e.id !== id));
      setSnackbar({open: true, message: "Journal entry deleted!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

  const startEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setEditForm({ date: entry.date, description: entry.description });
    setEditLines(entry.lines.map(l => ({ ...l })));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({...editForm, [e.target.name]: e.target.value});
  };

  const handleLineChange = (idx: number, field: keyof JournalLine, value: any) => {
    setEditLines(lines =>
      lines.map((l, i) => i === idx ? { ...l, [field]: field === "account_id" ? Number(value) : value } : l)
    );
  };

  const addLine = () => {
    setEditLines([...editLines, { account_id: accounts[0]?.id || 0, debit: 0, credit: 0 }]);
  };

  const removeLine = (idx: number) => {
    setEditLines(editLines.filter((_, i) => i !== idx));
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await apiFetch(`/journal/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...editForm, lines: editLines }),
      });
      // Refresh entries
      const updated = await apiFetch("/journal");
      setEntries(updated);
      setSnackbar({open: true, message: "Journal entry updated!", severity: "success"});
      setEditing(null);
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Journal Entries</Typography>
      {/* --- Add Entry Form (unchanged) --- */}
      <Box sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
        <Typography variant="h6">Add Journal Entry</Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Date" name="date" type="date" value={addForm.date} onChange={handleAddChange} size="small" InputLabelProps={{ shrink: true }} />
          <TextField label="Description" name="description" value={addForm.description} onChange={handleAddChange} size="small" />
        </Box>
        {addLines.map((line, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
            <TextField
              select
              label="Account"
              name="account_id"
              value={line.account_id}
              onChange={e => handleAddLineChange(idx, "account_id", e.target.value)}
              SelectProps={{ native: true }}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </TextField>
            <TextField
              label="Debit"
              name="debit"
              type="number"
              value={line.debit}
              onChange={e => handleAddLineChange(idx, "debit", Number(e.target.value))}
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              label="Credit"
              name="credit"
              type="number"
              value={line.credit}
              onChange={e => handleAddLineChange(idx, "credit", Number(e.target.value))}
              size="small"
              sx={{ width: 100 }}
            />
            <IconButton onClick={() => removeAddLine(idx)} color="error" size="small">✕</IconButton>
          </Box>
        ))}
        <Button onClick={addAddLine} sx={{ mt: 1, mr: 2 }}>Add Line</Button>
        <Button variant="contained" onClick={saveAdd} sx={{ mt: 1 }}>Save Entry</Button>
      </Box>
      {/* --- Journal Entries Table --- */}
      {entries.map(entry => (
        <Box key={entry.id} sx={{ mb: 4, border: "1px solid #eee", borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle1">
            <b>Date:</b> {entry.date} &nbsp; <b>Description:</b> {entry.description}
          </Typography>
          <Table size="small" sx={{ mt: 1, mb: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Account Code</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entry.lines.map((l, i) => {
                const acc = accounts.find(a => a.id === l.account_id);
                return (
                  <TableRow key={i}>
                    <TableCell>{acc?.code || ""}</TableCell>
                    <TableCell>{acc?.name || l.account_id}</TableCell>
                    <TableCell align="right">{l.debit ? l.debit.toFixed(2) : ""}</TableCell>
                    <TableCell align="right">{l.credit ? l.credit.toFixed(2) : ""}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button onClick={() => startEdit(entry)} size="small">Edit</Button>
          <Button color="error" onClick={() => deleteEntry(entry.id)} size="small">Delete</Button>
        </Box>
      ))}
      {/* --- Edit Dialog --- */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Journal Entry</DialogTitle>
        <DialogContent>
          <TextField label="Date" name="date" value={editForm.date || ""} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Description" name="description" value={editForm.description || ""} onChange={handleEditChange} fullWidth margin="normal" />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Lines</Typography>
          {editLines.map((line, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <TextField
                select
                label="Account"
                name="account_id"
                value={line.account_id}
                onChange={e => handleLineChange(idx, "account_id", e.target.value)}
                SelectProps={{ native: true }}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </TextField>
              <TextField
                label="Debit"
                name="debit"
                type="number"
                value={line.debit}
                onChange={e => handleLineChange(idx, "debit", Number(e.target.value))}
                size="small"
                sx={{ width: 100 }}
              />
              <TextField
                label="Credit"
                name="credit"
                type="number"
                value={line.credit}
                onChange={e => handleLineChange(idx, "credit", Number(e.target.value))}
                size="small"
                sx={{ width: 100 }}
              />
              <IconButton onClick={() => removeLine(idx)} color="error" size="small">✕</IconButton>
            </Box>
          ))}
          <Button onClick={addLine} sx={{ mt: 1 }}>Add Line</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={errorDialog.open} onClose={() => setErrorDialog({open: false, message: ""})}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">{errorDialog.message}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({open: false, message: ""})}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}