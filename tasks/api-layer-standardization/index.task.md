# Plano de Execução — 'api-layer-standardization'

## Objetivo
Padronizar o acesso à API em um único fluxo Hook → Action (server) → Gateway (interface) → Container (Inject) → Real Gateway (API), eliminando fetch direto no cliente e divergências com o contrato `openapi.json`. Garantir segurança (token apenas no server), consistência de cache (QueryKeys/NextKeys) e mapeamento completo dos contratos usados.

## Escopo
- Itens incluídos
  - Extensão dos gateways `AdminGateway`, `ClubGateway`, `FamilyGateway` com métodos faltantes do OpenAPI.
  - Criação/ajuste de Actions server-side por operação exposta.
  - Refatoração de hooks clientes para consumir Actions + `QueryKeys`.
  - Refatoração de páginas server que fazem fetch direto para usar gateways/actions.
  - Remoção da camada legacy de `infraestructure/queries` e do `query.service.api`.
  - Documentação de padrão e guardas de revisão/lint.
- Itens excluídos
  - Remoção total dos use-cases legados (apenas manter deprecados nesta fase).

## Referências
- Doc do Arquiteto: `@/tasks/analisys/015-api-layer-standardization.arch.analisys.md`
- Contrato API: `openapi.json`
- Padrões internos: `src/infraestructure/cache/query-keys.ts`, `src/infraestructure/cache/next-keys.ts`

## Tasks
1. 01 — Estender Gateways conforme OpenAPI
2. 02 — Criar/Ajustar Actions por operação
3. 03 — Refatorar Hooks para Actions + QueryKeys
4. 04 — Refatorar Páginas Server para Gateways/Actions
5. 05 — Remover Queries Legacy e Ajustes
6. 06 — Documentar Padrão e Guardas (lint/review)

