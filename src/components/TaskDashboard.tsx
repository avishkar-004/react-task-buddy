
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import TaskSearch from './TaskSearch';
import { Task, TaskFilter as FilterType, TaskPriority } from '@/types/task';
import { saveTasks, loadTasks } from '@/utils/localStorage';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface TaskDashboardProps {
  user: string;
  onLogout: () => void;
}

const TaskDashboard = ({ user, onLogout }: TaskDashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const savedTasks = loadTasks();
    // Convert old tasks to new format if needed
    const migratedTasks = savedTasks.map(task => ({
      ...task,
      priority: task.priority || 'medium',
      category: task.category || 'General',
      tags: task.tags || [],
    }));
    setTasks(migratedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: {
    title: string;
    description: string;
    dueDate?: string;
    priority: TaskPriority;
    category: string;
    tags: string[];
  }) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      category: taskData.category,
      tags: taskData.tags,
    };
    setTasks([newTask, ...tasks]);
    setIsAddingTask(false);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const availableCategories = useMemo(() => {
    return [...new Set(tasks.map(task => task.category))].filter(Boolean);
  }, [tasks]);

  const availableTags = useMemo(() => {
    return [...new Set(tasks.flatMap(task => task.tags))].filter(Boolean);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Basic filter (all/completed/pending)
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;

      // Search filter
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;

      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => task.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [tasks, filter, searchTerm, selectedCategory, selectedPriority, selectedTags]);

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Welcome back, {user}! 👋
            </h1>
            <p className={`mt-1 transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Let's get things done today
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
            
            <Button 
              onClick={onLogout}
              variant="outline"
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setIsAddingTask(true)}
            className="bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            ✨ Add New Task
          </Button>
        </div>

        {/* Task Form Modal */}
        {isAddingTask && (
          <TaskForm
            onSubmit={addTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        {/* Search and Filters */}
        <TaskSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          availableCategories={availableCategories}
          availableTags={availableTags}
        />

        {/* Filter Tabs */}
        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
        />

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">
              {filter === 'completed' ? '🎉' : filter === 'pending' ? '📝' : '🔍'}
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedTags.length > 0
                ? 'No tasks match your filters'
                : filter === 'completed' 
                ? 'No completed tasks yet' 
                : filter === 'pending' 
                ? 'No pending tasks' 
                : 'No tasks yet'}
            </h3>
            <p className={`transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedTags.length > 0
                ? 'Try adjusting your search criteria'
                : filter === 'all' ? 'Add your first task to get started!' : 'Keep up the great work!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
