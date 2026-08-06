import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GitFork,
  ScrollText,
  Settings,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Repositories', href: '/repositories', icon: GitFork },
  { label: 'Audit Log', href: '/audit-log', icon: ScrollText },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-hidden flex-shrink-0"
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GitBranch className="h-4 w-4" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
                  PT Repo Manager
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="px-2 mb-2 text-2xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Navigation
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          const itemEl = (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.label}
              className={cn(
                'group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80',
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{itemEl}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return itemEl;
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        {!collapsed && (
          <p className="px-2 text-2xs text-sidebar-foreground/30 mb-2">
            v1.0.0 · GitHub Org
          </p>
        )}
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleCollapse}
        className={cn(
          'absolute -right-3 top-[3.5rem] z-10 h-6 w-6 rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground transition-all',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        id="sidebar-collapse-btn"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </motion.aside>
  );
}
