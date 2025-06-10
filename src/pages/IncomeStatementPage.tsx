import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import ExportButton from "../components/ExportButton";

export default function IncomeStatementPage({ bookId }: { bookId: number | null }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (bookId) apiFetch(`/journal/income-statement?book_id=${bookId}`).then(setData);
  }, [bookId]);

  if (!bookId) return <Typography color="error">Please select an accounting book.</Typography>;
  if (!data) return null;

  const totalIncome = data.income.reduce((sum: number, acc: any) => sum + acc.amount, 0);
  const totalExpense = data.expense.reduce((sum: number, acc: any) => sum + acc.amount, 0);

  const exportCSV = () => {
    if (!data) return;
    let rows = "Section,Account Code,Account Name,Amount\n";
    data.income.forEach((acc: any) => {
      rows += `Income,${acc.account_code},${acc.account_name},${acc.amount}\n`;
    });
    data.expense.forEach((acc: any) => {
      rows += `Expense,${acc.account_code},${acc.account_name},${acc.amount}\n`;
    });
    rows += `,,Net Income,${data.net_income}\n`;
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "income_statement.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.text("Income Statement", 10, 10);
      let y = 20;
      doc.text("Income", 10, y);
      y += 8;
      data.income.forEach((acc: any) => {
        doc.text(`${acc.account_code} | ${acc.account_name} | ${acc.amount}`, 10, y);
        y += 8;
      });
      y += 4;
      doc.text("Expenses", 10, y);
      y += 8;
      data.expense.forEach((acc: any) => {
        doc.text(`${acc.account_code} | ${acc.account_name} | ${acc.amount}`, 10, y);
        y += 8;
      });
      y += 8;
      doc.text(`Net Income: ${data.net_income}`, 10, y);
      doc.save("income_statement.pdf");
    });
  };

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
          <ExportButton onExportCSV={exportCSV} onExportPDF={exportPDF} disabled={!data} />
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