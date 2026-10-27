import { prepararDialogo } from "./DialogoUX.js";

const lista = document.getElementById("modulosContainer");
const layout = document.getElementById("cursoLayout");
const alternar = document.getElementById("alternarModulos");
const abrir = document.getElementById("abrirModulos");
const painel = document.getElementById("painelModulos");
const fechar = document.getElementById("fecharModulos");
const rotulo = alternar.querySelector(".rotulo-modulos");
const icone = alternar.querySelector("i");
const lugar = document.createComment("Posição original da lista de módulos");
lista.before(lugar);
const mobile = matchMedia("(max-width: 1000px)");
const navegacaoInferior = document.querySelector(".bottom-nav");
if (navegacaoInferior) {
  const ajustarBase = () => {
    const altura = navegacaoInferior.getBoundingClientRect().height;
    abrir.style.setProperty("--modulos-base", `${Math.max(24, altura + 16)}px`);
  };
  new ResizeObserver(ajustarBase).observe(navegacaoInferior);
  ajustarBase();
}
let recolhido = false;
const nomesOriginais = new WeakMap();
function atualizarRotulos() {
  lista.querySelectorAll(".modulo").forEach((modulo) => {
    if (!nomesOriginais.has(modulo)) nomesOriginais.set(modulo, {
      nome: modulo.getAttribute("aria-label"), titulo: modulo.getAttribute("title"),
    });
    if (recolhido && !mobile.matches) {
      const nome = modulo.textContent.replace(/\s+/g, " ").trim();
      modulo.setAttribute("aria-label", `Módulo ${nome}`);
      modulo.title = nome;
    } else {
      const original = nomesOriginais.get(modulo);
      for (const [atributo, valor] of [["aria-label", original.nome], ["title", original.titulo]]) {
        if (valor === null) modulo.removeAttribute(atributo);
        else modulo.setAttribute(atributo, valor);
      }
    }
  });
}
new MutationObserver(atualizarRotulos).observe(lista, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
const modal = prepararDialogo(painel, () => abrir.setAttribute("aria-expanded", "false"));

function atualizar() {
  modal.fechar();
  if (mobile.matches) {
    painel.append(lista);
    lista.hidden = false;
  } else {
    lugar.after(lista);
    lista.hidden = false;
  }
  layout.classList.toggle("modulos-recolhidos", !mobile.matches && recolhido);
  alternar.setAttribute("aria-expanded", String(!recolhido));
  const acao = recolhido ? "Mostrar módulos" : "Recolher módulos";
  rotulo.textContent = acao;
  alternar.setAttribute("aria-label", acao);
  alternar.title = acao;
  icone.className = recolhido ? "fa-solid fa-angles-right" : "fa-solid fa-angles-left";
  atualizarRotulos();
}
alternar.addEventListener("click", () => { recolhido = !recolhido; atualizar(); });
abrir.addEventListener("click", () => {
  modal.abrir(abrir);
  abrir.setAttribute("aria-expanded", "true");
  fechar.focus();
});
fechar.addEventListener("click", modal.fechar);
// Fecha antes do listener original: a orientação de foco da nova aula continua por último.
lista.addEventListener("click", (evento) => {
  const modulo = evento.target.closest("button.modulo");
  if (modulo && !modulo.disabled && mobile.matches) modal.fechar();
}, true);
mobile.addEventListener("change", atualizar);
new MutationObserver(() => { abrir.hidden = layout.hidden; }).observe(layout, { attributes: true, attributeFilter: ["hidden"] });
abrir.hidden = layout.hidden;
atualizar();
