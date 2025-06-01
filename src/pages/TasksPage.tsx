import { useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { Task } from "../types/task";
import { saveTasks, loadTasks } from "../utils/storage";
import { Paper, Typography, Box, } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | "">("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "">("");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const toggleTask = (id: string) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string) =>
    setTasks(tasks.filter(t => t.id !== id));
  const editTask = (task: Task) => setEditingTask(task);
  const saveEdit = (updated: Task) => {
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    setEditingTask(null);
  };

  const filteredTasks = tasks
    .filter(t =>
      t.text.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory ? t.category === filterCategory : true)
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      }
      if (sortBy === "priority") {
        const order = { low: 1, medium: 2, high: 3 };
        return (order[b.priority || "low"] - order[a.priority || "low"]);
      }
      return 0;
    });

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
              : "rgba(40,44,52,0.92)", // lighter and more opaque in dark mode
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              : "0 8px 32px 0 rgba(0,0,0,0.45)", // stronger shadow in dark mode
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          CRM Tasks
        </Typography>
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
            onChange={e => setSortBy(e.target.value)}
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
          onEdit={editTask}
        />
      </Paper>
    </Box>
  );
}