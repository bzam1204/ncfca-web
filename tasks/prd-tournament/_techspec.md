# Tournament Pages — Implementation Plan

## Summary

Deliver two authenticated dashboard experiences using the project’s Hook → Action → Gateway standard, Shadcn UI, TanStack Query, and Next.js caching. Prefer client components + hooks (no server component data fetching unless strictly necessary):

- Panel page (`/dashboard/tournaments`):
  - Tab 1: Explore tournaments — featured carousel + searchable/paginated grid; CTA to open details/register.
  - Tab 2: My registrations — table listing my tournament registrations (all statuses).
- Individual page (`/dashboard/tournaments/[id]`):
  - Show all tournament details; display registration window and registrationCount; CTA to register (individual or duo) via dialogs with toasts and cache updates.

## OpenAPI Mapping (Key Endpoints)

- GET `/featured-tournaments` → FeaturedTournamentResponseDto[]
- GET `/tournaments` → SearchTournamentsView { data: SearchTournamentsItemView[], meta } with containers:
  - `filter[name]?`, `filter[type]? ('INDIVIDUAL'|'DUO')`, `filter[showDeleted]?`
  - `pagination[page]?`, `pagination[limit]?`
- GET `/tournaments/{id}` → TournamentDetailsView
- GET `/my-registrations` → SearchMyRegistrationView { data, meta } (supports filtering and order)
- GET `/my-registrations/pending` → GetMyPendingRegistrationsListItemView[] (duo invites awaiting approval)
- POST `/registrations/request-individual` → RequestIndividualRegistrationOutputDto
- POST `/registrations/request-duo` → RequestDuoRegistrationOutputDto
- POST `/registrations/{id}/accept` and `/registrations/{id}/reject`
- POST `/registrations/cancel` → void
- GET `/dependants/search` → SearchDependantsView { data: DependantsItemView[], meta } using `filter[email]` and `pagination[page|limit]`

Notes:
- OpenAPI already exposes `registrationCount` in list and details; no need to mock this field.
- Filters for GET `/tournaments` are now specified via `SearchTournamentFilter` and `PaginationDto` containers.

## Data Contracts (src/contracts/api)

Create TypeScript DTOs that mirror OpenAPI components:

- `tournament.dto.ts`
  - `TournamentType = 'INDIVIDUAL' | 'DUO'`
  - `SearchTournamentsItemView` { id, name, type, startDate, registrationCount, registrationStartDate, registrationEndDate }
  - `SearchTournamentsView` { data: SearchTournamentsItemView[], meta }
  - `SearchTournamentFilter` { name?: string; type?: TournamentType; showDeleted?: boolean }
  - `SearchTournamentsQuery` { filter?: SearchTournamentFilter; pagination?: PaginationDto }
  - `TournamentDetailsView` { id, name, type, createdAt, startDate, deletedAt?, description, registrationCount, registrationStartDate, registrationEndDate }
  - `FeaturedTournamentResponseDto` { id, tournamentId, position, createdAt, updatedAt, tournamentName, tournamentType, startDate, registrationStartDate, registrationEndDate }
- `SearchMyRegistrationItemView` { registrationId, tournamentName, tournamentType, status, competitorName, competitorId, partnerName?, partnerId?, requestedAt }
- `SearchMyRegistrationView` { data: SearchMyRegistrationItemView[], meta }
- `SearchMyRegistrationsFilter` { tournamentName?: string; status?: 'CONFIRMED'|'CANCELLED'|'PENDING_APPROVAL'|'REJECTED'; order?: 'asc'|'desc' }
- `GetMyPendingRegistrationsListItemView` { registrationId, tournamentName, competitorName, competitorId, requestedAt, tournamentType }
- `RequestIndividualRegistrationInputDto` { tournamentId, competitorId }
- `RequestIndividualRegistrationOutputDto` { registrationId, status: 'CONFIRMED' }
- `RequestDuoRegistrationDto` { tournamentId, competitorId, partnerId }
- `RequestDuoRegistrationOutputDto` { registrationId, status: 'PENDING_APPROVAL' }
- `CancelRegistrationDto` { registrationId }
- `SearchDependantsFilter` { email?: string }
- `DependantsItemView` { id, name, email }
- `SearchDependantsView` { data: DependantsItemView[], meta }

Reuse `PaginatedResponseDto` shape from `pagination.dto.ts` meta contract.

## Cache Keys

- `QueryKeys` (src/infrastructure/cache/query-keys.ts)
  - `tournaments.all`
  - `tournaments.search.query(query)`
  - `tournaments.details(id)`
  - `featuredTournaments.all()`
  - `registrations.mine()`
  - `registrations.pending()`
  - `dependants.search(query)`

- `NextKeys` (src/infrastructure/cache/next-keys.ts)
  - `featuredTournaments.list`
  - `tournaments.search(query)` (stringify query)
  - `tournaments.details(id)`
  - `registrations.mine`
  - `registrations.pending`
  - `dependants.search(query)`

Use these for `next.tags` on GETs and to `revalidateTag` on mutations.

## Gateway Interfaces & Implementation (split by resource)

- Names and method signatures should mirror API operations when feasible.

- `src/application/gateways/tournaments/tournaments.gateway.ts`
  - `searchTournaments(query: SearchTournamentsQuery): Promise<SearchTournamentsView>` (GET `/tournaments`)
  - `getById(id: string): Promise<TournamentDetailsView>` (GET `/tournaments/{id}`)

- `src/application/gateways/featured-tournaments/featured-tournaments.gateway.ts`
  - `listFeatured(): Promise<FeaturedTournamentResponseDto[]>` (GET `/featured-tournaments`)

- `src/application/gateways/registrations/registrations.gateway.ts`
  - `searchMyRegistrations(query?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView>` (GET `/my-registrations`)
  - `findMyPendingRegistrations(): Promise<GetMyPendingRegistrationsListItemView[]>` (GET `/my-registrations/pending`)
  - `registerIndividualCompetitor(input: RequestIndividualRegistrationInputDto): Promise<RequestIndividualRegistrationOutputDto>` (POST `/registrations/request-individual`)
  - `requestDuoCompetitorRegistration(input: RequestDuoRegistrationDto): Promise<RequestDuoRegistrationOutputDto>` (POST `/registrations/request-duo`)
  - `acceptDuoCompetitorRegistration(id: string): Promise<void>` (POST `/registrations/{id}/accept`)
  - `rejectDuoCompetitorRegistration(id: string): Promise<void>` (POST `/registrations/{id}/reject`)
  - `cancelCompetitorRegistration(input: CancelRegistrationDto): Promise<void>` (POST `/registrations/cancel`)

- Implement three API classes under `src/infrastructure/gateways/...` mirroring the interfaces above, using `baseUrl` + `accessToken`.
  - GETs: include `next: { revalidate: 300, tags: [...] }` with `NextKeys` above.
  - Mutations: on success `revalidateTag` the impacted tags:
    - Individual/Duo request: featured, tournaments search, tournaments details(id), registrations.mine, registrations.pending.
    - Accept/Reject duo: registrations.pending, registrations.mine.
    - Cancel: registrations.mine (and details(id) if available in callsite).
  - Build querystring with `filter[...]` and `pagination[...]` containers.

- Add to DI container (`src/infrastructure/containers/container.ts`):
  - `function tournamentsGateway(accessToken: string): TournamentsGateway` → `Inject.TournamentsGateway`
  - `function featuredTournamentsGateway(accessToken: string): FeaturedTournamentsGateway` → `Inject.FeaturedTournamentsGateway`
  - `function registrationsGateway(accessToken: string): RegistrationsGateway` → `Inject.RegistrationsGateway`

## Server Actions (src/infrastructure/actions)

Create server actions that authenticate via `auth()` and delegate to the split gateways:

- Queries
  - `get-featured-tournaments.action.ts` → FeaturedTournamentsGateway.listFeatured
  - `search-tournaments.action.ts` → TournamentsGateway.searchTournaments
  - `get-tournament-by-id.action.ts` → TournamentsGateway.getById
  - `get-my-registrations.action.ts` → RegistrationsGateway.searchMyRegistrations
  - `get-my-pending-registrations.action.ts` → RegistrationsGateway.findMyPendingRegistrations
  - `search-dependants.action.ts` → FamilyGateway.searchDependants (for duo partner lookup)

- Mutations
  - `request-individual-registration.action.ts` → RegistrationsGateway.registerIndividualCompetitor
  - `request-duo-registration.action.ts` → RegistrationsGateway.requestDuoCompetitorRegistration
  - `accept-duo-registration.action.ts` → RegistrationsGateway.acceptDuoCompetitorRegistration
  - `reject-duo-registration.action.ts` → RegistrationsGateway.rejectDuoCompetitorRegistration
  - `cancel-registration.action.ts` → RegistrationsGateway.cancelCompetitorRegistration

Each mutation should also `revalidateTag` as described in the Gateway (either in the gateway or here; keep consistency with existing gateways that centralize this on the gateway side).

- ## Client Hooks (src/hooks)

Mirror existing patterns (e.g., clubs/enrollment hooks). Use client components + hooks (no server fetching):

- Queries
  - `use-featured-tournaments.ts` → QueryKeys.featuredTournaments.all()
  - `use-search-tournaments.ts` → QueryKeys.tournaments.search.query(query)
  - `use-tournament-details.ts` → QueryKeys.tournaments.details(id)
  - `use-my-registrations.ts` → QueryKeys.registrations.mine
  - `use-my-pending-registrations.ts` → QueryKeys.registrations.pending
  - `use-search-dependants.ts` → QueryKeys.dependants.search(query)

- Mutations
  - `use-request-individual-registration.ts` → invalidates mine + pending + details + search + featured
  - `use-request-duo-registration.ts` → same invalidations as above
  - `use-accept-duo-registration.ts` / `use-reject-duo-registration.ts` → invalidates pending + mine
  - `use-cancel-registration.ts` → invalidates mine (and details if provided)

All hooks must call Server Actions only (no direct fetch/useSession in hooks).

## UI — Panel Page (`/dashboard/tournaments`)

- Create `src/app/dashboard/tournaments/page.tsx` modeled after `dashboard/clubs/page.tsx`:
  - Tabs (Shadcn) for: “Explorar Torneios” and “Minhas Inscrições”.
  - Tab 1 — Explore:
    - `FeaturedTournamentsCarousel` (horizontal card scroll) backed by `use-featured-tournaments`.
      - If the featured list is empty, do not render the carousel.
    - `ExploreTournaments` grid component with filters (name/type) and pagination controls; CTA buttons:
      - “Ver detalhes” → push to `/dashboard/tournaments/[id]` (register there).
  - Tab 2 — My Registrations:
    - `MyRegistrationsTable` rendering SearchMyRegistrationItemView with status badges, type, requestedAt, actions (cancel when applicable; accept/reject if pending duo request belongs to me — or split these actions into the Pending tab if preferred).

## UI — Individual Page (`/dashboard/tournaments/[id]`)

- Create `src/app/dashboard/tournaments/[id]/page.tsx`:
  - Fetch details via `use-tournament-details` (client hook) and render descriptive Card(s). Avoid server components unless strictly necessary.
  - Show: name, type badge, description, startDate, registrationStart/End, `registrationCount`.
  - Registration CTA(s): based on `type` show one or two buttons to open:
    - `IndividualRegistrationDialog` (select dependant using `useGetDependants`; submit via `use-request-individual-registration`; toast via `useNotify`).
    - `DuoRegistrationDialog` (select dependant + search partner by email; submit via `use-request-duo-registration`; toast + UI state updates).

## Dialogs

- `IndividualRegistrationDialog.tsx` — replicate pattern from Clubs `EnrollmentDialog` (select dependant → submit). Reuse universal `src/components/ui/dialog.tsx`.
- `DuoRegistrationDialog.tsx` — replicate search UX from `change-principal-dialog` using `Command`:
  - Field 1: Select dependant (same as individual).
  - Field 2: Search partner by email (debounced). Shows “not found” message when no match; select user when found.
  - Submit using `use-request-duo-registration`.

BE dependency for partner lookup:
- Use `GET /dependants/search?email=` to find partner candidate by email. If not available in the current OpenAPI/runtime, fallback to UI-only “not found” and add a TODO to integrate once backend ships.

## Navigation & Routing

- Add “Explorar Torneios” entry to `src/infrastructure/config/navigation.ts` under `navigation.user`.
- Create routes and directories:
  - `src/app/dashboard/tournaments/page.tsx`
  - `src/app/dashboard/tournaments/_components/*`
  - `src/app/dashboard/tournaments/[id]/page.tsx`
  - `src/app/dashboard/tournaments/[id]/_components/*`

## Caching Strategy

- TanStack Query: keys as defined above; keep defaults from `QueryProvider`.
- Next.js Tags: add tags on GET in gateway and `revalidateTag` on mutations.
- Invalidate on successful mutations as outlined to keep UI current (Explore grid counts, My Registrations table, Pending approvals, Details page).

## Notifications & UX

- Use `useNotify` to display success/error toasts for all mutations.
- Disabled/Loading states on dialog buttons (`Loader2` icon) following existing patterns.
- Validate registration window (disable CTA if outside registrationStart/End range; optional).

## Security & Standards

- Follow `rules/api-layer-standardization.md`:
  - No `useSession`/`fetch` in hooks; only Server Actions.
  - Gateways type-safe and contain endpoint mapping and error propagation.
  - Actions check auth and roles when needed (none of the above require admin for user flows).

## Edge Cases & TODOs

- Partner email lookup endpoint — FE TODO with BE proposal as above.
- `/tournaments` filter schema — confirm supported filters; align `SearchTournamentsQuery` accordingly.
- Carousel content source — OpenAPI has `/featured-tournaments`; use it. if the list is empty just don't render the tournament carousel. 
- Registration state transitions — enforce per OpenAPI: individual → CONFIRMED; duo → PENDING_APPROVAL; accept/reject actions required to resolve duo.

## Implementation Order (Milestones)

1) Contracts + Cache Keys (QueryKeys/NextKeys)
2) Gateway Interface + Implementation + DI injection
3) Actions (queries first, then mutations)
4) Hooks (queries first)
5) Panel Page (Explore grid + My Registrations; wire featured carousel)
6) Individual Page (details + dialogs)
7) Mutation hooks + cache invalidations + toasts
8) Navigation link + polish + empty/loading states
9) Review vs. rules; remove any stray fetch/useSession from hooks
