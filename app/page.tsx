'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, CreateTaskInput, TaskStatus } from '@/types/task';
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from '@/services/taskApi';
import { toast } from 'sonner';
import { AlertCircleIcon } from 'lucide-react';

export default function Home() {
  const queryClient = useQueryClient();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // 1. Fetch tasks using TanStack Query
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Statistics calculation for dashboard cards
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const progressRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, progressRate };
  }, [tasks]);

  // 2. Mutation: Create Task
  const createTaskMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks to synchronize with server
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task Created', {
        description: `"${newTask.title}" was successfully added.`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Unable to create task';
      toast.error('Creation Failed', {
        description: message,
      });
    },
  });

  // Handle creating a new task
  const handleCreateTask = async (input: CreateTaskInput): Promise<boolean> => {
    try {
      await createTaskMutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  };

  // 3. Mutation: Update Task Status (with Optimistic Updates)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the UI
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ['tasks'],
          previousTasks.map((t) => (t.id === id ? { ...t, status } : t))
        );
      }

      return { previousTasks };
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      const message =
        err instanceof Error ? err.message : 'Unable to update status';
      toast.error('Update Failed', {
        description: message,
      });
    },
    onSuccess: (_data, { status }) => {
      const statusLabels: Record<TaskStatus, string> = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
      };
      toast.success('Status Updated', {
        description: `Task marked as "${statusLabels[status] || status}".`,
      });
    },
    onSettled: () => {
      setUpdatingTaskId(null);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Handle updating task status
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask || currentTask.status === newStatus) return;

    setUpdatingTaskId(id);
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch {
      // Handled in onError
    }
  };

  // 4. Mutation: Delete Task (with Optimistic Updates)
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically remove from list
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ['tasks'],
          previousTasks.filter((t) => t.id !== id)
        );
      }

      return { previousTasks };
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      const message =
        err instanceof Error ? err.message : 'Unable to delete task';
      toast.error('Deletion Failed', {
        description: message,
      });
    },
    onSuccess: (_data, id) => {
      const targetTask = tasks.find((t) => t.id === id);
      toast.success('Task Deleted', {
        description: targetTask
          ? `"${targetTask.title}" has been removed.`
          : 'Task successfully removed.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Handle deleting a task
  const handleDeleteTask = async (id: string): Promise<boolean> => {
    try {
      await deleteTaskMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-muted/20 to-background">
      {/* Navigation Header */}
      <Navbar
        totalTasks={stats.total}
        completedTasks={stats.completed}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Workspace Hero Header */}
        <section className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Task Management
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Organize, track, and streamline team workflows in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Global Connection Error (if query fails) */}
        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="size-4 shrink-0" />
              <span>{error instanceof Error ? error.message : 'Failed to fetch tasks from server'}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="underline font-semibold hover:opacity-80 ml-4 shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <aside className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-20">
            <TaskForm onSubmit={handleCreateTask} isSubmitting={createTaskMutation.isPending} />
          </aside>

          {/* Right Column */}
          <section className="lg:col-span-8 xl:col-span-8">
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5 shadow-xs backdrop-blur-xs">
              <TaskList
                tasks={tasks}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
                updatingTaskId={updatingTaskId}
              />
            </div>
          </section>
        </div>
      </main>


    </div>
  );
}
