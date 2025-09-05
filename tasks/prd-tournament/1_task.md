---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/contracts-cache</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>external_apis</dependencies>
</task_context>

# Task 1.0: Contracts & Cache Keys

## Overview

Define all tournament, registration, and dependants-search DTOs per OpenAPI and extend centralized caching keys (TanStack Query and Next.js tags) to support tournaments, featured tournaments, registrations, and dependants search.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Mirror OpenAPI schemas in TypeScript with exact field names and enums.
- Reuse existing `PaginationDto` patterns for paginated responses.
- Extend `QueryKeys` and `NextKeys` using existing naming conventions.
- Keep changes additive; do not break existing keys.
</requirements>

## Subtasks

- [ ] 1.1 Add `src/contracts/api/tournament.dto.ts` with:
  - `TournamentType = 'INDIVIDUAL'|'DUO'`
  - `SearchTournamentsItemView`, `SearchTournamentsView`, `SearchTournamentFilter`, `SearchTournamentsQuery`, `TournamentDetailsView`, `FeaturedTournamentResponseDto`.
- [ ] 1.2 Add `src/contracts/api/registration.dto.ts` with:
  - `SearchMyRegistrationItemView`, `SearchMyRegistrationView`, `SearchMyRegistrationsFilter`, `GetMyPendingRegistrationsListItemView`,
  - `RequestIndividualRegistrationInputDto`/`OutputDto`, `RequestDuoRegistrationDto`/`OutputDto`, `CancelRegistrationDto`.
- [ ] 1.3 Add `src/contracts/api/dependants-search.dto.ts` with:
  - `SearchDependantsFilter` { email?: string }
  - `DependantsItemView` { id, name, email }
  - `SearchDependantsView` { data: DependantsItemView[], meta }
- [ ] 1.4 Extend `src/infrastructure/cache/query-keys.ts` with:
  - `tournaments.all`, `tournaments.search.query(query)`, `tournaments.details(id)`
  - `featuredTournaments.all()`
  - `registrations.mine()`, `registrations.pending()`
  - `dependants.search(query)`
- [ ] 1.5 Extend `src/infrastructure/cache/next-keys.ts` with:
  - `featuredTournaments.list`, `tournaments.search(query)`, `tournaments.details(id)`,
  - `registrations.mine`, `registrations.pending`, `dependants.search(query)`
- [ ] 1.6 Validation: Type-check project; verify imports and naming consistency.

## Implementation Details

- Tech spec sections:
  - “Data Contracts (src/contracts/api)”
  - “Cache Keys” — QueryKeys and NextKeys subsections
  - “OpenAPI Mapping (Key Endpoints)” for field shapes

### Relevant Files

- `src/contracts/api/tournament.dto.ts`
- `src/contracts/api/registration.dto.ts`
- `src/contracts/api/dependants-search.dto.ts`
- `src/infrastructure/cache/query-keys.ts`
- `src/infrastructure/cache/next-keys.ts`

### Dependent Files

- `src/infrastructure/actions/*`
- `src/infrastructure/gateways/*.api.ts`
- `src/hooks/*`

## Success Criteria

- All DTOs compiled and exported; no TS errors.
- QueryKeys/NextKeys expose the new tournament/registration namespaces.
- Naming matches existing patterns; no breaking changes to current keys.
- Ready for gateways and actions to import and use.

