# Arquitetura

O WeKamb utiliza npm workspaces. A organização segue a separação entre shell, núcleo, domínio, contrato e UI do Orbital, com implementação de plataforma voltada ao navegador.

```text
apps/web                  Entrada React, Vite, Analytics e adaptador de localStorage
packages/app-core         Aplicação, estado, Kanban, interação e estilos
packages/bridge-contract  Interfaces de persistência e geração de identificadores
packages/shared-domain    Modelos, validação e regras do quadro
packages/shared-ui        Primitivos de interface sem regras de negócio
tooling/config            Configurações compartilhadas de TypeScript, Tailwind e PostCSS
```

## Dependências

```text
web → app-core → bridge-contract → shared-domain
              → shared-domain
              → shared-ui
web → bridge-contract + shared-domain
```

`app-core` recebe um `WekambBridge` por injeção. O navegador implementa esse contrato em `apps/web/src/platform`. O núcleo não importa código de `apps/web` e não acessa o armazenamento diretamente. O domínio não depende de React, DOM ou Node e recebe a geração de identificadores como argumento.

O repositório de armazenamento lê o formato legado e o documento versionado. Erros de acesso, JSON inválido e falta de espaço retornam mensagens para a aplicação. Apenas alterações do quadro acionam uma gravação; abrir dados inválidos não os substitui.

## Interface

`styles/tokens.css` define tipografia, dimensões e movimento. `styles/theme.css` concentra as cores semânticas. Layout e Kanban utilizam esses tokens, mantendo o tema escuro de alto contraste em preto, branco e cinza, a adaptação a telas pequenas e a preferência por movimento reduzido. As fontes são servidas com a aplicação.

## Desenvolvimento

Node.js 20.13.1 ou superior.

```sh
npm ci
npm run dev
```

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

O build é gerado em `dist` na raiz. `npm run preview` serve esse build localmente. Os testes ficam próximos dos respectivos módulos: domínio, persistência Web e navegação do Kanban. O ESLint exige chaves nos blocos e limita importações entre camadas. O Prettier utiliza quatro espaços de indentação.
