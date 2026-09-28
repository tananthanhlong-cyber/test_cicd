import React from 'react';
import { TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { CircleIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'TODO':
      return (
        <Badge
          variant="outline"
          className={`gap-1.5 border-slate-300 bg-slate-100/80 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 ${className || ''}`}
        >
          <CircleIcon className="size-2.5 fill-slate-400 stroke-none" />
          <span>To Do</span>
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge
          variant="outline"
          className={`gap-1.5 border-blue-300 bg-blue-50 font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 ${className || ''}`}
        >
          <ClockIcon className="size-3 text-blue-600 dark:text-blue-400" />
          <span>In Progress</span>
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge
          variant="outline"
          className={`gap-1.5 border-emerald-300 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 ${className || ''}`}
        >
          <CheckCircle2Icon className="size-3 text-emerald-600 dark:text-emerald-400" />
          <span>Completed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
};
