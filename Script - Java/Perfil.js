import { auth } from "./Firebase-config.js";

import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { meuPerfil } from "../dataconnect-generated/esm/index.esm.js";

// ==========================================
// ELEMENTOS DO PERFIL
// ==========================================

const senhaUsuario = document.getElementById("senhaUsuario");
const mostrarSenha = document.getElementById("mostrarSenha");

const nomePerfil = document.getElementById("nomePerfil");
const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");

const btnSair = document.getElementById("btnSair");

// ==========================================
// SENHA
// ==========================================
//
// A senha pertence ao Firebase Authentication.
// Ela nunca é armazenada nem recuperada do
// PostgreSQL.
// ==========================================

if (senhaUsuario) {
  senhaUsuario.textContent = "••••••••";
}

if (mostrarSenha) {
  mostrarSenha.addEventListener("click", () => {
    senhaUsuario.textContent = "••••••••";

    mostrarSenha.innerHTML = `
      <i class="fa-solid fa-eye"></i>
    `;

    alert("Por segurança, a senha não pode ser exibida.");
  });
}

// ==========================================
// CARREGAR USUÁRIO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
  // ========================================
  // USUÁRIO NÃO ESTÁ LOGADO
  // ========================================

  if (!usuario) {
    window.location.href = "Login.html";

    return;
  }

  try {
    // ======================================
    // BUSCAR PERFIL NO POSTGRESQL
    // ======================================

    const resposta = await meuPerfil();

    const dados = resposta.data.usuarios?.[0];

    // ======================================
    // PERFIL ENCONTRADO
    // ======================================

    if (dados) {
      if (dados.nome && usuario.displayName !== dados.nome) {
        await updateProfile(usuario, {
          displayName: dados.nome,
        });
      }

      if (nomePerfil) {
        nomePerfil.textContent = dados.nome || "Usuário";
      }

      if (nomeUsuario) {
        nomeUsuario.textContent = dados.nome || "Usuário";
      }

      if (emailUsuario) {
        emailUsuario.textContent = dados.email || usuario.email || "";
      }

      console.log("Perfil carregado do PostgreSQL:", dados);
    }

    // ======================================
    // PERFIL NÃO ENCONTRADO
    // ======================================
    else {
      console.warn("Perfil não encontrado no PostgreSQL.");

      if (nomePerfil) {
        nomePerfil.textContent = "Usuário";
      }

      if (nomeUsuario) {
        nomeUsuario.textContent = "Usuário";
      }

      if (emailUsuario) {
        emailUsuario.textContent = usuario.email || "";
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);

    // ======================================
    // FALLBACK
    // ======================================

    if (nomePerfil) {
      nomePerfil.textContent = "Usuário";
    }

    if (nomeUsuario) {
      nomeUsuario.textContent = "Usuário";
    }

    if (emailUsuario) {
      emailUsuario.textContent = usuario.email || "";
    }
  }
});

// ==========================================
// SAIR DA CONTA
// ==========================================

if (btnSair) {
  btnSair.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja sair da sua conta?");

    if (!confirmar) {
      return;
    }

    try {
      await signOut(auth);

      alert("Você saiu da sua conta.");

      window.location.href = "Login.html";
    } catch (erro) {
      console.error("Erro ao sair:", erro);

      alert("Não foi possível sair da conta. Tente novamente.");
    }
  });
}
