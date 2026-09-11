import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ==========================================
// DÚVIDAS FREQUENTES
// ==========================================

const duvidas = document.querySelectorAll(".duvida");

duvidas.forEach((duvida) => {
  const botao = duvida.querySelector(".duvida-pergunta");

  botao.addEventListener("click", () => {
    const estaAtiva = duvida.classList.contains("ativa");

    // Fecha todas as dúvidas
    duvidas.forEach((outraDuvida) => {
      outraDuvida.classList.remove("ativa");

      const outroBotao = outraDuvida.querySelector(".duvida-pergunta");

      outroBotao.setAttribute("aria-expanded", "false");
    });

    // Abre a dúvida selecionada
    if (!estaAtiva) {
      duvida.classList.add("ativa");

      botao.setAttribute("aria-expanded", "true");
    }
  });
});


// ==========================================
// FORMULÁRIO DE CONTATO
// ==========================================

const formContato = document.getElementById("formContato");

const mensagemFeedback =
  document.getElementById("mensagemFeedback");

const btnEnviar = document.getElementById("btnEnviar");


// ==========================================
// VERIFICAR USUÁRIO LOGADO
// ==========================================

onAuthStateChanged(auth, (usuario) => {

  if (usuario) {

    console.log("Usuário autenticado:", usuario.email);

  } else {

    console.log("Nenhum usuário autenticado.");

  }

});


// ==========================================
// ENVIO DO FORMULÁRIO
// ==========================================

if (formContato) {

  formContato.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nome =
      document.getElementById("nome").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const assunto =
      document.getElementById("assunto").value.trim();

    const mensagem =
      document.getElementById("mensagem").value.trim();


    // ==========================================
    // LIMPA MENSAGEM ANTERIOR
    // ==========================================

    mensagemFeedback.textContent = "";

    mensagemFeedback.className = "mensagem-feedback";


    // ==========================================
    // VALIDAÇÃO DOS CAMPOS
    // ==========================================

    if (!nome || !email || !assunto || !mensagem) {

      mensagemFeedback.textContent =
        "Por favor, preencha todos os campos.";

      mensagemFeedback.classList.add("erro");

      return;
    }


    // ==========================================
    // VALIDAÇÃO DO E-MAIL
    // ==========================================

    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {

      mensagemFeedback.textContent =
        "Digite um endereço de e-mail válido.";

      mensagemFeedback.classList.add("erro");

      return;
    }


    // ==========================================
    // ENVIO SIMULADO
    // ==========================================

    btnEnviar.disabled = true;

    btnEnviar.textContent = "Enviando...";


    setTimeout(() => {

      mensagemFeedback.textContent =
        "Mensagem enviada com sucesso! Nossa equipe recebeu sua mensagem.";

      mensagemFeedback.classList.add("sucesso");

      formContato.reset();

      btnEnviar.disabled = false;

      btnEnviar.textContent = "Enviar mensagem";

    }, 1000);

  });

}