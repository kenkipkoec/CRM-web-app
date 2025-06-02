import { Task } from "../types/task";
import TaskItem from "./TaskItem";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: Props) {
  return (
    <List>
      {tasks.map(task => (
        <Collapse key={task.id} in>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Collapse>
      ))}
    </List>
  );
}