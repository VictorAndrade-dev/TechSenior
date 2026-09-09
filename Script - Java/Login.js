import { auth } from "./Firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  meuPerfil,
  cadastrarUsuario,
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
const mensagem = document.getElementById("mensagem");
const btnEntrar = document.getElementById("btnEntrar");

if (formLogin) {
  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value;

    const senhaUsuario = document.getElementById("senha").value;

    // Validação simples
    if (email === "" || senhaUsuario === "") {
      mostrarMensagem("Preencha todos os campos antes de continuar.", "erro");

      return;
    }

    try {
      btnEntrar.disabled = true;
      btnEntrar.textContent = "Entrando...";

      mostrarMensagem("", "");

      const resultado = await signInWithEmailAndPassword(
        auth,
        email,
        senhaUsuario,
      );

      console.log("Login realizado:", resultado.user.uid);

      mostrarMensagem("Login realizado com sucesso!", "sucesso");

      setTimeout(() => {
        window.location.href = "Cursos.html#cursos";
      }, 700);

    } catch (erro) {
      console.error("Erro no login:", erro);

      if (
        erro.code === "auth/invalid-credential" ||
        erro.code === "auth/wrong-password" ||
        erro.code === "auth/user-not-found"
      ) {
        mostrarMensagem(
          "E-mail ou senha incorretos.",
          "erro"
        );
      } else {
        mostrarMensagem(
          "Não foi possível realizar o login. Tente novamente.",
          "erro"
        );
      }
    } finally {
      btnEntrar.disabled = false;
      btnEntrar.textContent = "Entrar";
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

      const resultado = await signInWithPopup(auth, provedorGoogle);

      const usuario = resultado.user;

      // Verifica se já existe perfil no PostgreSQL
      const resposta = await meuPerfil();

      const perfil = resposta.data.usuarios?.[0];

      // Primeiro acesso com Google
      if (!perfil) {
        await cadastrarUsuario({
          nome: usuario.displayName || "Usuário TechSênior",
          email: usuario.email,
        });
      }

      console.log("Login com Google realizado:", usuario.uid);

      window.location.href = "Cursos.html#cursos";
    } catch (erro) {
      console.error("Erro no login com Google:", erro);

      if (erro.code === "auth/popup-closed-by-user") {
        return;
      }

      if (erro.code === "auth/popup-blocked") {
        alert("O navegador bloqueou a janela do Google.");
      } else {
        alert("Não foi possível entrar com o Google.");
      }
    } finally {
      btnGoogle.disabled = false;
    }
  });
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className =
    tipo ? `mensagem ${tipo}` : "mensagem";
}