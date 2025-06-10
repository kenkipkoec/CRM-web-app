import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  useTheme,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import AccountPage from "./AccountPage";
import JournalPage from "./JournalPage";
import TrialBalancePage from "./TrialBalancePage";
import IncomeStatementPage from "./IncomeStatementPage";
import BalanceSheetPage from "./BalanceSheetPage";
import LedgerPage from "./LedgerPage";

const navItems = [
  { label: "Chart of Accounts", path: "chart" },
  { label: "Journal", path: "journal" },
  { label: "Ledger", path: "ledger" },
  { label: "Trial Balance", path: "trial-balance" },
  { label: "Income Statement", path: "income-statement" },
  { label: "Balance Sheet", path: "balance-sheet" },
];

export default function AccountsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [books, setBooks] = useState<{ id: number; name: string }[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [bookDialog, setBookDialog] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; book: any }>({
    open: false,
    book: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; book: any }>({
    open: false,
    book: null,
  });
  const [newName, setNewName] = useState("");

  useEffect(() => {
    apiFetch("/books").then(setBooks);
  }, []);

  useEffect(() => {
    // Optionally: persist selectedBook in localStorage
    const saved = localStorage.getItem("selectedBook");
    if (saved) setSelectedBook(Number(saved));
  }, []);

  useEffect(() => {
    if (selectedBook)
      localStorage.setItem("selectedBook", String(selectedBook));
  }, [selectedBook]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #e3f0ff 60%, #f5f6fa 100%)"
            : "linear-gradient(135deg, #181c24 60%, #22334d 100%)",
      }}
    >
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: "border-box",
            border: "none",
            background:
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.85)"
                : "rgba(24,28,36,0.92)",
            backdropFilter: "blur(12px)",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 32px 0 rgba(31, 38, 135, 0.12)"
                : "0 8px 32px 0 rgba(0,0,0,0.45)",
            borderRadius: "0 24px 24px 0",
            p: 0,
          },
        }}
        open
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2, pb: 1 }}>
          <IconButton
            onClick={() => navigate("/")}
            aria-label="Back to main"
            size="large"
            sx={{
              color: theme.palette.primary.main,
              background:
                theme.palette.mode === "light" ? "#e3f0ff" : "#23283a",
              mr: 1,
              "&:hover": {
                background: theme.palette.action.hover,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: 1,
            }}
          >
            Back to Main
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: theme.palette.text.secondary }}
          >
            Accounting Book
          </Typography>
          <Select
            value={selectedBook ?? ""}
            onChange={(e) => setSelectedBook(Number(e.target.value))}
            size="small"
            fullWidth
            displayEmpty
            sx={{
              mb: 1,
              "& .MuiSelect-select": {
                py: 1.5,
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="">Select Book</MenuItem>
            {books.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={() => setBookDialog(true)}
            sx={{ width: "100%" }}
            size="small"
            variant="outlined"
          >
            New Book
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />
        <List>
          {navItems.map((item) => {
            const selected = location.pathname === `/accounts/${item.path}`;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => navigate(`/accounts/${item.path}`)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    background:
                      selected
                        ? theme.palette.mode === "light"
                          ? "linear-gradient(90deg, #e3f0ff 60%, #b3d1fa 100%)"
                          : "linear-gradient(90deg, #23283a 60%, #005478 100%)"
                        : "none",
                    color: selected
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontWeight: selected ? 700 : 500,
                    "&:hover": {
                      background: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: selected ? 700 : 500,
                      fontSize: "1.08rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, sm: 3, md: 4 },
          mt: { xs: 1, sm: 3, md: 4 },
          width: "100%",
          minHeight: "100vh",
          transition: "background 0.3s",
        }}
      >
        <Routes>
          <Route path="chart" element={<AccountPage bookId={selectedBook} />} />
          <Route path="journal" element={<JournalPage bookId={selectedBook} />} />
          <Route path="ledger" element={<LedgerPage bookId={selectedBook} />} />
          <Route path="trial-balance" element={<TrialBalancePage bookId={selectedBook} />} />
          <Route path="income-statement" element={<IncomeStatementPage bookId={selectedBook} />} />
          <Route path="balance-sheet" element={<BalanceSheetPage bookId={selectedBook} />} />
          <Route path="*" element={<AccountPage bookId={selectedBook} />} />
        </Routes>
      </Box>
      <Dialog open={bookDialog} onClose={() => setBookDialog(false)}>
        <DialogTitle>New Accounting Book</DialogTitle>
        <DialogContent>
          <TextField
            label="Book Name"
            value={newBookName}
            onChange={(e) => setNewBookName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              const book = await apiFetch("/books", {
                method: "POST",
                body: JSON.stringify({ name: newBookName }),
              });
              setBooks([...books, book]);
              setSelectedBook(book.id);
              setBookDialog(false);
              setNewBookName("");
            }}
            variant="contained"
            disabled={!newBookName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={renameDialog.open}
        onClose={() => setRenameDialog({ open: false, book: null })}
      >
        <DialogTitle>Rename Book</DialogTitle>
        <DialogContent>
          <TextField
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              await apiFetch(
                `/books/${renameDialog.book.id}`,
                {
                  method: "PUT",
                  body: JSON.stringify({ name: newName }),
                }
              );
              setBooks(
                books.map((b) =>
                  b.id === renameDialog.book.id
                    ? { ...b, name: newName }
                    : b
                )
              );
              setRenameDialog({ open: false, book: null });
            }}
            variant="contained"
            disabled={!newName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, book: null })}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          Are you sure? This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              try {
                await apiFetch(
                  `/books/${deleteDialog.book.id}`,
                  { method: "DELETE" }
                );
                setBooks(books.filter((b) => b.id !== deleteDialog.book.id));
                setDeleteDialog({ open: false, book: null });
              } catch (err) {
                // Handle error (e.g., book not empty)
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}