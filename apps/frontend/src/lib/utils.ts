import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely, resolving conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to a human-readable format */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

/** Format a date string with time */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString));
}

/** Relative time from now */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

/** Capitalize the first letter of a string */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Parse candidate name from repo name (e.g. pt-frontend-johnsmith → John Smith) */
export function parseCandidateName(repoName: string): string {
  const parts = repoName.replace(/^pt-/, '').split('-');
  if (parts.length < 2) return repoName;
  return parts
    .slice(1)
    .map((p) => capitalize(p))
    .join(' ');
}

/** Parse role from repo name (e.g. pt-frontend-johnsmith → Frontend) */
export function parseRole(repoName: string): string {
  const parts = repoName.replace(/^pt-/, '').split('-');
  return parts.length > 0 ? capitalize(parts[0]) : repoName;
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Truncate a string to a given length */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}
