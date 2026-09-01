# TechSenior — instruções de projeto

## Objetivo

O TechSenior é uma plataforma de inclusão digital para pessoas idosas. Priorize clareza, confiança, leitura confortável e interações previsíveis.

## Tecnologia e arquitetura

- O projeto usa HTML, CSS e JavaScript sem framework, com Firebase Authentication e Cloud Firestore.
- Preserve o padrão de módulos ES para qualquer código que use Firebase.
- Centralize acesso a dados e autenticação em serviços reutilizáveis; evite repetir chamadas Firebase em scripts de páginas.
- Não use `localStorage` como fonte de verdade para sessão, perfil ou progresso quando houver conta autenticada. Use-o apenas como cache ou para preferências antes do login.

## Acessibilidade obrigatória

- Interface em português do Brasil, com linguagem simples e direta.
- Não implemente uma ação relevante somente por cor, hover ou gesto complexo.
- Todo controle deve ter rótulo acessível, foco visível e poder ser usado pelo teclado.
- Teste responsividade, navegação por teclado e contraste após mudanças visuais.
- Para leitura em voz alta, use Web Speech API no navegador; forneça ouvir, pausar/retomar e parar, sem reproduzir automaticamente.
- Respeite `prefers-reduced-motion` e não dependa de animações para transmitir conteúdo.

## Dados e segurança

- O ID do usuário autenticado (`auth.currentUser.uid`) define a propriedade dos dados pessoais.
- Nunca exponha segredos, tokens administrativos ou credenciais de servidor no front-end.
- Toda mudança no Firestore deve vir acompanhada de regras que limitem leitura e escrita ao dono do documento, salvo conteúdo público explicitamente definido.

## Processo de alteração

- Nunca trabalhe diretamente na branch `main`. Antes de alterar código, confirme que há uma branch de funcionalidade atualizada com o remoto; neste projeto, a branch compartilhada inicial é `feat/Victor`.
- Antes de iniciar uma nova alteração, execute `git pull --ff-only` na branch de trabalho. Nunca faça force-push, reset destrutivo ou merge direto na `main` sem autorização explícita.
- Antes de mudar uma funcionalidade, localize todos os scripts e páginas que a utilizam.
- Ao concluir uma alteração de JavaScript, teste o fluxo principal no navegador e reporte o que foi verificado.
- Não introduza bibliotecas de produção sem confirmar a necessidade.
