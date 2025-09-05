---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/ui-components</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 9.0: Dialogs — Individual & Duo Registration

## Overview

Implement `IndividualRegistrationDialog` and `DuoRegistrationDialog` using Shadcn Dialog and patterns similar to `change-principal-dialog`. Select dependant; for duo, search partner by email with debounce and show not-found feedback.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Individual: select dependant → submit via mutation; toast success/error.
- Duo: select dependant → partner email search → show matches or not found → select partner → submit → toast + UI refresh.
- Use `useNotify` and mutation hooks; no direct network calls.
- Invalidate caches handled in hooks; dialogs focus on UX and state.
</requirements>

## Subtasks

- [ ] 9.1 `IndividualRegistrationDialog.tsx` modeled after clubs enrollment dialog.
- [ ] 9.2 `DuoRegistrationDialog.tsx` modeled after `change-principal-dialog` with Command-style search and debounced input.
- [ ] 9.3 Wire loading/disabled states; handle errors and success toasts.

## Implementation Details

- Tech spec sections:
  - “Dialogs”
  - “Notifications & UX”
- References:
  - `@src/app/(admin)/admin/dashboard/clubs/[clubId]/_components/change-principal-dialog.tsx`
  - `@src/infrastructure/cache/query-keys.ts`
  - `@src/infrastructure/cache/next-keys.ts`

### Relevant Files

- `src/app/dashboard/tournaments/[id]/_components/IndividualRegistrationDialog.tsx`
- `src/app/dashboard/tournaments/[id]/_components/DuoRegistrationDialog.tsx`

### Dependent Files

- `src/hooks/use-request-individual-registration.ts`
- `src/hooks/use-request-duo-registration.ts`
- `src/hooks/use-my-pending-registrations.ts`

## Success Criteria

- Dialogs functionally complete with clear UX for selection/search/submit.
- Debounced partner search; shows “not found” message appropriately.
- Success/error toasts appear and affected UI updates after cache invalidation.

