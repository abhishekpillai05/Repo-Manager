import type { RepoSummary } from '@pt-repo-manager/shared-types';
import { CountdownBadge } from './CountdownBadge';
import { StatusBadge } from './StatusBadge';
import { Table } from '../ui/Table';

interface RepoTableProps {
  rows: RepoSummary[];
}

export function RepoTable({ rows }: RepoTableProps) {
  return (
    <Table>
      <thead>
        <tr style={{ textAlign: 'left', color: '#475569' }}>
          <th style={{ padding: '0.75rem' }}>Repo</th>
          <th style={{ padding: '0.75rem' }}>Candidate</th>
          <th style={{ padding: '0.75rem' }}>Role</th>
          <th style={{ padding: '0.75rem' }}>Created</th>
          <th style={{ padding: '0.75rem' }}>Access</th>
          <th style={{ padding: '0.75rem' }}>Status</th>
          <th style={{ padding: '0.75rem' }}>Countdown</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} style={{ borderTop: '1px solid #e2e8f0' }}>
            <td style={{ padding: '0.75rem', fontWeight: 600 }}>{row.name}</td>
            <td style={{ padding: '0.75rem' }}>{row.candidateName}</td>
            <td style={{ padding: '0.75rem' }}>{row.role}</td>
            <td style={{ padding: '0.75rem' }}>{row.createdAt}</td>
            <td style={{ padding: '0.75rem' }}>{row.accessStatus}</td>
            <td style={{ padding: '0.75rem' }}><StatusBadge status={row.repoStatus} /></td>
            <td style={{ padding: '0.75rem' }}><CountdownBadge daysLeft={row.daysUntilDeletion} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
