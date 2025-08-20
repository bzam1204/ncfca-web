## Descrição

Breve descrição das mudanças implementadas.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema sem quebrar funcionalidade existente)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade sem quebrar existente)
- [ ] Breaking change (mudança que quebra funcionalidade existente)
- [ ] Refatoração (mudança que não adiciona funcionalidade nem corrige bugs)
- [ ] Documentação

## Checklist de Revisão

### Geral
- [ ] Código segue os padrões do projeto (`.cursor/rules/code.standards.yml`)
- [ ] Build passa (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Testes passam (se aplicável)

### Camada de API (se aplicável)
- [ ] **Mapeamento OpenAPI**: Novos métodos de Gateway documentados com rota do `openapi.json`
- [ ] **Hooks limpos**: Ausência de `fetch()` e `useSession()` em `src/hooks/**`
- [ ] **Actions padronizadas**: Server Actions com `auth()` e `Inject.{Gateway}(token)`
- [ ] **Cache adequado**: `QueryKeys` para queries e `NextKeys` para revalidação
- [ ] **Invalidações corretas**: Mutações invalidam chaves relacionadas (`QueryKeys`)

### Segurança
- [ ] Tokens de acesso nunca expostos no cliente
- [ ] Autorização adequada em Actions (verificação de roles)
- [ ] Nenhum dado sensível commitado

## Comandos de Verificação

```bash
# Verificar padrões de API
rg -n "fetch\(|useSession" src/hooks/
rg -n "src/infraestructure/queries/|src/infraestructure/services/query.service.api"

# Build e lint
npm run build
npm run lint
```

## Testes

Descreva como testar as mudanças:

- [ ] Teste manual realizado
- [ ] Testes automatizados adicionados/atualizados