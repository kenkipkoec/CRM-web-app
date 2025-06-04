import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

export default function IncomeStatementPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/income-statement").then(setData);
  }, []);

  if (!data) return null;

  const totalIncome = data.income.reduce((sum: number, acc: any) => sum + acc.amount, 0);
  const totalExpense = data.expense.reduce((sum: number, acc: any) => sum + acc.amount, 0);

  return (
    <Box sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, sm: 2 }, width: "100%" }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          mt: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, textAlign: "center" }}
        >
          Income Statement
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.2rem" } }}>
              Income
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.income.map((acc: any) => (
                    <TableRow key={acc.account_id}>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                      <TableCell align="right">{acc.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Income</b></TableCell>
                    <TableCell align="right"><b>{totalIncome.toFixed(2)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.2rem" } }}>
              Expenses
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.expense.map((acc: any) => (
                    <TableRow key={acc.account_id}>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                      <TableCell align="right">{acc.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Expenses</b></TableCell>
                    <TableCell align="right"><b>{totalExpense.toFixed(2)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            textAlign: { xs: "center", sm: "right" },
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Net Income: <b>{data.net_income.toFixed(2)}</b>
        </Typography>
      </Paper>
    </Box>
  );
}