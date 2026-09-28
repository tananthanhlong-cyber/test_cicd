import { NextResponse } from 'next/server';
import { UpdateTaskInput } from '@/types/task';
import { getTasksStore, setTasksStore } from '../route';

// Artificial latency helper to simulate real-world network requests
const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 350));

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/tasks/[id]
 * Updates an existing task (e.g., status or title/description)
 */
export async function PUT(request: Request, context: RouteContext) {
  await simulateNetworkDelay();
  try {
    const { id } = await context.params;
    const body: UpdateTaskInput = await request.json();

    const tasks = getTasksStore();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    setTasksStore(newTasks);

    return NextResponse.json({ success: true, data: updatedTask });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Deletes a task by ID
 */
export async function DELETE(_request: Request, context: RouteContext) {
  await simulateNetworkDelay();
  try {
    const { id } = await context.params;
    const tasks = getTasksStore();
    const taskExists = tasks.some((t) => t.id === id);

    if (!taskExists) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    const filtered = tasks.filter((t) => t.id !== id);
    setTasksStore(filtered);

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
      deletedId: id,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
