import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

export default function TrialBalancePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/trial-balance").then(setData);
  }, []);

  if (!data) return null;

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
        <Typography variant="h5" gutterBottom>Trial Balance</Typography>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account Code</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.accounts.map((acc: any) => (
                <TableRow key={acc.account_id}>
                  <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                  <TableCell align="right">{acc.debit ? acc.debit.toFixed(2) : ""}</TableCell>
                  <TableCell align="right">{acc.credit ? acc.credit.toFixed(2) : ""}</TableCell>
                  <TableCell align="right">{acc.balance ? acc.balance.toFixed(2) : ""}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}><b>Total</b></TableCell>
                <TableCell align="right"><b>{data.total_debit.toFixed(2)}</b></TableCell>
                <TableCell align="right"><b>{data.total_credit.toFixed(2)}</b></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}