import { auth } from "./Firebase-config.js";

import {
  listarCursos,
} from "../dataconnect-generated/esm/index.esm.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const ID_CURSO_CELULAR =
  "7a831a7c8c3c41768575f4e46a3df222";

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

let usuarioAtual = null;
let cursoSelecionado = null;


// ==========================================
// LOGIN
// ==========================================

onAuthStateChanged(auth, (usuario) => {
  usuarioAtual = usuario;
});


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

function abrirModalCurso(curso) {

  cursoSelecionado =
    curso;

  modalCursoTitulo.innerHTML = "";

  const icone =
    document.createElement("i");

  icone.className =
    curso.icone ||
    "fa-solid fa-book-open";

  const textoTitulo =
    document.createTextNode(
      ` ${curso.nome}`
    );

  modalCursoTitulo.appendChild(icone);
  modalCursoTitulo.appendChild(textoTitulo);


  modalCursoDescricao.textContent =
    curso.descricao ||
    "Conheça este curso do TechSênior.";


  modalCursoDificuldade.textContent =
    curso.dificuldade ||
    "Não informado";


  modalCursoDuracao.textContent =
    curso.cargaHoraria
      ? `${curso.cargaHoraria} minutos`
      : "Duração não informada";


  configurarBotaoIniciar(curso);


  modalCurso.style.display =
    "flex";

}


// ==========================================
// DESTINO DO CURSO
// ==========================================

function obterDestinoCurso(curso) {

  if (
    curso.id ===
    ID_CURSO_CELULAR
  ) {

    return "CursoCelular.html";

  }

  return null;

}


// ==========================================
// CONFIGURAR BOTÃO INICIAR
// ==========================================

function configurarBotaoIniciar(curso) {

  const destino =
    obterDestinoCurso(curso);

  btnIniciarCurso.classList.remove(
    "desabilitado"
  );

  btnIniciarCurso.removeAttribute(
    "aria-disabled"
  );


  if (destino) {

    btnIniciarCurso.innerHTML = `
      <i class="fa-solid fa-play"></i>
      Iniciar Curso
    `;

    btnIniciarCurso.dataset.destino =
      destino;

    return;

  }


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