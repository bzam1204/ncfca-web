---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/actions</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server|external_apis</dependencies>
</task_context>

# Task 3.0: Server Actions — Queries

## Overview

Create server actions for tournaments and registrations queries. Actions must perform `auth()` and use DI gateways. No direct fetch/useSession in hooks.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Mark files with `'use server'`.
- Retrieve `accessToken` via `auth()` and instantiate gateways via `Inject.*`.
- Return typed DTOs; propagate errors sensibly.
- GET endpoints rely on gateway’s Next.js tags for cache.
</requirements>

## Subtasks

- [ ] 3.1 `listFeaturedTournamentsAction(): Promise<FeaturedTournamentResponseDto[]>`
- [ ] 3.2 `searchTournamentsAction(query: SearchTournamentsQuery): Promise<SearchTournamentsView>`
- [ ] 3.3 `getTournamentDetailsAction(id: string): Promise<TournamentDetailsView>`
- [ ] 3.4 `getMyRegistrationsAction(filter?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView>`
- [ ] 3.5 `getMyPendingRegistrationsAction(): Promise<GetMyPendingRegistrationsListItemView[]>`
- [ ] 3.6 Validation: ensure no fetch/useSession in actions’ callers (hooks will call actions only).

## Implementation Details

- Tech spec sections:
  - “OpenAPI Mapping (Key Endpoints)”
  - “Gateway Interfaces & Implementation” (use via DI)
  - “Security & Standards” (no fetch/useSession in hooks)

### Relevant Files

- `src/infrastructure/actions/tournaments/list-featured-tournaments.action.ts`
- `src/infrastructure/actions/tournaments/search-tournaments.action.ts`
- `src/infrastructure/actions/tournaments/get-tournament-details.action.ts`
- `src/infrastructure/actions/registrations/get-my-registrations.action.ts`
- `src/infrastructure/actions/registrations/get-my-pending-registrations.action.ts`

### Dependent Files

- `src/hooks/*`
- `src/infrastructure/gateways/*.api.ts`

## Success Criteria

- All actions return typed data and compile.
- Actions use DI with validated token; no direct fetch in hooks.
- Ready for hooks to consume.

