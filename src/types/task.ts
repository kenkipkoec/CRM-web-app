export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // Optional due date
  category?: string; // Optional category
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly'; // Optional recurrence
  notes?: string; // Optional notes
  priority?: 'low' | 'medium' | 'high'; // Optional priority
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}