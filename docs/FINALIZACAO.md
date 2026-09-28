# Finalização funcional e visual — TechSênior

Implementação local em feat/Victor, em 27/09/2026. Sem commit, staging, push, migração ou deploy. O status inicial estava limpo e o pull --ff-only confirmou a branch atualizada. A tipografia Poppins existente foi preservada.

## 1. Arquivos alterados
- Admin.html
- AdminModulo.html
- AdminModulos.html
- AdminQuizCurso.html
- Cadastro.html
- ContatoSuporte.html
- Curso.html
- Cursos.html
- Declaração de Acessibilidade.html
- EditarPerfil.html
- EsqueciSenha.html
- Estilos - CSS/Admin.css
- Estilos - CSS/ContatoSuporte.css
- Estilos - CSS/Curso.css
- Estilos - CSS/Curso.css
- Estilos - CSS/Cursos.css
- Estilos - CSS/EditarPerfil.css
- Estilos - CSS/EsqueciSenha.css
- Estilos - CSS/Início.css
- Estilos - CSS/Padrão.css
- Estilos - CSS/Perfil.css
- Estilos - CSS/RedefinirSenha.css
- Estilos - CSS/SobreNós.css
- Estilos - CSS/TesteFinal.css
- Login.html
- Perfil.html
- Política de Privacidade.html
- RedefinirSenha.html
- Regras da Comunidade.html
- Script - Java/Admin.js
- Script - Java/Cadastro.js
- Script - Java/ContatoSuporte.js
- Script - Java/Curso.js
- Script - Java/Cursos.js
- Script - Java/Início.js
- Script - Java/Padrão.js
- Script - Java/Perfil.js
- Script - Java/RedefinirSenha.js
- Script - Java/ServicoProgresso.js
- Script - Java/TesteFinal.js
- Sobre Nós.html
- Termos de Uso.html
- TesteFinal.html
- dataconnect-generated/README.md
- dataconnect-generated/esm/index.esm.js
- dataconnect-generated/index.cjs.js
- dataconnect-generated/index.d.ts
- dataconnect/example/usuarios.gql
- dataconnect/schema/schema.gql
- firestore.rules
- index.html

## 2. Arquivos criados
- Script - Java/Acessibilidade.js
- Script - Java/AdminSuporte.js
- Script - Java/CalendarioEstudos.js
- Script - Java/ServicoAtividade.js
- Script - Java/ServicoConta.js
- Script - Java/ServicoSuporte.js
- Script - Java/ValidacaoSenha.js
- dataconnect/example/suporte.gql
- tests/verificar-finalizacao.mjs
- docs/FINALIZACAO.md (este relatório)

## 3. Arquivos excluídos
- CursoCelular.html
- CursoCompra.html
- Script - Java/CursoCelular.js
- Script - Java/CursoCompra.js

Busca recursiva em HTML, JS, CSS e documentação confirmou que as referências funcionais eram somente entre cada página legada e seu script. Uma menção histórica em comentário foi atualizada. CursoCompra ainda apontava para AulaCelular2.html inexistente. Assets e CSS compartilhados foram preservados.

## 4. Data Connect
- Tabela SolicitacaoSuporte com usuário, assunto, mensagem, status e horários.
- CriarSolicitacaoSuporte resolve o proprietário por auth.uid, valida tamanho no servidor e fixa status Nova.
- ListarSolicitacoesSuporte e AtualizarStatusSuporte verificam existência do perfil e tipoUsuario.nome Administrador. Status limitado a Nova, Em atendimento e Resolvida.
- ExcluirMinhaConta não recebe uid nem e-mail; apaga Certificado, UsuarioModulo, UsuarioCurso, SolicitacaoSuporte e Usuario em transação, filtrando tudo por auth.uid.
- ExcluirUsuarioPorEmail permanece NO_ACCESS e não é usada pelo frontend.
- SDK regenerado pela CLI Firebase, sem edição manual dos arquivos gerados. Geração final concluída com sucesso.
- A proteção segue os padrões documentados em https://firebase.google.com/docs/sql-connect/authorization-and-security e https://firebase.google.com/docs/sql-connect/mutations-guide.

## 5. Firestore e regras
- Atividade em usuarios/{uid}/atividade/{YYYY-MM-DD}, usando data local e serverTimestamp.
- Primeiro acesso preservado em transação; novos estudos atualizam o documento do dia.
- Registro ao abrir módulo, salvar progresso e concluir teste final. A Home não registra estudo.
- Regras de atividade restritas ao dono, com validação dos campos e horário; regras existentes de progresso preservadas.
- Posição inicial salva sem substituir conclusões feitas em outra aba.
- Exclusão percorre progresso e atividade em lotes de até 400 documentos e remove a raiz.

## 6. Perfil e dashboard
- Mantidos identidade, avatar Google/iniciais, cursos e progresso reais.
- Cursos iniciados incluem curso aberto ainda sem módulo concluído.
- Frequência dos últimos sete dias, dias ativos, sequência e última atividade com Continuar.
- Sequência considera hoje ou ontem; atividade anterior a ontem resulta em zero. Nenhum histórico foi inventado.
- Ausência de dados e falhas têm mensagens específicas.

## 7–10. Acessibilidade, tema, voz e navegação
- Escalas 90%, 100%, 110%, 120%; removidas regras antigas de 80% e 130%.
- Claro como padrão, Escuro opcional; fonte, tema e velocidade persistidos em localStorage somente como preferências.
- Cores compartilhadas em Padrão.css e variáveis locais de Curso/Perfil/Admin; correções de superfícies fixas e contraste.
- Web Speech API com Ouvir, Pausar/Continuar, Parar, velocidades 0.8x/1x/1.2x e leitura em trechos.
- Somente texto visível de main ou conteúdo atual da aula; ignora navegação, formulários, elementos ocultos e controles decorativos. Não inicia automaticamente.
- Cancela ao sair, ocultar a página, trocar módulo ou pergunta. Não muda a lógica de pontuação.
- Drawer até 1000px, largura 85% limitada, rolagem própria, overlay, Escape, retorno e contenção do foco, aria-expanded e controles integrados.
- Desktop mantém painel flutuante. Telas de autenticação sem drawer mantêm painel acessível.
- Administração aparece na navegação somente para papel Administrador. Validações administrativas existentes mantidas.
- Links institucionais preservados; Instagram com noopener noreferrer. Links para Comunidade.html substituídos por suporte.

## 11. Home
- Consulta listarCursos: quantidade real e até três cursos publicados.
- Cards com texto seguro, ícone/imagem quando disponível e destino dinâmico.
- Removidos números e depoimentos fictícios. Seção de benefícios descreve recursos reais.
- Navegador carregou um curso publicado: Utilizando o Celular.

## 12. Suporte
- Removido setTimeout de envio simulado.
- Exige autenticação; identidade não é selecionada pelo navegador.
- Confirma sucesso somente após resolução da mutation. Erros mantêm o texto para nova tentativa.
- Admin tem seção de solicitações com usuário, e-mail, assunto, mensagem, data, status e atualização explícita.
- Não há fórum, chat ou resposta pelo site.

## 13. Exclusão de conta
- Zona de perigo e dialog de confirmação permanente, com foco inicial em Cancelar.
- Email/senha reautentica com EmailAuthProvider; Google-only usa popup e não solicita senha local.
- Reautenticação acontece antes da primeira exclusão; Auth é removido após os dados.
- Sem transação entre os três produtos: falhas parciais são informadas e a operação pode ser repetida para concluir. A transação SQL é atômica.
- Sucesso encerra sessão e redireciona à Home. Não executei exclusão de conta real.

## 14. Política de senha e recuperação
- Validação compartilhada: 10–32 caracteres, maiúscula, minúscula, número, símbolo, nenhum espaço e confirmação igual.
- Checklist, força textual, confirmação ao digitar, aria-live, autocomplete e restrições nativas.
- Login não recebe essa política.
- sendPasswordResetEmail, verifyPasswordResetCode e confirmPasswordReset preservados.
- Perfil Google-only não oferece alteração de senha local.

## 15. Bugs corrigidos
- IDs duplicados dos modais de cursos.
- Nome de usuário interpolado em innerHTML na navegação.
- Textos e ícones de cursos do Admin e títulos de módulos escapados onde havia interpolação HTML.
- Padrão.js assumia elementos ausentes; agora possui guardas.
- Importmaps adicionados onde o módulo compartilhado passou a depender do SDK.
- Acessibilidade era escondida no TesteFinal por CSS legado.
- Cards da Home estreitos no celular; passaram a uma coluna.
- Modal de curso ganha rótulo, contenção/retorno de foco e limite de altura.

## 16. Limitações e fases dependentes de validação externa
O código das fases foi preparado; não equivale a validação integral em produção.
- Fases 3, 4, 5 e 9: faltam aplicar schema/connector/regras e testar gravações autenticadas. Não havia conta de teste fornecida e produção não pode ser publicada automaticamente.
- Fases 6, 7 e 12: telas públicas testadas no navegador; Perfil, EditarPerfil, Curso, TesteFinal e Admin tiveram CSS/código revisados e bloqueio sem login verificado, mas layout/conteúdo autenticado ainda requer teste com conta real.
- Fase 10: redefinição por link inválido testada; entrega de e-mail e código válido dependem do Firebase Console e caixa de e-mail.
- Criação real de conta, login Google, aprovação/reprovação/retry, persistência real de atividade, administração do suporte e exclusão não foram exercitados em produção.
- Estados da voz foram verificados; qualidade audível e disponibilidade de vozes variam por navegador/dispositivo.
- Não foi feita certificação WCAG nem alegação de acessibilidade total.

## 17. Configurações externas necessárias
Após revisão manual, em ambiente/projeto confirmado:

```powershell
firebase.cmd dataconnect:sql:diff --service tech-senior-service
firebase.cmd dataconnect:sql:migrate --service tech-senior-service --location southamerica-east1
firebase.cmd deploy --only dataconnect
firebase.cmd deploy --only firestore:rules
```

A migração e os deploys acima NÃO foram executados. Confira o diff SQL e os prompts da CLI antes de aplicar. Neste ambiente a CLI foi chamada por npx --yes --package firebase-tools firebase; pode substituir firebase.cmd por esse prefixo.

No Firebase Console: Authentication → Templates → Password reset → personalizar URL de ação para a URL HTTPS final de RedefinirSenha.html. Validar domínios autorizados e o retorno mode=resetPassword&oobCode=... de um e-mail real. Uma continue URL sozinha não substitui o handler do e-mail. Se desejar imposição da política também no servidor, configurar os requisitos compatíveis na política de senha do Firebase; a restrição sem espaços e confirmação permanece no cliente.

## 18. Testes executados
- node tests/verificar-finalizacao.mjs: aprovado; limites/requisitos da senha, Unicode, data local, virada de ano, hoje/ontem, lacuna, janela de sete dias, duplicados diários, IDs HTML, links locais, importmaps e sintaxe de todos os scripts.
- Data Connect: geração do SDK aprovada pela CLI após correção das validações.
- Navegador real local: Home e catálogo consultando banco; modal único e Escape/retorno de foco; cadastro inválido/válido e confirmação; reset inválido; suporte deslogado bloqueado; ausência de Administração para visitante.
- 56 combinações de telas públicas (Home, Cursos, Login, Cadastro, EsqueciSenha, RedefinirSenha, ContatoSuporte) × larguras 390/768/1000/1440 × fontes 100/120: sem overflow horizontal nas medições. Temas claro e escuro percorridos.
- Drawer em celular/tablet: abertura, X, clique no overlay fora do painel, Escape, contenção de foco por Shift+Tab; fonte 90/100/110/120 e persistência após reload.
- Ouvir → Pausar → Continuar → Parar verificou os estados correspondentes.
- Perfil, EditarPerfil, Admin, Curso e TesteFinal redirecionaram visitantes para Login.
- Sem erros de console nas verificações públicas finais.
- Node emite aviso informativo sobre detecção automática de módulos ES; testes terminam com código 0.

## 19. Git
- git status --short e git diff --stat executados antes e depois.
- git diff --check -- . ':(exclude)dataconnect-generated/**': código 0, sem erros de whitespace.
- Avisos LF/CRLF são informativos. Nenhum arquivo foi adicionado ao staging; sem commit/push/deploy.

## 20. Checklist manual curto
1. Aplicar schema, connector e regras em ambiente revisado; testar suporte com usuário comum e administrador, incluindo negativas de permissão.
2. Criar conta válida, entrar por senha e Google; recuperar senha por e-mail real.
3. Estudar módulos/quiz, concluir e refazer teste final; confirmar progresso, frequência e última atividade após reload e em outro dispositivo.
4. Revisar telas autenticadas em 390/768/1000/desktop, claro/escuro e fonte 120%; ouvir pergunta/alternativas sem conteúdo oculto.
5. Com contas descartáveis, testar exclusão por senha/Google, senha incorreta, cancelamento, falha parcial e nova tentativa; confirmar remoção nos três serviços.
