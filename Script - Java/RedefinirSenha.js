import { auth } from "./Firebase-config.js";

import {
  verifyPasswordResetCode,
  confirmPasswordReset
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ========================================
// ELEMENTOS
// ========================================

const formRedefinicao =
  document.getElementById("formRedefinicao");

const novaSenhaInput =
  document.getElementById("novaSenha");

const confirmarSenhaInput =
  document.getElementById("confirmarSenha");

const mensagem =
  document.getElementById("mensagem");

const btnRedefinir =
  document.getElementById("btnRedefinir");


// ========================================
// PEGAR CÓDIGO DO LINK
// ========================================

const parametros =
  new URLSearchParams(window.location.search);

const modo =
  parametros.get("mode");

const oobCode =
  parametros.get("oobCode");


// ========================================
// VALIDAR LINK DE RECUPERAÇÃO
// ========================================

async function validarLink() {

  if (
    modo !== "resetPassword" ||
    !oobCode
  ) {

    bloquearFormulario();

    mostrarMensagem(
      "Este link de recuperação é inválido.",
      "erro"
    );

    return;
  }


  try {

    await verifyPasswordResetCode(
      auth,
      oobCode
    );

  } catch (erro) {

    console.error(
      "Erro ao validar link:",
      erro
    );

    bloquearFormulario();


    if (erro.code === "auth/expired-action-code") {

      mostrarMensagem(
        "Este link de recuperação expirou. Solicite um novo link.",
        "erro"
      );

    } else {

      mostrarMensagem(
        "Este link de recuperação é inválido ou já foi utilizado.",
        "erro"
      );

    }

  }

}


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formRedefinicao.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const novaSenha =
      novaSenhaInput.value;

    const confirmarSenha =
      confirmarSenhaInput.value;


    mensagem.textContent = "";
    mensagem.className = "mensagem";


    // ====================================
    // VALIDAÇÃO
    // ====================================

    if (
      novaSenha === "" ||
      confirmarSenha === ""
    ) {

      mostrarMensagem(
        "Preencha todos os campos.",
        "erro"
      );

      return;
    }


    if (novaSenha.length < 6) {

      mostrarMensagem(
        "A senha deve ter pelo menos 6 caracteres.",
        "erro"
      );

      novaSenhaInput.focus();

      return;
    }


    if (
      novaSenha !== confirmarSenha
    ) {

      mostrarMensagem(
        "As senhas não coincidem.",
        "erro"
      );

      confirmarSenhaInput.focus();

      return;
    }


    if (!oobCode) {

      mostrarMensagem(
        "O link de recuperação é inválido.",
        "erro"
      );

      return;
    }


    // ====================================
    // FIREBASE AUTH
    // ====================================

    try {

      btnRedefinir.disabled = true;

      btnRedefinir.textContent =
        "Redefinindo...";


      await confirmPasswordReset(
        auth,
        oobCode,
        novaSenha
      );


      mostrarMensagem(
        "Senha redefinida com sucesso! Você será redirecionado para o login.",
        "sucesso"
      );


      formRedefinicao.reset();


      setTimeout(() => {

        window.location.href =
          "Login.html";

      }, 2000);


    } catch (erro) {

      console.error(
        "Erro ao redefinir senha:",
        erro
      );


      if (
        erro.code ===
        "auth/expired-action-code"
      ) {

        mostrarMensagem(
          "Este link expirou. Solicite uma nova recuperação de senha.",
          "erro"
        );

      }

      else if (
        erro.code ===
        "auth/invalid-action-code"
      ) {

        mostrarMensagem(
          "Este link é inválido ou já foi utilizado.",
          "erro"
        );

      }

      else if (
        erro.code ===
        "auth/weak-password"
      ) {

        mostrarMensagem(
          "A nova senha é muito fraca.",
          "erro"
        );

      }

      else {

        mostrarMensagem(
          "Não foi possível redefinir sua senha. Tente novamente.",
          "erro"
        );

      }


      btnRedefinir.disabled = false;

      btnRedefinir.textContent =
        "Redefinir senha";

    }

  }
);


// ========================================
// BLOQUEAR FORMULÁRIO
// ========================================

function bloquearFormulario() {

  novaSenhaInput.disabled = true;

  confirmarSenhaInput.disabled = true;

  btnRedefinir.disabled = true;

}


// ========================================
// MENSAGEM
// ========================================

function mostrarMensagem(
  texto,
  tipo
) {

  mensagem.textContent = texto;

  mensagem.className =
    `mensagem ${tipo}`;

}


// ========================================
// INICIALIZAÇÃO
// ========================================

validarLink();