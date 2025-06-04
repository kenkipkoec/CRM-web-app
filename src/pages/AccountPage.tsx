import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Account } from "../types/accounting";
import {
  Paper, Typography,Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, MenuItem, Grid
} from "@mui/material";

const ACCOUNT_TYPES = ["Asset", "Liability", "Equity", "Revenue", "Expense"];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState(ACCOUNT_TYPES[0]);
  const [code, setCode] = useState("");

  useEffect(() => {
    apiFetch("/accounts").then(setAccounts);
  }, []);

  const addAccount = async () => {
    if (!name || !type || !code) return;
    await apiFetch("/accounts", {
      method: "POST",
      body: JSON.stringify({ name, type, code }),
    });
    setAccounts([...accounts, { id: Date.now(), name, type, code }]);
    setName(""); setType(ACCOUNT_TYPES[0]); setCode("");
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Chart of Accounts</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select label="Type" value={type} onChange={e => setType(e.target.value)} fullWidth>
            {ACCOUNT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Code" value={code} onChange={e => setCode(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={addAccount}>Add Account</Button>
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map(acc => (
            <TableRow key={acc.id}>
              <TableCell>{acc.code}</TableCell>
              <TableCell>{acc.name}</TableCell>
              <TableCell>{acc.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}