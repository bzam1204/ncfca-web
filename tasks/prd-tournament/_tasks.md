# Tournament Pages — Implementation Task Summary

## Relevant Files

### Core Implementation Files

- `src/contracts/api/tournament.dto.ts` - Tournament DTOs and views (lists, details, featured, queries).
- `src/contracts/api/registration.dto.ts` - Registration DTOs (mine, pending, request/cancel/accept/reject shapes).
- `src/contracts/api/dependants-search.dto.ts` - Partner search DTOs (email filter + results view).
- `src/infrastructure/cache/query-keys.ts` - Extend with tournaments, featured, registrations, dependants.search.
- `src/infrastructure/cache/next-keys.ts` - Extend with tournaments/registrations/featured/dependants tags.
- `src/application/gateways/tournaments/tournaments.gateway.ts` - Interface for tournaments queries.
- `src/application/gateways/featured-tournaments/featured-tournaments.gateway.ts` - Interface for featured list.
- `src/application/gateways/registrations/registrations.gateway.ts` - Interface for registration flows.
- `src/infrastructure/gateways/tournaments.gateway.api.ts` - API implementation with Next.js tags.
- `src/infrastructure/gateways/featured-tournaments.gateway.api.ts` - API implementation for featured.
- `src/infrastructure/gateways/registrations.gateway.api.ts` - API implementation for registrations.
- `src/infrastructure/containers/container.ts` - DI: add new gateway injectors.
- `src/infrastructure/actions/*.action.ts` - Server actions (queries and mutations).
- `src/hooks/*` - TanStack Query hooks for queries and mutations.
- `src/app/dashboard/tournaments/page.tsx` - Panel page (tabs: explore + my registrations).
- `src/app/dashboard/tournaments/[id]/page.tsx` - Individual tournament page.
- `src/app/dashboard/tournaments/_components/*` - Panel page components (carousel, grid, table).
- `src/app/dashboard/tournaments/[id]/_components/*` - Details components + dialogs.

### Integration Points

- `src/infrastructure/config/navigation.ts` - Add “Explorar Torneios” menu item.
- `rules/api-layer-standardization.md` - Compliance (Hook → Action → Gateway; cache rules).
- `openapi.json` - Endpoint and schema mapping reference.

### Documentation Files

- `tasks/prd-tournament/_kickoff.md` - PRD (Kickoff).
- `tasks/prd-tournament/_plan.md` - Technical Specification.

## Tasks

- [x] 1.0 Contracts & Cache Keys
- [x] 2.0 Gateways & DI Wiring
- [ ] 3.0 Server Actions — Queries
- [ ] 4.0 Server Actions — Mutations
- [ ] 5.0 Hooks — Queries
- [ ] 6.0 Hooks — Mutations
- [ ] 7.0 UI — Panel Page
- [ ] 8.0 UI — Individual Page
- [ ] 9.0 Dialogs — Individual & Duo Registration
- [ ] 10.0 Navigation, Compliance & Testing

## Parallel Agent Analysis

- Architecture duplication check: No overlap with existing clubs/trainings; introduces new tournaments/registrations namespaces; reuse existing patterns (QueryKeys/NextKeys, Hook→Action→Gateway).
- Missing component analysis: Add tournaments/featured/registrations gateways, actions, hooks, pages, and cache keys; DI entries absent and required.
- Integration point validation: Next.js tags on GET; revalidate tags on mutations; QueryKeys invalidations for mine, pending, details, search, featured.
- Dependency analysis: Linear chain — Contracts → Keys → Gateways → Actions → Hooks → UI Pages → Dialogs → Navigation/Polish.
- Standards compliance: Ensure no fetch/useSession in hooks, only in actions; follow `rules/api-layer-standardization.md`; use Shadcn components and `useNotify` for toasts.

