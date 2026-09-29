// ============================================================
// IMPORTAÇÕES
// ============================================================

import { auth } from "./Firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { enviarSuporte } from "./ServicoSuporte.js";


// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

// Dúvidas frequentes
const duvidas = document.querySelectorAll(".duvida");

// Formulário de contato
const form = document.getElementById("formContato");
const feedback = document.getElementById("mensagemFeedback");
const btnEnviar = document.getElementById("btnEnviar");

// Campos do formulário
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoAssunto = document.getElementById("assunto");
const campoMensagem = document.getElementById("mensagem");

// Botão principal da página
const btnComecar = document.getElementById("btnComecar");


// ============================================================
// DÚVIDAS FREQUENTES
// ============================================================

duvidas.forEach((duvida) => {
  const botao = duvida.querySelector(".duvida-pergunta");
  const resposta = duvida.querySelector(".duvida-resposta");

  if (!botao || !resposta) return;

  // Estado inicial
  resposta.style.maxHeight = "0";
  resposta.setAttribute("aria-hidden", "true");

  botao.addEventListener("click", () => {
    const estaAberta = duvida.classList.toggle("ativa");

    botao.setAttribute("aria-expanded", String(estaAberta));
    resposta.setAttribute("aria-hidden", String(!estaAberta));

    if (estaAberta) {
      // Abre suavemente até a altura real do conteúdo.
      resposta.style.maxHeight = `${resposta.scrollHeight}px`;
    } else {
      // Fecha suavemente.
      resposta.style.maxHeight = "0";
    }
  });
});


// ============================================================
// CONFIGURAÇÃO DO FORMULÁRIO
// ============================================================

// Informa ao leitor de tela que as mensagens de feedback
// devem ser anunciadas quando forem atualizadas.
feedback.setAttribute("role", "status");

// Limites dos campos.
campoAssunto.maxLength = 120;
campoMensagem.maxLength = 5000;


// ============================================================
// ESTADO DE AUTENTICAÇÃO
// ============================================================

onAuthStateChanged(auth, (usuario) => {
  // Preenche automaticamente nome e e-mail
  // quando o usuário estiver autenticado.
  if (usuario) {
    campoNome.value = usuario.displayName || "";
    campoEmail.value = usuario.email || "";

    campoNome.readOnly = true;
    campoEmail.readOnly = true;

    campoNome.required = false;
    campoEmail.required = false;
  }

  // O envio só fica disponível para usuários autenticados.
  btnEnviar.disabled = !usuario;

  // Mensagem exibida de acordo com o estado da sessão.
  if (!usuario) {
    feedback.textContent = "Entre na sua conta para enviar uma solicitação. ";

    const linkLogin = document.createElement("a");

    linkLogin.href = "Login.html";
    linkLogin.textContent = "Entrar";

    feedback.append(linkLogin);

    return;
  }

  feedback.textContent =
    "Sua solicitação será vinculada à sua conta.";
});


// ============================================================
// ENVIO DO FORMULÁRIO
// ============================================================

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  // Impede o envio caso o usuário não esteja autenticado.
  if (btnEnviar.disabled) return;

  // Desativa o botão enquanto a solicitação é processada.
  btnEnviar.disabled = true;

  feedback.className = "mensagem-feedback";
  feedback.textContent = "Enviando...";

  try {
    // Envia os dados para o serviço de suporte.
    await enviarSuporte(
      campoAssunto.value,
      campoMensagem.value
    );

    // Exibe mensagem de sucesso.
    feedback.textContent =
      "Solicitação enviada com sucesso. Nossa equipe recebeu sua mensagem.";

    feedback.classList.add("sucesso");

    // Limpa os campos após o envio.
    campoAssunto.value = "";
    campoMensagem.value = "";

  } catch (erro) {
    console.error("Erro ao enviar solicitação:", erro);

    // Exibe mensagem de erro.
    feedback.textContent =
      "Não foi possível enviar a solicitação. Confira os campos e tente novamente. Sua mensagem foi mantida.";

    feedback.classList.add("erro");

  } finally {
    // O botão volta a ficar disponível somente
    // se ainda houver um usuário autenticado.
    btnEnviar.disabled = !auth.currentUser;
  }
});


// ============================================================
// BOTÃO "COMEÇAR AGORA"
// ============================================================

btnComecar?.addEventListener("click", () => {
  // Usuário autenticado → Cursos
  // Usuário não autenticado → Login
  window.location.href = auth.currentUser
    ? "Cursos.html"
    : "Login.html";
});

// ==========================================
// FAQ
// ==========================================

const accordions =
  document.querySelectorAll(
    ".accordion"
  );


accordions.forEach(
  (accordion) => {

    accordion.addEventListener(
      "click",
      () => {

        const resposta =
          accordion.nextElementSibling;

        if (!resposta) {
          return;
        }


        const estaAberto =
          accordion.classList.contains(
            "active"
          );


        accordion.classList.toggle(
          "active"
        );


        if (estaAberto) {

          resposta.classList.remove(
            "aberta"
          );

        } else {

          resposta.classList.add(
            "aberta"
          );

        }

      }
    );

  }
);