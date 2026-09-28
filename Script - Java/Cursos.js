import { auth } from "./Firebase-config.js";

import {
  listarCursos,
  listarModulosDoCurso,
} from "../dataconnect-generated/esm/index.esm.js";

import {
  carregarProgressoCurso,
} from "./ServicoProgresso.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ==========================================
// CONFIGURAÇÕES
// ==========================================


const listaCursos =
  document.getElementById("listaCursos");

const modalCurso =
  document.getElementById("modalCurso");

const fecharModalCurso =
  document.getElementById("fecharModalCurso");

const modalCursoTitulo =
  document.getElementById("modalCursoTitulo");

const modalCursoDescricao =
  document.getElementById("modalCursoDescricao");

const modalCursoDificuldade =
  document.getElementById("modalCursoDificuldade");

const modalCursoDuracao =
  document.getElementById("modalCursoDuracao");

const btnIniciarCurso =
  document.getElementById("btnIniciarCurso");

const modalCursoQuantidadeModulos =
  document.getElementById(
    "modalCursoQuantidadeModulos"
  );

const modalCursoAprendizados =
  document.getElementById(
    "modalCursoAprendizados"
  );

const modalCursoListaAprendizados =
  document.getElementById(
    "modalCursoListaAprendizados"
  );

const modalCursoMensagemEstrutura =
  document.getElementById(
    "modalCursoMensagemEstrutura"
  );

const modalCursoProgresso =
  document.getElementById(
    "modalCursoProgresso"
  );

const modalCursoProgressoTexto =
  document.getElementById(
    "modalCursoProgressoTexto"
  );

const modalCursoProgressoBarra =
  document.getElementById(
    "modalCursoProgressoBarra"
  );

const modalCursoProgressoPreenchimento =
  document.getElementById(
    "modalCursoProgressoPreenchimento"
  );

let usuarioAtual = null;
let focoAntesModal;
let cursoSelecionado = null;





// ==========================================
// LOGIN
// ==========================================

onAuthStateChanged(
  auth,
  (usuario) => {
    usuarioAtual =
      usuario;

    if (
      cursoSelecionado &&
      modalCurso?.style.display ===
        "flex"
    ) {
      carregarEstruturaCurso(
        cursoSelecionado
      );
    }
  }
);

// ==========================================
// CARREGAR CURSOS DO BANCO
// ==========================================

async function carregarCursosDoBanco() {

  if (!listaCursos) {
    return;
  }

  listaCursos.innerHTML = `
    <p class="mensagem-cursos">
      Carregando cursos...
    </p>
  `;

  try {

    const resultado =
      await listarCursos();

    const cursos =
      resultado.data?.cursos || [];

    console.log(
      "Cursos publicados:",
      cursos
    );

    mostrarCursos(cursos);

  } catch (erro) {

    console.error(
      "Erro ao carregar cursos:",
      erro
    );

    listaCursos.innerHTML = `
      <p class="mensagem-cursos">
        Não foi possível carregar os cursos.
        Tente novamente mais tarde.
      </p>
    `;

  }

}


// ==========================================
// MOSTRAR CURSOS
// ==========================================

function mostrarCursos(cursos) {

  listaCursos.innerHTML = "";

  if (cursos.length === 0) {

    listaCursos.innerHTML = `
      <p class="mensagem-cursos">
        Nenhum curso disponível no momento.
      </p>
    `;

    return;
  }

  cursos.forEach((curso) => {

    const card =
      document.createElement("div");

    card.className = "card";

    const icone =
      document.createElement("i");

    icone.className =
      curso.icone ||
      "fa-solid fa-book-open";


    const titulo =
      document.createElement("h3");

    titulo.textContent =
      curso.nome;


    const descricao =
      document.createElement("p");

    descricao.textContent =
      curso.descricao ||
      "Conheça este curso do TechSênior.";


    const botao =
      document.createElement("button");

    botao.className =
      "btn-card";

    botao.type =
      "button";

    botao.textContent =
      "Ver Curso";


    botao.addEventListener(
      "click",
      () => abrirModalCurso(curso)
    );


    card.appendChild(icone);
    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(botao);

    listaCursos.appendChild(card);

    prepararAnimacaoCard(card);

  });

}


// ==========================================
// ABRIR MODAL
// ==========================================

async function abrirModalCurso(curso) {
  focoAntesModal =
    document.activeElement;

  cursoSelecionado =
    curso;

  modalCurso.setAttribute(
    "role",
    "dialog"
  );

  modalCurso.setAttribute(
    "aria-modal",
    "true"
  );

  modalCurso.setAttribute(
    "aria-labelledby",
    "modalCursoTitulo"
  );


  // Título simples e centralizado.
  modalCursoTitulo.textContent =
    curso.nome;


  modalCursoDescricao.textContent =
    curso.descricao ||
    "Conheça este curso do TechSênior.";


  modalCursoDificuldade.textContent =
    curso.dificuldade ||
    "Não informado";


  modalCursoDuracao.textContent =
    curso.cargaHoraria
      ? `${curso.cargaHoraria} min`
      : "Não informada";


  prepararEstruturaModal();

  configurarBotaoIniciar(
    curso,
    null
  );


  modalCurso.style.display =
    "flex";

  fecharModalCurso.focus();


  await carregarEstruturaCurso(
    curso
  );
}

function prepararEstruturaModal() {
  modalCursoQuantidadeModulos.textContent =
    usuarioAtual
      ? "Carregando..."
      : "Faça login";

  modalCursoAprendizados.hidden =
    true;

  modalCursoListaAprendizados
    .replaceChildren();

  modalCursoMensagemEstrutura.hidden =
    true;

  modalCursoMensagemEstrutura.textContent =
    "";

  modalCursoProgresso.hidden =
    true;

  modalCursoProgressoTexto.textContent =
    "";

  modalCursoProgressoBarra
    .setAttribute(
      "aria-valuenow",
      "0"
    );

  modalCursoProgressoPreenchimento
    .style.width = "0%";
}


async function carregarEstruturaCurso(
  curso
) {
  if (!curso?.id) {
    return;
  }


  // A consulta de módulos exige autenticação.
  if (!usuarioAtual) {
    modalCursoQuantidadeModulos.textContent =
      "Após entrar";

    modalCursoMensagemEstrutura.textContent =
      "Entre na sua conta para visualizar os módulos e seu progresso neste curso.";

    modalCursoMensagemEstrutura.hidden =
      false;

    configurarBotaoIniciar(
      curso,
      null
    );

    return;
  }


  try {
    const resultado =
      await listarModulosDoCurso({
        cursoId: curso.id,
      });


    // Evita atualizar o modal errado
    // caso outro curso tenha sido aberto.
    if (
      cursoSelecionado?.id !==
      curso.id
    ) {
      return;
    }


    const modulos =
      resultado.data?.modulos || [];


    modalCursoQuantidadeModulos.textContent =
      modulos.length === 1
        ? "1 módulo"
        : `${modulos.length} módulos`;


    renderizarAprendizados(
      modulos
    );


    const progresso =
      await carregarProgressoCurso(
        usuarioAtual.uid,
        curso.id,
        modulos.length
      );


    if (
      cursoSelecionado?.id !==
      curso.id
    ) {
      return;
    }


    renderizarProgresso(
      progresso,
      modulos.length
    );


    configurarBotaoIniciar(
      curso,
      progresso
    );

  } catch (erro) {
    console.error(
      "Erro ao carregar estrutura do curso:",
      erro
    );


    modalCursoQuantidadeModulos.textContent =
      "Indisponível";

    modalCursoAprendizados.hidden =
      true;

    modalCursoProgresso.hidden =
      true;

    modalCursoMensagemEstrutura.textContent =
      "Não foi possível carregar os módulos deste curso agora.";

    modalCursoMensagemEstrutura.hidden =
      false;


    configurarBotaoIniciar(
      curso,
      null
    );
  }
}


function renderizarAprendizados(
  modulos
) {
  modalCursoListaAprendizados
    .replaceChildren();


  if (modulos.length === 0) {
    modalCursoAprendizados.hidden =
      true;

    modalCursoMensagemEstrutura.textContent =
      "A estrutura deste curso ainda está sendo preparada.";

    modalCursoMensagemEstrutura.hidden =
      false;

    return;
  }


  const principais =
    modulos.slice(0, 3);


  principais.forEach(
    (modulo) => {
      const item =
        document.createElement("li");

      const icone =
        document.createElement("i");

      icone.className =
        "fa-solid fa-check";

      icone.setAttribute(
        "aria-hidden",
        "true"
      );


      const texto =
        document.createElement("span");

      texto.textContent =
        modulo.nome;


      item.append(
        icone,
        texto
      );


      modalCursoListaAprendizados
        .append(item);
    }
  );


  if (modulos.length > 3) {
    const restante =
      modulos.length - 3;

    const item =
      document.createElement("li");

    item.className =
      "modal-mais-modulos";

    item.textContent =
      restante === 1
        ? "+ 1 módulo"
        : `+ ${restante} módulos`;


    modalCursoListaAprendizados
      .append(item);
  }


  modalCursoAprendizados.hidden =
    false;

  modalCursoMensagemEstrutura.hidden =
    true;
}


function renderizarProgresso(
  progresso,
  totalModulos
) {
  if (
    !progresso ||
    totalModulos <= 0
  ) {
    modalCursoProgresso.hidden =
      true;

    return;
  }


  const concluidos =
    progresso.modulosConcluidos
      ?.filter(Boolean)
      .length || 0;


  // Nunca começou:
  // não precisa mostrar barra 0%.
  if (
    !progresso.iniciado &&
    concluidos === 0 &&
    !progresso.cursoConcluido
  ) {
    modalCursoProgresso.hidden =
      true;

    return;
  }


  const percentual =
    Math.round(
      (
        concluidos /
        totalModulos
      ) *
      100
    );


  modalCursoProgressoTexto.textContent =
    `${concluidos} de ${totalModulos} módulos`;


  modalCursoProgressoBarra
    .setAttribute(
      "aria-valuenow",
      String(percentual)
    );


  modalCursoProgressoPreenchimento
    .style.width =
      `${percentual}%`;


  modalCursoProgresso.hidden =
    false;
}

// ==========================================
// DESTINO DO CURSO
// ==========================================

function obterDestinoCurso(curso) {

  if (!curso?.id) {
    return null;
  }

  return `Curso.html?id=${encodeURIComponent(curso.id)}`;

}


// ==========================================
// CONFIGURAR BOTÃO INICIAR
// ==========================================

function configurarBotaoIniciar(
  curso,
  progresso = null
) {
  const destino =
    obterDestinoCurso(curso);


  btnIniciarCurso.classList.remove(
    "desabilitado"
  );

  btnIniciarCurso.removeAttribute(
    "aria-disabled"
  );


  if (!destino) {
    btnIniciarCurso.innerHTML = `
      <i class="fa-regular fa-clock"></i>
      Em breve
    `;

    btnIniciarCurso.dataset.destino =
      "";

    btnIniciarCurso.classList.add(
      "desabilitado"
    );

    btnIniciarCurso.setAttribute(
      "aria-disabled",
      "true"
    );

    return;
  }


  btnIniciarCurso.dataset.destino =
    destino;


  if (!usuarioAtual) {
    btnIniciarCurso.innerHTML = `
      <i class="fa-solid fa-right-to-bracket"></i>
      Entrar para iniciar
    `;

    return;
  }


  if (progresso?.cursoConcluido) {
    btnIniciarCurso.innerHTML = `
      <i class="fa-solid fa-rotate-right"></i>
      Revisar curso
    `;

    return;
  }


  const jaComecou =
    progresso?.iniciado === true ||
    progresso?.modulosConcluidos
      ?.some(Boolean);


  if (jaComecou) {
    btnIniciarCurso.innerHTML = `
      <i class="fa-solid fa-play"></i>
      Continuar curso
    `;

    return;
  }


  btnIniciarCurso.innerHTML = `
    <i class="fa-solid fa-play"></i>
    Iniciar curso
  `;
}


// ==========================================
// INICIAR CURSO
// ==========================================

btnIniciarCurso?.addEventListener(
  "click",
  (evento) => {

    evento.preventDefault();

    if (!cursoSelecionado) {
      return;
    }


    const destino =
      btnIniciarCurso.dataset.destino;


    // Curso ainda não possui página
    if (!destino) {
      return;
    }


    // Precisa estar logado
    if (!usuarioAtual) {

      window.location.href =
        "Login.html";

      return;

    }


    window.location.href =
      destino;

  }
);


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal() {

  if (!modalCurso) {
    return;
  }

  modalCurso.style.display =
    "none";

  focoAntesModal?.focus();
  cursoSelecionado =
    null;

}


fecharModalCurso?.addEventListener(
  "click",
  fecharModal
);


modalCurso?.addEventListener(
  "click",
  (evento) => {

    if (
      evento.target ===
      modalCurso
    ) {

      fecharModal();

    }

  }
);


document.addEventListener(
  "keydown",
  (evento) => {

    if (
      evento.key === "Escape" &&
      modalCurso?.style.display === "flex"
    ) {

      fecharModal();

    }

  }
);


// ==========================================
// ANIMAÇÃO DOS CARDS
// ==========================================

const observador =
  new IntersectionObserver(
    (entradas) => {

      entradas.forEach(
        (entrada) => {

          if (
            entrada.isIntersecting
          ) {

            entrada.target.style.opacity =
              "1";

            entrada.target.style.transform =
              "translateY(0)";

          }

        }
      );

    }
  );


function prepararAnimacaoCard(card) {

  card.style.opacity =
    "0";

  card.style.transform =
    "translateY(40px)";

  card.style.transition =
    "0.8s";


  card.addEventListener(
    "mouseenter",
    () => {

      card.style.transform =
        "translateY(-10px)";

      card.style.transition =
        "0.3s";

    }
  );


  card.addEventListener(
    "mouseleave",
    () => {

      card.style.transform =
        "translateY(0)";

    }
  );


  observador.observe(card);

}


// ==========================================
// BOTÃO COMEÇAR
// ==========================================

const btnComecar =
  document.getElementById(
    "btnComecar"
  );


if (btnComecar) {

  onAuthStateChanged(
    auth,
    (usuario) => {

      if (usuario) {

        btnComecar.innerHTML = `
          <i class="fa-solid fa-graduation-cap"></i>
          Continuar aprendendo
        `;

      }


      btnComecar.onclick =
        () => {

          if (usuario) {

            document
              .getElementById("cursos")
              ?.scrollIntoView({
                behavior: "smooth"
              });

            return;

          }


          window.location.href =
            "Login.html";

        };

    }
  );

}


// ==========================================
// FAQ
// ==========================================

const accordions =
  document.querySelectorAll(
    ".accordion"
  );


accordions.forEach(
  (accordion) => {

    accordion.addEventListener(
      "click",
      () => {

        const resposta =
          accordion.nextElementSibling;

        if (!resposta) {
          return;
        }


        const estaAberto =
          accordion.classList.contains(
            "active"
          );


        accordion.classList.toggle(
          "active"
        );


        if (estaAberto) {

          resposta.classList.remove(
            "aberta"
          );

        } else {

          resposta.classList.add(
            "aberta"
          );

        }

      }
    );

  }
);


// ==========================================
// SCROLL AUTOMÁTICO
// ==========================================

window.addEventListener(
  "load",
  () => {

    if (
      window.location.hash ===
      "#cursos"
    ) {

      setTimeout(
        () => {

          const destino =
            document.getElementById(
              "cursos"
            );

          if (destino) {

            scrollSuave(
              destino,
              2000
            );

          }

        },
        400
      );

    }

  }
);


// ==========================================
// FUNÇÃO DE SCROLL SUAVE
// ==========================================

function scrollSuave(
  destino,
  duracao = 2000
) {

  if (!destino) {
    return;
  }


  const inicio =
    window.scrollY;


  const posicaoDestino =
    destino
      .getBoundingClientRect()
      .top +
    window.scrollY;


  const fim =
    posicaoDestino - 90;

  const distancia =
    fim - inicio;

  let inicioTempo =
    null;


  function animar(
    tempoAtual
  ) {

    if (!inicioTempo) {
      inicioTempo =
        tempoAtual;
    }


    const tempoDecorrido =
      tempoAtual -
      inicioTempo;


    const progresso =
      Math.min(
        tempoDecorrido /
          duracao,
        1
      );


    const ease =
      progresso < 0.5
        ? 2 *
          progresso *
          progresso
        : 1 -
          Math.pow(
            -2 *
              progresso +
              2,
            2
          ) /
            2;


    window.scrollTo(
      0,
      inicio +
        distancia *
          ease
    );


    if (
      progresso < 1
    ) {

      requestAnimationFrame(
        animar
      );

    }

  }


  requestAnimationFrame(
    animar
  );

}


// ==========================================
// BOTÃO "CONHEÇA NOSSOS CURSOS"
// ==========================================

// Usamos o botão especificamente dentro do HERO.
// Não usamos document.querySelector(".btn-principal")
// porque agora também existe o botão do modal.

const btnCursos =
  document.getElementById(
    "btnCursos"
  );


if (btnCursos) {

  btnCursos.addEventListener(
    "click",
    () => {

      const cursos =
        document.getElementById(
          "cursos"
        );

      if (cursos) {

        scrollSuave(cursos);

      }

    }
  );

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarCursosDoBanco();
modalCurso?.addEventListener("keydown", (evento) => {
  if (evento.key !== "Tab") return;
  const controles = [...modalCurso.querySelectorAll("button, a[href]")].filter((el) => !el.disabled && el.getClientRects().length);
  const primeiro = controles[0], ultimo = controles.at(-1);
  if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo?.focus(); }
  if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro?.focus(); }
});
