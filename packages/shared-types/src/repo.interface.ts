export interface RepoSummary {
  id: string;
  name: string;
  candidateName: string;
  role: string;
  createdAt: string;
  daysSinceCreation: number;
  daysUntilDeletion: number;
  accessStatus: 'Active' | 'Revoked';
  repoStatus: 'Live' | 'Archived' | 'Pending Deletion';
}
