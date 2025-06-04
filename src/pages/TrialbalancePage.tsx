import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function TrialBalancePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/trial-balance").then(setData);
  }, []);

  if (!data) return null;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Trial Balance</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.accounts.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.debit}</TableCell>
              <TableCell>{acc.credit}</TableCell>
              <TableCell>{acc.balance}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell><b>Total</b></TableCell>
            <TableCell><b>{data.total_debit}</b></TableCell>
            <TableCell><b>{data.total_credit}</b></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}