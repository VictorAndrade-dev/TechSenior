import { auth } from "./Firebase-config.js";

import {
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  meuPerfil,
  atualizarNomeUsuario
} from "../dataconnect-generated/esm/index.esm.js";


// ========================================
// ELEMENTOS
// ========================================

const formEdicao =
  document.getElementById("formEdicao");

const nomeInput =
  document.getElementById("nome");

const emailInput =
  document.getElementById("email");

const mensagem =
  document.getElementById("mensagem");

const btnSalvar =
  document.getElementById("btnSalvar");


// ========================================
// USUÁRIO ATUAL
// ========================================

let usuarioAtual = null;


// ========================================
// CARREGAR PERFIL
// ========================================

onAuthStateChanged(
  auth,
  async (usuario) => {

    if (!usuario) {

      window.location.href =
        "Login.html";

      return;
    }


    usuarioAtual = usuario;


    try {

      const resposta =
        await meuPerfil();

      const dados =
        resposta.data.usuarios?.[0];


      if (!dados) {

        mostrarMensagem(
          "Não foi possível encontrar seu perfil.",
          "erro"
        );

        return;
      }


      nomeInput.value =
        dados.nome || "";

      emailInput.value =
        dados.email ||
        usuario.email ||
        "";


    } catch (erro) {

      console.error(
        "Erro ao carregar perfil:",
        erro
      );

      mostrarMensagem(
        "Não foi possível carregar suas informações.",
        "erro"
      );

    }

  }
);


// ========================================
// SALVAR ALTERAÇÕES
// ========================================

formEdicao.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const nome =
      nomeInput.value.trim();


    mensagem.textContent = "";
    mensagem.className = "mensagem";


    // ====================================
    // VALIDAÇÃO
    // ====================================

    if (nome === "") {

      mostrarMensagem(
        "Por favor, informe seu nome.",
        "erro"
      );

      nomeInput.focus();

      return;
    }


    if (!usuarioAtual) {

      mostrarMensagem(
        "Sua sessão expirou. Faça login novamente.",
        "erro"
      );

      return;
    }


    // ====================================
    // SALVAR
    // ====================================

    try {

      btnSalvar.disabled = true;

      btnSalvar.textContent =
        "Salvando...";


      // PostgreSQL
      await atualizarNomeUsuario({
        nome
      });


      // Firebase Authentication
      await updateProfile(
        usuarioAtual,
        {
          displayName: nome
        }
      );


      mostrarMensagem(
        "Suas informações foram atualizadas com sucesso!",
        "sucesso"
      );


      setTimeout(() => {

        window.location.href =
          "Perfil.html";

      }, 1200);


    } catch (erro) {

      console.error(
        "Erro ao atualizar perfil:",
        erro
      );


      mostrarMensagem(
        "Não foi possível salvar as alterações. Tente novamente.",
        "erro"
      );


      btnSalvar.disabled = false;

      btnSalvar.textContent =
        "Salvar alterações";

    }

  }
);


// ========================================
// MENSAGEM
// ========================================

function mostrarMensagem(
  texto,
  tipo
) {

  mensagem.textContent =
    texto;

  mensagem.className =
    `mensagem ${tipo}`;

}