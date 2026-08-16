import { auth, db } from "./Firebase-config.js";

import { 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// MOSTRAR / OCULTAR SENHA
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

    const nome = document.getElementById("nome").value;

    const email = document.getElementById("email").value;

    const senhaUsuario = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const aceitarTermos = document.getElementById("aceitarTermos").checked;

    // Verifica campos vazios

    if (
      nome === "" ||
      email === "" ||
      senhaUsuario === "" ||
      confirmarSenha === ""
    ) {
      alert("Preencha todos os campos antes de continuar.");

      return;
    }

    // Verifica confirmação de senha

    if (senhaUsuario !== confirmarSenha) {
      alert("As senhas não são iguais.");

      return;
    }

    // Verifica aceite dos termos

    if (!aceitarTermos) {
      alert(
        "É necessário aceitar os Termos de Uso e a Política de Privacidade.",
      );

      return;
    }

        try {
      const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      senhaUsuario
    );

    const usuario = resultado.user;

    await setDoc(doc(db, "usuarios", usuario.uid), {
      nome: nome,
      email: email,
      tipo: "usuario",
      criadoEm: serverTimestamp()
    });

    console.log("Usuário criado:", usuario.uid);

    alert("Cadastro realizado com sucesso!");

    window.location.href = "Login.html";  

    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      if (erro.code === "auth/email-already-in-use") {
        alert("Este e-mail já está cadastrado.");
      } else if (erro.code === "auth/invalid-email") {
        alert("Digite um e-mail válido.");
      } else if (erro.code === "auth/weak-password") {
        alert("A senha é muito fraca. Use pelo menos 6 caracteres.");
      } else {
        alert("Não foi possível realizar o cadastro. Tente novamente.");
      }
    }
  });
}
