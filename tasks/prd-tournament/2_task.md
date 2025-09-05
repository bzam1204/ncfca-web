---
status: completed # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/gateway</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>external_apis|http_server</dependencies>
</task_context>

# Task 2.0: Gateways & DI Wiring

## Overview

Define gateway interfaces for tournaments, featured tournaments, and registrations, then implement API classes with Next.js tags for GETs and wire them into the DI container (`Inject.*`).

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Interfaces mirror API operations and DTOs.
- Implementations use `fetch` with Authorization headers and typed responses.
- Add `next: { tags: [...] }` on GET requests to enable tag revalidation.
- Update `src/infrastructure/containers/container.ts` with new injectors.
</requirements>

## Subtasks

- [ ] 2.1 Create interfaces:
  - `src/application/gateways/tournaments/tournaments.gateway.ts`
    - `searchTournaments(query: SearchTournamentsQuery): Promise<SearchTournamentsView>`
    - `getById(id: string): Promise<TournamentDetailsView>`
  - `src/application/gateways/featured-tournaments/featured-tournaments.gateway.ts`
    - `listFeatured(): Promise<FeaturedTournamentResponseDto[]>`
  - `src/application/gateways/registrations/registrations.gateway.ts`
    - `requestIndividual(input: RequestIndividualRegistrationInputDto): Promise<RequestIndividualRegistrationOutputDto>`
    - `requestDuo(input: RequestDuoRegistrationDto): Promise<RequestDuoRegistrationOutputDto>`
    - `accept(registrationId: string): Promise<void>` / `reject(registrationId: string): Promise<void>`
    - `cancel(input: CancelRegistrationDto): Promise<void>`
    - `mine(filter?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView>`
    - `pending(): Promise<GetMyPendingRegistrationsListItemView[]>`
- [ ] 2.2 Implement API classes under `src/infrastructure/gateways/` with NextKeys tags:
  - `tournaments.gateway.api.ts`, `featured-tournaments.gateway.api.ts`, `registrations.gateway.api.ts`
- [ ] 2.3 Wire DI in `src/infrastructure/containers/container.ts` (e.g., `Inject.TournamentsGateway(accessToken)` etc.).
- [ ] 2.4 Validation: ensure all imports resolve; confirm fetch URLs and method/paths match OpenAPI.

## Implementation Details

- Tech spec sections:
  - “Gateway Interfaces & Implementation (split by resource)”
  - “Cache Keys” (for Next.js tags on GET)

### Relevant Files

- `src/application/gateways/tournaments/tournaments.gateway.ts`
- `src/application/gateways/featured-tournaments/featured-tournaments.gateway.ts`
- `src/application/gateways/registrations/registrations.gateway.ts`
- `src/infrastructure/gateways/tournaments.gateway.api.ts`
- `src/infrastructure/gateways/featured-tournaments.gateway.api.ts`
- `src/infrastructure/gateways/registrations.gateway.api.ts`
- `src/infrastructure/containers/container.ts`

### Dependent Files

- `src/infrastructure/actions/*`
- `src/hooks/*`

## Success Criteria

- Interfaces compile and match DTOs.
- Implementations call correct endpoints with tags on GET.
- DI container exposes new gateways without type errors.

