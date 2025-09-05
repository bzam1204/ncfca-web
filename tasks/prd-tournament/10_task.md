---
status: pending # Options: pending, in-progress, completed, excluded
---

<task_context>
<domain>engine/infra/config-quality</domain>
<type>integration</type>
<scope>configuration</scope>
<complexity>low</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 10.0: Navigation, Compliance & Testing

## Overview

Add navigation entry for tournaments, run standards compliance checks, and implement targeted tests/validation to ensure cache, actions, and hooks behave as specified.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Add “Explorar Torneios” in `AppConfig.navigation.user`.
- Ensure no hooks contain `fetch`/`useSession`; only actions may access tokens.
- Verify QueryKeys/NextKeys invalidations on successful mutations.
- Provide basic test coverage where feasible; otherwise, add manual validation checklist.
</requirements>

## Subtasks

- [ ] 10.1 Update `src/infrastructure/config/navigation.ts` with user menu item → `/dashboard/tournaments`.
- [ ] 10.2 Standards scan: `rg -n "fetch\(|useSession" src/hooks/` to ensure compliance.
- [ ] 10.3 Cache checks: mutate and confirm affected queries refetch; validate Next.js tag revalidation calls exist.
- [ ] 10.4 E2E path validation: Explore → Details → Register (individual and duo) → Toast → UI refresh.

## Implementation Details

- Tech spec sections:
  - “Navigation & Routing”
  - “Security & Standards”
  - “Caching Strategy”

### Relevant Files

- `src/infrastructure/config/navigation.ts`
- `src/hooks/*`
- `src/infrastructure/actions/*`
- `src/infrastructure/cache/*`

### Dependent Files

- `src/app/dashboard/tournaments/*`

## Success Criteria

- Navigation shows tournaments in user area and link works.
- Hooks pass standards checks; mutations invalidate caches correctly.
- Documented validation results or basic tests added.

