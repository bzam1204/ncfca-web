---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/hooks</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 6.0: Hooks — Mutations

## Overview

Create TanStack Mutation hooks for registration flows. Use `useNotify` for success/error toasts and invalidate affected query caches per spec.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Use `useMutation` calling server actions only.
- On success, invalidate: mine + pending + details(id) + search(query) + featured.
- Surface `notify.success/error` messages from action results.
- Avoid direct `fetch`/`useSession`.
</requirements>

## Subtasks

- [ ] 6.1 `use-request-individual-registration.ts`
- [ ] 6.2 `use-request-duo-registration.ts`
- [ ] 6.3 `use-accept-duo-registration.ts`
- [ ] 6.4 `use-reject-duo-registration.ts`
- [ ] 6.5 `use-cancel-registration.ts`
- [ ] 6.6 Validation: verify invalidations via `QueryKeys` and toasts via `useNotify`.

## Implementation Details

- Tech spec sections:
  - “Hooks (mutations)”
  - “Caching Strategy” — invalidation matrix

### Relevant Files

- `src/hooks/use-request-individual-registration.ts`
- `src/hooks/use-request-duo-registration.ts`
- `src/hooks/use-accept-duo-registration.ts`
- `src/hooks/use-reject-duo-registration.ts`
- `src/hooks/use-cancel-registration.ts`

### Dependent Files

- `src/infrastructure/actions/*`
- `src/infrastructure/cache/query-keys.ts`
- `src/hooks/use-notify.ts`

## Success Criteria

- Hooks compile and trigger correct actions.
- On success, relevant caches are invalidated and toasts are shown.
- No direct `fetch`/`useSession` usage.

