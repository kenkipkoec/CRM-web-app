import { Task } from "../types/task";

export function saveTasks(tasks: Task[]) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadTasks(): Task[] {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}