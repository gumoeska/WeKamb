# WeKamb

O WeKamb é um quadro Kanban para organizar tarefas em colunas, no computador ou celular.

Crie colunas, adicione tarefas e arraste os cartões para reorganizá-los. No celular, toque e segure para mover. Pelo teclado, use Tab para focar um cartão, espaço para selecionar e soltar, as setas para mover e Escape para cancelar. O botão **Adicionar exemplo** preenche o quadro com tarefas demonstrativas.

## Dados e privacidade

- As tarefas ficam no `localStorage` do navegador, sem backend, conta ou sincronização entre dispositivos.
- O app lê os dados do formato antigo (`cards` e `columns`). Ao modificar o quadro, salva um documento versionado em `wekamb:board:v1`, mantendo as chaves antigas intactas.
- Dados ilegíveis não são sobrescritos ao abrir o app. Nesse caso, uma mensagem informa a falha e novas alterações tentam salvar um novo quadro.
- Se o navegador bloquear o armazenamento ou esgotar a cota, o app informa que as alterações estão apenas na sessão atual.
- O botão **Adicionar exemplo** adiciona tarefas demonstrativas sem apagar as existentes.
- A exclusão de uma coluna remove também suas tarefas. Limpar os dados do site remove o quadro salvo.
- O projeto inclui Vercel Web Analytics em `apps/web/src/main.tsx`. O código não envia o conteúdo das tarefas em eventos personalizados.
