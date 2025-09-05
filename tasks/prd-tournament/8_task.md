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

# Task 8.0: UI — Individual Page

## Overview

Build `/dashboard/tournaments/[id]` page to show tournament details and registration CTAs (individual and/or duo). Render details including `registrationCount` and registration window dates.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Use `use-tournament-details` hook for data.
- Show: name, type badge, description, startDate, registrationStart/End, `registrationCount`.
- Conditionally render CTA buttons based on tournament `type`.
- Optionally disable CTAs outside registration window.
</requirements>

## Subtasks

- [ ] 8.1 Create `src/app/dashboard/tournaments/[id]/page.tsx`.
- [ ] 8.2 Add `[id]/_components/TournamentDetailsCard.tsx` to present details.
- [ ] 8.3 Wire `IndividualRegistrationDialog` and `DuoRegistrationDialog` trigger buttons.
- [ ] 8.4 Loading/empty/error states consistent with UX.

## Implementation Details

- Tech spec sections:
  - “UI — Individual Page (`/dashboard/tournaments/[id]`)”
  - “Dialogs” (wiring of CTAs)

### Relevant Files

- `src/app/dashboard/tournaments/[id]/page.tsx`
- `src/app/dashboard/tournaments/[id]/_components/TournamentDetailsCard.tsx`
- `src/app/dashboard/tournaments/[id]/_components/*`

### Dependent Files

- `src/hooks/use-tournament-details.ts`
- `src/app/dashboard/tournaments/_components/*`

## Success Criteria

- Details page renders complete info and CTA buttons.
- CTA opens dialogs; navigation and state transitions intact.
- Matches visual/UX patterns in the project.

