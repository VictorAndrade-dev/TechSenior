import { auth, db } from "./Firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ==========================================
// ELEMENTOS DO PERFIL
// ==========================================

const senhaUsuario = document.getElementById("senhaUsuario");
const mostrarSenha = document.getElementById("mostrarSenha");

const nomePerfil = document.getElementById("nomePerfil");
const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");


// ==========================================
// SENHA
// ==========================================

// A senha não é recuperada do Firebase.
// Apenas mostramos uma representação visual.

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
  // NENHUM USUÁRIO LOGADO
  // ========================================

  if (!usuario) {
    window.location.href = "Login.html";
    return;
  }


  // ========================================
  // E-MAIL DO AUTHENTICATION
  // ========================================

  if (emailUsuario) {
    emailUsuario.textContent = usuario.email;
  }


  // ========================================
  // BUSCAR DADOS NO FIRESTORE
  // ========================================

  try {

    const referenciaUsuario = doc(
      db,
      "usuarios",
      usuario.uid
    );

    const documentoUsuario = await getDoc(
      referenciaUsuario
    );


    if (documentoUsuario.exists()) {

      const dados = documentoUsuario.data();

      if (nomePerfil) {
        nomePerfil.textContent =
          dados.nome || "Usuário";
      }

      if (nomeUsuario) {
        nomeUsuario.textContent =
          dados.nome || "Usuário";
      }

    } else {

      if (nomePerfil) {
        nomePerfil.textContent = "Usuário";
      }

      if (nomeUsuario) {
        nomeUsuario.textContent = "Usuário";
      }

      console.warn(
        "Documento do usuário não encontrado no Firestore."
      );
    }

  } catch (erro) {

    console.error(
      "Erro ao carregar perfil:",
      erro
    );

    if (nomePerfil) {
      nomePerfil.textContent = "Usuário";
    }

    if (nomeUsuario) {
      nomeUsuario.textContent = "Usuário";
    }
  }

  // ==========================================
  // SAIR DA CONTA
  // ==========================================

  const btnSair = document.getElementById("btnSair");

  if (btnSair) {
    btnSair.addEventListener("click", async () => {

      const confirmar = confirm(
        "Tem certeza que deseja sair da sua conta?"
      );

      if (!confirmar) {
        return;
      }

      try {

        await signOut(auth);

        alert("Você saiu da sua conta.");

        window.location.href = "Login.html";

      } catch (erro) {

        console.error("Erro ao sair:", erro);

        alert(
          "Não foi possível sair da conta. Tente novamente."
        );
      }

    });
  }

});
