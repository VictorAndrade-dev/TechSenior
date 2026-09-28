import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { listarCursos } from "../dataconnect-generated/esm/index.esm.js";
const btnComecar = document.getElementById("btnComecar");
onAuthStateChanged(auth, (usuario) => {
  if (!btnComecar) return;

  const icone = document.createElement("i");

  icone.className = usuario
    ? "fa-solid fa-graduation-cap"
    : "fa-solid fa-play";

  icone.setAttribute("aria-hidden", "true");

  const texto = usuario
    ? "Continuar aprendendo"
    : "Começar agora";

  btnComecar.replaceChildren(
    icone,
    document.createTextNode(texto)
  );

  btnComecar.onclick = () => {
    location.href = usuario
      ? "Cursos.html"
      : "Login.html";
  };
});

document.getElementById("btnInicio")?.addEventListener("click", () => document.getElementById("sobre")?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"}));
const destaque = document.getElementById("cursosDestaque");
try {
  const resposta = await listarCursos();
  const cursos = resposta.data?.cursos || [];
  document.getElementById("quantidadeCursos").textContent = String(cursos.length);
  destaque.replaceChildren();
  if (!cursos.length) destaque.textContent = "Novos cursos aparecerão aqui quando estiverem disponíveis.";
  for (const curso of cursos.slice(0, 3)) {
    const card = document.createElement("article"); card.className = "curso-card";
    if (curso.imagem && /^https:\/\//i.test(curso.imagem)) {
      const imagem = document.createElement("img"); imagem.src = curso.imagem; imagem.alt = ""; imagem.loading = "lazy"; imagem.className = "destaque-imagem"; card.append(imagem);
    } else {
      const icone = document.createElement("i"); icone.className = /^fa-(solid|regular|brands) fa-[a-z0-9-]+$/.test(curso.icone || "") ? curso.icone : "fa-solid fa-book-open"; icone.setAttribute("aria-hidden", "true"); card.append(icone);
    }
    const titulo = document.createElement("h3"); titulo.textContent = curso.nome;
    const descricao = document.createElement("p"); descricao.textContent = curso.descricao || "Conheça o conteúdo deste curso.";
    const detalhes = document.createElement("p"); detalhes.textContent = curso.dificuldade + " • " + curso.cargaHoraria + " minutos";
    const link = document.createElement("a"); link.href = "Curso.html?id=" + encodeURIComponent(curso.id); link.textContent = "Ver curso";
    card.append(titulo, descricao, detalhes, link); destaque.append(card);
  }
} catch (erro) {
  console.error(erro); destaque.textContent = "Não foi possível carregar os cursos. Tente novamente mais tarde.";
  document.getElementById("quantidadeCursos").textContent = "Indisponível";
}
