import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function IncomeStatementPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/income-statement").then(setData);
  }, []);

  if (!data) return null;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Income Statement</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Income</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.income.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Expenses</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.expense.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Net Income: {data.net_income}</Typography>
    </Paper>
  );
}