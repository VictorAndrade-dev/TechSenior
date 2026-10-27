import { prepararDialogo } from "./DialogoUX.js";

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = new URL("../Estilos - CSS/Tutorial.css", import.meta.url).href;
document.head.append(css);
const aula = document.body.classList.contains("curso-page");
const inicio = /(?:^|\/)index\.html$|\/$/.test(location.pathname);
const chave = (tipo) => `techsenior:tutorial:${tipo}:convite:v1`;
const memoria = new Set();
function decidiu(tipo) {
  try { return memoria.has(tipo) || localStorage.getItem(chave(tipo)) === "decidido"; }
  catch { return memoria.has(tipo); }
}
function guardar(tipo) {
  memoria.add(tipo);
  try { localStorage.setItem(chave(tipo), "decidido"); } catch { /* A orientação funciona sem armazenamento. */ }
}
const dialogo = document.createElement("dialog");
dialogo.id = "tutorialTechSenior";
dialogo.setAttribute("aria-labelledby", "tutorialTitulo");
dialogo.setAttribute("aria-describedby", "tutorialTexto");
dialogo.innerHTML = `<div id="tutorialDestaque" aria-hidden="true" hidden></div>
  <div class="tutorial-cartao"><p id="tutorialProgresso" role="status"></p>
  <h2 id="tutorialTitulo" tabindex="-1"></h2><p id="tutorialTexto"></p>
  <a id="tutorialContexto" hidden></a><div id="tutorialAcoes"></div></div>`;
document.body.append(dialogo);
const titulo = dialogo.querySelector("h2");
const texto = dialogo.querySelector("#tutorialTexto");
const progresso = dialogo.querySelector("#tutorialProgresso");
const acoes = dialogo.querySelector("#tutorialAcoes");
const contexto = dialogo.querySelector("#tutorialContexto");
const destaque = dialogo.querySelector("#tutorialDestaque");
const cartao = dialogo.querySelector(".tutorial-cartao");
let alvo;
let etapas = [];
let passo = 0;
let convite;
let tipoAtual;
const modal = prepararDialogo(dialogo, () => {
  if (convite) guardar(convite);
  convite = null;
  alvo = null;
  destaque.hidden = true;
});

function visivel(seletor) {
  return seletor.split(",").flatMap((parte) => [...document.querySelectorAll(parte.trim())]).find((el) => {
    const estilo = getComputedStyle(el);
    return el.getClientRects().length && estilo.display !== "none" && estilo.visibility !== "hidden" && !el.closest("[inert], [hidden]");
  });
}
const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(valor, maximo));
function posicionar() {
  if (!dialogo.open) return;
  const viewport = window.visualViewport;
  const margem = 12;
  const limites = {
    esquerda: (viewport?.offsetLeft || 0) + margem,
    topo: (viewport?.offsetTop || 0) + margem,
    direita: (viewport?.offsetLeft || 0) + (viewport?.width || innerWidth) - margem,
    base: (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) - margem,
  };
  const inferior = document.querySelector(".bottom-nav");
  if (inferior?.getClientRects().length) limites.base = Math.min(limites.base, inferior.getBoundingClientRect().top - margem);
  const largura = Math.min(352, limites.direita - limites.esquerda);
  dialogo.style.width = `${largura}px`;
  const alturaNatural = cartao.scrollHeight + 2;
  const alturaDisponivel = Math.max(44, limites.base - limites.topo);
  const r = alvo?.isConnected ? alvo.getBoundingClientRect() : null;
  destaque.hidden = !r?.width || !r?.height;
  let altura = Math.min(alturaNatural, alturaDisponivel);
  let x = limites.direita - largura;
  let y = limites.base - altura;
  let lado = "sem-alvo";
  if (r?.width && r?.height) {
    Object.assign(destaque.style, { left: `${r.left - 4}px`, top: `${r.top - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
    destaque.dataset.passo = String(passo + 1);
    const distancia = 14;
    const abaixo = limites.base - r.bottom - distancia;
    const acima = r.top - limites.topo - distancia;
    const centroX = limitar(r.left + r.width / 2 - largura / 2, limites.esquerda, limites.direita - largura);
    const centroY = limitar(r.top + r.height / 2 - altura / 2, limites.topo, limites.base - altura);
    if (abaixo >= altura) { x = centroX; y = r.bottom + distancia; lado = "abaixo"; }
    else if (acima >= altura) { x = centroX; y = r.top - distancia - altura; lado = "acima"; }
    else if (limites.direita - r.right - distancia >= largura) { x = r.right + distancia; y = centroY; lado = "direita"; }
    else if (r.left - limites.esquerda - distancia >= largura) { x = r.left - distancia - largura; y = centroY; lado = "esquerda"; }
    else {
      // Em telas baixas, o cartão rola internamente na maior área livre do alvo.
      lado = acima >= abaixo ? "acima" : "abaixo";
      altura = Math.max(44, Math.min(alturaNatural, Math.max(acima, abaixo)));
      x = centroX;
      y = lado === "acima" ? r.top - distancia - altura : r.bottom + distancia;
    }
  }
  dialogo.dataset.lado = lado;
  Object.assign(dialogo.style, { left: `${x}px`, top: `${y}px`, maxHeight: `${altura}px` });
}
let quadro;
function agendarPosicao() {
  cancelAnimationFrame(quadro);
  quadro = requestAnimationFrame(posicionar);
}
function atualizarAlvo() {
  if (!dialogo.open) return;
  if (etapas.length && !convite) {
    const etapa = configurarEtapas(tipoAtual)[passo];
    alvo = visivel(etapa.seletor);
    texto.textContent = alvo ? etapa.texto : etapa.alternativa || etapa.texto;
    alvo?.scrollIntoView({ block: "center", behavior: "instant" });
  }
  agendarPosicao();
}
window.addEventListener("resize", atualizarAlvo);
window.visualViewport?.addEventListener("resize", atualizarAlvo);
document.addEventListener("scroll", agendarPosicao, true);
const observador = new ResizeObserver(agendarPosicao);
observador.observe(document.body);
observador.observe(cartao);

function botao(rotulo, acao) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = rotulo;
  b.addEventListener("click", acao);
  acoes.append(b);
}
function limpar() {
  cartao.scrollTop = 0;
  alvo = null;
  destaque.hidden = true;
  dialogo.removeAttribute("data-lado");
  contexto.hidden = true;
  contexto.removeAttribute("href");
  progresso.textContent = "";
  acoes.replaceChildren();
}
function linkContexto(rotulo, href) {
  contexto.textContent = rotulo;
  contexto.href = href;
  contexto.hidden = false;
}
function configurarEtapas(tipo) {
  if (tipo === "aula") return [
    { titulo: "Sua aula", texto: "Aqui estão o título e o conteúdo da aula. Leia no seu ritmo.", seletor: "#tituloAula" },
    { titulo: "Encontre os módulos", texto: innerWidth <= 1000 ? "Toque no livro verde para ver as aulas do curso." : "Use este controle para expandir ou recolher os módulos.", seletor: "#abrirModulos, #alternarModulos" },
    { titulo: "Próxima aula", texto: "Use este botão para seguir. Algumas aulas têm atividades antes de continuar.", seletor: "#btnProximaAula, .navegacao-aulas" },
  ];
  return [
    { titulo: "Encontre os cursos", texto: innerWidth >= 768 && innerWidth <= 1100 ? "Abra o menu e toque em Cursos para ver o que você pode aprender." : "Toque em Cursos para ver o que você pode aprender.", seletor: '.bottom-nav a[href="Cursos.html"], header nav a[href="Cursos.html"], #menuToggle' },
    { titulo: "Comece a aprender", texto: "Escolha um curso para ver a opção de iniciar ou continuar.", alternativa: "Na página Cursos, escolha o que quer aprender. Depois, toque em iniciar ou continuar.", seletor: "#listaCursos .curso-card, #listaCursos .card-curso, #listaCursos", link: ["Ver cursos (sair do tutorial)", "Cursos.html"] },
    { titulo: "Ajuste o site", texto: innerWidth < 768 ? "Abra Perfil para ajustar letras e cores ou ouvir o texto." : innerWidth <= 1000 ? "Abra o menu para ajustar letras e cores ou ouvir o texto." : "Use este botão para ajustar letras e cores ou ouvir o texto.", alternativa: "Procure Ajustar letras e cores no menu do site.", seletor: "#btnAcessibilidade, #abrirContaMobile, #menuToggle" },
    { titulo: "Precisa de ajuda?", texto: innerWidth >= 768 && innerWidth <= 1100 ? "Abra o menu e toque em Contato e Suporte quando precisar de ajuda." : "Toque em Contato e Suporte quando precisar de ajuda.", seletor: '.bottom-nav a[href="ContatoSuporte.html"], header nav a[href="ContatoSuporte.html"], #menuToggle', link: ["Contato e Suporte (sair do tutorial)", "ContatoSuporte.html"] },
  ];
}
function mostrarPasso(focar = true) {
  limpar();
  // Reavalia os caminhos reais quando muda a largura ou o tamanho das letras.
  etapas = configurarEtapas(tipoAtual);
  const etapa = etapas[passo];
  titulo.textContent = etapa.titulo;
  progresso.textContent = `Passo ${passo + 1} de ${etapas.length}`;
  alvo = visivel(etapa.seletor);
  texto.textContent = alvo ? etapa.texto : etapa.alternativa || etapa.texto;
  if (etapa.link) linkContexto(...etapa.link);
  if (passo) botao("Voltar", () => { passo--; mostrarPasso(); });
  botao(passo === etapas.length - 1 ? "Concluir" : "Próximo", () => {
    if (passo === etapas.length - 1) modal.fechar();
    else { passo++; mostrarPasso(); }
  });
  botao("Pular tutorial", modal.fechar);
  if (focar) {
    alvo?.scrollIntoView({ block: "center", behavior: "instant" });
    titulo.focus({ preventScroll: true });
  }
  posicionar();
}
function iniciar(tipo) {
  guardar(tipo);
  convite = null;
  tipoAtual = tipo;
  passo = 0;
  modal.abrir();
  mostrarPasso();
}
function convidar(tipo) {
  limpar();
  etapas = [];
  convite = tipo;
  titulo.textContent = tipo === "aula" ? "Quer aprender a usar esta página?" : "Bem-vindo ao TechSênior!";
  texto.textContent = tipo === "aula" ? "Vamos mostrar onde ficam os módulos e como passar para a próxima aula." : "É sua primeira vez por aqui? Podemos mostrar como encontrar os cursos, ajustar as letras e pedir ajuda.";
  botao("Agora não", modal.fechar);
  botao(tipo === "aula" ? "Mostrar como usar" : "Conhecer o site", () => iniciar(tipo));
  modal.abrir();
  titulo.focus();
  posicionar();
}
function escolher() {
  limpar();
  etapas = [];
  convite = null;
  titulo.textContent = "Como usar o TechSênior";
  texto.textContent = aula ? "Escolha o que quer conhecer. Você pode parar a qualquer momento." : "Conheça o site. Para aprender a usar as aulas, abra um curso e escolha esta mesma opção no menu.";
  botao("Conhecer o site", () => iniciar("geral"));
  if (aula && !document.getElementById("cursoLayout")?.hidden) botao("Aprender a usar as aulas", () => iniciar("aula"));
  else linkContexto("Encontrar um curso para aprender a usar as aulas", "Cursos.html");
  botao("Fechar", modal.fechar);
  modal.abrir();
  titulo.focus();
  posicionar();
}
// Um único acesso no menu existente; o rodapé também atende ao desktop.
for (const nav of document.querySelectorAll(".sidebar-nav, footer .coluna:has(a[href='Cursos.html'])")) {
  const acesso = document.createElement(nav.closest("footer") ? "a" : "button");
  if (acesso.tagName === "A") acesso.href = "#como-usar-techsenior";
  else acesso.type = "button";
  acesso.className = "tutorial-acesso";
  acesso.textContent = "Como usar o TechSênior";
  acesso.addEventListener("click", (evento) => { evento.preventDefault(); escolher(); });
  nav.append(acesso);
}
// Em nav-v2 o painel mobile esconde os links de navegação; o acesso continua nas preferências.
const preferencias = document.getElementById("drawerPreferencias");
if (preferencias) {
  const acesso = document.createElement("button");
  acesso.type = "button";
  acesso.className = "tutorial-acesso";
  acesso.textContent = "Como usar o TechSênior";
  acesso.addEventListener("click", escolher);
  preferencias.append(acesso);
}
// Preserva caminhos institucionais quando o rodapé da aula é ocultado.
if (aula && preferencias) {
  const links = document.createElement("details");
  links.className = "tutorial-institucional";
  const resumo = document.createElement("summary");
  resumo.textContent = "Informações do site";
  links.append(resumo);
  document.querySelectorAll("footer a:not(.tutorial-acesso)").forEach((link) => links.append(link.cloneNode(true)));
  preferencias.append(links);
}
const tipoConvite = aula ? "aula" : inicio ? "geral" : null;
function tentarConvite() {
  if (!tipoConvite || decidiu(tipoConvite)) return;
  if (aula && document.getElementById("cursoLayout")?.hidden) return;
  if (document.querySelector("dialog[open], .sidebar.active")) return;
  convidar(tipoConvite);
}
css.addEventListener("load", tentarConvite);
if (aula) {
  const layout = document.getElementById("cursoLayout");
  if (layout) new MutationObserver(tentarConvite).observe(layout, { attributes: true, attributeFilter: ["hidden"] });
}
document.addEventListener("techsenior:abrir-modal", () => {
  // Convites adiados não interrompem uma interação já iniciada.
  if (tipoConvite && !decidiu(tipoConvite)) document.addEventListener("click", tentarConvite, { once: true });
});
