import type { RepoSummary } from '@pt-repo-manager/shared-types';
import { RepoTable } from '../components/dashboard/RepoTable';

const demoRows: RepoSummary[] = [
  {
    id: '1',
    name: 'pt-frontend-alex',
    candidateName: 'Alex',
    role: 'Frontend Engineer',
    createdAt: '2026-07-01',
    daysSinceCreation: 34,
    daysUntilDeletion: 56,
    accessStatus: 'Active',
    repoStatus: 'Live',
  },
  {
    id: '2',
    name: 'pt-backend-maya',
    candidateName: 'Maya',
    role: 'Backend Engineer',
    createdAt: '2026-06-20',
    daysSinceCreation: 45,
    daysUntilDeletion: 45,
    accessStatus: 'Revoked',
    repoStatus: 'Pending Deletion',
  },
];

export function Dashboard() {
  return (
    <section className="stack">
      <div className="grid-3">
        <div className="surface card">
          <div className="muted">Tracked repos</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>128</div>
        </div>
        <div className="surface card">
          <div className="muted">Pending deletions</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>14</div>
        </div>
        <div className="surface card">
          <div className="muted">Access revoked</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>52</div>
        </div>
      </div>

      <div className="surface card">
        <h2 className="section-title">Candidate repositories</h2>
        <p className="muted" style={{ marginTop: '0.35rem' }}>Search, review, and manage pt- prefixed repositories from a single dashboard.</p>
      </div>

      <RepoTable rows={demoRows} />
    </section>
  );
}
