
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskFilter as FilterType } from '@/types/task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters: Array<{
    key: FilterType;
    label: string;
    emoji: string;
    count: number;
  }> = [
    { key: 'all', label: 'All Tasks', emoji: '📋', count: taskCounts.all },
    { key: 'pending', label: 'Pending', emoji: '⏳', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', emoji: '✅', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-lg shadow-sm border">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? 'default' : 'ghost'}
          onClick={() => onFilterChange(filter.key)}
          className={`flex-1 min-w-0 relative transition-all duration-200 ${
            currentFilter === filter.key
              ? 'bg-blue-600 text-white shadow-md'
              : 'hover:bg-gray-50'
          }`}
        >
          <span className="mr-2">{filter.emoji}</span>
          <span className="truncate">{filter.label}</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            currentFilter === filter.key
              ? 'bg-white bg-opacity-20 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TaskFilter;
