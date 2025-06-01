import { Task } from "../types/task";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    dayjs(task.dueDate).isBefore(dayjs(), "day");

  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      }
      disablePadding
      sx={{
        transition: "background 0.2s",
        "&:hover": {
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(0,84,120,0.06)"
              : "rgba(255,255,255,0.04)",
          boxShadow: "0 2px 8px 0 rgba(31,38,135,0.08)",
        },
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        sx={{ mr: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: task.completed ? "line-through" : "none",
            fontWeight: "bold",
            color: isOverdue ? "error.main" : undefined,
          }}
        >
          {task.text}
          {isOverdue && (
            <Typography
              component="span"
              variant="caption"
              color="error"
              sx={{ ml: 1, fontWeight: "bold" }}
            >
              (Overdue)
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              📅 {dayjs(task.dueDate).format("MMM D, YYYY")}
            </Typography>
          )}
          {task.category && (
            <Typography variant="caption" color="primary">
              📂 {task.category}
            </Typography>
          )}
          {task.recurrence && task.recurrence !== "none" && (
            <Typography variant="caption" color="text.secondary">
              🔁 {task.recurrence}
            </Typography>
          )}
          {task.notes && (
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
              📝 {task.notes}
            </Typography>
          )}
          {task.priority && (
            <Typography variant="caption" color={
              task.priority === "high"
                ? "error"
                : task.priority === "medium"
                ? "warning.main"
                : "success.main"
            }>
              ⭐ {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Typography>
          )}
        </Box>
      </Box>
    </ListItem>
  );
}