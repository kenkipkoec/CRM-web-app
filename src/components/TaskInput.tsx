import { useState, useEffect } from "react";
import { Task } from "../types/task";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Grid,
} from "@mui/material";

const CATEGORIES = ["Work", "Personal", "Shopping", "Other"];
const RECURRENCES = [
  { label: "None", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];
const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

interface Props {
  onAddTask: (task: Task) => void;
  editTask?: Task | null;
  onSaveEdit?: (task: Task) => void;
  onCancelEdit?: () => void;
}

export default function TaskInput({
  onAddTask,
  editTask,
  onSaveEdit,
  onCancelEdit,
}: Props) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [recurrence, setRecurrence] = useState("none");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (editTask) {
      setText(editTask.text);
      setDueDate(editTask.dueDate || "");
      setCategory(editTask.category || CATEGORIES[0]);
      setRecurrence(editTask.recurrence || "none");
      setNotes(editTask.notes || "");
      setPriority(editTask.priority || "medium");
    } else {
      setText("");
      setDueDate("");
      setCategory(CATEGORIES[0]);
      setRecurrence("none");
      setNotes("");
      setPriority("medium");
    }
  }, [editTask]);

  function scheduleNotification(taskText: string, dueDate: string) {
    if ("Notification" in window && Notification.permission === "granted") {
      const due = new Date(dueDate).getTime();
      const now = Date.now();
      if (due > now) {
        setTimeout(() => {
          new Notification("Task Reminder", {
            body: `Task "${taskText}" is due now!`,
          });
        }, due - now);
      }
    }
  }

  const handleAddOrEdit = () => {
    if (text.trim()) {
      const task: Task = {
        id: editTask ? editTask.id : Date.now().toString(),
        text,
        completed: editTask ? editTask.completed : false,
        dueDate: dueDate || undefined,
        category,
        recurrence: recurrence as Task["recurrence"],
        notes: notes || undefined,
        priority: priority as Task["priority"],
      };
      if (editTask && onSaveEdit) {
        onSaveEdit(task);
      } else {
        onAddTask(task);
        if (dueDate) {
          scheduleNotification(text, dueDate);
        }
      }
      setText("");
      setDueDate("");
      setCategory(CATEGORIES[0]);
      setRecurrence("none");
      setNotes("");
      setPriority("medium");
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Box mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={editTask ? "Edit Task" : "Task"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
            fullWidth
            placeholder="Enter task description"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={editTask ? "Edit Due Date & Time" : "Due Date & Time"}
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              background: editTask ? "#fff3e0" : undefined,
              borderRadius: 1,
            }}
            placeholder="Select due date and time"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
            displayEmpty
            fullWidth
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            size="small"
            displayEmpty
            fullWidth
          >
            {RECURRENCES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            labelId="priority-label"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            size="small"
            displayEmpty
            fullWidth
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              transition: "box-shadow 0.2s, background 0.2s",
              "&:hover": {
                background: "primary.dark",
                boxShadow: "0 4px 16px 0 rgba(0,84,120,0.15)",
              },
            }}
            onClick={handleAddOrEdit}
            fullWidth
          >
            {editTask ? "Save" : "Add"}
          </Button>
        </Grid>
        {editTask && onCancelEdit && (
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancelEdit}
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}