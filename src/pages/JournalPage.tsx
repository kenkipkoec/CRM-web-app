import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { JournalEntry, Account } from "../types/accounting";
import {
  Paper, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, MenuItem, Grid
} from "@mui/material";
import dayjs from "dayjs";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([{ account_id: "", debit: "", credit: "" }]);

  useEffect(() => {
    apiFetch("/journal").then(setEntries);
    apiFetch("/accounts").then(setAccounts);
  }, []);

  const addLine = () => setLines([...lines, { account_id: "", debit: "", credit: "" }]);
  const updateLine = (idx: number, field: string, value: string) => {
    setLines(lines.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const addEntry = async () => {
    const formattedLines = lines.map(l => ({
      account_id: Number(l.account_id),
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
    }));
    await apiFetch("/journal", {
      method: "POST",
      body: JSON.stringify({ date, description, lines: formattedLines }),
    });
    setEntries([...entries, { id: Date.now(), date, description, lines: formattedLines }]);
    setDate(dayjs().format("YYYY-MM-DD")); setDescription(""); setLines([{ account_id: "", debit: "", credit: "" }]);
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Journal Entries</Typography>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
          </Grid>
        </Grid>
        {lines.map((line, idx) => (
          <Grid container spacing={2} key={idx} mt={1}>
            <Grid item xs={12} sm={4}>
              <TextField select label="Account" value={line.account_id} onChange={e => updateLine(idx, "account_id", e.target.value)} fullWidth>
                {accounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.code} - {acc.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Debit" type="number" value={line.debit} onChange={e => updateLine(idx, "debit", e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Credit" type="number" value={line.credit} onChange={e => updateLine(idx, "credit", e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={2}>
              {idx === lines.length - 1 && (
                <Button onClick={addLine}>Add Line</Button>
              )}
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" sx={{ mt: 2 }} onClick={addEntry}>Add Entry</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Lines</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(entry => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>
                {entry.lines.map((l, i) => (
                  <div key={i}>
                    {accounts.find(a => a.id === l.account_id)?.name || l.account_id}: 
                    Debit: {l.debit} Credit: {l.credit}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}