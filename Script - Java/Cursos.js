import { auth } from "./Firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ==========================================
// CONTROLE UNIVERSAL DOS MODAIS DOS CURSOS
// ==========================================

const botoesVerCurso = document.querySelectorAll(".btn-card");

botoesVerCurso.forEach((botao) => {
  botao.addEventListener("click", (e) => {
    e.preventDefault();

    const idModal = botao.getAttribute("data-modal");
    const modalTarget = document.getElementById(idModal);

    if (!modalTarget) return;

    modalTarget.style.display = "flex";

    const botaoFechar = modalTarget.querySelector(".fechar-modal");

    if (botaoFechar) {
      botaoFechar.onclick = () => {
        modalTarget.style.display = "none";
      };
    }

    modalTarget.onclick = (evento) => {
      if (evento.target === modalTarget) {
        modalTarget.style.display = "none";
      }
    };
  });
});

// ==========================================
// VERIFICAÇÃO DE LOGIN PARA INICIAR CURSO
// ==========================================

let usuarioAtual = null;

onAuthStateChanged(auth, (usuario) => {
  usuarioAtual = usuario;
});

// Todos os links "Iniciar Curso" dos modais
const botoesIniciarCurso = document.querySelectorAll(
  ".modal .btn-principal"
);

botoesIniciarCurso.forEach((botao) => {
  botao.addEventListener("click", (e) => {
    e.preventDefault();

    const destino = botao.getAttribute("href");

    if (!destino) return;

    if (usuarioAtual) {
      window.location.href = destino;
    } else {
      window.location.href = "Login.html";
    }
  });
});

// ==========================================
// ANIMAÇÃO DOS CARDS
// ==========================================

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
    card.style.transition = "0.3s";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// ==========================================
// ANIMAÇÃO AO APARECER NA TELA
// ==========================================

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.style.opacity = "1";
      entrada.target.style.transform = "translateY(0)";
    }
  });
});

cards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.8s";

  observador.observe(card);
});

// ==========================================
// BOTÃO COMEÇAR
// ==========================================

const btnComecar = document.getElementById("btnComecar");

if (btnComecar) {
  onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
      btnComecar.innerHTML = `
        <i class="fa-solid fa-graduation-cap"></i>
        Continuar aprendendo
      `;
    }

    btnComecar.onclick = () => {
      if (usuario) {
        document.getElementById("cursos")?.scrollIntoView({
          behavior: "smooth"
        });

        return;
      }

      window.location.href = "Login.html";
    };
  });
}

// ==========================================
// FAQ
// ==========================================

const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
  accordion.addEventListener("click", () => {
    const resposta = accordion.nextElementSibling;

    if (!resposta) return;

    const estaAberto = accordion.classList.contains("active");

    accordion.classList.toggle("active");

    if (estaAberto) {
      resposta.classList.remove("aberta");
    } else {
      resposta.classList.add("aberta");
    }
  });
});

// ==========================================
// SCROLL AUTOMÁTICO PARA A SEÇÃO DE CURSOS
// ==========================================

window.addEventListener("load", () => {
  if (window.location.hash === "#cursos") {
    setTimeout(() => {
      const destino = document.getElementById("cursos");

      if (destino) {
        scrollSuave(destino, 2000);
      }
    }, 400);
  }
});

// ==========================================
// FUNÇÃO DE SCROLL SUAVE
// ==========================================

function scrollSuave(destino, duracao = 2000) {
  if (!destino) return;

  const inicio = window.scrollY;

  const posicaoDestino =
    destino.getBoundingClientRect().top + window.scrollY;

  const fim = posicaoDestino - 90;
  const distancia = fim - inicio;

  let inicioTempo = null;

  function animar(tempoAtual) {
    if (!inicioTempo) {
      inicioTempo = tempoAtual;
    }

    const tempoDecorrido = tempoAtual - inicioTempo;

    const progresso = Math.min(
      tempoDecorrido / duracao,
      1
    );

    const ease =
      progresso < 0.5
        ? 2 * progresso * progresso
        : 1 - Math.pow(-2 * progresso + 2, 2) / 2;

    window.scrollTo(
      0,
      inicio + distancia * ease
    );

    if (progresso < 1) {
      requestAnimationFrame(animar);
    }
  }

  requestAnimationFrame(animar);
}

// ==========================================
// BOTÃO "CONHEÇA NOSSOS CURSOS"
// ==========================================

const btnCursos = document.querySelector(".btn-principal");

if (btnCursos) {
  btnCursos.addEventListener("click", () => {
    const cursos = document.getElementById("cursos");

    if (cursos) {
      scrollSuave(cursos);
    }
  });
}