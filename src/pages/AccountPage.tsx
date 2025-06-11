import { useState, useEffect } from "react";
import { Account } from "../types/accounting";
import { apiFetch } from "../utils/api";
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Snackbar, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box,
} from "@mui/material";
import ExportButton from "../components/ExportButton";

export default function AccountPage({ bookId }: { bookId: number | null }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"});
  const [editing, setEditing] = useState<Account | null>(null);
  const [editForm, setEditForm] = useState<Partial<Account>>({});
  const [addForm, setAddForm] = useState<Partial<Account>>({ name: "", type: "", code: "" });
  const [errorDialog, setErrorDialog] = useState<{open: boolean, message: string}>({open: false, message: ""});

  useEffect(() => {
    if (bookId) apiFetch(`/accounts?book_id=${bookId}`).then(setAccounts);
  }, [bookId]);

  const deleteAccount = async (id: number) => {
    try {
      await apiFetch(`/accounts/${id}`, { method: "DELETE" });
      setAccounts(accounts.filter(acc => acc.id !== id));
      setSnackbar({open: true, message: "Account deleted!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

  const startEdit = (acc: Account) => {
    setEditing(acc);
    setEditForm(acc);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({...editForm, [e.target.name]: e.target.value});
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await apiFetch(`/accounts/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setAccounts(accounts.map(acc => acc.id === editing.id ? {...acc, ...editForm} as Account : acc));
      setSnackbar({open: true, message: "Account updated!", severity: "success"});
      setEditing(null);
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const addAccount = async () => {
    if (!addForm.name || !addForm.type || !addForm.code) {
      setSnackbar({open: true, message: "All fields are required", severity: "error"});
      return;
    }
    try {
      const newAcc = await apiFetch("/accounts", {
        method: "POST",
        body: JSON.stringify({ ...addForm, book_id: bookId }),
      });
      setAccounts([...accounts, { ...addForm, id: newAcc.id } as Account]);
      setAddForm({ name: "", type: "", code: "" });
      setSnackbar({open: true, message: "Account added!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

  const exportCSV = () => {
    if (!accounts.length) return;
    const header = "Name,Type,Code,Category,Parent ID\n";
    const rows = accounts.map(acc =>
      [acc.name, acc.type, acc.code, acc.category || "", acc.parent_id || ""].join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart_of_accounts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.text("Chart of Accounts", 10, 10);
      accounts.forEach((acc, i) => {
        doc.text(
          `${acc.name} | ${acc.type} | ${acc.code} | ${acc.category || ""} | ${acc.parent_id || ""}`,
          10,
          20 + i * 8
        );
      });
      doc.save("chart_of_accounts.pdf");
    });
  };

  if (!bookId) return <Typography color="error">Please select an accounting book.</Typography>;

  return (
    <Box sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, sm: 2 }, width: "100%" }}>
      <Paper sx={{
        p: { xs: 2, sm: 4 },
        mt: { xs: 2, sm: 4 },
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        borderRadius: { xs: 2, sm: 4 },
        boxShadow: 3,
        overflowX: "auto"
      }}>
        <Typography variant="h5" gutterBottom>
          Chart of Accounts
          <ExportButton onExportCSV={exportCSV} onExportPDF={exportPDF} disabled={!accounts.length} />
        </Typography>
        {/* Add Account Form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 80px"
            },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={addForm.name || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Type"
            name="type"
            value={addForm.type || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
            SelectProps={{ native: true }} // <-- Add this line
          >
            <option value="">Select Type</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
            <option value="Equity">Equity</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </TextField>
          <TextField
            label="Code"
            name="code"
            value={addForm.code || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
          />
          <TextField
            label="Category"
            name="category"
            value={addForm.category || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Parent Account"
            name="parent_id"
            value={addForm.parent_id || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
          >
            <option value="">None</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={addAccount}
            fullWidth
            sx={{
              height: { xs: 40, md: "100%" },
              mt: { xs: 1, md: 0 }
            }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>Name</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>Type</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>Code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.type}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.code}</TableCell>
                  <TableCell>
                    <Button onClick={() => startEdit(acc)} size="small">Edit</Button>
                    <Button color="error" onClick={() => deleteAccount(acc.id)} size="small">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
        <Dialog open={!!editing} onClose={() => setEditing(null)}>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" value={editForm.name || ""} onChange={handleEditChange} fullWidth margin="normal" />
            <TextField
              select
              label="Type"
              name="type"
              value={editForm.type || ""}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            >
              <option value="">Select Type</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </TextField>
            <TextField label="Code" name="code" value={editForm.code || ""} onChange={handleEditChange} fullWidth margin="normal" />
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
      </Paper>
    </Box>
  );
}