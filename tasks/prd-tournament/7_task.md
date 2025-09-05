---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/ui</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 7.0: UI — Panel Page

## Overview

Build `/dashboard/tournaments` with Shadcn Tabs: “Explorar Torneios” (featured carousel + grid with filters/pagination) and “Minhas Inscrições” (table). Use hooks for data; CTA navigates to details page.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Model after `dashboard/clubs/page.tsx` structure and styling.
- Tab 1: render `FeaturedTournamentsCarousel` only if list non-empty; `ExploreTournaments` grid supports name/type filters and pagination.
- Tab 2: `MyRegistrationsTable` with status badges and optional actions (cancel where applicable).
- Navigation to details: push to `/dashboard/tournaments/[id]`.
</requirements>

## Subtasks

- [ ] 7.1 Create `src/app/dashboard/tournaments/page.tsx` with Shadcn Tabs.
- [ ] 7.2 Add `_components/FeaturedTournamentsCarousel.tsx` using `use-featured-tournaments`.
- [ ] 7.3 Add `_components/ExploreTournaments.tsx` grid using `use-search-tournaments` + filters + pagination.
- [ ] 7.4 Add `_components/MyRegistrationsTable.tsx` using `use-my-registrations` (+ pending if needed).
- [ ] 7.5 Empty/loading states; consistent with existing UX patterns.

## Implementation Details

- Tech spec sections:
  - “UI — Panel Page (`/dashboard/tournaments`)”
  - “Notifications & UX”

### Relevant Files

- `src/app/dashboard/tournaments/page.tsx`
- `src/app/dashboard/tournaments/_components/FeaturedTournamentsCarousel.tsx`
- `src/app/dashboard/tournaments/_components/ExploreTournaments.tsx`
- `src/app/dashboard/tournaments/_components/MyRegistrationsTable.tsx`

### Dependent Files

- `src/hooks/*`
- `src/infrastructure/config/navigation.ts`

## Success Criteria

- Page renders tabs, carousel (when data exists), and grid with filters/pagination.
- My registrations table displays statuses and relevant actions.
- CTA navigates to details page.

