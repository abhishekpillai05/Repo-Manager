import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RotateCcw, Building2, GitBranch, Clock, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { configService } from '@/services/config.service';

const settingsSchema = z.object({
  repoPrefix: z.string().min(1, 'Prefix is required').max(20),
  retentionDays: z
    .number({ error: 'Must be a number' })
    .int()
    .min(1)
    .max(365),
  defaultAction: z.enum(['delete', 'archive']),
  warningDays: z
    .number({ error: 'Must be a number' })
    .int()
    .min(1)
    .max(30),
  autoDeleteEnabled: z.boolean(),
  autoArchiveEnabled: z.boolean(),
  githubOrg: z.string().min(1, 'Organization name is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const DEFAULT_VALUES: SettingsFormValues = {
  repoPrefix: 'pt-',
  retentionDays: 90,
  defaultAction: 'delete',
  warningDays: 7,
  autoDeleteEnabled: true,
  autoArchiveEnabled: false,
  githubOrg: '',
};

function FormField({ label, description, error, children, id }: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4">
      <div className="md:col-span-1">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="md:col-span-2 space-y-1">
        {children}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function Settings() {
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Load config from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const config = await configService.getConfig();
        const loaded: SettingsFormValues = {
          repoPrefix: 'pt-',
          retentionDays: config.retentionDays,
          defaultAction: config.autoArchiveEnabled ? 'archive' : 'delete',
          warningDays: config.warningDays,
          autoDeleteEnabled: config.autoDeleteEnabled,
          autoArchiveEnabled: config.autoArchiveEnabled,
          githubOrg: '',
        };
        reset(loaded);
      } catch (error) {
        console.error('Failed to load config', error);
        // Keep default values if backend is unreachable
      } finally {
        setIsLoadingConfig(false);
      }
    })();
  }, [reset]);

  const autoDeleteEnabled = watch('autoDeleteEnabled');
  const autoArchiveEnabled = watch('autoArchiveEnabled');
  const defaultAction = watch('defaultAction');

  const onSubmit = async (values: SettingsFormValues) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await configService.updateConfig({
        retentionDays: values.retentionDays,
        autoDeleteEnabled: values.autoDeleteEnabled,
        autoArchiveEnabled: values.autoArchiveEnabled,
        warningDays: values.warningDays,
      });
      setSaveSuccess(true);
      // Re-fetch to sync form state (marks form as pristine)
      const config = await configService.getConfig();
      reset({
        repoPrefix: values.repoPrefix,
        retentionDays: config.retentionDays,
        defaultAction: config.autoArchiveEnabled ? 'archive' : 'delete',
        warningDays: config.warningDays,
        autoDeleteEnabled: config.autoDeleteEnabled,
        autoArchiveEnabled: config.autoArchiveEnabled,
        githubOrg: values.githubOrg,
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save config', error);
      setSaveError('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings"
        description="Configure lifecycle policies and GitHub organization settings."
      />

      {isLoadingConfig ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading settings…</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ─── Repository lifecycle ───────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                Repository lifecycle
              </CardTitle>
              <CardDescription>
                Control how pt- repositories are identified and when they expire.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-border">
              <FormField
                id="repo-prefix"
                label="Repository prefix"
                description="Prefix used to identify candidate test repositories."
                error={errors.repoPrefix?.message}
              >
                <Input
                  id="repo-prefix"
                  {...register('repoPrefix')}
                  placeholder="pt-"
                  className="max-w-xs"
                />
              </FormField>

              <FormField
                id="retention-days"
                label="Retention period (days)"
                description="Number of days from creation before auto-deletion or archiving is triggered."
                error={errors.retentionDays?.message}
              >
                <div className="flex items-center gap-2 max-w-xs">
                  <Input
                    id="retention-days"
                    type="number"
                    min={1}
                    max={365}
                    {...register('retentionDays', { valueAsNumber: true })}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                </div>
              </FormField>

              <FormField
                id="default-action"
                label="Default expiry action"
                description="What happens when a repository reaches its retention limit."
                error={errors.defaultAction?.message}
              >
                <Select
                  value={defaultAction}
                  onValueChange={(v) => setValue('defaultAction', v as 'delete' | 'archive', { shouldDirty: true })}
                >
                  <SelectTrigger id="default-action" className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete permanently</SelectItem>
                    <SelectItem value="archive">Archive (read-only)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                id="warning-days"
                label="Pre-deletion warning (days)"
                description="Days before expiry to trigger in-app notifications."
                error={errors.warningDays?.message}
              >
                <div className="flex items-center gap-2 max-w-xs">
                  <Input
                    id="warning-days"
                    type="number"
                    min={1}
                    max={30}
                    {...register('warningDays', { valueAsNumber: true })}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">days before</span>
                </div>
              </FormField>
            </CardContent>
          </Card>

          {/* ─── Automation ─────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Automation
              </CardTitle>
              <CardDescription>
                Enable or disable the daily background scheduler.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-border">
              <FormField
                id="auto-delete"
                label="Auto-delete"
                description="Automatically delete repositories when they reach the retention limit."
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id="auto-delete"
                    checked={autoDeleteEnabled}
                    onCheckedChange={(v) => setValue('autoDeleteEnabled', v, { shouldDirty: true })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {autoDeleteEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </FormField>

              <FormField
                id="auto-archive"
                label="Auto-archive"
                description="Automatically archive repositories instead of deleting them."
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id="auto-archive"
                    checked={autoArchiveEnabled}
                    onCheckedChange={(v) => setValue('autoArchiveEnabled', v, { shouldDirty: true })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {autoArchiveEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </FormField>
            </CardContent>
          </Card>

          {/* ─── GitHub org ─────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                GitHub Organization
              </CardTitle>
              <CardDescription>
                Target GitHub organization for repository management.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-border">
              <FormField
                id="github-org"
                label="Organization name"
                description="The GitHub organization slug (e.g. my-company)."
                error={errors.githubOrg?.message}
              >
                <Input
                  id="github-org"
                  {...register('githubOrg')}
                  placeholder="your-org-name"
                  className="max-w-xs"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* ─── Security notice ────────────────────────────── */}
          <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Changes affect all repositories</p>
              <p>
                Modifying the retention period or default action will affect all repositories that
                have not been individually overridden. Existing countdown timers will recalculate.
              </p>
            </div>
          </div>

          {/* ─── Save / Reset ───────────────────────────────── */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="gap-1.5"
              id="save-settings-btn"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset(DEFAULT_VALUES)}
              disabled={!isDirty || isSubmitting}
              className="gap-1.5"
              id="reset-settings-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to defaults
            </Button>
            {isDirty && (
              <span className="text-xs text-muted-foreground">Unsaved changes</span>
            )}
            {saveSuccess && (
              <span className="text-xs text-green-500 font-medium">✓ Settings saved</span>
            )}
            {saveError && (
              <span className="text-xs text-destructive">{saveError}</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
