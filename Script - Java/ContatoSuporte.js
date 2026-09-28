import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { enviarSuporte } from "./ServicoSuporte.js";
for (const duvida of document.querySelectorAll(".duvida")) {
  const botao = duvida.querySelector(".duvida-pergunta");
  botao?.addEventListener("click", () => {
    const ativa = duvida.classList.toggle("ativa");
    botao.setAttribute("aria-expanded", String(ativa));
    const resposta = duvida.querySelector(".duvida-resposta");
    if (resposta) resposta.hidden = !ativa;
  });
  const resposta = duvida.querySelector(".duvida-resposta");
  if (resposta) resposta.hidden = true;
}
const form = document.getElementById("formContato"), feedback = document.getElementById("mensagemFeedback"), enviar = document.getElementById("btnEnviar");
feedback.setAttribute("role", "status");
document.getElementById("assunto").maxLength = 120;
document.getElementById("mensagem").maxLength = 5000;
onAuthStateChanged(auth, (usuario) => {
  for (const [id, valor] of [["nome", usuario?.displayName || ""], ["email", usuario?.email || ""]]) {
    const campo = document.getElementById(id);
    if (campo) { campo.value = valor; campo.readOnly = true; campo.required = false; }
  }
  enviar.disabled = !usuario;
  if (!usuario) {
    feedback.textContent = "Entre na sua conta para enviar uma solicitação. ";
    const link = document.createElement("a"); link.href = "Login.html"; link.textContent = "Entrar"; feedback.append(link);
  } else feedback.textContent = "Sua solicitação será vinculada à sua conta.";
});
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (enviar.disabled) return;
  enviar.disabled = true; feedback.className = "mensagem-feedback"; feedback.textContent = "Enviando...";
  try {
    await enviarSuporte(document.getElementById("assunto").value, document.getElementById("mensagem").value);
    feedback.textContent = "Solicitação enviada com sucesso. Nossa equipe recebeu sua mensagem.";
    feedback.classList.add("sucesso");
    document.getElementById("assunto").value = ""; document.getElementById("mensagem").value = "";
  } catch (erro) {
    console.error(erro); feedback.textContent = "Não foi possível enviar a solicitação. Confira os campos e tente novamente. Sua mensagem foi mantida.";
    feedback.classList.add("erro");
  } finally { enviar.disabled = !auth.currentUser; }
});
const comecar = document.getElementById("btnComecar");
comecar?.addEventListener("click", () => { location.href = auth.currentUser ? "Cursos.html" : "Login.html"; });
