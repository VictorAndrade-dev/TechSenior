import { auth } from "./Firebase-config.js";

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ========================================
// ELEMENTOS
// ========================================

const formRecuperacao =
  document.getElementById("formRecuperacao");

const emailInput =
  document.getElementById("email");

const mensagem =
  document.getElementById("mensagem");

const btnEnviar =
  document.getElementById("btnEnviar");


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formRecuperacao.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const email =
      emailInput.value.trim();


    // Limpa mensagem anterior
    mostrarMensagem("", "");


    // ========================================
    // VALIDAÇÃO
    // ========================================

    if (email === "") {

      mostrarMensagem(
        "Por favor, informe seu e-mail.",
        "erro"
      );

      emailInput.focus();

      return;
    }


    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formatoEmail.test(email)) {

      mostrarMensagem(
        "Digite um e-mail válido.",
        "erro"
      );

      emailInput.focus();

      return;
    }

    if (email.length > 100) {

      mostrarMensagem(
        "O e-mail deve ter no máximo 100 caracteres.",
        "erro"
      );

      emailInput.focus();

      return;
    }
    
    // ========================================
    // FIREBASE AUTH
    // ========================================

    try {

      btnEnviar.disabled = true;
      btnEnviar.textContent =
        "Enviando...";


      await sendPasswordResetEmail(
        auth,
        email
      );


      mostrarMensagem(
        "Se este e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.",
        "sucesso"
      );


      emailInput.value = "";

    } catch (erro) {

      console.error(
        "Erro ao recuperar senha:",
        erro
      );


      // ======================================
      // TRATAMENTO DE ERROS
      // ======================================

      if (erro.code === "auth/user-not-found" || erro.code === "auth/invalid-credential") {

        mostrarMensagem(
          "Se este e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.",
          "sucesso"
        );

      }

      else if (erro.code === "auth/invalid-email") {

        mostrarMensagem(
          "Digite um e-mail válido.",
          "erro"
        );

      }

      else if (
        erro.code === "auth/too-many-requests"
      ) {

        mostrarMensagem(
          "Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente.",
          "erro"
        );

      }

      else if (
        erro.code === "auth/network-request-failed"
      ) {

        mostrarMensagem(
          "Não foi possível conectar ao serviço. Verifique sua internet e tente novamente.",
          "erro"
        );

      }

      else {

        mostrarMensagem(
          "Não foi possível enviar as instruções. Tente novamente.",
          "erro"
        );

      }

    } finally {

      btnEnviar.disabled = false;

      btnEnviar.textContent =
        "Enviar instruções";

    }

  }
);


// ========================================
// FUNÇÃO DE MENSAGEM
// ========================================

function mostrarMensagem(
  texto,
  tipo
) {

  mensagem.replaceChildren();
  if (texto) {
    const icone = document.createElement("span");
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = tipo === "sucesso" ? "✓" : tipo === "informacao" ? "ℹ" : "⚠";
    const conteudo = document.createElement("span");
    conteudo.textContent = texto;
    mensagem.append(icone, conteudo);
  }
  mensagem.className = texto ? `mensagem auth-feedback ${tipo}` : "mensagem auth-feedback";
  mensagem.setAttribute("role", tipo === "erro" ? "alert" : "status");

}
