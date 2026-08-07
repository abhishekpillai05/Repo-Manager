import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number | null | undefined;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  isLoading = false,
}: StatsCardProps) {
  return (
    <Card className={cn('relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50', className)}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            {isLoading ? (
              <div className="h-8 w-24 rounded bg-muted animate-skeleton-pulse" />
            ) : (
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {value ?? '—'}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && !isLoading && (
              <p
                className={cn('text-xs font-medium', {
                  'text-success': trend.positive,
                  'text-destructive': !trend.positive,
                })}
              >
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
