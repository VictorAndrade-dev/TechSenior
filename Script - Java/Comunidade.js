import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ==========================================
// MODAIS DA COMUNIDADE
// ==========================================

// BOTÕES DOS CARDS

const abrirConversa = document.getElementById("abrirConversa");

const abrirAvaliacao = document.getElementById("abrirAvaliacao");

const abrirContato = document.getElementById("abrirContato");

// MODAIS

const modalConversa = document.getElementById("modalConversa");

const modalAvaliacao = document.getElementById("modalAvaliacao");

const modalContato = document.getElementById("modalContato");

// BOTÕES DE FECHAR

const fecharModais = document.querySelectorAll(".fechar-modal");

// ==========================================
// ABRIR MODAIS
// ==========================================

if (abrirConversa) {
  abrirConversa.addEventListener("click", () => {
    modalConversa.style.display = "flex";
  });
}

if (abrirAvaliacao) {
  abrirAvaliacao.addEventListener("click", () => {
    modalAvaliacao.style.display = "flex";
  });
}

if (abrirContato) {
  abrirContato.addEventListener("click", () => {
    modalContato.style.display = "flex";
  });
}

// ==========================================
// FECHAR PELO X
// ==========================================

fecharModais.forEach((botao) => {
  botao.addEventListener("click", () => {
    modalConversa.style.display = "none";

    modalAvaliacao.style.display = "none";

    modalContato.style.display = "none";
  });
});

// ==========================================
// FECHAR CLICANDO FORA
// ==========================================

window.addEventListener("click", (evento) => {
  if (evento.target === modalConversa) {
    modalConversa.style.display = "none";
  }

  if (evento.target === modalAvaliacao) {
    modalAvaliacao.style.display = "none";
  }

  if (evento.target === modalContato) {
    modalContato.style.display = "none";
  }
});

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
      if (usuario) {
        window.location.href = "Cursos.html#cursos";
        return;
      }

      window.location.href = "Login.html";
    };
  });
}
