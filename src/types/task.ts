export interface Task {
  id: string;
  description: string;
  dueDate?: string;
  category?: string;
  recurrence?: string;
  notes?: string;
  priority?: string;
  completed?: boolean;
  created_at?: string;
}