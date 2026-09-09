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

      alert("Preencha todos os campos antes de continuar.");

      return;

    }


    if (senhaUsuario !== confirmarSenha) {

      alert("As senhas não são iguais.");

      return;

    }


    if (!aceitarTermos) {

      alert(
        "É necessário aceitar os Termos de Uso e a Política de Privacidade."
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

      alert("Cadastro realizado com sucesso!");

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

        alert(
          "Este e-mail já está cadastrado."
        );

      } else if (erro.code === "auth/invalid-email") {

        alert(
          "Digite um e-mail válido."
        );

      } else if (erro.code === "auth/weak-password") {

        alert(
          "A senha é muito fraca. Use pelo menos 6 caracteres."
        );

      } else {

        alert(
          "Não foi possível realizar o cadastro. Tente novamente."
        );

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

          alert(
            "O navegador bloqueou a janela do Google."
          );

        } else {

          alert(
            "Não foi possível continuar com o Google."
          );

        }

      } finally {

        btnGoogle.disabled = false;

      }

    }
  );

}