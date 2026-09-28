import { Task, CreateTaskInput, TaskStatus, UpdateTaskInput } from '@/types/task';

const BASE_URL = '/api/tasks';

/**
 * Fetch all tasks from the API
 */
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch tasks from server');
  }

  const result = await response.json();
  return result.data as Task[];
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create task');
  }

  return result.data as Task;
}

/**
 * Update an existing task (e.g. status)
 */
export async function updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update task');
  }

  return result.data as Task;
}

/**
 * Update specifically the task status
 */
export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  return updateTask(id, { status });
}

/**
 * Delete a task by ID
 */
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete task');
  }
}
