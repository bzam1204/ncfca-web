# ESPECIFICAÇÃO DE REFATORAÇÃO DECLARATIVA
# VERSÃO: FRAMEWORK v3.0 (modo TAG-PRIMEIRO)
# DATA: 20 de agosto de 2025

<task>
Refatorar a camada de acesso à API para padronizar o uso de Gateways, eliminando o padrão legado de Use Cases, garantindo consistência, testabilidade e manutenibilidade em todo o projeto.
</task>

__________________________________________________________________________________________

<reference>

  <!-- Conceitos e Padrões do Documento -->
  <concepts_and_patterns>
    <projectCodeStandards>@.cursor/rules/code.standards.yml</projectCodeStandards>
    <conceptApiContract>openapi.json</conceptApiContract>
    <patternOld>Use Cases monolíticos com chamadas `fetch` diretas e lógica de negócio acoplada.</patternOld>
    <patternNew>Padrão Gateway: Hooks (React Query) -> Ações -> Gateway (Interface) -> Gateway (Implementação HTTP).</patternNew>
    <folderToDelete>src/application/use-cases/</folderToDelete>
  </concepts_and_patterns>

  <!-- AGRUPAMENTO: use tags como IDs -->
  <filesToDelete>
    <legacyUseCasesGroup purpose="Remover padrão de use cases que acessam a API diretamente.">
      <useAdminManagementUseCaseLegacy path="src/application/use-cases/use-admin-management.use-case.ts" role="usecase" />
      <useCheckoutUseCaseLegacy path="src/application/use-cases/use-checkout.use-case.ts" role="usecase" />
      <useClubManagementUseCaseLegacy path="src/application/use-cases/use-club-management.use-case.ts" role="usecase" />
      <useDependantDetailsUseCaseLegacy path="src/application/use-cases/use-dependant-details.use-case.ts" role="usecase" />
      <useManageDependantsUseCaseLegacy path="src/application/use-cases/use-manage-dependants.use-case.ts" role="usecase" />
      <useMyFamilyUseCaseLegacy path="src/application/use-cases/use-my-family.use-case.ts" role="usecase" />
      <useRegisterUserUseCaseLegacy path="src/application/use-cases/use-register-user.use-case.ts" role="usecase" />
    </legacyUseCasesGroup>
  </filesToDelete>

  <!-- INTERFACES A MODIFICAR/CRIAR: tag é a identidade -->
  <interfacesToModify>
    <adminGatewayInterface path="src/application/gateways/admin.gateway.ts"
                          desiredContractRef="<AdminGateway>"
                          rationale="Centralizar todas as operações de Admin, garantindo conformidade com o openapi.json." />
    <familyGatewayInterface path="src/application/gateways/family.gateway.ts"
                             desiredContractRef="<FamilyGateway>"
                             rationale="Criar uma porta dedicada para operações de Família e Dependentes." />
    <clubGatewayInterface path="src/application/gateways/club.gateway.ts"
                           desiredContractRef="<ClubGateway>"
                           rationale="Unificar operações relacionadas a clubes que não são de gestão." />
    <clubManagementGatewayInterface path="src/application/gateways/club-management.gateway.ts"
                                   desiredContractRef="<ClubManagementGateway>"
                                   rationale="Criar porta para as operações de gestão do diretor do clube." />
    <checkoutGatewayInterface path="src/application/gateways/checkout.gateway.ts"
                                   desiredContractRef="<CheckoutGateway>"
                                   rationale="Criar porta para o processo de pagamento." />
    <accountGatewayInterface path="src/application/gateways/account.gateway.ts"
                                   desiredContractRef="<AccountGateway>"
                                   rationale="Criar porta para registro e gestão da conta do usuário." />
  </interfacesToModify>

</reference>

__________________________________________________________________________________________

<as-is>
  <contextoArquitetural>
    - O projeto apresenta uma dualidade de padrões para acesso à API. O padrão legado, contido em <folderToDelete>, coexiste com o padrão novo de Gateways.
    - Arquivos como <useAdminManagementUseCaseLegacy> concentram múltiplas responsabilidades: constroem URLs, realizam chamadas `fetch`, manipulam headers e definem múltiplos hooks `useQuery` e `useMutation`.
    - Este acoplamento direto com a infraestrutura HTTP (fetch) dificulta testes, aumenta a duplicação de código (ex: lógica de autorização) e viola o princípio de Inversão de Dependência (DIP).
  </contextoArquitetural>

  <evidencias>
    <acoplamento>
      - <useAdminManagementUseCaseLegacy> contém a URL `process.env.NEXT_PUBLIC_BACKEND_URL` e a implementação de `fetch` com `headers : {'Authorization' : \`Bearer \${accessToken}\`}`. Qualquer alteração na estratégia de autenticação ou no endereço da API exige modificações em múltiplos arquivos legados.
    </acoplamento>

    <duplicacao>
      - A lógica de data fetching e tratamento de erro é replicada em cada função dentro dos arquivos de use case legados.
    </duplicacao>

    <inconsistenciaDeContrato>
      - Os DTOs e os formatos de resposta são definidos ad-hoc dentro dos arquivos de use case, podendo divergir do contrato oficial em <conceptApiContract>.
    </inconsistenciaDeContrato>

    <metricas>
      - Complexidade Ciclomática de arquivos como <useAdminManagementUseCaseLegacy> é alta devido aos múltiplos hooks e funções.
      - Cobertura de testes para a camada de acesso a dados é baixa e complexa de implementar, pois exige mocks do `fetch` global.
    </metricas>
  </evidencias>

  <consequencias>
    - **Alta Manutenção:** Alterações na API causam impacto difuso pelo código.
    - **Baixa Testabilidade:** Testar a lógica dos componentes de UI exige mocks complexos da camada de rede.
    - **Inconsistência:** Desenvolvedores novos ou existentes podem ter dúvidas sobre qual padrão seguir, perpetuando o problema.
  </consequencias>
</as-is>

__________________________________________________________________________________________

<to-be>
### **DECLARAÇÃO DO ESTADO FUTURO DO CÓDIGO**
O estado futuro adere estritamente ao <patternNew>. Toda a comunicação com a API será intermediada por Gateways, que são injetados em Actions consumidas por hooks do React Query. A pasta <folderToDelete> será eliminada.

<moduloAdmin>
  <designPatterns>
    <Gateway />
    <DependencyInjection />
    <PortsAndAdapters />
  </designPatterns>

  <dataContracts>
    <!-- Contratos baseados no openapi.json para as operações de Admin -->
    <AdminGateway>
      <searchUsers signature="(query: SearchUsersQuery) => Promise<PaginatedUsersDto>" />
      <getUserById signature="(userId: string) => Promise<User>" />
      <viewUserFamily signature="(userId: string) => Promise<Family>" />
      <!-- ...outros métodos do admin.gateway.ts -->
    </AdminGateway>
  </dataContracts>

  <!-- Transformações por TAG -->
  <useAdminManagementUseCaseLegacy state="DELETADO">
    <justificativa>
      As responsabilidades serão distribuídas: a lógica de chamada HTTP para uma implementação do <adminGatewayInterface>, a gestão de estado para hooks `useQuery`/`useMutation` específicos, e a orquestração para `actions` dedicadas.
    </justificativa>
    <impactos>
      - Componentes que hoje usam `useAdminListUsers`, `useAdminViewUserFamily`, etc., precisarão ser refatorados para usar os novos hooks (ex: `useSearchUsers`, `useUserFamily`).
    </impactos>
  </useAdminManagementUseCaseLegacy>

  <adminGatewayInterface state="MODIFICADO">
    <responsabilidade>
      Ser a única porta de entrada para todas as operações de back-end relacionadas ao módulo de Administração.
    </responsabilidade>
    <contrato>
      Deve exportar e se conformar com a interface <AdminGateway> e os DTOs definidos em `openapi.json`.
    </contrato>
    <naoDeve>
      Não deve conter nenhuma lógica de negócio ou de UI. Apenas a comunicação com a API.
    </naoDeve>
  </adminGatewayInterface>

  <adminGatewayHttpAdapter state="NOVO">
    <path>src/infrastructure/gateways/admin.gateway.http.ts</path>
    <implements ref="<adminGatewayInterface>" />
    <mapeamentos>
      - Mapear os DTOs da aplicação para os payloads esperados pela API e vice-versa, conforme <conceptApiContract>.
    </mapeamentos>
    <observabilidade>
      - Implementar logging para falhas de comunicação com a API.
    </observabilidade>
  </adminGatewayHttpAdapter>

  <migrationPlan>
    <step order="1">Para cada arquivo em <legacyUseCasesGroup>, identificar os endpoints correspondentes em <conceptApiContract>.</step>
    <step order="2">Garantir que a interface do Gateway correspondente (ex: <adminGatewayInterface>) possui os métodos necessários.</step>
    <step order="3">Implementar os métodos do Gateway na sua versão HTTP (ex: <adminGatewayHttpAdapter>), que conterá a lógica de `fetch`.</step>
    <step order="4">Criar uma `action` para cada operação (ex: `searchUsersAction`).</step>
    <step order="5">Criar um hook `useQuery` ou `useMutation` dedicado para cada action (ex: `useSearchUsers`).</step>
    <step order="6">Refatorar os componentes de UI que consomem o hook legado para usar o novo hook.</step>
    <step order="7">Após todos os hooks de um arquivo de use case legado serem substituídos, deletar o arquivo.</step>
    <step order="8">Repetir o processo para todos os arquivos em <legacyUseCasesGroup>.</step>
  </migrationPlan>

</moduloAdmin>

### **VERIFICAÇÃO FINAL DO ESTADO E CRITÉRIOS DE ACEITAÇÃO**

<finalState>
  A pasta <folderToDelete> não deve existir.
  # Script: test -d src/application/use-cases && exit 1 || exit 0
</finalState>

<finalState>
  Nenhum arquivo no projeto deve conter a string "src/application/use-cases/".
  # Script: git grep "src/application/use-cases/" | wc -l | grep 0
</finalState>

<finalState type="TestCoverage">
  Cobertura de testes unitários para as novas actions e implementações de gateway deve ser ≥ 90%.
</finalState>

<finalState type="CodeReview">
  Aprovação de 2 seniores confirmando a aderência ao <patternNew> e a <projectCodeStandards>.
</finalState>

<finalState type="StaticChecks">
  `pnpm lint` e `pnpm build` devem passar sem erros.
</finalState>
