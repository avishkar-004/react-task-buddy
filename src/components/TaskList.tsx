
import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskList = ({ tasks, onUpdate, onDelete, onToggleComplete }: TaskListProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskItem
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
