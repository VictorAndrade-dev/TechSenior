import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  carregarProgressoCurso,
  salvarProgressoCurso,
} from "./ServicoProgresso.js";

// ==========================================
// CONFIGURAÇÕES DO CURSO
// ==========================================

const ID_CURSO = "celular";

let modulos = [];
let moduloAtual = 0;
let modulosConcluidos = [];


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {

    window.location.href = "Login.html";

    return;
  }

  try {

    await inicializarCurso(usuario);

  } catch (erro) {

    console.error(
      "Erro ao carregar o curso:",
      erro
    );

    mostrarErroCurso();

  }

});


// ==========================================
// INICIALIZAR CURSO
// ==========================================

async function inicializarCurso(usuario) {

  await carregarModulos();

  if (modulos.length === 0) {

    mostrarMensagemSemModulos();

    return;
  }

  const progresso =
    await carregarProgressoCurso(
      usuario.uid,
      ID_CURSO,
      modulos.length
    );

  moduloAtual = progresso.moduloAtual;

  modulosConcluidos =
    progresso.modulosConcluidos;

  atualizarProgresso();

  renderizarModulos();

  carregarModulo(moduloAtual);

}


// ==========================================
// CARREGAR MÓDULOS DO FIRESTORE
// ==========================================

async function carregarModulos() {

  const referenciaModulos =
    collection(
      db,
      "cursos",
      ID_CURSO,
      "modulos"
    );

  const consulta =
    query(
      referenciaModulos,
      orderBy("ordem", "asc")
    );

  const resultado =
    await getDocs(consulta);

  modulos = resultado.docs.map((documento) => {

    return {
      id: documento.id,
      ...documento.data(),
    };

  });

}


// ==========================================
// RENDERIZAR LISTA DE MÓDULOS
// ==========================================

function renderizarModulos() {

  modulosContainer.innerHTML = "";

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
          ${modulo.titulo || `Módulo ${indice + 1}`}
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

function carregarModulo(indice) {

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
  // CABEÇALHO
  // ========================================

  identificacaoModulo.textContent =
    `MÓDULO ${indice + 1} DE ${modulos.length}`;

  tituloAula.textContent =
    modulo.titulo || "Aula";

  descricaoAula.textContent =
    modulo.descricao || "";


  // ========================================
  // CONTEÚDO
  // ========================================

  renderizarConteudo(modulo);


  // ========================================
  // INFORMAÇÕES LATERAIS
  // ========================================

  sobreModulo.textContent =
    modulo.sobreModulo ||
    modulo.sobre ||
    modulo.descricao ||
    "";

  dicaImportante.textContent =
    modulo.dicaImportante ||
    modulo.importante ||
    "";

  atencaoModulo.textContent =
    modulo.atencao ||
    "";

  voceSabia.textContent =
    modulo.voceSabia ||
    "";

  lembreteModulo.textContent =
    modulo.lembrete ||
    "";


  // ========================================
  // DICA DA AULA
  // ========================================

  if (modulo.dica) {

    textoDica.textContent =
      modulo.dica;

    dicaAula.hidden = false;

  } else {

    textoDica.textContent = "";

    dicaAula.hidden = true;

  }


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

function renderizarConteudo(modulo) {

  conteudoPrincipal.innerHTML = "";


  // ========================================
  // INTRODUÇÃO
  // ========================================

  if (modulo.introducao) {

    const secao =
      document.createElement("section");

    secao.className =
      "secao-aula";


    secao.innerHTML = `

      <div class="titulo-conteudo">

        <i class="fa-solid fa-book-open"></i>

        <h2>
          Introdução
        </h2>

      </div>

      <div class="texto-conteudo">
        ${formatarTexto(modulo.introducao)}
      </div>

    `;

    conteudoPrincipal.appendChild(secao);

  }


  // ========================================
  // IMAGEM
  // ========================================

  if (modulo.imagem) {

    const imagemContainer =
      document.createElement("div");

    imagemContainer.className =
      "imagem-aula";


    imagemContainer.innerHTML = `

      <img
        src="${modulo.imagem}"
        alt="${modulo.altImagem || modulo.titulo || "Imagem da aula"}"
      >

    `;

    conteudoPrincipal.appendChild(
      imagemContainer
    );

  }


  // ========================================
  // CONTEÚDO EXTRA
  // ========================================

  if (modulo.conteudo) {

    const secaoConteudo =
      document.createElement("section");

    secaoConteudo.className =
      "secao-aula";


    secaoConteudo.innerHTML =
      formatarTexto(modulo.conteudo);


    conteudoPrincipal.appendChild(
      secaoConteudo
    );

  }


  // ========================================
  // CASO NÃO TENHA CONTEÚDO
  // ========================================

  if (
    !modulo.introducao &&
    !modulo.imagem &&
    !modulo.conteudo
  ) {

    conteudoPrincipal.innerHTML = `

      <div class="estado-carregamento">

        <i class="fa-solid fa-book-open"></i>

        <p>
          O conteúdo desta aula ainda não está disponível.
        </p>

      </div>

    `;

  }

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


  // ========================================
  // PRÓXIMA AULA
  // ========================================

  if (proximo < modulos.length) {

    btnProximaAula.disabled = false;

    nomeProximaAula.textContent =
      modulos[proximo].titulo ||
      `Módulo ${proximo + 1}`;

  } else {

    btnProximaAula.disabled = true;

    nomeProximaAula.textContent =
      "Curso concluído";

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

    if (
      moduloAtual >=
      modulos.length - 1
    ) {

      return;
    }


    // ======================================
    // CONCLUIR MÓDULO ATUAL
    // ======================================

    modulosConcluidos[moduloAtual] = true;


    // ======================================
    // PRÓXIMO MÓDULO
    // ======================================

    const proximoModulo =
      moduloAtual + 1;

    moduloAtual =
      proximoModulo;


    // ======================================
    // ATUALIZA INTERFACE
    // ======================================

    atualizarProgresso();

    carregarModulo(
      moduloAtual
    );


    // ======================================
    // SALVAR NO FIRESTORE
    // ======================================

    const usuario =
      auth.currentUser;

    if (!usuario) {

      return;
    }

    try {

      await salvarProgressoCurso(
        usuario.uid,
        ID_CURSO,
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