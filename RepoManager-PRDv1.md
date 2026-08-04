## PRODUCT REQUIREMENTS DOCUMENT

## Repo Manager

GitHub Practical Test Repository Lifecycle Management

Version

1.0

Status

Draft

Date

May 27, 2026

Platform

GitHub (Single Org)

Audience

Engineering / Tech Leads

Delivery

Web Application (Browser-based)


## 1. Executive Summary

PT Repo Manager is an internal web application for engineering and tech leads to manage the full lifecycle of GitHub repositories created for candidate practical tests. Repos are identified by the naming prefix "pt-", and the tool provides a centralized dashboard to monitor, control access, archive, and auto-delete these repositories — replacing manual GitHub administration with a configurable, auditable workflow.

## 2. Problem Statement

When conducting practical tests, the organization creates one GitHub repository per candidate under a naming convention of pt-<role>-<candidatename>. As the number of candidates scales, managing these repos manually becomes operationally risky:

- Candidate access is not revoked promptly after test completion, creating a security exposure.

- Stale repositories accumulate indefinitely, cluttering the GitHub organization.

- There is no central visibility into which repos are active, expired, or pending deletion.


- Deletion timelines and access policies are inconsistently enforced across tech leads.


## 3. Goals & Non-Goals

## 3.1 Goals

- Provide a single dashboard to list and manage all pt- prefixed GitHub repositories.

- Allow tech leads to revoke candidate access from a repo with one action.

- Automatically delete repos a configurable number of days after creation (default: 90 days).

- Allow archiving repos as an alternative to hard deletion.

- Maintain a tamper-evident audit log of all actions taken.

- Allow tech leads to configure lifecycle policies (retention days, default action) without code changes.

## 3.2 Non-Goals

- Support for GitLab, Bitbucket, or Azure DevOps (GitHub only, v1).

- Multi-organization GitHub support (single org only, v1).


- Candidate-facing portal or email notifications to candidates.

- Integration with ATS (Applicant Tracking Systems) or HR software.

- Repo creation workflows (out of scope; repos are created externally).

## 4. Users & Personas

| Persona | Role | Key Needs |
| --- | --- | --- |
| Tech Lead | Primary User | List pt- repos, revoke access, set timers, view audit log |
| Engineering | Config Owner | Configure retention policies, deletion defaults, org-level |
| Manager |   | settings |

## 5. Features & Requirements

## 5.1 Repository Dashboard

The primary view of the application. On load, it fetches all repositories from the connected GitHub organization and filters to those with the pt- prefix.

## Functional Requirements

- List all repositories matching the pt- prefix with the following columns:

- Repo name, candidate name (parsed from repo name), role (parsed from repo name)

- Creation date, days since creation, days until auto-deletion

- Current access status (Active / Revoked), Repo status (Live / Archived / Pending Deletion)

- Support search/filter by candidate name, role, access status, and repo status.

- Support sorting by creation date and days remaining.

- Paginate results if more than 50 repos are listed.

- Display a countdown badge (e.g. '12 days left') with color coding: green > 30 days, amber 10–30 days, red < 10 days.

## 5.2 Access Management

## Functional Requirements

- Tech lead can view all collaborators/outside collaborators on any pt- repo.

- Tech lead can revoke access for a specific user from a repo via a single 'Revoke Access' action.

- Tech lead can revoke access for all external collaborators on a repo in bulk.


- All access changes are reflected immediately via the GitHub API.

- A confirmation dialog must be shown before revoking access.

- Revoking access does not delete or archive the repo.

## 5.3 Repo Lifecycle Actions

## Functional Requirements

- Tech lead can manually Archive a repo (moves to archived state on GitHub; retains code, removes write access).

- Tech lead can manually trigger Delete for any pt- repo with a confirmation step requiring them to type the repo name.

- Deletion permanently removes the repo from GitHub via the API.

- Both archive and delete actions are captured in the audit log with actor, timestamp, and repo name.

## 5.4 Auto-Deletion Scheduler

## Functional Requirements

- The system calculates deletion date as: repo creation date + configured retention period (default: 90 days).

- A background job runs daily to identify repos that have crossed their deletion threshold.

- Repos past their threshold are automatically deleted (or archived, depending on configured default action).

- Tech leads receive an in-app notification 7 days before a scheduled auto-deletion.

- Tech leads can override the auto-deletion date for an individual repo (extend or bring forward).

- A repo with manually revoked access continues its deletion countdown independently.

## 5.5 Configuration Panel

A settings page accessible to tech leads to configure org-level and default lifecycle behavior.

## Configurable Parameters

| Setting | Default Value | Description |
| --- | --- | --- |
| Repo prefix filter | pt- | Prefix used to identify test repos |
| Retention period (days) | 90 | Days from creation before auto-deletion |
| Default expiry action | Delete | Delete or Archive on expiry |
| Pre-deletion warning (days) | 7 | Days before expiry to show in-app alert |


|   | GitHub Org name | (configured at setup) |   | Target GitHub organization |
| --- | --- | --- | --- | --- |
|   | GitHub OAuth App | (configured at setup) |   | OAuth credentials for API access |

## 5.6 Audit Log

A tamper-evident, append-only activity history for all actions performed through the application.

## Functional Requirements

- Log every action: access revoke, manual archive, manual delete, auto-delete, config change, login.

- Each log entry captures: actor (GitHub username), action type, target repo, timestamp (UTC), IP address.

- Audit log is viewable from a dedicated page with filter by actor, action type, and date range.

- Log entries cannot be edited or deleted via the UI.

- Export audit log as CSV for a selected date range.

## 6. GitHub API Integration & Permissions

The application connects to GitHub via OAuth App authentication. The following GitHub API scopes are required:

| GitHub Scope | Reason Required |
| --- | --- |
| repo | List, read, archive, and delete repositories |
| admin:org | Manage outside collaborators and org members |
| read:user | Identify the authenticated tech lead for audit log |
| delete_repo | Permanently delete repositories (explicit scope required) |

## 7. User Stories

|   | ID User Story |   |   |   | Priority |   |   | Feature |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| US- |   |   | As a tech lead, I want to see all pt- repos in one view so I |   | Must Have |   |   | Dashboard |
| 01 | don't have to scroll through GitHub. |   |   |   |   |   |   |   |
| US- |   | As a tech lead, I want to revoke a candidate's repo |   |   | Must Have |   |   | Access Mgmt |
| 02 | access with one click after their test ends. |   |   |   |   |   |   |   |


| US- | As a tech lead, I want repos to be auto-deleted 90 days | Must Have | Scheduler |
| --- | --- | --- | --- |
| 03 | after creation so I don't have to remember. |   |   |
| US- | As a tech lead, I want to archive a repo instead of | Must Have | Lifecycle |
| 04 | deleting it if we may need to review the code later. |   |   |
| US- | As an engineering manager, I want to change the default | Must Have | Config |
| 05 | retention period from 90 to another value. |   |   |
| US- | As a tech lead, I want to see who deleted a repo and | Must Have | Audit Log |
| 06 | when, in case there's a dispute. |   |   |
| US- | As a tech lead, I want an in-app warning 7 days before a | Should Have | Scheduler |
| 07 | repo is auto-deleted. |   |   |
| US- | As a tech lead, I want to extend the deletion date of a | Should Have | Scheduler |
| 08 | specific repo if a candidate needs more time. |   |   |
| US- | As an engineering manager, I want to export the audit log | Should Have | Audit Log |
| 09 | as CSV for compliance review. |   |   |
