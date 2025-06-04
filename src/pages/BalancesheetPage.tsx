import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function BalanceSheetPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/balance-sheet").then(setData);
  }, []);

  if (!data) return null;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Balance Sheet</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Assets</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.assets.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.balance}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell><b>Total Assets</b></TableCell>
            <TableCell><b>{data.total_assets}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Liabilities</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.liabilities.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.balance}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell><b>Total Liabilities</b></TableCell>
            <TableCell><b>{data.total_liabilities}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Equity</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.equity.map((acc: any) => (
            <TableRow key={acc.account_id}>
              <TableCell>{acc.account_name}</TableCell>
              <TableCell>{acc.balance}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell><b>Total Equity</b></TableCell>
            <TableCell><b>{data.total_equity}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}