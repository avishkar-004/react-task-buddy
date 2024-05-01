
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
}

export type TaskFilter = 'all' | 'completed' | 'pending';
export type TaskPriority = 'low' | 'medium' | 'high';
