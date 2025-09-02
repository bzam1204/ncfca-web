### Plano Arquitetural: Padronização da Camada de Acesso à API

**1. Objetivo**

Eliminar o padrão de `use-cases` e padronizar todas as interações com a API através do fluxo `React Hook (useQuery/useMutation) -> Gateway Interface -> Gateway Implementation`, garantindo consistência, testabilidade e uma clara separação de responsabilidades.

**2. O Padrão Alvo**

- **Hook (`/src/hooks`):** Expõe os dados da API para os componentes React usando `useQuery` ou `useMutation` do TanStack Query. Ele invoca uma função do gateway.
- **Gateway Interface (`/src/application/gateways`):** Define o contrato para as operações de um domínio (e.g., `AdminGateway`). É o que os hooks consomem.
- **Gateway Implementation (`/src/infrastructure/gateways`):** Implementação concreta da interface, responsável pela lógica de `fetch`, headers, e tratamento de erros da comunicação HTTP.
- **Container DI (`/src/infrastructure/containers`):** Mapeia as interfaces aos seus gateways concretos, permitindo a injeção de dependência.

**3. Estratégia de Refatoração**

Para cada arquivo em `/src/application/use-cases`, o processo será:

1.  **Mapear Operações:** Identificar as operações de API existentes no use-case e seus endpoints correspondentes no `openapi.json`.
2.  **Estender Gateway:** Adicionar as assinaturas dos métodos necessários à interface do gateway de domínio apropriado (e.g., `AdminGateway`, `FamilyGateway`).
3.  **Implementar Gateway:** Implementar os novos métodos na classe de gateway concreta, encapsulando a lógica de `fetch`.
4.  **Criar Hooks:** Desenvolver os hooks `useQuery`/`useMutation` correspondentes em `/src/hooks` que utilizam os novos métodos do gateway.
5.  **Refatorar Componentes:** Substituir o uso do `use-case` legado nos componentes de UI pelos novos hooks.
6.  **Remover Arquivo:** Após a refatoração de todos os seus usos, deletar o arquivo do `use-case`.

**4. Plano de Execução**

- **4.1. Refatorar `use-admin-management.use-case.ts`**
  - **Gateways:** `AdminGateway` e `AdminGatewayHttp`.
  - **Operações:** `searchUsers`, `getUserById`, `manageUserRole`, `viewUserFamily`.
  - **Novos Hooks:** `useSearchUsers`, `useAdminUserById`, `useManageUserRole`, `useAdminUserFamily`.

- **4.2. Refatorar `use-checkout.use-case.ts`**
  - **Gateways:** `CheckoutGateway` (criar, se não existir) e `CheckoutGatewayHttp`.
  - **Operações:** `createCheckout`.
  - **Novos Hooks:** `useCreateCheckout`.

- **4.3. Refatorar `use-club-management.use-case.ts`**
  - **Gateways:** `ClubManagementGateway` e `ClubManagementGatewayHttp`.
  - **Operações:** `getMyClubInfo`, `updateClub`, `listEnrollments`, `approve`, `reject`, etc.
  - **Novos Hooks:** `useMyClubInfo`, `useUpdateMyClub`, `useClubEnrollments`, `useApproveEnrollment`, `useRejectEnrollment`.

- **4.4. Refatorar `use-manage-dependants.use-case.ts` e `use-dependant-details.use-case.ts`**
  - **Gateways:** `FamilyGateway` e `FamilyGatewayHttp`.
  - **Operações:** `addDependant`, `listDependants`, `viewDependant`, `updateDependant`, `deleteDependant`.
  - **Novos Hooks:** `useAddDependant`, `useListDependants`, `useDependantDetails`, `useUpdateDependant`, `useDeleteDependant`.

- **4.5. Refatorar `use-my-family.use-case.ts`**
  - **Gateways:** `FamilyGateway` e `FamilyGatewayHttp`.
  - **Operações:** `viewMyFamily`.
  - **Novos Hooks:** `useMyFamily`.

- **4.6. Refatorar `use-register-user.use-case.ts`**
  - **Gateways:** `AccountGateway` (criar, se não existir) e `AccountGatewayHttp`.
  - **Operações:** `registerUser`.
  - **Novos Hooks:** `useRegisterUser`.

**5. Validação**

- A aplicação deve ser testada manualmente nas áreas refatoradas para garantir que nenhuma regressão funcional foi introduzida.

**6. Próximos Passos**

Arquivo de análise persistido em `tasks/analysys/013-refactor-api-layer-standardization.analisys.md`. Cabe ao PM quebrar em tarefas para o time de desenvolvimento.
