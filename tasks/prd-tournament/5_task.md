---
status: completed # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/hooks</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 5.0: Hooks — Queries

## Overview

Create TanStack Query hooks for tournaments and registrations queries, consuming server actions (no fetch/useSession here). Use centralized `QueryKeys` and add `enabled` where appropriate.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Use `useQuery` only; call server actions.
- Provide `enabled` flags to guard undefined inputs.
- Memoize derived lists when applying client-side transforms.
- Use `staleTime` consistent with project norms.
</requirements>

## Subtasks

- [x] 5.1 `use-featured-tournaments.ts` → lists featured tournaments.
- [x] 5.2 `use-search-tournaments.ts` → accepts `SearchTournamentsQuery`; supports filters and pagination.
- [x] 5.3 `use-tournament-details.ts` → fetches details by `id`.
- [x] 5.4 `use-my-registrations.ts` → lists my registrations with optional filter.
- [x] 5.5 `use-my-pending-registrations.ts` → lists pending duo approvals.
- [x] 5.6 Validation: ensure keys match `QueryKeys` and no direct fetch/useSession.

## Implementation Details

- Tech spec sections:
  - “Hooks (queries first)”
  - “Caching Strategy” — QueryKeys usage

### Relevant Files

- `src/hooks/use-featured-tournaments.ts`
- `src/hooks/use-search-tournaments.ts`
- `src/hooks/use-tournament-details.ts`
- `src/hooks/use-my-registrations.ts`
- `src/hooks/use-my-pending-registrations.ts`

### Dependent Files

- `src/infrastructure/actions/*`
- `src/infrastructure/cache/query-keys.ts`

## Success Criteria

- All hooks compile, return typed data, and respect `enabled`.
- No direct `fetch`/`useSession` in hooks.
- Verified query keys align with `QueryKeys`.

