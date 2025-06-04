import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

export default function BalanceSheetPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/journal/balance-sheet").then(setData);
  }, []);

  if (!data) return null;

  return (
    <Box sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, sm: 2 }, width: "100%" }}>
      <Paper sx={{
        p: { xs: 2, sm: 4 },
        mt: { xs: 2, sm: 4 },
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        borderRadius: { xs: 2, sm: 4 },
        boxShadow: 3,
        overflowX: "auto"
      }}>
        <Typography variant="h5" gutterBottom>Balance Sheet</Typography>
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%"
        }}>
          {/* Assets (Left) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>Assets</Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.assets.map((acc: any) => (
                    <TableRow key={acc.account_id}>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                      <TableCell align="right">{acc.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Assets</b></TableCell>
                    <TableCell align="right"><b>{data.total_assets.toFixed(2)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
          {/* Liabilities + Equity (Right) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>Liabilities</Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.liabilities.map((acc: any) => (
                    <TableRow key={acc.account_id}>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                      <TableCell align="right">{acc.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Liabilities</b></TableCell>
                    <TableCell align="right"><b>{data.total_liabilities.toFixed(2)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>Equity</Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.equity.map((acc: any) => (
                    <TableRow key={acc.account_id || acc.account_name}>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_code || ""}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>{acc.account_name}</TableCell>
                      <TableCell align="right">{acc.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Equity</b></TableCell>
                    <TableCell align="right"><b>{data.total_equity.toFixed(2)}</b></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}><b>Total Liabilities + Equity</b></TableCell>
                    <TableCell align="right"><b>{(data.total_liabilities + data.total_equity).toFixed(2)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="h6">
            <b>Assets</b>: {data.total_assets.toFixed(2)} &nbsp;&nbsp;|&nbsp;&nbsp; <b>Liabilities + Equity</b>: {(data.total_liabilities + data.total_equity).toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}