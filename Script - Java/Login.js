import { auth } from "./Firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


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
