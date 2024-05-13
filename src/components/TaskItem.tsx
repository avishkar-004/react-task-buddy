
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import TaskForm from './TaskForm';
import { Task } from '@/types/task';
import { Edit, Trash2, Calendar, Flag } from 'lucide-react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (updatedTask: {
    title: string;
    description: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    tags: string[];
  }) => {
    onUpdate(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const today = startOfDay(new Date());
    
    if (isBefore(dueDate, today)) {
      return { status: 'overdue', color: 'text-red-600' };
    } else if (format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return { status: 'due-today', color: 'text-orange-600' };
    } else {
      return { status: 'upcoming', color: 'text-blue-600' };
    }
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
        task.completed 
          ? 'bg-green-50 border-green-200 opacity-90' 
          : 'bg-white border-gray-200 hover:border-blue-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium text-gray-900 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                
                <Badge className={getPriorityColor(task.priority)}>
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority}
                </Badge>
              </div>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 text-xs">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Created {formatDate(task.createdAt)}</span>
                
                {task.dueDate && dueDateStatus && (
                  <span className={`flex items-center gap-1 ${dueDateStatus.color}`}>
                    <Calendar className="w-3 h-3" />
                    Due {format(new Date(task.dueDate), 'MMM d')}
                    {dueDateStatus.status === 'overdue' && ' (Overdue)'}
                    {dueDateStatus.status === 'due-today' && ' (Today)'}
                  </span>
                )}
                
                {task.completed && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✅ Completed
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <TaskForm
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          initialData={{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category,
            tags: task.tags,
          }}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="w-full max-w-sm shadow-xl animate-scale-in">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-lg font-semibold mb-2">Delete Task?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TaskItem;
