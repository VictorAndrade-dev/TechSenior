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
// ALTERAÇÃO DO BOTÃO DE LOGIN/PERFIL
// ==========================================

const btnUsuario = document.getElementById("btnUsuario");

if (btnUsuario) {
  const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";

  if (usuarioLogado) {
    const nome = localStorage.getItem("usuarioNome");

    btnUsuario.innerHTML = `

            <i class="fa-solid fa-user"></i>

            ${nome}

        `;

    btnUsuario.onclick = () => {
      window.location.href = "Perfil.html";
    };
  } else {
    btnUsuario.onclick = () => {
      window.location.href = "Login.html";
    };
  }
}
