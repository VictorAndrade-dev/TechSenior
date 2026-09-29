import { escapeHtml } from "./AdminComum.js";
import { registrarAtividade } from "./ServicoAtividade.js";
import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  carregarProgressoCurso,
  salvarProgressoCurso,
  salvarPosicaoCurso,
} from "./ServicoProgresso.js";

import {
  listarCursos,
  listarModulosDoCurso,
  listarConteudosDoModulo,
  buscarQuizDoModulo,
  buscarQuizFinalDoCursoAluno,
  listarQuestoesDoQuiz,
  listarAlternativasDaQuestao,
} from "../dataconnect-generated/esm/index.esm.js";

// ==========================================
// CONFIGURAÇÕES DO CURSO
// ==========================================

const parametros =
  new URLSearchParams(
    window.location.search
  );

const cursoId =
  parametros.get("id");

const uuid =
  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

const cursoIdValido =
  uuid.test(cursoId || "");

let cursoAtual = null;
let modulos = [];
let moduloAtual = 0;
let modulosConcluidos = [];

let questoesQuiz = [];
let indiceQuestaoQuiz = 0;
let quizModuloConcluido = false;
let moduloPossuiQuiz = false;

let alternativaSelecionadaQuiz = null;
let botaoAlternativaSelecionadaQuiz = null;
let alternativasErradasTentadas = new Set();





// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const quizModulo =
  document.getElementById("quizModulo");

const estadoCarregamentoCurso =
  document.getElementById("estadoCarregamentoCurso");

const cursoLayout =
  document.getElementById("cursoLayout");

const quizPergunta =
  document.getElementById("quizPergunta");

const quizIdentificacao =
  document.getElementById(
    "quizIdentificacao"
  );

const btnProximaQuestao =
  document.getElementById(
    "btnProximaQuestao"
  );

const quizAlternativas =
  document.getElementById("quizAlternativas");

const quizFeedback =
  document.getElementById("quizFeedback");

const modulosContainer =
  document.getElementById("modulosContainer");

const porcentagemProgresso =
  document.getElementById("porcentagemProgresso");

const progressoPreenchido =
  document.getElementById("progressoPreenchido");

const textoProgresso =
  document.getElementById("textoProgresso");

const identificacaoModulo =
  document.getElementById("identificacaoModulo");

const tituloAula =
  document.getElementById("tituloAula");

const descricaoAula =
  document.getElementById("descricaoAula");

const conteudoPrincipal =
  document.getElementById("conteudoPrincipal");

const dicaAula =
  document.getElementById("dicaAula");

const textoDica =
  document.getElementById("textoDica");

const sobreModulo =
  document.getElementById("sobreModulo");

const dicaImportante =
  document.getElementById("dicaImportante");

const atencaoModulo =
  document.getElementById("atencaoModulo");

const voceSabia =
  document.getElementById("voceSabia");

const lembreteModulo =
  document.getElementById("lembreteModulo");

const btnAulaAnterior =
  document.getElementById("btnAulaAnterior");

const btnProximaAula =
  document.getElementById("btnProximaAula");

const nomeAulaAnterior =
  document.getElementById("nomeAulaAnterior");

const nomeProximaAula =
  document.getElementById("nomeProximaAula");

const testeFinalChamada =
  document.getElementById(
    "testeFinalChamada"
  );

const btnIniciarTesteFinal =
  document.getElementById(
    "btnIniciarTesteFinal"
  );

// ==========================================
// INICIALIZAÇÃO
// ==========================================

if (!cursoIdValido) {

  alert("Curso não informado ou inválido.");

  window.location.href =
    "Cursos.html";

}

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {

    window.location.href = "Login.html";

    return;
  }

  try {

    await inicializarCurso(usuario);

    ocultarCarregamentoCurso();

  } catch (erro) {

    ocultarCarregamentoCurso();

    console.error(
      "Erro ao carregar o curso:",
      erro
    );

    mostrarErroCurso();

  }

});

function ocultarCarregamentoCurso() {
  estadoCarregamentoCurso.hidden = true;
  cursoLayout.hidden = false;
  cursoLayout.setAttribute("aria-busy", "false");
}


// ==========================================
// INICIALIZAR CURSO
// ==========================================

async function inicializarCurso(usuario) {

  await carregarCurso();

  if (!cursoAtual) {
    return;
  }

  await carregarModulos();

  if (modulos.length === 0) {
    mostrarMensagemSemModulos();
    return;
  }

  const progresso =
    await carregarProgressoCurso(
      usuario.uid,
      cursoId,
      modulos.length
    );

  moduloAtual =
    progresso.moduloAtual;

  modulosConcluidos =
    progresso.modulosConcluidos;

  atualizarProgresso();
  renderizarModulos();

  await carregarModulo(
    moduloAtual
  );

  await verificarTesteFinalDisponivel();

}

async function carregarCurso() {

  const resultado =
    await listarCursos();

  const cursos =
    resultado.data?.cursos || [];

  cursoAtual =
    cursos.find(
      (curso) =>
        curso.id
          .replaceAll("-", "")
          .toLowerCase() ===
        cursoId
          .replaceAll("-", "")
          .toLowerCase()
    ) || null;


  if (!cursoAtual) {

    alert(
      "Este curso não está disponível."
    );

    window.location.href =
      "Cursos.html";

    return;
  }


  document.title =
    `${cursoAtual.nome} | TechSênior`;

}

// ==========================================
// CARREGAR MÓDULOS DO FIRESTORE
// ==========================================

async function carregarModulos() {

  const resultado =
  await listarModulosDoCurso({
    cursoId,
  });

  const dados =
    resultado.data?.modulos || [];

  modulos = dados.map((modulo) => {

    return {
      ...modulo,

      // A interface atual usa "titulo",
      // enquanto o SQL usa "nome".
      titulo: modulo.nome,
    };

  });

}

// ==========================================
// RENDERIZAR LISTA DE MÓDULOS
// ==========================================

function renderizarModulos() {

  modulosContainer
    .querySelectorAll(".modulo")
    .forEach((elemento) => elemento.remove());

  modulos.forEach((modulo, indice) => {

    const moduloElement =
      document.createElement("button");

    moduloElement.type = "button";

    moduloElement.className =
      "modulo";

    const concluido =
      modulosConcluidos[indice] === true;

    const atual =
      indice === moduloAtual;

    const desbloqueado =
      indice === 0 ||
      modulosConcluidos[indice - 1] === true;

    if (atual) {

      moduloElement.classList.add("ativo");

    }

    if (!desbloqueado) {

      moduloElement.classList.add("bloqueado");

      moduloElement.disabled = true;

    }


    // ======================================
    // ÍCONE DO MÓDULO
    // ======================================

    let icone = "fa-chevron-right";

    if (!desbloqueado) {

      icone = "fa-lock";

    } else if (concluido) {

      icone = "fa-check";

    }


    // ======================================
    // STATUS
    // ======================================

    let status = "Ainda não iniciado";

    if (concluido) {

      status = "Concluído";

    } else if (atual) {

      status = "Em andamento";

    } else if (!desbloqueado) {

      status = "Bloqueado";

    }


    // ======================================
    // CONTEÚDO DO MÓDULO
    // ======================================

    moduloElement.innerHTML = `

      <div class="numero-modulo">
        ${indice + 1}
      </div>

      <div class="informacoes-modulo">

        <strong>
          ${escapeHtml(modulo.titulo || `Módulo ${indice + 1}`)}
        </strong>

        <span>
          ${status}
        </span>

      </div>

      <i class="fa-solid ${icone}"></i>

    `;


    // ======================================
    // CLIQUE
    // ======================================

    if (desbloqueado) {

      moduloElement.addEventListener(
        "click",
        () => {

          carregarModulo(indice);

        }
      );

    }


    modulosContainer.appendChild(
      moduloElement
    );

  });

}


// ==========================================
// CARREGAR MÓDULO SELECIONADO
// ==========================================

async function carregarModulo(indice) {

  if (
    indice < 0 ||
    indice >= modulos.length
  ) {
    return;
  }

  moduloAtual = indice;

  const modulo =
    modulos[indice];


  // ========================================
  // BUSCAR CONTEÚDOS DO MÓDULO
  // ========================================

  const resultadoConteudos =
    await listarConteudosDoModulo({
      moduloId: modulo.id,
    });

  const conteudos =
    resultadoConteudos.data?.conteudoModulos || [];


  // ========================================
  // CABEÇALHO
  // ========================================

  identificacaoModulo.textContent =
    `MÓDULO ${indice + 1} DE ${modulos.length}`;

  tituloAula.textContent =
    modulo.titulo ||
    modulo.nome ||
    "Aula";

  descricaoAula.textContent =
    modulo.descricao || "";


  // ========================================
  // CONTEÚDOS
  // ========================================

  renderizarConteudos(conteudos);
  salvarPosicaoCurso(auth.currentUser.uid, cursoId, indice, modulos.length).catch((erro) => console.warn("Não foi possível salvar a posição do curso.", erro));
  document.dispatchEvent(new Event("techsenior:parar-leitura"));
  registrarAtividade(cursoId, indice, cursoAtual?.nome || "", modulo.nome || "").catch((erro) => {
    console.warn("Não foi possível registrar sua atividade.", erro);
  });


  // ========================================
  // QUIZ
  // ========================================

  await carregarQuizModulo(modulo);


  // ========================================
  // COLUNA LATERAL
  // ========================================

  sobreModulo.textContent =
    modulo.descricao ||
    "Conteúdo deste módulo do curso.";


  // Esses cards pertenciam ao modelo estático
  // antigo do curso estático.
  // Agora dica/importante são conteúdos ordenáveis.

  [
    dicaImportante,
    atencaoModulo,
    voceSabia,
    lembreteModulo,
  ].forEach((elemento) => {

    const card =
      elemento?.closest(
        ".card-informacao"
      );

    if (card) {
      card.hidden = true;
    }

  });


  // A antiga dica fixa também deixa de ser usada.
  dicaAula.hidden = true;


  // ========================================
  // NAVEGAÇÃO
  // ========================================

  atualizarNavegacao();


  // ========================================
  // LISTA DE MÓDULOS
  // ========================================

  renderizarModulos();

}


// ==========================================
// RENDERIZAR CONTEÚDO
// ==========================================

function renderizarConteudos(conteudos) {

  conteudoPrincipal.innerHTML = "";


  // ========================================
  // SEM CONTEÚDOS
  // ========================================

  if (
    !Array.isArray(conteudos) ||
    conteudos.length === 0
  ) {

    conteudoPrincipal.innerHTML = `
      <div class="estado-carregamento">
        <i class="fa-solid fa-book-open"></i>

        <p>
          O conteúdo desta aula ainda não está disponível.
        </p>
      </div>
    `;

    return;
  }


  // ========================================
  // RENDERIZAR NA ORDEM DO ADMIN
  // ========================================

  conteudos.forEach((conteudo) => {

    switch (conteudo.tipo) {

      case "texto":
        renderizarTexto(conteudo);
        break;

      case "importante":
        renderizarDestaque(
          conteudo,
          "importante"
        );
        break;

      case "dica":
        renderizarDestaque(
          conteudo,
          "dica"
        );
        break;

      case "imagem":
        renderizarImagem(conteudo);
        break;

      case "video":
        renderizarVideo(conteudo);
        break;

      default:
        console.warn(
          "Tipo de conteúdo desconhecido:",
          conteudo.tipo
        );

    }

  });

}

function renderizarTexto(conteudo) {

  const secao =
    document.createElement("section");

  secao.className =
    "secao-aula";


  if (conteudo.titulo) {

    const cabecalho =
      criarTituloConteudo(
        conteudo.titulo,
        "fa-solid fa-book-open"
      );

    secao.appendChild(cabecalho);

  }


  adicionarTextoFormatado(
    secao,
    conteudo.conteudo
  );


  conteudoPrincipal.appendChild(
    secao
  );

}

function renderizarDestaque(
  conteudo,
  tipo
) {

  const bloco =
    document.createElement("section");

  bloco.className =
    `bloco-destaque bloco-${tipo}`;


  const cabecalho =
    document.createElement("div");

  cabecalho.className =
    "bloco-destaque-titulo";


  const icone =
    document.createElement("i");

  icone.className =
    tipo === "dica"
      ? "fa-solid fa-lightbulb"
      : "fa-solid fa-triangle-exclamation";


  const titulo =
    document.createElement("strong");

  titulo.textContent =
    conteudo.titulo ||
    (
      tipo === "dica"
        ? "Dica"
        : "Importante"
    );


  cabecalho.appendChild(icone);
  cabecalho.appendChild(titulo);

  bloco.appendChild(cabecalho);


  const texto =
    document.createElement("div");

  texto.className =
    "bloco-destaque-texto";


  adicionarTextoFormatado(
    texto,
    conteudo.conteudo
  );


  bloco.appendChild(texto);

  conteudoPrincipal.appendChild(
    bloco
  );

}

function renderizarImagem(conteudo) {

  if (!conteudo.url) {
    return;
  }


  const secao =
    document.createElement("section");

  secao.className =
    "secao-aula";


  if (conteudo.titulo) {

    secao.appendChild(
      criarTituloConteudo(
        conteudo.titulo,
        "fa-regular fa-image"
      )
    );

  }


  const container =
    document.createElement("div");

  container.className =
    "imagem-aula";


  const imagem =
    document.createElement("img");

  imagem.src =
    conteudo.url;

  imagem.alt =
    conteudo.altTexto ||
    conteudo.titulo ||
    "Imagem do conteúdo";


  container.appendChild(imagem);

  secao.appendChild(container);

  conteudoPrincipal.appendChild(
    secao
  );

}

function renderizarVideo(conteudo) {

  if (!conteudo.url) {
    return;
  }


  const secao =
    document.createElement("section");

  secao.className =
    "secao-aula";


  if (conteudo.titulo) {

    secao.appendChild(
      criarTituloConteudo(
        conteudo.titulo,
        "fa-solid fa-video"
      )
    );

  }


  const container =
    document.createElement("div");

  container.className =
    "video-aula";


  const youtubeId =
    extrairIdYoutube(
      conteudo.url
    );


  // YOUTUBE

  if (youtubeId) {

    const iframe =
      document.createElement("iframe");

    iframe.src =
      `https://www.youtube.com/embed/${youtubeId}`;

    iframe.title =
      conteudo.altTexto ||
      conteudo.titulo ||
      "Vídeo da aula";

    iframe.loading =
      "lazy";

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

    iframe.allowFullscreen =
      true;

    container.appendChild(
      iframe
    );

  }


  // VÍDEO DIRETO / SUPABASE

  else {

    const video =
      document.createElement("video");

    video.src =
      conteudo.url;

    video.controls =
      true;

    video.preload =
      "metadata";

    video.playsInline =
      true;

    video.setAttribute(
      "aria-label",
      conteudo.altTexto ||
      conteudo.titulo ||
      "Vídeo da aula"
    );

    container.appendChild(
      video
    );

  }


  secao.appendChild(container);

  conteudoPrincipal.appendChild(
    secao
  );

}

function criarTituloConteudo(
  titulo,
  classeIcone
) {

  const cabecalho =
    document.createElement("div");

  cabecalho.className =
    "titulo-conteudo";


  const icone =
    document.createElement("i");

  icone.className =
    classeIcone;


  const h2 =
    document.createElement("h2");

  h2.textContent =
    titulo;


  cabecalho.appendChild(icone);
  cabecalho.appendChild(h2);


  return cabecalho;

}

function adicionarTextoFormatado(
  container,
  texto
) {

  if (!texto) {
    return;
  }


  const paragrafos =
    String(texto)
      .split(/\n{2,}/);


  paragrafos.forEach(
    (paragrafo) => {

      const p =
        document.createElement("p");

      const linhas =
        paragrafo.split("\n");


      linhas.forEach(
        (linha, indice) => {

          if (indice > 0) {

            p.appendChild(
              document.createElement("br")
            );

          }

          p.appendChild(
            document.createTextNode(
              linha
            )
          );

        }
      );


      container.appendChild(p);

    }
  );
}

function extrairIdYoutube(url) {

  try {

    const endereco =
      new URL(url);

    const host =
      endereco.hostname
        .replace(/^www\./, "");


    if (host === "youtu.be") {

      return (
        endereco.pathname
          .split("/")
          .filter(Boolean)[0] ||
        null
      );

    }


    if (
      host === "youtube.com" ||
      host === "m.youtube.com"
    ) {

      if (
        endereco.pathname ===
        "/watch"
      ) {

        return endereco
          .searchParams
          .get("v");

      }


      const partes =
        endereco.pathname
          .split("/")
          .filter(Boolean);


      if (
        [
          "embed",
          "shorts",
          "live",
        ].includes(partes[0])
      ) {

        return partes[1] || null;

      }

    }

  } catch {

    return null;

  }


  return null;

}


// ==========================================
// CARREGAR QUIZ DO MÓDULO
// ==========================================

async function carregarQuizModulo(modulo) {

  // ========================================
  // RESET
  // ========================================

  questoesQuiz = [];
  indiceQuestaoQuiz = 0;

  moduloPossuiQuiz = false;

  quizModuloConcluido =
    modulosConcluidos[moduloAtual] === true;


  quizModulo.hidden = true;

  quizPergunta.textContent = "";
  quizAlternativas.innerHTML = "";

  quizFeedback.textContent = "";
  quizFeedback.className =
    "quiz-feedback";

  quizFeedback.hidden = true;

  btnProximaQuestao.hidden = true;


  // ========================================
  // BUSCAR QUIZ
  // ========================================

  const resultadoQuiz =
    await buscarQuizDoModulo({
      moduloId: modulo.id,
    });

  const quiz =
    resultadoQuiz.data?.quizzes?.[0];


  if (!quiz) {

    atualizarNavegacao();

    return;

  }


  // ========================================
  // BUSCAR QUESTÕES
  // ========================================

  const resultadoQuestoes =
    await listarQuestoesDoQuiz({
      quizId: quiz.id,
    });

  const questoes =
    resultadoQuestoes.data
      ?.questaoQuizs || [];


  if (questoes.length === 0) {

    atualizarNavegacao();

    return;

  }


  // ========================================
  // BUSCAR ALTERNATIVAS DE CADA QUESTÃO
  // ========================================

  const questoesComAlternativas =
    await Promise.all(

      questoes.map(
        async (questao) => {

          const resultadoAlternativas =
            await listarAlternativasDaQuestao({
              questaoId: questao.id,
            });


          return {
            ...questao,

            alternativas:
              resultadoAlternativas.data
                ?.alternativaQuizs || [],
          };

        }
      )

    );


  // Ignora questão sem alternativas
  questoesQuiz =
    questoesComAlternativas.filter(
      (questao) =>
        questao.alternativas.length > 0
    );


  if (questoesQuiz.length === 0) {

    atualizarNavegacao();

    return;

  }


  moduloPossuiQuiz = true;

  quizModulo.hidden = false;


  renderizarQuestaoQuiz();

  atualizarNavegacao();

}

function renderizarQuestaoQuiz() {
  document.dispatchEvent(new Event("techsenior:parar-leitura"));

  const questao =
    questoesQuiz[indiceQuestaoQuiz];

  if (!questao) {
    return;
  }


  // ========================================
  // RESET DA QUESTÃO
  // ========================================

  alternativaSelecionadaQuiz = null;
  botaoAlternativaSelecionadaQuiz = null;

  alternativasErradasTentadas =
    new Set();

  quizAlternativas.innerHTML = "";

  quizFeedback.textContent = "";

  quizFeedback.className =
    "quiz-feedback";

  quizFeedback.hidden = true;


  // ========================================
  // BOTÃO COMEÇA COMO CONFIRMAR
  // ========================================

  btnProximaQuestao.hidden = false;

  btnProximaQuestao.disabled = true;

  btnProximaQuestao.dataset.acao =
    "confirmar";

  btnProximaQuestao.innerHTML = `
    Confirmar resposta
    <i class="fa-solid fa-check"></i>
  `;


  // ========================================
  // CONTADOR
  // ========================================

  quizIdentificacao.textContent =
    `Questão ${indiceQuestaoQuiz + 1} de ${questoesQuiz.length}`;


  quizPergunta.textContent =
    questao.pergunta;


  // ========================================
  // ALTERNATIVAS
  // ========================================

  const letras =
    ["A", "B", "C", "D", "E"];


  questao.alternativas.forEach(
    (alternativa, indice) => {

      const botao =
        document.createElement("button");

      botao.type = "button";

      botao.className =
        "opcao-quiz";


      const letra =
        document.createElement("span");

      letra.className =
        "letra-alternativa";

      letra.textContent =
        letras[indice] ||
        String(indice + 1);


      const texto =
        document.createElement("span");

      texto.textContent =
        alternativa.texto;


      botao.appendChild(letra);
      botao.appendChild(texto);


      botao.addEventListener(
        "click",
        () => {

          selecionarAlternativaQuiz(
            botao,
            alternativa
          );

        }
      );


      quizAlternativas.appendChild(
        botao
      );

    }
  );

}

function selecionarAlternativaQuiz(
  botao,
  alternativa
) {

  if (
    btnProximaQuestao.dataset.acao !==
    "confirmar"
  ) {
    return;
  }


  quizAlternativas
    .querySelectorAll(".opcao-quiz")
    .forEach((opcao) => {

      opcao.classList.remove(
        "selecionada"
      );

    });


  botao.classList.add(
    "selecionada"
  );


  alternativaSelecionadaQuiz =
    alternativa;

  botaoAlternativaSelecionadaQuiz =
    botao;


  // ========================================
  // JÁ ERROU ESSA ALTERNATIVA ANTES
  // ========================================

  if (
    alternativasErradasTentadas.has(
      alternativa.id
    )
  ) {

    quizFeedback.className =
      "quiz-feedback errado";

    quizFeedback.textContent =
      alternativa.explicacao ||
      "Você já tentou esta resposta. Leia novamente a explicação e escolha outra alternativa.";

    quizFeedback.hidden = false;


    // Não deixa confirmar novamente
    // uma resposta que já sabemos estar errada.
    btnProximaQuestao.disabled =
      true;

    return;

  }


  // ========================================
  // NOVA ALTERNATIVA
  // ========================================

  quizFeedback.hidden = true;

  btnProximaQuestao.disabled =
    false;

}


// ==========================================
// RESPONDER QUIZ
// ==========================================

function responderQuiz() {

  if (
    !alternativaSelecionadaQuiz ||
    !botaoAlternativaSelecionadaQuiz
  ) {
    return;
  }


  const alternativa =
    alternativaSelecionadaQuiz;

  const botao =
    botaoAlternativaSelecionadaQuiz;


  const botoes =
    Array.from(
      quizAlternativas.querySelectorAll(
        ".opcao-quiz"
      )
    );


  // ========================================
  // ACERTO
  // ========================================

  if (alternativa.correta) {

    botao.classList.remove(
      "selecionada"
    );

    botao.classList.add(
      "correta"
    );


    botoes.forEach(
      (opcao) => {

        opcao.disabled = true;

      }
    );


    quizFeedback.className =
      "quiz-feedback correto";

    quizFeedback.textContent =
      alternativa.explicacao ||
      "Muito bem! Resposta correta.";

    quizFeedback.hidden = false;


    const ultimaQuestao =
      indiceQuestaoQuiz ===
      questoesQuiz.length - 1;


    if (ultimaQuestao) {

      btnProximaQuestao.dataset.acao =
        "concluir";

      btnProximaQuestao.innerHTML = `
        Concluir atividade
        <i class="fa-solid fa-check"></i>
      `;

    } else {

      btnProximaQuestao.dataset.acao =
        "continuar";

      btnProximaQuestao.innerHTML = `
        Continuar
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }


    btnProximaQuestao.disabled =
      false;

    return;

  }


  // ========================================
  // ERRO
  // ========================================

  alternativasErradasTentadas.add(
    alternativa.id
  );


  botao.classList.remove(
    "selecionada"
  );

  botao.classList.add(
    "errada"
  );


  // Para a pessoa ler o feedback antes
  // de simplesmente clicar em outra.
  botoes.forEach(
    (opcao) => {

      opcao.disabled = true;

    }
  );


  quizFeedback.className =
    "quiz-feedback errado";

  quizFeedback.textContent =
    alternativa.explicacao ||
    "Essa não é a resposta correta. Leia a explicação e tente novamente.";

  quizFeedback.hidden = false;


  // ========================================
  // DOIS ERROS DIFERENTES
  // ========================================

  if (
    alternativasErradasTentadas.size >= 2
  ) {

    btnProximaQuestao.dataset.acao =
      "revisar";

    btnProximaQuestao.innerHTML = `
      Revisar conteúdo
      <i class="fa-solid fa-book-open"></i>
    `;

  } else {

    btnProximaQuestao.dataset.acao =
      "tentar";

    btnProximaQuestao.innerHTML = `
      Tentar novamente
      <i class="fa-solid fa-rotate-right"></i>
    `;

  }


  btnProximaQuestao.disabled =
    false;

}

function prepararNovaTentativaQuiz() {

  alternativaSelecionadaQuiz =
    null;

  botaoAlternativaSelecionadaQuiz =
    null;


  quizAlternativas
    .querySelectorAll(".opcao-quiz")
    .forEach((botao) => {

      botao.disabled = false;

      botao.classList.remove(
        "errada",
        "selecionada"
      );

    });


  // Não deixamos os erros marcados permanentemente.
  // Isso evita entregar a resposta por eliminação.

  quizFeedback.hidden = true;


  btnProximaQuestao.dataset.acao =
    "confirmar";

  btnProximaQuestao.innerHTML = `
    Confirmar resposta
    <i class="fa-solid fa-check"></i>
  `;

  btnProximaQuestao.disabled =
    true;

}

btnProximaQuestao.addEventListener(
  "click",
  async () => {

    const acao =
      btnProximaQuestao.dataset.acao;


    // ======================================
    // CONFIRMAR RESPOSTA
    // ======================================

    if (acao === "confirmar") {

      responderQuiz();

      return;

    }


    // ======================================
    // NOVA TENTATIVA
    // ======================================

    if (acao === "tentar") {

      prepararNovaTentativaQuiz();

      return;

    }


    // ======================================
    // REVISAR CONTEÚDO
    // ======================================

    if (acao === "revisar") {

      prepararNovaTentativaQuiz();


      conteudoPrincipal.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;

    }


    // ======================================
    // PRÓXIMA QUESTÃO
    // ======================================

    if (acao === "continuar") {

      indiceQuestaoQuiz++;

      renderizarQuestaoQuiz();

      return;

    }


    // ======================================
    // TERMINOU
    // ======================================

    if (acao === "concluir") {

      await concluirQuizModulo();

    }

  }
);

async function concluirQuizModulo() {

  quizModuloConcluido = true;

  modulosConcluidos[
    moduloAtual
  ] = true;


  // ========================================
  // FEEDBACK
  // ========================================

  quizIdentificacao.textContent =
    "Atividade concluída";

  quizFeedback.className =
    "quiz-feedback correto";

  quizFeedback.textContent =
    "Muito bem! Você concluiu a atividade deste módulo.";

  quizFeedback.hidden = false;

  btnProximaQuestao.hidden = true;


  // ========================================
  // PROGRESSO
  // ========================================

  atualizarProgresso();

  renderizarModulos();

  atualizarNavegacao();


  // ========================================
  // SALVAR
  // ========================================

  const usuario =
    auth.currentUser;


  if (!usuario) {
    return;
  }


  try {

    await salvarProgressoCurso(
      usuario.uid,
      cursoId,
      moduloAtual,
      modulosConcluidos
    );

  } catch (erro) {

    console.error(
      "Erro ao salvar conclusão do quiz:",
      erro
    );

  }
  await verificarTesteFinalDisponivel();

}



// ==========================================
// FORMATAR TEXTO
// ==========================================

function formatarTexto(texto) {

  if (!texto) {

    return "";

  }

  return texto
    .split("\n\n")
    .map((paragrafo) => {

      return `<p>${paragrafo
        .replace(/\n/g, "<br>")}</p>`;

    })
    .join("");

}


// ==========================================
// ATUALIZAR NAVEGAÇÃO
// ==========================================

function atualizarNavegacao() {

  const anterior =
    moduloAtual - 1;

  const proximo =
    moduloAtual + 1;

  const bloqueadoPeloQuiz =
  moduloPossuiQuiz &&
  !quizModuloConcluido;


  // ========================================
  // AULA ANTERIOR
  // ========================================

  if (anterior >= 0) {

    btnAulaAnterior.disabled = false;

    nomeAulaAnterior.textContent =
      modulos[anterior].titulo ||
      `Módulo ${anterior + 1}`;

  } else {

    btnAulaAnterior.disabled = true;

    nomeAulaAnterior.textContent =
      "Indisponível";

  }

  if (bloqueadoPeloQuiz) {

  btnProximaAula.disabled =
    true;

  nomeProximaAula.textContent =
    "Conclua a atividade para continuar";

  return;

  }

  // ========================================
  // PRÓXIMA AULA
  // ========================================

  if (proximo < modulos.length) {

    btnProximaAula.disabled = false;

    nomeProximaAula.textContent =
      modulos[proximo].titulo ||
      `Módulo ${proximo + 1}`;

  } else {

    const moduloJaConcluido =
      modulosConcluidos[
        moduloAtual
      ] === true;


    if (moduloJaConcluido) {

      btnProximaAula.disabled =
        true;

      nomeProximaAula.textContent =
        "Módulos concluídos";

    } else {

      btnProximaAula.disabled =
        false;

      nomeProximaAula.textContent =
        "Concluir módulo";

    }
  }
}


// ==========================================
// BOTÃO AULA ANTERIOR
// ==========================================

btnAulaAnterior.addEventListener(
  "click",
  () => {

    if (moduloAtual <= 0) {

      return;
    }

    carregarModulo(
      moduloAtual - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }
);


// ==========================================
// BOTÃO PRÓXIMA AULA
// ==========================================

btnProximaAula.addEventListener(
  "click",
  async () => {

    // ======================================
    // QUIZ AINDA NÃO CONCLUÍDO
    // ======================================

    if (
      moduloPossuiQuiz &&
      !quizModuloConcluido
    ) {
      return;
    }


    const usuario =
      auth.currentUser;

    if (!usuario) {
      return;
    }


    // ======================================
    // CONCLUIR MÓDULO ATUAL
    // ======================================

    modulosConcluidos[
      moduloAtual
    ] = true;


    const ultimoModulo =
      moduloAtual ===
      modulos.length - 1;


    // ======================================
    // ÚLTIMO MÓDULO
    // ======================================

    if (ultimoModulo) {

      atualizarProgresso();

      renderizarModulos();

      atualizarNavegacao();


      try {

        await salvarProgressoCurso(
          usuario.uid,
          cursoId,
          moduloAtual,
          modulosConcluidos
        );

      } catch (erro) {

        console.error(
          "Erro ao salvar conclusão do curso:",
          erro
        );

      }

      await verificarTesteFinalDisponivel();
      return;

    }


    // ======================================
    // IR PARA O PRÓXIMO MÓDULO
    // ======================================

    moduloAtual++;


    atualizarProgresso();

    await carregarModulo(
      moduloAtual
    );

    // ======================================
    // SALVAR PROGRESSO
    // ======================================

    try {

      await salvarProgressoCurso(
        usuario.uid,
        cursoId,
        moduloAtual,
        modulosConcluidos
      );

    } catch (erro) {

      console.error(
        "Erro ao salvar progresso:",
        erro
      );

    }

  }
);

// ==========================================
// ATUALIZAR PROGRESSO
// ==========================================

function atualizarProgresso() {

  const total =
    modulos.length;

  if (total === 0) {

    return;
  }


  const concluidos =
    modulosConcluidos.filter(
      Boolean
    ).length;


  const percentual =
    Math.round(
      (concluidos / total) * 100
    );


  // ========================================
  // PORCENTAGEM
  // ========================================

  porcentagemProgresso.textContent =
    `${percentual}%`;


  // ========================================
  // BARRA
  // ========================================

  progressoPreenchido.style.width =
    `${percentual}%`;


  // ========================================
  // ACESSIBILIDADE
  // ========================================

  const barra =
    document.querySelector(
      ".barra-progresso"
    );

  if (barra) {

    barra.setAttribute(
      "aria-valuenow",
      percentual
    );

  }


  // ========================================
  // TEXTO
  // ========================================

  textoProgresso.textContent =
    `${concluidos} de ${total} módulos concluídos`;

}

function todosModulosConcluidos() {
  return modulos.length > 0
    && modulosConcluidos.length === modulos.length
    && modulosConcluidos.every((concluido) => concluido === true);
}

async function verificarTesteFinalDisponivel() {
  testeFinalChamada.hidden = true;
  if (!todosModulosConcluidos()) return;

  try {
    const resultado = await buscarQuizFinalDoCursoAluno({ cursoId });
    if (!resultado.data?.quizzes?.[0]) return;

    btnIniciarTesteFinal.href = `TesteFinal.html?id=${encodeURIComponent(cursoId)}`;
    testeFinalChamada.hidden = false;
  } catch (erro) {
    console.error("Erro ao buscar teste final:", erro);
  }
}

// ==========================================
// MENSAGEM DE ERRO
// ==========================================

function mostrarErroCurso() {

  modulosContainer.innerHTML = `

    <p class="carregando-modulos">
      Não foi possível carregar os módulos.
    </p>

  `;

  tituloAula.textContent =
    "Não foi possível carregar o curso.";

  descricaoAula.textContent =
    "Tente novamente mais tarde.";

}


// ==========================================
// SEM MÓDULOS
// ==========================================

function mostrarMensagemSemModulos() {

  modulosContainer.innerHTML = `

    <p class="carregando-modulos">
      Nenhum módulo disponível.
    </p>

  `;

  tituloAula.textContent =
    "Curso ainda não disponível";

  descricaoAula.textContent =
    "Os módulos deste curso ainda não foram cadastrados.";

}
