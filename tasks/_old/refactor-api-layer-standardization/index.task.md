# Plano de Execução — "refactor-api-layer-standardization"

## Objetivo

Este plano visa refatorar a camada de acesso à API, eliminando o padrão de `use-cases` e adotando uma abordagem padronizada com `React Hooks (useQuery/useMutation) -> Gateway Interface -> Gateway Implementation`. O objetivo é aumentar a consistência, testabilidade e manutenibilidade do código.

## Escopo

- **Incluído:** Refatoração completa dos `use-cases` listados abaixo, substituindo-os por hooks e gateways.
- **Excluído:** Nenhuma nova funcionalidade será adicionada. A lógica de negócio existente nos `use-cases` será migrada, não alterada.

## Referências

- **Doc do Arquiteto:** @/tasks/analysys/013-refactor-api-layer-standardization.analisys.md
- **Framework:** TanStack Query (React Query) para `useQuery` e `useMutation`.

## Tasks

1. **01** — Refatorar `use-admin-management.use-case.ts` para Hooks e Gateway
2. **02** — Refatorar `use-checkout.use-case.ts` para Hooks e Gateway
3. **03** — Refatorar `use-club-management.use-case.ts` para Hooks e Gateway
4. **04** — Unificar Use-Cases de Família (`use-manage-dependants`, `use-dependant-details`, `use-my-family`) em Hooks e Gateway
5. **05** — Refatorar `use-register-user.use-case.ts` para Hooks e Gateway
