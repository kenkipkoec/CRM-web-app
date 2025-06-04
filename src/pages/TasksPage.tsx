import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { Task } from "../types/task";
import { Paper, Typography, Box, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { apiFetch } from "../utils/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | "">("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "">("");
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity?: "success"|"info"|"error"}>({open: false, message: ""});
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/tasks")
      .then((data) => setTasks(data))
      .catch(() => setSnackbar({open: true, message: "Failed to load tasks", severity: "error"}));
  }, []);

  // Add Task
  const addTask = async (task: Task) => {
    try {
      const newTask = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      setTasks([...tasks, newTask]);
      setSnackbar({open: true, message: "Task added!", severity: "success"});
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSnackbar({open: true, message: err.message, severity: "error"});
      } else {
        setSnackbar({open: true, message: "Failed to add task", severity: "error"});
      }
    }
  };

  // Toggle Task
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const updated = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch {
      setSnackbar({open: true, message: "Failed to update task", severity: "error"});
    }
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== id));
      setSnackbar({open: true, message: "Task deleted successfully!", severity: "success"});
    } catch {
      setSnackbar({open: true, message: "Failed to delete task", severity: "error"});
    }
  };

  // Edit Task
  const saveEdit = async (updated: Task) => {
    try {
      const newTask = await apiFetch(`/tasks/${updated.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      setTasks(tasks.map(t => t.id === updated.id ? newTask : t));
      setEditingTask(null);
      setSnackbar({open: true, message: "Task updated successfully!", severity: "success"});
    } catch {
      setSnackbar({open: true, message: "Failed to update task", severity: "error"});
    }
  };

  const filteredTasks = tasks
    .filter(t =>
      (t.description || "").toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory ? t.category === filterCategory : true)
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      }
      if (sortBy === "priority") {
        const order: Record<string, number> = { low: 1, medium: 2, high: 3 };
        return (order[b.priority || "low"] - order[a.priority || "low"]);
      }
      return 0;
    });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f5f6fa 60%, #e3f0ff 100%)"
            : "linear-gradient(135deg, #181c24 60%, #22334d 100%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          backdropFilter: "blur(16px)",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(40,44,52,0.92)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              : "0 8px 32px 0 rgba(0,0,0,0.45)",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          CRM Tasks
        </Typography>
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate("/calendar")}
        >
          Open Calendar
        </Button>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            size="small"
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {["Work", "Personal", "Shopping", "Other"].map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            size="small"
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">No Sort</MenuItem>
            <MenuItem value="dueDate">Sort by Due Date</MenuItem>
            <MenuItem value="priority">Sort by Priority</MenuItem>
          </Select>
        </Box>
        <TaskInput
          onAddTask={addTask}
          editTask={editingTask}
          onSaveEdit={saveEdit}
          onCancelEdit={() => setEditingTask(null)}
        />
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={handleEditTask}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({...snackbar, open: false})}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity || "info"} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}