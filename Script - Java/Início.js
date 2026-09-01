import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

//Botão Começar (CTA)

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
      window.location.href = usuario ? "Cursos.html#cursos" : "Login.html";
    };
  });
}

// ==========================================
// ANIMAÇÃO AO APARECER - PÁGINA INICIAL
// ==========================================

const elementos = document.querySelectorAll(
  ".hero-texto, .hero-img, .sobre-texto, .sobre-imagem, .ajuda-card, .curso-card, .estatistica, .depoimento-card, .cta",
);

const observador = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";

        entry.target.style.transform = "translateY(0)";

        observador.unobserve(entry.target);
      }
    });
  },

  {
    threshold: 0.2,
  },
);

// Configuração inicial e ativação

elementos.forEach((elemento) => {
  elemento.style.opacity = "0";

  elemento.style.transform = "translateY(40px)";

  elemento.style.transition = "0.7s ease";

  observador.observe(elemento);
});

//Seção Cursos

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const destino = this.getAttribute("href");

    if (destino.includes("#")) {
      e.preventDefault();

      const url = destino.split("#")[0];
      const id = destino.split("#")[1];

      // Se for outra página
      if (url && url !== window.location.pathname.split("/").pop()) {
        window.location.href = destino;

        return;
      }

      const elemento = document.getElementById(id);

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

function scrollSuave(elemento, duracao = 1500) {
  const inicio = window.scrollY;

  const destino = elemento.offsetTop;

  const distancia = destino - inicio;

  let inicioTempo = null;

  function animar(tempoAtual) {
    if (!inicioTempo) inicioTempo = tempoAtual;

    const progresso = tempoAtual - inicioTempo;

    const porcentagem = Math.min(progresso / duracao, 1);

    window.scrollTo(0, inicio + distancia * porcentagem);

    if (progresso < duracao) {
      requestAnimationFrame(animar);
    }
  }

  requestAnimationFrame(animar);
}

//BOTÃO CONHEÇA NOSSA PÁGINA

const btnInicio = document.querySelector(".btn-principal");

if (btnInicio) {
  btnInicio.addEventListener("click", () => {
    scrollSuave(document.getElementById("sobre"));
  });
}

function scrollSuave(destino, duracao = 2000) {
  const inicio = window.pageYOffset;
  const fim = destino.offsetTop - 80;
  const distancia = fim - inicio;

  let inicioTempo = null;

  function animacao(tempoAtual) {
    if (!inicioTempo) inicioTempo = tempoAtual;

    const tempoDecorrido = tempoAtual - inicioTempo;

    const progresso = Math.min(tempoDecorrido / duracao, 1);

    // Ease In Out
    const ease =
      progresso < 0.5
        ? 2 * progresso * progresso
        : 1 - Math.pow(-2 * progresso + 2, 2) / 2;

    window.scrollTo(0, inicio + distancia * ease);

    if (progresso < 1) {
      requestAnimationFrame(animacao);
    }
  }

  requestAnimationFrame(animacao);
}
