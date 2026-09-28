'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { TaskForm } from '@/components/tasks/TaskForm';
// import { TaskList } from '@/components/tasks/TaskList';
import { Task, CreateTaskInput, TaskStatus } from '@/types/task';
// import {
//   fetchTasks,
//   createTask,
//   updateTaskStatus,
//   deleteTask,
// } from '@/services/taskApi';
import { toast } from 'sonner';
import { CheckCircle2Icon, ClockIcon, ListTodoIcon, AlertCircleIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [initialError, setInitialError] = useState<string | null>(null);

  // Load initial tasks from the API
  const loadTasks = useCallback(async () => {
    // try {
    //   setInitialError(null);
    //   const data = await fetchTasks();
    //   setTasks(data);
    // } catch (err: unknown) {
    //   const errorMessage =
    //     err instanceof Error ? err.message : 'Failed to fetch tasks from server';
    //   setInitialError(errorMessage);
    //   toast.error('Network Error', {
    //     description: errorMessage,
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Statistics calculation for dashboard cards
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const progressRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, progressRate };
  }, [tasks]);

  // Handle creating a new task
  const handleCreateTask = async (input: CreateTaskInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const createdTask = await createTask(input);

      // Reactively prepend the new task without page reload
      setTasks((prev) => [createdTask, ...prev]);

      toast.success('Task Created', {
        description: `"${createdTask.title}" was successfully added.`,
      });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to create task';
      toast.error('Creation Failed', {
        description: message,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating task status
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask || currentTask.status === newStatus) return;

    setUpdatingTaskId(id);
    try {
      const updated = await updateTaskStatus(id, newStatus);

      // Reactively update the state without page reload
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t))
      );

      const statusLabels: Record<TaskStatus, string> = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
      };

      toast.success('Status Updated', {
        description: `Task marked as "${statusLabels[newStatus]}".`,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to update status';
      toast.error('Update Failed', {
        description: message,
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id: string): Promise<boolean> => {
    const targetTask = tasks.find((t) => t.id === id);
    try {
      await deleteTask(id);

      // Reactively remove the task from state
      setTasks((prev) => prev.filter((t) => t.id !== id));

      toast.success('Task Deleted', {
        description: targetTask
          ? `"${targetTask.title}" has been removed.`
          : 'Task successfully removed.',
      });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to delete task';
      toast.error('Deletion Failed', {
        description: message,
      });
      return false;
    }
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

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Card className="px-3 py-2 border-border/60 bg-card/60">
                <CardContent className="p-0 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                    <ListTodoIcon className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground font-medium">To Do</div>
                    <div className="text-sm font-bold text-foreground">{stats.todo}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="px-3 py-2 border-border/60 bg-card/60">
                <CardContent className="p-0 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <ClockIcon className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground font-medium">In Progress</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {stats.inProgress}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="px-3 py-2 border-border/60 bg-card/60">
                <CardContent className="p-0 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2Icon className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground font-medium">Done</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.completed}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Global Connection Error Banner (if initial load fails) */}
        {initialError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="size-4 shrink-0" />
              <span>{initialError}</span>
            </div>
            <button
              onClick={() => {
                setIsLoading(true);
                loadTasks();
              }}
              className="underline font-semibold hover:opacity-80 ml-4 shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Main Two-Column Layout (Form on Left / List on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Creation Form (Sticky on Desktop) */}
          <aside className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-20">
            <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
          </aside>

          {/* Right Column: Task List (Table on Desktop, Cards on Mobile) */}
          <section className="lg:col-span-8 xl:col-span-8">
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5 shadow-xs backdrop-blur-xs">
              <TaskList
                tasks={tasks}
                isLoading={isLoading}
                onRefresh={loadTasks}
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
