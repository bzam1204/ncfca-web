# TEMPLATE DE ESPECIFICAÇÃO DE REFATORAÇÃO DECLARATIVA
# VERSÃO: FRAMEWORK v3.0 (modo TAG-PRIMEIRO)
# DATA: 20 de agosto de 2025
#
# FILOSOFIA (TAG > name):
# Preferimos <TagEspecífica> em vez de <tipo name="tag-específica">.
#   - DTOs e contratos podem manter <property name=".." type=".."> (faz sentido técnico).
#   - Para o restante, a PRÓPRIA TAG É O ID. Referencie a tag pelo nome.
# Benefício: semântica forte, rastreabilidade e refactors simples (busca por tag).

<task>
Padronizar o acesso à API em um único fluxo hook → action (server) → gateway (interface) → container (Inject) → real gateway (API), eliminando fetch direto e divergências com o contrato OpenAPI.
</task>

__________________________________________________________________________________________

<reference>

  <concepts_and_patterns>
    <projectCodeStandards>code.standards.yml</projectCodeStandards>

    <conceptApiContract>openapi.json</conceptApiContract>
    <patternOld>Hooks com fetch direto, Use-Cases legados e Queries paralelas</patternOld>
    <patternNew>Gateways + Actions + Hooks (Ports & Adapters)</patternNew>
    <folderToDelete>src/infraestructure/queries/</folderToDelete>
  </concepts_and_patterns>

  <filesToDelete>
    <clientFetchHooksGroup purpose="remover fetch direto do cliente">
      <adminClubMembersHook path="src/hooks/use-admin-club-members.ts" role="hook" />
      <adminClubRequestsHook path="src/hooks/use-admin-club-requests.ts" role="hook" />
      <adminClubEnrollmentsHook path="src/hooks/use-admin-club-enrollments.ts" role="hook" />
      <adminClubChartsHook path="src/hooks/use-admin-club-charts.ts" role="hook" />
    </clientFetchHooksGroup>

    <queriesLegacyGroup purpose="remover camada paralela de queries (duplicidade de gateways)">
      <clubQueryApi path="src/infraestructure/queries/club.query.api.ts" role="query" />
      <dependantQueryApi path="src/infraestructure/queries/dependant.query.api.ts" role="query" />
      <queryService path="src/infraestructure/services/query.service.api.ts" role="service" />
    </queriesLegacyGroup>
    <!-- Observação: use-cases permanecem deprecados, mas NÃO serão removidos nesta análise -->
  </filesToDelete>

  <interfacesToModify>
    <adminGatewayInterface path="src/application/gateways/admin.gateway.ts"
                           desiredContractRef="<AdminGateway>"
                           rationale="alinhar todas rotas Admin do OpenAPI em uma única porta" />
    <clubGatewayInterface path="src/application/gateways/club.gateway.ts"
                          desiredContractRef="<ClubGateway>"
                          rationale="concentrar operações do diretor (club-management) e busca de clubes" />
    <familyGatewayInterface path="src/application/gateways/family.gateway.ts"
                            desiredContractRef="<FamilyGateway>"
                            rationale="expor operações de família (meus dependentes/família)" />
  </interfacesToModify>

  <refs>
    <dependsOf src="<adminClubMembersHook>" on="<clientFetchHooksGroup>" reason="token no cliente e fetch direto" />
    <willDependOf src="<adminClubMembersHook>" on="<adminGatewayInterface>" when="pós-refatoração" />

    <dependsOf src="<adminClubRequestsHook>" on="<clientFetchHooksGroup>" reason="fetch direto sem gateway" />
    <willDependOf src="<adminClubRequestsHook>" on="<adminGatewayInterface>" when="pós-refatoração" />

    <dependsOf src="<adminClubChartsHook>" on="<clientFetchHooksGroup>" reason="rota charts fora de gateway" />
    <willDependOf src="<adminClubChartsHook>" on="<adminGatewayInterface>" when="pós-refatoração" />

    <dependsOf src="<adminClubEnrollmentsHook>" on="<clientFetchHooksGroup>" reason="aprovar/rejeitar direto via fetch" />
    <willDependOf src="<adminClubEnrollmentsHook>" on="<adminGatewayInterface>" when="pós-refatoração" />

    <dependsOf src="<searchClubsHook>" on="<clubGatewayInterface>" reason="padrão correto já aplicado (via action)" />
  </refs>

</reference>

__________________________________________________________________________________________

<as-is>
  <contextoArquitetural>
    - <clientFetchHooksGroup> contém hooks que leem token com useSession e fazem fetch no cliente.
    - <queriesLegacyGroup> duplica responsabilidades já cobertas por <clubGatewayInterface>.
    - Parte das páginas server usa fetch direto a endpoints admin, fora de <adminGatewayInterface>.
    - <applicationUseCasesLegacy> (pasta: src/application/use-cases/) agrega fetch/negócio no cliente; está deprecada, ainda consumida por algumas telas.
  </contextoArquitetural>

  <evidencias>
    <acoplamento>
      - <adminClubMembersHook> → fetch direto para /admin/clubs/{clubId}/members.
      - <adminClubRequestsHook> → fetch direto para /admin/clubs/{clubId}/enrollments/pending.
      - <adminClubEnrollmentsHook> → aprova/rejeita via fetch para /admin/clubs/{clubId}/enrollments/{id}.
      - <adminClubChartsHook> → fetch direto para /admin/clubs/{clubId}/charts.
      - Páginas: users/[userId]/page.tsx e affiliations/page.tsx fazem fetch direto a rotas Admin.
    </acoplamento>

    <duplicacao>
      - Busca de clubes em <clubQueryApi> e em <clubGatewayInterface> (dois caminhos para mesma rota /club).
      - Tratamento de erro HTTP duplicado em múltiplos hooks e páginas.
    </duplicacao>

    <inconsistenciaDeContrato>
      - <conceptApiContract> expõe rotas admin (members, charts, enrollments) ainda não mapeadas por <adminGatewayInterface>.
      - Hooks chamam diretamente essas rotas, quebrando o padrão gateway.
    </inconsistenciaDeContrato>

    <metricas>
      - Hooks com fetch direto: 4 (<clientFetchHooksGroup>).
      - Páginas server com fetch direto Admin: 2.
      - Módulos legacy (use-cases) presentes: ≥ 10 arquivos.
    </metricas>
  </evidencias>

  <consequencias>
    - Token e política de autenticação tratados no cliente (risco e acoplamento).
    - Cache/invalidations inconsistentes (React Query keys ad-hoc vs <QueryKeys> e tags Next).
    - Evolução de contrato OpenAPI exige alterações difusas e pouco testáveis.
  </consequencias>
</as-is>

__________________________________________________________________________________________

<to-be>
### **DECLARAÇÃO DO ESTADO FUTURO DO CÓDIGO**

<apiLayerStandardization>

  <designPatterns>
    <Gateway />
    <ActionsServerOnly />
    <PortsAndAdapters />
    <DependencyInjection />
  </designPatterns>

  <dataContracts>
    <AdminGateway>
      <getAffiliations signature="() => Promise<Family[]>" />
      <getClubs signature="() => Promise<Club[]>" />
      <getEnrollments signature="() => Promise<EnrollmentRequest[]>" />
      <getUsers signature="() => Promise<User[]>" />
      <getUserById signature="(userId: string) => Promise<User>" />
      <searchUsers signature="(query: SearchUsersQuery) => Promise<PaginatedUsersDto>" />
      <changeClubPrincipal signature="(clubId: string, dto: ChangePrincipalDto) => Promise<void>" />
      <updateClub signature="(clubId: string, payload: UpdateClubByAdminDto) => Promise<Club>" />
      <getClubMembers signature="(clubId: string) => Promise<ClubMemberDto[]>" />
      <getClubPendingEnrollments signature="(clubId: string) => Promise<PendingEnrollmentDto[]>" />
      <approveClubEnrollment signature="(clubId: string, enrollmentId: string) => Promise<void>" />
      <rejectClubEnrollment signature="(clubId: string, enrollmentId: string, dto: RejectEnrollmentDto) => Promise<void>" />
      <getClubCharts signature="(clubId: string) => Promise<ClubChartsDto>" />
      <getUserFamily signature="(userId: string) => Promise<FamilyResponseDto>" />
    </AdminGateway>

    <ClubGateway>
      <myClub signature="() => Promise<Club>" />
      <search signature="(query: SearchClubsQuery) => Promise<PaginatedClubDto>" />
      <getById signature="(clubId: string) => Promise<Club>" />
      <updateMyClub signature="(payload: UpdateClubDto) => Promise<Club>" />
      <getPendingEnrollments signature="(clubId: string) => Promise<PendingEnrollmentDto[]>" />
      <getEnrollmentHistory signature="() => Promise<EnrollmentRequestDto[]>" />
      <getClubMembers signature="() => Promise<ClubMemberDto[]>" />
      <approveEnrollment signature="(enrollmentId: string) => Promise<void>" />
      <rejectEnrollment signature="(enrollmentId: string, dto: RejectEnrollmentDto) => Promise<void>" />
      <revokeMembership signature="(membershipId: string) => Promise<void>" />
    </ClubGateway>

    <FamilyGateway>
      <getMyDependants signature="() => Promise<Dependant[]>" />
      <getMyFamily signature="() => Promise<FamilyResponseDto | null>" />
    </FamilyGateway>
  </dataContracts>

  <clientFetchHooksGroup state="DELETADO">
    <justificativa>
      Centralizar rede/autenticação em Actions + Gateways; evitar token no cliente e padronizar cache/erros.
    </justificativa>
    <impactos>
      - Substituir por hooks finos que chamam Actions (server).
      - Adotar <QueryKeys> para todas as chaves e invalidações.
    </impactos>
    <rollback>
      - Manter hooks antigos por um release atrás de feature flag (enable_client_fetch_hooks=false).
    </rollback>
  </clientFetchHooksGroup>

  <queriesLegacyGroup state="DELETADO">
    <justificativa>
      Evitar duplicidade com <ClubGateway.search>; uma única porta por domínio.
    </justificativa>
    <impactos>
      - Remover <QueryService> e imports relacionados.
      - Unificar fonte da verdade em <ClubGateway>.
    </impactos>
    <rollback>
      - Commit hash de referência e script de restauração.
    </rollback>
  </queriesLegacyGroup>

  <useCasesLegacyGroup state="MANTIDO">
    <justificativa>
      Alinhado à diretriz: não abordar abandono total de use-cases nesta análise; não criar novos.
    </justificativa>
    <impactos>
      - Consumidores novos devem usar apenas Gateways via Actions.
      - Planejar migração gradual fora do escopo imediato.
    </impactos>
  </useCasesLegacyGroup>

  <migrationPlan>
    <step order="1">Estender <adminGatewayInterface>, <clubGatewayInterface>, <familyGatewayInterface> com métodos faltantes do OpenAPI.</step>
    <step order="2">Criar/ajustar Actions server-side para cada método (auth() → Inject → gateway).</step>
    <step order="3">Refatorar hooks do grupo <clientFetchHooksGroup> para usar Actions + <QueryKeys>.</step>
    <step order="4">Refatorar páginas server que usam fetch direto para gateways/actions.</step>
    <step order="5">Remover <queriesLegacyGroup> e validar rotas de busca e família.</step>
    <step order="6">Documentar padrão e proibir novos use-cases (lint/regra de revisão).</step>
  </migrationPlan>

  <riscosERollback>
    - Risco: divergência com <conceptApiContract>. Mitigar com testes de contrato por método de gateway.
    - Risco: regressão de invalidação de cache. Mitigar com tabela de <QueryKeys> e <NextKeys> por rota e testes e2e.
    - Risco: mudanças amplas em hooks consumidores. Mitigar com feature flags por tela.
  </riscosERollback>

</apiLayerStandardization>

### EXPRESSE-SE (DECLARATIVIDADE)

<security>
  - Token apenas em Actions/Server Components; zero leitura de token no cliente.
</security>

<observabilidade>
  - Logging padronizado de falhas 4xx/5xx nos gateways (mensagem do body).
  - Métricas por rota crítica (aprovar/rejeitar, update club) com latência p50/p95.
</observabilidade>

<nonGoals>
  - Remover completamente use-cases legados nesta fase (apenas deprecar e não criar novos).
</nonGoals>

### **VERIFICAÇÃO FINAL DO ESTADO E CRITÉRIOS DE ACEITAÇÃO**

<finalState>
  Nenhum hook cliente deve conter "fetch(" nem "useSession(" para obter token.
  # Script: rg -n "src/hooks/.*(fetch\(|useSession\()" → saída vazia
</finalState>

<finalState>
  Nenhum arquivo deve importar de <queriesLegacyGroup> (queries/service).
  # Script: rg -n "src/infraestructure/queries/|src/infraestructure/services/query.service.api" → saída vazia
</finalState>

<finalState type="ContractMapping">
  Todas as rotas usadas do <conceptApiContract> mapeadas em métodos de gateways correspondentes.
</finalState>

<finalState type="CacheConsistency">
  Todas as mutações invalidam chaves de <QueryKeys> e/ou tags de <NextKeys> de forma documentada.
</finalState>

<finalState type="CodeReview">
  ≥ 2 revisões confirmando aderência ao padrão Hook→Action→Gateway e eliminação de fetch direto.
</finalState>

