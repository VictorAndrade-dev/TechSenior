import { auth } from "./Firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { meuPerfil } from "../dataconnect-generated/esm/index.esm.js";
import { configurarAcessibilidade } from "./Acessibilidade.js";

const menuToggle = document.getElementById("menuToggle");
const botaoContaMobile = document.getElementById("abrirContaMobile");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeMenu = document.getElementById("closeMenu");
const drawerUsuario = document.getElementById("drawerUsuario");
const drawerPreferencias = document.getElementById("drawerPreferencias");
const drawerAdmin = document.getElementById("drawerAdmin");
const drawerConta = document.getElementById("drawerConta");
const homeNavV2 = document.body.classList.contains("nav-v2");
let focoAnterior;
const estadosInert = new Map();

function definirEstadoDosGatilhos(aberto) {
  menuToggle?.setAttribute("aria-expanded", String(aberto));
  botaoContaMobile?.setAttribute("aria-expanded", String(aberto));
}

function fecharMenu() {
  if (!sidebar) return;
  sidebar.classList.remove("active");
  sidebar.inert = true;
  overlay?.classList.remove("active");
  definirEstadoDosGatilhos(false);
  document.body.classList.remove("drawer-aberto");
  document.body.style.overflow = "";
  for (const [elemento, anterior] of estadosInert) elemento.inert = anterior;
  estadosInert.clear();
  focoAnterior?.focus();
  focoAnterior = null;
}

function abrirMenu(gatilho) {
  if (!sidebar || !overlay) return;
  focoAnterior = gatilho || document.activeElement;
  sidebar.inert = false;
  sidebar.classList.add("active");
  overlay.classList.add("active");
  definirEstadoDosGatilhos(true);
  document.body.classList.add("drawer-aberto");
  document.body.style.overflow = "hidden";

  for (const elemento of document.body.children) {
    if (elemento === sidebar || elemento === overlay || elemento.contains(sidebar)) continue;
    estadosInert.set(elemento, elemento.inert);
    elemento.inert = true;
  }
  setTimeout(() => closeMenu?.focus({ preventScroll: true }), 250);
}

if (sidebar && overlay) {
  sidebar.inert = true;
  sidebar.setAttribute("role", "dialog");
  sidebar.setAttribute("aria-label", homeNavV2 ? "Painel de conta e preferências" : "Menu de navegação e acessibilidade");
  sidebar.setAttribute("aria-modal", "true");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
  menuToggle?.setAttribute("aria-controls", sidebar.id);
  botaoContaMobile?.setAttribute("aria-label", "Abrir painel de perfil");
  closeMenu?.setAttribute("aria-label", "Fechar painel");
  definirEstadoDosGatilhos(false);

  menuToggle?.addEventListener("click", () => abrirMenu(menuToggle));
  botaoContaMobile?.addEventListener("click", () => abrirMenu(botaoContaMobile));
  closeMenu?.addEventListener("click", fecharMenu);
  overlay.addEventListener("click", fecharMenu);
  sidebar.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();
      return;
    }
    if (evento.key !== "Tab") return;
    const controles = [...sidebar.querySelectorAll("a[href], button, select, input")]
      .filter((elemento) => !elemento.disabled && elemento.getClientRects().length);
    const primeiro = controles[0];
    const ultimo = controles.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo?.focus();
    }
    if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro?.focus();
    }
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && sidebar.classList.contains("active")) fecharMenu();
  });
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));
  window.addEventListener("resize", () => {
    if (innerWidth > 1000 && sidebar.classList.contains("active")) fecharMenu();
  });
}

const identidade = document.createElement("a");
identidade.className = "drawer-identidade";
const avatar = document.createElement("span");
avatar.className = "drawer-avatar";
avatar.setAttribute("aria-hidden", "true");
const dadosIdentidade = document.createElement("span");
dadosIdentidade.className = "drawer-identidade-texto";
const nomeDrawer = document.createElement("strong");
const acaoDrawer = document.createElement("span");
dadosIdentidade.append(nomeDrawer, acaoDrawer);
identidade.append(avatar, dadosIdentidade);

const destinoIdentidade = drawerUsuario || sidebar;
if (destinoIdentidade) {
  if (drawerUsuario) {
    const titulo = document.createElement("p");
    titulo.className = "drawer-titulo";
    titulo.textContent = "Usuário";
    drawerUsuario.append(titulo, identidade);
  } else {
    closeMenu?.after(identidade);
  }
}

const sair = document.createElement("button");
sair.type = "button";
sair.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>Sair</span>';
sair.className = "drawer-sair";
sair.hidden = true;
sair.addEventListener("click", async () => {
  sair.disabled = true;
  try {
    await signOut(auth);
    location.href = "index.html";
  } catch {
    sair.querySelector("span").textContent = "Não foi possível sair. Tentar novamente";
    sair.disabled = false;
  }
});

const linkConta = document.createElement("a");
linkConta.className = "drawer-link-conta";
linkConta.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i><span>Meu perfil</span>';
linkConta.addEventListener("click", fecharMenu);

if (drawerConta) {
  const tituloConta = document.createElement("p");
  tituloConta.className = "drawer-titulo";
  tituloConta.textContent = "Conta";
  drawerConta.append(tituloConta, linkConta, sair);
} else {
  sidebar?.append(sair);
}

const btnUsuario = document.getElementById("btnUsuario") || document.querySelector("body > header .btn-login");
btnUsuario?.addEventListener("click", (evento) => {
  evento.preventDefault();
  location.href = auth.currentUser ? "Perfil.html" : "Login.html";
});

onAuthStateChanged(auth, async (usuario) => {
  document.querySelectorAll("[data-link-admin]").forEach((elemento) => elemento.remove());
  const nome = usuario?.displayName?.trim() || "Meu perfil";

  if (btnUsuario) {
    const icone = document.createElement("i");
    icone.className = "fa-solid fa-user";
    icone.setAttribute("aria-hidden", "true");
    btnUsuario.replaceChildren(icone, document.createTextNode(usuario ? nome : "Entrar"));
  }

  identidade.href = usuario ? "Perfil.html" : "Login.html";
  nomeDrawer.textContent = usuario ? nome : "Entrar";
  acaoDrawer.textContent = usuario ? "Ver meu perfil →" : "Crie ou acesse sua conta";
  avatar.textContent = usuario
    ? nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()
    : "TS";

  if (usuario?.photoURL) {
    const foto = document.createElement("img");
    foto.src = usuario.photoURL;
    foto.alt = "";
    foto.referrerPolicy = "no-referrer";
    foto.onerror = () => {
      avatar.textContent = nome[0]?.toUpperCase() || "U";
    };
    avatar.replaceChildren(foto);
  }

  sair.hidden = !usuario;
  linkConta.href = usuario ? "Perfil.html" : "Login.html";
  linkConta.querySelector("span").textContent = usuario ? "Meu perfil" : "Entrar";
  if (!usuario) return;

  try {
    const resposta = await meuPerfil();
    if (auth.currentUser?.uid !== usuario.uid || resposta.data?.usuarios?.[0]?.tipoUsuario?.nome !== "Administrador") return;

    const navDesktop = document.querySelector("body > header nav");
    if (navDesktop) {
      const link = document.createElement("a");
      link.href = "Admin.html";
      link.dataset.linkAdmin = "true";
      link.textContent = "Administração";
      navDesktop.append(link);
    }

    const linkAdmin = document.createElement("a");
    linkAdmin.href = "Admin.html";
    linkAdmin.dataset.linkAdmin = "true";
    linkAdmin.innerHTML = '<i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span>Painel administrativo</span>';
    linkAdmin.addEventListener("click", fecharMenu);

    if (drawerAdmin) {
      const tituloAdmin = document.createElement("p");
      tituloAdmin.className = "drawer-titulo";
      tituloAdmin.textContent = "Administrador";
      drawerAdmin.hidden = false;
      drawerAdmin.replaceChildren(tituloAdmin, linkAdmin);
    } else {
      sidebar?.querySelector(".sidebar-nav")?.append(linkAdmin);
    }
  } catch (erro) {
    console.warn("Não foi possível consultar o papel da conta.", erro);
  }
});

configurarAcessibilidade(sidebar, drawerPreferencias);

const topo = document.createElement("button");
topo.id = "voltarTopo";
topo.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
topo.setAttribute("aria-label", "Voltar ao topo");
topo.hidden = true;
document.body.append(topo);
window.addEventListener("scroll", () => {
  topo.hidden = scrollY < 300;
});
topo.addEventListener("click", () => window.scrollTo({
  top: 0,
  behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
}));

// ============================================================
// LINK "FALE CONOSCO" DO RODAPÉ
// ============================================================

const linkFaleConosco = [...document.querySelectorAll("footer a")]
  .find((link) => link.textContent.trim() === "Fale Conosco");

if (linkFaleConosco) {
  linkFaleConosco.href = "ContatoSuporte.html#formulario-contato";
}