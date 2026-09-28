import React from 'react';
import Link from 'next/link';
import { CheckSquareIcon, ListTodoIcon, SparklesIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  totalTasks?: number;
  completedTasks?: number;
}

const Navbar: React.FC<NavbarProps> = ({ totalTasks = 0, completedTasks = 0 }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Breadcrumb Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <CheckSquareIcon className="size-4.5" />
            </div>
            <span className="text-base font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Task
            </span>
          </Link>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-xs text-muted-foreground hover:text-foreground">
                  Workspace
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-medium">Task Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Quick Stats & Mode Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListTodoIcon className="size-3.5" />
            <span className="hidden sm:inline">Tasks:</span>
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-semibold">
              {completedTasks}/{totalTasks} Done
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;