import { configurarValidacaoSenha } from "./ValidacaoSenha.js";
import { auth } from "./Firebase-config.js";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  cadastrarUsuario,
  meuPerfil
} from "../dataconnect-generated/esm/index.esm.js";

// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================

const mostrarSenha = document.getElementById("mostrarSenha");
const senha = document.getElementById("senha");
const validarSenha = configurarValidacaoSenha(senha, document.getElementById("confirmarSenha"));
const mensagemCadastro = document.getElementById("mensagemCadastro");

function mostrarMensagemCadastro(texto, tipo) {
  mensagemCadastro.replaceChildren();
  if (texto) {
    const icone = document.createElement("span");
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = tipo === "sucesso" ? "✓" : tipo === "informacao" ? "ℹ" : "⚠";
    const conteudo = document.createElement("span");
    conteudo.textContent = texto;
    mensagemCadastro.append(icone, conteudo);
  }
  mensagemCadastro.className = texto ? `mensagem auth-feedback ${tipo}` : "mensagem auth-feedback";
  mensagemCadastro.setAttribute("role", tipo === "erro" ? "alert" : "status");
}

if (mostrarSenha) {

  mostrarSenha.addEventListener("click", () => {

    if (senha.type === "password") {

      senha.type = "text";

      mostrarSenha.innerHTML = `
        <i class="fa-solid fa-eye-slash"></i>
      `;

    } else {

      senha.type = "password";

      mostrarSenha.innerHTML = `
        <i class="fa-solid fa-eye"></i>
      `;

    }

  });

}


// ==========================================
// CADASTRO
// ==========================================

const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {

  formCadastro.addEventListener("submit", async (evento) => {

    evento.preventDefault();
    if (!validarSenha()) {
      mostrarMensagemCadastro("Confira as regras da senha e confirme que as duas senhas são iguais.", "erro");
      senha.focus();
      return;
    }


    // ======================================
    // PEGAR DADOS
    // ======================================

    const nome = document
      .getElementById("nome")
      .value
      .trim();

    const email = document
      .getElementById("email")
      .value
      .trim();

    const senhaUsuario =
      document.getElementById("senha").value;

    const confirmarSenha =
      document.getElementById("confirmarSenha").value;

    const aceitarTermos =
      document.getElementById("aceitarTermos").checked;


    // ======================================
    // VALIDAÇÕES
    // ======================================

    if (
      nome === "" ||
      email === "" ||
      senhaUsuario === "" ||
      confirmarSenha === ""
    ) {

      mostrarMensagemCadastro("Preencha todos os campos antes de continuar.", "erro");

      return;

    }


    if (senhaUsuario !== confirmarSenha) {

      mostrarMensagemCadastro("As senhas não são iguais.", "erro");

      return;

    }


    if (!aceitarTermos) {

      mostrarMensagemCadastro(
        "É necessário aceitar os Termos de Uso e a Política de Privacidade."
        , "erro"
      );

      return;

    }


    // Guarda o usuário caso seja necessário
    // desfazer o cadastro no Firebase Auth.

    let usuarioCriado = null;


    try {

      // ======================================
      // 1. FIREBASE AUTHENTICATION
      // ======================================

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          email,
          senhaUsuario
        );

      usuarioCriado = resultado.user;

      await updateProfile(usuarioCriado, {
      displayName: nome
    });     
    
      console.log(
        "Usuário criado no Firebase Auth:",
        usuarioCriado.uid
      );     

      // ======================================
      // 2. SQL CONNECT / POSTGRESQL
      // ======================================

      await cadastrarUsuario({
        nome: nome,
        email: email
      });


      console.log(
        "Perfil criado no PostgreSQL."
      );


      // ======================================
      // CADASTRO FINALIZADO
      // ======================================

      mostrarMensagemCadastro("Cadastro realizado com sucesso! Redirecionando para o login.", "sucesso");

      window.location.href = "Login.html";


    } catch (erro) {

      console.error(
        "Erro no cadastro:",
        erro
      );


      // ======================================
      // ROLLBACK
      // ======================================
      //
      // Se o Firebase Auth criou a conta,
      // mas o PostgreSQL falhou,
      // apagamos a conta do Auth para não
      // deixar um usuário incompleto.
      // ======================================

      if (usuarioCriado) {

        try {

          await deleteUser(usuarioCriado);

          console.log(
            "Cadastro incompleto removido do Firebase Auth."
          );

        } catch (erroRollback) {

          console.error(
            "Erro ao desfazer cadastro:",
            erroRollback
          );

        }

      }


      // ======================================
      // ERROS DO FIREBASE AUTH
      // ======================================

      if (erro.code === "auth/email-already-in-use") {

        mostrarMensagemCadastro("Já existe uma conta com este e-mail.", "erro");

      } else if (erro.code === "auth/invalid-email") {

        mostrarMensagemCadastro("Digite um e-mail válido.", "erro");

      } else if (erro.code === "auth/weak-password") {

        mostrarMensagemCadastro("A senha ainda não atende a todos os requisitos indicados.", "erro");

      } else {

        mostrarMensagemCadastro("Não foi possível criar sua conta. Tente novamente.", "erro");

      }

    }

  });

}

// ==========================================
// CADASTRO COM GOOGLE
// ==========================================

const btnGoogle =
  document.getElementById("btnGoogle");

const provedorGoogle =
  new GoogleAuthProvider();

if (btnGoogle) {

  btnGoogle.addEventListener(
    "click",
    async () => {

      try {

        btnGoogle.disabled = true;

        const resultado =
          await signInWithPopup(
            auth,
            provedorGoogle
          );

        const usuario =
          resultado.user;


        // Verifica se já existe perfil
        const resposta =
          await meuPerfil();

        const perfil =
          resposta.data.usuarios?.[0];


        // Primeiro acesso
        if (!perfil) {

          await cadastrarUsuario({
            nome:
              usuario.displayName ||
              "Usuário TechSênior",

            email:
              usuario.email
          });

        }


        console.log(
          "Cadastro/Login Google realizado:",
          usuario.uid
        );


        window.location.href =
          "Cursos.html#cursos";


      } catch (erro) {

        console.error(
          "Erro no cadastro com Google:",
          erro
        );


        if (
          erro.code ===
          "auth/popup-closed-by-user"
        ) {

          return;

        }


        if (
          erro.code ===
          "auth/popup-blocked"
        ) {

          mostrarMensagemCadastro("O navegador bloqueou a janela de acesso do Google. Permita a janela e tente novamente.", "erro");

        } else {

          mostrarMensagemCadastro("Não foi possível continuar com o Google. Tente novamente.", "erro");

        }

      } finally {

        btnGoogle.disabled = false;

      }

    }
  );

}
