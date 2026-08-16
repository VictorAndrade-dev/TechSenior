import { auth, db } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const menuToggle = document.getElementById("menuToggle");
const closeMenu = document.getElementById("closeMenu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });
}

if (closeMenu) {
  closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const alvo = document.querySelector(this.getAttribute("href"));

    if (alvo) {
      alvo.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

const linksSidebar = document.querySelectorAll(".sidebar-nav a");

linksSidebar.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1000) {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }
});

// ===========================
// BOTÃO VOLTAR AO TOPO
// ===========================
const voltarTopo = document.createElement("button");

voltarTopo.innerHTML = "↑";
voltarTopo.id = "topo";

document.body.appendChild(voltarTopo);

voltarTopo.style.position = "fixed";
voltarTopo.style.bottom = "30px";
voltarTopo.style.right = "30px";
voltarTopo.style.width = "55px";
voltarTopo.style.height = "55px";
voltarTopo.style.borderRadius = "50%";
voltarTopo.style.border = "none";
voltarTopo.style.background = "#3bc6b8";
voltarTopo.style.color = "white";
voltarTopo.style.fontSize = "28px";
voltarTopo.style.cursor = "pointer";
voltarTopo.style.boxShadow = "0 5px 15px rgba(0,0,0,.3)";
voltarTopo.style.display = "none";

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    voltarTopo.style.display = "block";
  } else {
    voltarTopo.style.display = "none";
  }
});

voltarTopo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ==========================================
// AUTENTICAÇÃO DO USUÁRIO
// ==========================================

const btnUsuario = document.getElementById("btnUsuario");

if (btnUsuario) {
  onAuthStateChanged(auth, async (usuario) => {

    if (usuario) {

      try {
        const referenciaUsuario = doc(db, "usuarios", usuario.uid);
        const documentoUsuario = await getDoc(referenciaUsuario);

        let nome = usuario.email;

        if (documentoUsuario.exists()) {
          const dados = documentoUsuario.data();

          if (dados.nome) {
            nome = dados.nome;
          }
        }

        btnUsuario.innerHTML = `
          <i class="fa-solid fa-user"></i>
          ${nome}
        `;

        btnUsuario.onclick = () => {
          window.location.href = "Perfil.html";
        };

      } catch (erro) {

        console.error(
          "Erro ao carregar dados do usuário:",
          erro
        );

        btnUsuario.innerHTML = `
          <i class="fa-solid fa-user"></i>
          ${usuario.email}
        `;

        btnUsuario.onclick = () => {
          window.location.href = "Perfil.html";
        };
      }

    } else {

      btnUsuario.innerHTML = `
        <i class="fa-solid fa-user"></i>
        Entrar
      `;

      btnUsuario.onclick = () => {
        window.location.href = "Login.html";
      };
    }
  });
}