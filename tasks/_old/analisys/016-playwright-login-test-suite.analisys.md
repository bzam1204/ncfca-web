<task>
Implementar uma suíte de testes End-to-End (E2E) com Playwright para a página de login (`@src/app/login/page.tsx`), garantindo a cobertura dos fluxos de sucesso, falha e navegação, seguindo as melhores práticas oficiais.
</task>

<reference>

<concepts_and_patterns>
<projectCodeStandards>@.cursor/rules/test.standards.yml</projectCodeStandards>
<conceptApiContract>openapi.json</conceptApiContract>
<patternNew>Playwright E2E Testing com Page Object Model (POM)</patternNew>
<officialDocs ref="CONTEXT7:/microsoft/playwright" topic="getting started" />
</concepts_and_patterns>

  <filesToCreate>
    <playwrightConfig path="playwright.config.ts" role="config" />
    <loginTestSuite path="tests/login.spec.ts" role="test-suite" />
    <loginPageObject path="tests/poms/login.page.ts" role="page-object-model" />
    <githubActionsWorkflow path=".github/workflows/playwright.yml" role="ci-cd" />
  </filesToCreate>

  <filesToModify>
      <packageJson path="package.json" role="dependency-management" />
  </filesToModify>

  <refs>
    <dependsOf src="<loginTestSuite>" on="<loginPageObject>" reason="encapsular seletores e ações da UI" />
    <validates src="<loginTestSuite>" on="@src/app/login/page.tsx" reason="validar o comportamento da página de login" />
  </refs>

</reference>

<as-is>
  <contextoArquitetural>
    - O projeto não possui uma suíte de testes E2E automatizada.
    - O documento <projectCodeStandards> menciona Jest para testes unitários/integração, mas não especifica um framework para E2E.
    - A validação do fluxo de login é um processo manual, lento e suscetível a falhas humanas.
  </contextoArquitetural>

  <evidencias>
    <acoplamento>
      - A ausência de testes E2E acopla a confiança na qualidade do software ao conhecimento tribal e à execução manual.
    </acoplamento>
    <dependencias>
      - A análise de <packageJson> confirma a ausência da dependência `@playwright/test`.
    </dependencias>
    <metricas>
      - Cobertura de teste E2E para o fluxo de login: 0%.
      - Tempo de verificação manual do fluxo: estimado em 5-10 minutos por verificação.
    </metricas>
  </evidencias>

  <consequencias>
    - Alto risco de regressões no fluxo de autenticação a cada nova implantação.
    - Ciclo de feedback lento para desenvolvedores sobre o impacto de suas alterações na UI.
    - Impossibilidade de validar automaticamente a integração ponta-a-ponta com o `next-auth` e a renderização do componente.
  </consequencias>
</as-is>

---

<to-be>
### **DECLARAÇÃO DO ESTADO FUTURO DO CÓDIGO**

<designPatterns>
  <PageObjectModel />
  <ReusableAuthState />
</designPatterns>

<playwrightSetup state="NOVO">
  <justificativa>
    Instalar e configurar o Playwright utilizando o inicializador oficial, que segue as melhores práticas e automatiza a criação de artefatos essenciais.
  </justificativa>
  <impactos>
    - Adição da dependência `@playwright/test` em <packageJson>.
    - Criação automática de <playwrightConfig>, <githubActionsWorkflow> e diretórios de teste.
    - Adição de um script `test:e2e` em <packageJson>.
  </impactos>
  <criteriosAceitacao>
    - O comando `pnpm create playwright` é executado com sucesso.
    - O arquivo `playwright.config.ts` é criado e configurado para usar o servidor de desenvolvimento.
    - O workflow <githubActionsWorkflow> é criado.
  </criteriosAceitacao>
</playwrightSetup>

<playwrightConfig state="MODIFICADO">
    <path>playwright.config.ts</path>
    <responsabilidade>Configurar o ambiente de teste do Playwright.</responsabilidade>
    <transformacao>
        Adicionar a configuração `webServer` para iniciar automaticamente o servidor de desenvolvimento (`pnpm dev`) antes da execução dos testes, garantindo um ambiente consistente.
    </transformacao>
    <criteriosAceitacao>
        - A propriedade `webServer` está configurada com o comando `pnpm dev` e a URL correta (`http://localhost:3000`).
    </criteriosAceitacao>
</playwrightConfig>

<loginPageObject state="NOVO">
  <path>tests/poms/login.page.ts</path>
  <responsabilidade>
    Encapsular todos os seletores e interações da página de login. Isso desacopla os testes dos detalhes de implementação da UI.
  </responsabilidade>
  <contrato>
    - `emailInput`: seletor para o campo de email.
    - `passwordInput`: seletor para o campo de senha.
    - `submitButton`: seletor para o botão de login.
    - `goto()`: método para navegar até a página de login.
    - `login(email, password)`: método para preencher o formulário e submetê-lo.
  </contrato>
  <naoDeve>
    - Conter asserções (`expect`). A responsabilidade de validação é da suíte de testes.
  </naoDeve>
</loginPageObject>

<loginTestSuite state="NOVO">
  <path>tests/login.spec.ts</path>
  <implements ref="<projectCodeStandards>" />
  <responsabilidade>
    Orquestrar os casos de teste para o fluxo de login, utilizando o <loginPageObject> para interagir com a página.
  </responsabilidade>
  <testCases>
    - `(E2E) Login`:
      - `it('Deve realizar o login com sucesso com credenciais válidas e redirecionar para o dashboard')`
      - `it('Não deve realizar o login com senha incorreta')`
      - `it('Não deve realizar o login com um email não cadastrado')`
      - `it('Deve exibir uma notificação de erro para credenciais inválidas')`
      - `it('Deve desabilitar o botão de login durante a submissão')`
      - `it('Deve navegar para a página de registro ao clicar no link "Registre-se"')`
  </testCases>
  <criteriosAceitacao>
    - Todos os casos de teste passam com sucesso.
    - As nomeclaturas de `describe` e `it` seguem o padrão de <projectCodeStandards>.
    - O padrão Arrange-Act-Assert é seguido em todos os testes.
  </criteriosAceitacao>
</loginTestSuite>

<implementationPlan>
  <step order="1">Executar o inicializador oficial do Playwright: `pnpm create playwright`.</step>
  <step order="2">Durante a instalação, confirmar a criação do workflow de GitHub Actions.</step>
  <step order="3">Modificar o arquivo <playwrightConfig> para adicionar a configuração `webServer`, apontando para o comando `pnpm dev`.</step>
  <step order="4">Criar a estrutura de pastas `tests/poms` para os Page Object Models.</step>
  <step order="5">Implementar o Page Object Model em <loginPageObject>.</step>
  <step order="6">Implementar a suíte de testes em <loginTestSuite> com os casos de teste definidos, movendo ou adaptando o arquivo de exemplo criado pelo inicializador.</step>
  <step order="7">Executar a suíte de testes (`npx playwright test`) e garantir que todos os testes passem.</step>
</implementationPlan>

</to-be>

---

### **VERIFICAÇÃO FINAL DO ESTADO E CRITÉRIOS DE ACEITAÇÃO**

<finalState>
  O comando `npx playwright test` deve executar a suíte de testes de login sem erros.
  # Script: npx playwright test
</finalState>

<finalState type="TestCoverage">
  Os fluxos de sucesso, falha e navegação da página de login estão cobertos por testes E2E.
</finalState>

<finalState type="CI">
  O workflow <githubActionsWorkflow> é acionado em pull requests e executa os testes com sucesso.
</finalState>

<finalState type="CodeReview">
  A implementação do POM e da suíte de testes é revisada e aprovada, com foco na clareza, manutenibilidade e aderência aos padrões definidos.
</finalState>

<finalState type="StaticChecks">
  O comando `pnpm lint` deve passar sem erros nos novos arquivos de teste.
</finalState>
