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

# Task 4.0: Server Actions — Mutations

## Overview

Create server actions for registration mutations: request individual/duo, accept/reject duo, and cancel. Ensure Next.js tag revalidation per spec.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Mark files with `'use server'` and retrieve token via `auth()`.
- Use `Inject.RegistrationsGateway(token)` for all calls.
- On success, call `revalidateTag` for all affected `NextKeys` (mine, pending, details, search, featured as applicable).
- Propagate errors for UI to toast.
</requirements>

## Subtasks

- [ ] 4.1 `requestIndividualRegistrationAction(input): Promise<RequestIndividualRegistrationOutputDto>`
- [ ] 4.2 `requestDuoRegistrationAction(input): Promise<RequestDuoRegistrationOutputDto>`
- [ ] 4.3 `acceptDuoRegistrationAction(registrationId: string): Promise<void>`
- [ ] 4.4 `rejectDuoRegistrationAction(registrationId: string): Promise<void>`
- [ ] 4.5 `cancelRegistrationAction(input: CancelRegistrationDto): Promise<void>`
- [ ] 4.6 Revalidate tags: `registrations.mine`, `registrations.pending`, `tournaments.details(id)`, `tournaments.search(query)`, `featuredTournaments.list`.

## Implementation Details

- Tech spec sections:
  - “Gateway Interfaces & Implementation (mutations)”
  - “Cache Keys” — revalidation guidance

### Relevant Files

- `src/infrastructure/actions/registrations/request-individual-registration.action.ts`
- `src/infrastructure/actions/registrations/request-duo-registration.action.ts`
- `src/infrastructure/actions/registrations/accept-duo-registration.action.ts`
- `src/infrastructure/actions/registrations/reject-duo-registration.action.ts`
- `src/infrastructure/actions/registrations/cancel-registration.action.ts`

### Dependent Files

- `src/hooks/*`
- `src/infrastructure/cache/next-keys.ts`

## Success Criteria

- Actions compile and call correct endpoints.
- Appropriate Next.js tags revalidated for each mutation.
- Errors bubble for UI toast handling.

