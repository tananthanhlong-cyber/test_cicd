import React from 'react';
import { TaskPriority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { CircleIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react';

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
    className?: string;
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority, className }) => {
    switch (priority) {
        case 'LOW':
            return (
                <Badge
                    variant="outline"
                    className={`gap-1.5 border-blue-300 bg-blue-50 font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 ${className || ''}`}
                >
                    <CircleIcon className="size-2.5 fill-slate-400 stroke-none" />
                    <span>Low</span>
                </Badge>
            );
        case 'MEDIUM':
            return (
                <Badge
                    variant="outline"
                    className={`gap-1.5 border-yellow-300 bg-yellow-50 font-medium text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 ${className || ''}`}
                >
                    <CircleIcon className="size-2.5 fill-yellow-400 stroke-none" />
                    <span>Medium</span>
                </Badge>
            );
        case 'HIGH':
            return (
                <Badge
                    variant="outline"
                    className={`gap-1.5 border-red-300 bg-red-50 font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300 ${className || ''}`}
                >
                    <CircleIcon className="size-2.5 fill-red-400 stroke-none" />
                    <span>High</span>
                </Badge>
            );
        default:
            return (
                <Badge variant="secondary" className={className}>
                    {priority}
                </Badge>
            );
    }
};
