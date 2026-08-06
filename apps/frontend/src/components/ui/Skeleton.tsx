import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-md bg-muted animate-skeleton-pulse', className)}
      {...props}
    />
  );
}

export { Skeleton };
