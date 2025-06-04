import { useState, useEffect } from "react";
import { Account } from "../types/accounting";
import { apiFetch } from "../utils/api";
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Snackbar, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box,
} from "@mui/material";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"});
  const [editing, setEditing] = useState<Account | null>(null);
  const [editForm, setEditForm] = useState<Partial<Account>>({});
  const [addForm, setAddForm] = useState<Partial<Account>>({ name: "", type: "", code: "" });
  const [errorDialog, setErrorDialog] = useState<{open: boolean, message: string}>({open: false, message: ""});

  useEffect(() => {
    apiFetch("/accounts").then(setAccounts);
  }, []);

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
        body: JSON.stringify(addForm),
      });
      setAccounts([...accounts, { ...addForm, id: newAcc.id } as Account]);
      setAddForm({ name: "", type: "", code: "" });
      setSnackbar({open: true, message: "Account added!", severity: "success"});
    } catch (err: any) {
      setErrorDialog({open: true, message: err?.error || "An unexpected error occurred."});
    }
  };

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
        <Typography variant="h5" gutterBottom>Chart of Accounts</Typography>
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
            label="Type"
            name="type"
            value={addForm.type || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
            placeholder="Asset, Liability, Equity, Income, Expense"
          />
          <TextField
            label="Code"
            name="code"
            value={addForm.code || ""}
            onChange={handleAddChange}
            size="small"
            fullWidth
          />
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
            <TextField label="Type" name="type" value={editForm.type || ""} onChange={handleEditChange} fullWidth margin="normal" />
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