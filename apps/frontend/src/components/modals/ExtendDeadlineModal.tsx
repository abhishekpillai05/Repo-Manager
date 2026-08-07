import { CalendarClock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

const schema = z.object({
  retentionDays: z
    .number({ error: 'Must be a number' })
    .int()
    .min(1, 'Must be at least 1 day')
    .max(365, 'Cannot exceed 365 days'),
  reason: z.string().min(1, 'Please provide a reason').max(300),
});

type FormValues = z.infer<typeof schema>;

interface ExtendDeadlineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoName: string;
  currentDaysLeft: number;
  currentRetentionDays: number;
  onConfirm: (retentionDays: number, reason: string) => void;
  isLoading?: boolean;
}

export function ExtendDeadlineModal({
  open,
  onOpenChange,
  repoName,
  currentDaysLeft,
  currentRetentionDays,
  onConfirm,
  isLoading = false,
}: ExtendDeadlineModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { retentionDays: currentRetentionDays, reason: '' },
  });

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const onSubmit = (values: FormValues) => {
    onConfirm(values.retentionDays, values.reason);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <CalendarClock className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-base">Override deletion date</DialogTitle>
          </div>
          <DialogDescription>
            Override the auto-deletion schedule for{' '}
            <strong className="text-foreground font-mono">{repoName}</strong>.
            Currently <strong className="text-foreground">{currentDaysLeft} days</strong> remaining.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="retention-days">Custom retention (days from creation)</Label>
            <Input
              id="retention-days"
              type="number"
              min={1}
              max={365}
              {...register('retentionDays', { valueAsNumber: true })}
              className={errors.retentionDays ? 'border-destructive' : ''}
            />
            {errors.retentionDays && (
              <p className="text-xs text-destructive">{errors.retentionDays.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="override-reason">Reason for override</Label>
            <Textarea
              id="override-reason"
              placeholder="e.g. Candidate requested more time to complete the assessment."
              rows={3}
              {...register('reason')}
              className={errors.reason ? 'border-destructive' : ''}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} id="confirm-extend-btn">
              {isLoading ? 'Saving…' : 'Save override'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
