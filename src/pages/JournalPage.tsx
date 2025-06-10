import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { JournalEntry, JournalLine, Account } from "../types/accounting";
import {
  Paper, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import ExportButton from "../components/ExportButton";

export default function JournalPage({ bookId }: { bookId: number | null }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"});
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [editForm, setEditForm] = useState<Partial<JournalEntry>>({});
  const [editLines, setEditLines] = useState<JournalLine[]>([]);
  const [errorDialog, setErrorDialog] = useState<{open: boolean, message: string}>({open: false, message: ""});
  const [attachment, setAttachment] = useState<File | null>(null);

  // --- Add Entry State ---
  const [addForm, setAddForm] = useState<{date: string, description: string}>({date: "", description: ""});
  const [addLines, setAddLines] = useState<JournalLine[]>([]);

  useEffect(() => {
    if (bookId) {
      apiFetch(`/journal?book_id=${bookId}`).then(setEntries);
      apiFetch(`/accounts?book_id=${bookId}`).then(setAccounts);
    }
  }, [bookId]);

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
        body: JSON.stringify({ ...addForm, lines: addLines, book_id: bookId }),
      });
      setSnackbar({open: true, message: "Journal entry added!", severity: "success"});
      setAddForm({date: "", description: ""});
      setAddLines([]);
      setEntries(await apiFetch(`/journal?book_id=${bookId}`));
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to add journal entry"});
    }
  };

  // --- Edit Entry Logic ---
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
      const updated = await apiFetch(`/journal?book_id=${bookId}`);
      setEntries(updated);
      setSnackbar({open: true, message: "Journal entry updated!", severity: "success"});
      setEditing(null);
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to update entry"});
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await apiFetch(`/journal/${id}`, { method: "DELETE" });
      setEntries(entries.filter(e => e.id !== id));
      setSnackbar({open: true, message: "Entry deleted!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to delete entry"});
    }
  };

  // --- Approval Logic (unchanged) ---
  const submitEntry = async (id: number) => {
    try {
      await apiFetch(`/journal/submit/${id}`, { method: "POST" });
      setEntries(entries.map(e => e.id === id ? { ...e, status: "submitted" } : e));
      setSnackbar({open: true, message: "Entry submitted!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to submit entry"});
    }
  };
  const approveEntry = async (id: number) => {
    try {
      await apiFetch(`/journal/approve/${id}`, { method: "POST" });
      setEntries(entries.map(e => e.id === id ? { ...e, status: "approved" } : e));
      setSnackbar({open: true, message: "Entry approved!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to approve entry"});
    }
  };
  const rejectEntry = async (id: number) => {
    try {
      await apiFetch(`/journal/reject/${id}`, { method: "POST" });
      setEntries(entries.map(e => e.id === id ? { ...e, status: "rejected" } : e));
      setSnackbar({open: true, message: "Entry rejected!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "Failed to reject entry"});
    }
  };

  // --- Export ---
  const exportCSV = () => {
    if (!entries.length) return;
    const header = "Date,Description,Account,Debit,Credit,Status\n";
    const rows = entries.flatMap(entry =>
      entry.lines.map(line =>
        [
          entry.date,
          entry.description,
          accounts.find(a => a.id === line.account_id)?.name || line.account_id,
          line.debit,
          line.credit,
          entry.status || ""
        ].join(",")
      )
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "journal.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.text("Journal Entries", 10, 10);
      let y = 20;
      entries.forEach(entry => {
        doc.text(`${entry.date} | ${entry.description} | ${entry.status || ""}`, 10, y);
        y += 8;
        entry.lines.forEach(line => {
          doc.text(
            `  ${accounts.find(a => a.id === line.account_id)?.name || line.account_id} | Debit: ${line.debit} | Credit: ${line.credit}`,
            10,
            y
          );
          y += 8;
        });
        y += 4;
      });
      doc.save("journal.pdf");
    });
  };

  if (!bookId) return <Typography color="error">Please select an accounting book.</Typography>;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Journal
        <ExportButton onExportCSV={exportCSV} onExportPDF={exportPDF} disabled={!entries.length} />
      </Typography>
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
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
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
                    <TableCell>{entry.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => submitEntry(entry.id)}>Submit</Button>
                      <Button onClick={() => approveEntry(entry.id)}>Approve</Button>
                      <Button onClick={() => rejectEntry(entry.id)}>Reject</Button>
                    </TableCell>
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
          {/* --- File Attachment Section --- */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Attachment</Typography>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setAttachment(e.target.files?.[0] || null)}
            />
            <Button
              onClick={async () => {
                if (attachment && editing) {
                  const formData = new FormData();
                  formData.append("file", attachment);
                  await fetch(`${import.meta.env.VITE_API_URL}/journal/upload/${editing.id}`, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });
                  setSnackbar({open: true, message: "Attachment uploaded!", severity: "success"});
                }
              }}
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
            >
              Upload Attachment
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
      <Dialog open={errorDialog.open} onClose={() => setErrorDialog({open: false, message: ""})}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">{errorDialog.message}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({open: false, message: ""})}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}