import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ==========================================
// ANIMAÇÃO AO APARECER
// ==========================================

const elementos = document.querySelectorAll(
  ".missao, .porque, .oferecemos, .ods, .equipe, .card, .membro",
);

const observador = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },

  {
    threshold: 0.2,
  },
);

elementos.forEach((elemento) => {
  elemento.style.opacity = "0";
  elemento.style.transform = "translateY(40px)";
  elemento.style.transition = ".8s";

  observador.observe(elemento);
});

// ==========================================
// HOVER DOS MEMBROS DA EQUIPE
// ==========================================

const membros = document.querySelectorAll(".membro");

membros.forEach((membro) => {
  membro.addEventListener("mouseenter", () => {
    membro.style.transform = "translateY(-12px)";
    membro.style.transition = ".4s";
  });

  membro.addEventListener("mouseleave", () => {
    membro.style.transform = "translateY(0px)";
  });
});

// ==========================================
// EFEITO DE CONTADOR
// (caso você adicione números depois)
// ==========================================

const contadores = document.querySelectorAll(".contador");

contadores.forEach((contador) => {
  contador.innerText = "0";

  const atualizar = () => {
    const alvo = +contador.getAttribute("data-target");

    const atual = +contador.innerText;

    const incremento = alvo / 100;

    if (atual < alvo) {
      contador.innerText = `${Math.ceil(atual + incremento)}`;

      setTimeout(atualizar, 20);
    } else {
      contador.innerText = alvo;
    }
  };

  atualizar();
});

//BOTÃO CONHEÇA NOSSA MISSÃO

const btnMissao = document.querySelector(".btn-principal");

if (btnMissao) {
  btnMissao.addEventListener("click", () => {
    scrollSuave(document.getElementById("missao"));
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

//Botão Comecar (CTA)

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
