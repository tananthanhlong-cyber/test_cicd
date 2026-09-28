'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '@/components/ui/button';
import { Trash2Icon, Loader2Icon, CalendarIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';

interface TaskTableProps {
    tasks: Task[];
    onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
    onDeleteClick: (task: Task) => void;
    updatingTaskId?: string | null;
}

export const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    onStatusChange,
    onDeleteClick,
    updatingTaskId,
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
        <div className="rounded-lg border border-border/80 overflow-hidden bg-card/60 backdrop-blur-xs">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="w-[45%] text-xs font-semibold">Task Details</TableHead>
                        <TableHead className="w-[25%] text-xs font-semibold">Status</TableHead>
                        <TableHead className="w-[18%] text-xs font-semibold">Created Date</TableHead>
                        <TableHead className="w-[12%] text-right text-xs font-semibold pr-4">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tasks.map((task) => {
                        const isUpdating = updatingTaskId === task.id;

                        return (
                            <TableRow key={task.id} className="group hover:bg-muted/30 transition-colors">
                                {/* Task Details Column */}
                                <TableCell className="py-3.5 pr-4 align-top">
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                                            {task.title}
                                        </p>
                                        {task.description ? (
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {task.description}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground/60 italic">
                                                No description provided
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Status Column with Quick Selector */}
                                <TableCell className="py-3.5 align-top">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <div className="flex items-center gap-2">
                                            <TaskStatusBadge status={task.status} />
                                            {isUpdating && <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />}
                                        </div>

                                        <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)} disabled={isUpdating}>
                                            <SelectTrigger>
                                                <SelectValue className="text-xs">
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
                                    </div>
                                </TableCell>

                                {/* Date Column */}
                                <TableCell className="py-3.5 align-top text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                        <CalendarIcon className="size-3 text-muted-foreground/70" />
                                        <span>{formatDate(task.createdAt)}</span>
                                    </div>
                                </TableCell>

                                {/* Action Column */}
                                <TableCell className="py-3.5 pr-4 align-top text-right">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => onDeleteClick(task)}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        title="Delete task"
                                    >
                                        <Trash2Icon className="size-3.5" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
