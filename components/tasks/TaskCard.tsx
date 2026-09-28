'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '@/components/ui/button';
import { Trash2Icon, Loader2Icon, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onDeleteClick: (task: Task) => void;
  isUpdating?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDeleteClick,
  isUpdating = false,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Card className="border border-border/80 bg-card/80 shadow-xs hover:border-border transition-all">
      <CardContent className="p-4 space-y-3">
        {/* Top Header: Title and Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug text-foreground flex-1">
            {task.title}
          </h3>
          <div className="shrink-0 flex items-center gap-1.5">
            <TaskStatusBadge status={task.status} />
            {isUpdating && <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />}
          </div>
        </div>

        {/* Middle: Description */}
        {task.description ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/60 italic">
            No description provided
          </p>
        )}

        {/* Bottom Row: Date, Status Selector, and Delete Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="size-3 text-muted-foreground/70" />
            <span>{formatDate(task.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            
            <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)} disabled={isUpdating}>
                <SelectTrigger>
                    <SelectValue>
                        {task.status === 'TODO' && 'To Do'}
                        {task.status === 'IN_PROGRESS' && 'In Progress'}
                        {task.status === 'COMPLETED' && 'Completed'}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {
                        Object.values(TaskStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status === 'TODO' && 'To Do'}
                                {status === 'IN_PROGRESS' && 'In Progress'}
                                {status === 'COMPLETED' && 'Completed'}
                            </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDeleteClick(task)}
              className="h-7 px-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              title="Delete task"
            >
              <Trash2Icon className="size-3.5 mr-1" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
