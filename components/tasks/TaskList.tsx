'use client';

import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskTable } from './TaskTable';
import { TaskCard } from './TaskCard';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  SearchIcon,
  RefreshCwIcon,
  FilterIcon,
  InboxIcon,
  CheckCircle2Icon,
  ListTodoIcon,
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onDeleteTask: (id: string) => Promise<boolean>;
  updatingTaskId?: string | null;
}

type FilterOption = 'ALL' | TaskStatus;

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onRefresh,
  onStatusChange,
  onDeleteTask,
  updatingTaskId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterOption>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status counts for badge counters
  const statusCounts = useMemo(() => {
    return {
      ALL: tasks.length,
      TODO: tasks.filter((t) => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
    };
  }, [tasks]);

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'ALL' ? true : task.status === statusFilter;
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchQuery]);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    const success = await onDeleteTask(taskToDelete.id);
    setIsDeleting(false);
    if (success) {
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs sm:text-sm h-8 bg-card/80"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Refresh & Quick Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleRefreshClick}
            disabled={isLoading || isRefreshing}
            className="text-xs gap-1.5"
          >
            <RefreshCwIcon
              className={`size-3 ${isRefreshing || isLoading ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-3">
        <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
          <FilterIcon className="size-3" />
          Status:
        </span>

        {(
          [
            { id: 'ALL', label: 'All' },
            { id: 'TODO', label: 'To Do' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'COMPLETED', label: 'Completed' },
          ] as const
        ).map((tab) => {
          const isActive = statusFilter === tab.id;
          const count = statusCounts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive
                  ? 'bg-primary-foreground/20 text-primary-foreground font-semibold'
                  : 'bg-background text-muted-foreground'
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Rendering: Loading Skeleton / Empty State / Tasks Views */}
      {isLoading ? (
        <div className="space-y-3">
          {/* Skeleton for Desktop Table */}
          <div className="hidden md:block rounded-lg border border-border/60 p-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Skeleton for Mobile Cards */}
          <div className="md:hidden space-y-2.5">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            {tasks.length === 0 ? (
              <ListTodoIcon className="size-6" />
            ) : (
              <InboxIcon className="size-6" />
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {tasks.length === 0 ? 'No tasks available' : 'No matching tasks found'}
          </h4>
          <p className="text-xs text-muted-foreground max-w-xs mb-3">
            {tasks.length === 0
              ? 'Get started by creating your first task using the form on the left.'
              : 'Try clearing the search query or changing your status filter.'}
          </p>
          {(searchQuery || statusFilter !== 'ALL') && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={onStatusChange}
              onDeleteClick={(task) => setTaskToDelete(task)}
              updatingTaskId={updatingTaskId}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onDeleteClick={(task) => setTaskToDelete(task)}
                isUpdating={updatingTaskId === task.id}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <DeleteTaskDialog
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDeleteConfirm}
          taskTitle={taskToDelete.title}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
