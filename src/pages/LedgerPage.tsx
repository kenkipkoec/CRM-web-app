import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Account } from "../types/accounting";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import ExportButton from "../components/ExportButton";

export default function LedgerPage({ bookId }: { bookId: number | null }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<number | "">("");
  const [ledger, setLedger] = useState<any[]>([]);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);

  useEffect(() => {
    if (bookId) {
      apiFetch(`/accounts?book_id=${bookId}`).then(setAccounts);
      setSelected(""); // Reset selection when book changes
      setLedger([]);
      setAccountInfo(null);
    }
  }, [bookId]);

  useEffect(() => {
    if (selected && bookId) {
      apiFetch(`/journal/ledger/${selected}?book_id=${bookId}`).then((data) => {
        setLedger(data.ledger || []);
        setAccountInfo(data.account || null);
      });
    } else {
      setLedger([]);
      setAccountInfo(null);
    }
  }, [selected, bookId]);

  const exportCSV = () => {
    if (!ledger.length) return;
    const header = "Date,Description,Debit,Credit,Balance\n";
    const rows = ledger
      .map((l: any) =>
        [l.date, l.description, l.debit, l.credit, l.balance].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!ledger.length) return;
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.jsPDF();
      doc.text("General Ledger", 10, 10);
      if (accountInfo) {
        doc.text(
          `Account: ${accountInfo.name} (${accountInfo.code})`,
          10,
          18
        );
      }
      let y = 28;
      ledger.forEach((l: any) => {
        doc.text(
          `${l.date} | ${l.description} | Debit: ${l.debit} | Credit: ${l.credit} | Balance: ${l.balance}`,
          10,
          y
        );
        y += 8;
      });
      doc.save("ledger.pdf");
    });
  };

  if (!bookId)
    return (
      <Typography color="error">Please select an accounting book.</Typography>
    );

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
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ flex: 1 }}>
            General Ledger
          </Typography>
          <Select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            displayEmpty
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Select Account</MenuItem>
            {accounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.name} ({acc.code})
              </MenuItem>
            ))}
          </Select>
          <ExportButton
            onExportCSV={exportCSV}
            onExportPDF={exportPDF}
            disabled={!ledger.length}
          />
        </Box>
        {accountInfo && (
          <Typography sx={{ mb: 2 }}>
            <b>Account:</b> {accountInfo.name} ({accountInfo.code}) |{" "}
            <b>Type:</b> {accountInfo.type}
          </Typography>
        )}
        {ledger.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledger.map((l: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{l.date}</TableCell>
                  <TableCell>{l.description}</TableCell>
                  <TableCell align="right">{l.debit}</TableCell>
                  <TableCell align="right">{l.credit}</TableCell>
                  <TableCell align="right">{l.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ mt: 4, textAlign: "center" }}>
            {selected
              ? "No ledger entries for this account."
              : "Select an account to view its ledger."}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}