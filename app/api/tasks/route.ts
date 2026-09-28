import { NextResponse } from 'next/server';
import { Task, CreateTaskInput, TaskStatus, TaskPriority } from '@/types/task';

// Initial dataset for the mock API
let tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design responsive layout for Task Manager',
    description: 'Create mobile card view and desktop table view with modern UI aesthetics.',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Integrate mock CRUD API endpoints',
    description: 'Implement GET, POST, PUT, and DELETE operations with loading feedback.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Set up Dockerfile for production build',
    description: 'Configure multi-stage Docker build with Node.js builder and Nginx static server.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Write comprehensive English documentation',
    description: 'Ensure 100% English across UI labels, validation messages, and code comments.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Artificial latency helper to simulate real-world network requests
const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 400));

/**
 * GET /api/tasks
 * Returns the list of all tasks
 */
export async function GET() {
  await simulateNetworkDelay();
  return NextResponse.json({ success: true, data: tasks });
}

/**
 * POST /api/tasks
 * Creates a new task
 */
export async function POST(request: Request) {
  await simulateNetworkDelay();
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      status: body.status || TaskStatus.TODO,
      priority: body.priority || TaskPriority.MEDIUM,
      createdAt: new Date().toISOString(),
    };

    tasks = [newTask, ...tasks];

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Export tasks setter for [id]/route.ts
export function getTasksStore() {
  return tasks;
}

export function setTasksStore(updated: Task[]) {
  tasks = updated;
}
