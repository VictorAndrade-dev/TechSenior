import { auth } from "./Firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  meuPerfil,
  cadastrarUsuario
} from "../dataconnect-generated/esm/index.esm.js";

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
// LOGIN
// ==========================================

const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async (evento) => {  
    evento.preventDefault();

    const email = document.getElementById("email").value;

    const senhaUsuario = document.getElementById("senha").value;

    // Validação simples

    if (email === "" || senhaUsuario === "") {
      alert("Preencha todos os campos antes de continuar.");

      return;
    }

    try {
      const resultado = await signInWithEmailAndPassword(
        auth,
        email,
        senhaUsuario
      );

      console.log("Login realizado:", resultado.user.uid);

      alert("Login realizado com sucesso!");

      window.location.href = "Cursos.html#cursos";

    } catch (erro) {
      console.error("Erro no login:", erro);

      if (
        erro.code === "auth/invalid-credential" ||
        erro.code === "auth/wrong-password" ||
        erro.code === "auth/user-not-found"
      ) {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Não foi possível realizar o login. Tente novamente.");
      }
    }
  });
}

// ==========================================
// LOGIN COM GOOGLE
// ==========================================

const btnGoogle = document.getElementById("btnGoogle");

const provedorGoogle = new GoogleAuthProvider();

if (btnGoogle) {
  btnGoogle.addEventListener("click", async () => {

    try {
      btnGoogle.disabled = true;

      const resultado = await signInWithPopup(
        auth,
        provedorGoogle
      );

      const usuario = resultado.user;


      // Verifica se já existe perfil no PostgreSQL
      const resposta = await meuPerfil();

      const perfil = resposta.data.usuarios?.[0];


      // Primeiro acesso com Google
      if (!perfil) {

        await cadastrarUsuario({
          nome: usuario.displayName || "Usuário TechSênior",
          email: usuario.email
        });

      }


      console.log(
        "Login com Google realizado:",
        usuario.uid
      );


      window.location.href =
        "Cursos.html#cursos";


    } catch (erro) {

      console.error(
        "Erro no login com Google:",
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
          "Não foi possível entrar com o Google."
        );

      }

    } finally {

      btnGoogle.disabled = false;

    }

  });
}