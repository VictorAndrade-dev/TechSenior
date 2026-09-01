# Plano de desenvolvimento — TechSenior

## Visão do produto

Plataforma de inclusão digital para pessoas idosas, com cursos curtos, linguagem simples, progresso salvo por usuário e recursos de acessibilidade ajustáveis.

## Decisão inicial

Usar Firebase no MVP:

- **Authentication:** cadastro, login, recuperação de senha e sessão.
- **Cloud Firestore:** perfil, preferências de acessibilidade, catálogo de cursos e progresso.
- **Hosting (opcional):** publicação do site após estabilização.

Manter HTML, CSS e JavaScript puro nesta fase. Um framework só deve ser avaliado se a quantidade de telas, estados e componentes tornar a manutenção difícil.

## Modelo de dados proposto

```text
usuarios/{uid}
  nome, email, criadoEm, papel
  preferencias: { tamanhoFonte, tema, modoLeitura }

cursos/{cursoId}
  titulo, descricao, imagem, nivel, publicado, ordem

cursos/{cursoId}/modulos/{moduloId}
  titulo, ordem, conteudo, dica, importante, duracao, quiz

usuarios/{uid}/progresso/{cursoId}
  modulosConcluidos, moduloAtual, percentual, atualizadoEm
```

Em uma fase posterior, a comunidade pode usar coleções separadas para `publicacoes`, `comentarios` e `denuncias`, com moderação.

## Etapas

### 0. Fundação e correções

- Substituir o controle de sessão em `localStorage` pelo estado do Firebase.
- Corrigir CTA de cursos, carregamento do nome do perfil e bloqueio real dos módulos.
- Organizar scripts em responsabilidades: autenticação, cursos, progresso, acessibilidade e interface comum.
- Criar regras iniciais do Firestore e um ambiente Firebase de desenvolvimento.

**Pronto quando:** cadastro, login, logout e perfil funcionarem de forma consistente em qualquer página.

### 1. Persistência de cursos

- Migrar a definição de módulos do JavaScript para Firestore (ou carregá-la por um serviço central).
- Salvar e ler progresso pelo `uid` do usuário.
- Exibir percentual, último módulo e botão “Continuar de onde parei”.
- Proteger a página de aula: visitante não autenticado é direcionado ao login.

**Pronto quando:** o mesmo usuário vê seu progresso ao entrar em outro navegador/dispositivo.

### 2. Acessibilidade essencial

- Unificar aumento/diminuição de fonte e persistir a preferência por usuário.
- Adicionar tema claro/escuro com contraste adequado e opção de alto contraste.
- Implementar modo de leitura: botão visível, largura de texto confortável, menos distrações e destaque do conteúdo.
- Implementar leitura em voz alta com `SpeechSynthesis`: ouvir seleção, pausar/retomar, parar e escolher velocidade.
- Revisar foco de teclado, rótulos, títulos, mensagens de erro e redução de movimento.

**Pronto quando:** uma pessoa consegue ajustar fonte, tema e ouvir um trecho sem criar uma conta nova ou perder a preferência.

### 3. Conteúdo e experiência de aprendizagem

- Criar pelo menos mais um curso completo usando a mesma estrutura de módulos e quiz.
- Permitir refazer quiz, mostrar feedback acessível e liberar módulos conforme regras claras.
- Exibir conclusão de curso e, se fizer sentido para o TCC, certificado simples.

### 4. Comunidade e qualidade

- Definir escopo mínimo da comunidade: publicação, comentário ou canal de ajuda.
- Implementar denúncia, moderação e regras visíveis antes de liberar postagem pública.
- Fazer testes com usuários do público-alvo; registrar dificuldades e iterar.
- Publicar, configurar domínio se necessário e documentar instalação/uso.

## Próxima entrega recomendada

Implementar a **Etapa 0** primeiro. Ela elimina os estados de login inconsistentes e cria a base segura para progresso, tema e modo de leitura.
