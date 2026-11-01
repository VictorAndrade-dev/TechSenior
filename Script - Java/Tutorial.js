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
  try { return memoria.has(tipo) || localStorage.getItem(chave(tipo)) !== null; }
  catch { return memoria.has(tipo); }
}
function guardar(tipo) {
  memoria.add(tipo);
  try {
    if (localStorage.getItem(chave(tipo)) === null) localStorage.setItem(chave(tipo), "decidido");
  } catch { /* A orientação funciona sem armazenamento. */ }
}
const dialogo = document.createElement("dialog");
dialogo.id = "tutorialTechSenior";
dialogo.setAttribute("aria-labelledby", "tutorialTitulo");
dialogo.setAttribute("aria-describedby", "tutorialTexto tutorialReabrir");
dialogo.innerHTML = `<svg id="tutorialSombra" aria-hidden="true" focusable="false" preserveAspectRatio="none"><path fill-rule="evenodd"></path></svg>
  <div id="tutorialDestaque" aria-hidden="true" hidden></div>
  <div id="tutorialConexao" aria-hidden="true" hidden></div>
  <div class="tutorial-cartao">
    <div class="tutorial-cabecalho">
      <div><p id="tutorialProgresso" role="status"></p><div id="tutorialEtapas" aria-hidden="true" hidden></div></div>
      <button type="button" id="tutorialFechar" aria-label="Fechar tutorial">Fechar</button>
    </div>
    <div class="tutorial-corpo" role="region" aria-labelledby="tutorialTitulo" tabindex="-1">
      <h2 id="tutorialTitulo" tabindex="-1" aria-describedby="tutorialTexto tutorialReabrir"></h2><p id="tutorialTexto"></p>
      <p id="tutorialReabrir" hidden></p><a id="tutorialContexto" hidden></a>
    </div>
    <div id="tutorialAcoes"></div>
  </div>`;
document.body.append(dialogo);
const titulo = dialogo.querySelector("h2");
const texto = dialogo.querySelector("#tutorialTexto");
const progresso = dialogo.querySelector("#tutorialProgresso");
const acoes = dialogo.querySelector("#tutorialAcoes");
const contexto = dialogo.querySelector("#tutorialContexto");
const destaque = dialogo.querySelector("#tutorialDestaque");
const cartao = dialogo.querySelector(".tutorial-cartao");
const cabecalho = dialogo.querySelector(".tutorial-cabecalho");
const corpo = dialogo.querySelector(".tutorial-corpo");
const fecharTutorial = dialogo.querySelector("#tutorialFechar");
const sombra = dialogo.querySelector("#tutorialSombra");
const recorte = sombra.querySelector("path");
const pontos = dialogo.querySelector("#tutorialEtapas");
const reabrir = dialogo.querySelector("#tutorialReabrir");
const conexao = dialogo.querySelector("#tutorialConexao");
let alvo;
let alvoPendente;
let etapas = [];
let passo = 0;
let convite;
let tipoAtual;
let quadroAlvo;
let ultimaPosicao = "";
const modal = prepararDialogo(dialogo, () => {
  if (convite) guardar(convite);
  convite = null;
  alvo = null;
  alvoPendente = null;
  destaque.hidden = true;
  conexao.hidden = true;
  document.documentElement.classList.remove("tutorial-aberto");
  cancelAnimationFrame(quadroAlvo);
});
fecharTutorial.addEventListener("click", modal.fechar);
dialogo.addEventListener("keydown", (evento) => {
  if (evento.key !== "Tab") return;
  const controles = [...dialogo.querySelectorAll("button, a[href], [tabindex]")]
    .filter((el) => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
  const primeiro = controles[0], ultimo = controles.at(-1);
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault(); ultimo?.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault(); primeiro?.focus();
  }
});

function abrirTutorial() {
  modal.abrir();
  document.documentElement.classList.add("tutorial-aberto");
  cancelAnimationFrame(quadroAlvo);
  ultimaPosicao = "";
  function acompanhar() {
    if (!dialogo.open) return;
    if (alvoPendente && etapas.length && !convite) {
      const etapa = configurarEtapas(tipoAtual)[passo];
      const pronto = visivel(etapa.seletor);
      if (pronto) {
        alvo = pronto;
        alvoPendente = null;
        texto.textContent = etapa.texto;
        if (tipoAtual === "geral" && passo === 1 && /\/Cursos\.html$/.test(location.pathname)) contexto.hidden = true;
        levarAlvoAVista();
      }
    }
    const r = alvo?.getBoundingClientRect();
    const atual = r ? [r.left, r.top, r.width, r.height].join(",") : "sem-alvo";
    if (atual !== ultimaPosicao) { ultimaPosicao = atual; posicionar(); }
    quadroAlvo = requestAnimationFrame(acompanhar);
  }
  quadroAlvo = requestAnimationFrame(acompanhar);
}

function visivel(seletor, aceitarTransparente = false) {
  return seletor.split(",").flatMap((parte) => [...document.querySelectorAll(parte.trim())]).find((el) => {
    if (!el.getClientRects().length || el.closest("[inert], [hidden]")) return false;
    for (let atual = el; atual; atual = atual.parentElement) {
      const estilo = getComputedStyle(atual);
      if (estilo.display === "none" || estilo.visibility === "hidden" || (!aceitarTransparente && Number(estilo.opacity) === 0)) return false;
    }
    return true;
  });
}
function selecionarAlvo(etapa) {
  alvoPendente = null;
  alvo = visivel(etapa.seletor);
  if (alvo) { levarAlvoAVista(); return; }
  // Cursos usa uma entrada por IntersectionObserver. Trazemos o controle para
  // a tela sem esperar a animação para liberar a navegação do tutorial.
  const entrada = visivel(etapa.seletor, true);
  if (entrada) {
    alvo = entrada;
    levarAlvoAVista();
    alvoPendente = entrada;
    alvo = null;
  }
}
function levarAlvoAVista() {
  if (!alvo || alvo.closest(".bottom-nav")) return;
  if (alvo.closest("header")) {
    const r = alvo.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  for (let el = alvo; el; el = el.parentElement) {
    if (getComputedStyle(el).position === "fixed") return;
  }
  const header = document.querySelector("body > header");
  const fixo = header && ["fixed", "sticky"].includes(getComputedStyle(header).position);
  const inicio = (fixo ? header.getBoundingClientRect().height : 0) + 16;
  // Uma única orientação por etapa, deixando espaço abaixo de controles em fluxo.
  window.scrollBy({ top: alvo.getBoundingClientRect().top - inicio, behavior: "instant" });
}
const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(valor, maximo));
function desenharSombra(r) {
  sombra.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
  let caminho = `M0 0H${innerWidth}V${innerHeight}H0Z`;
  if (r?.width && r?.height) {
    const x = r.left - 5, y = r.top - 5, w = r.width + 10, h = r.height + 10;
    const borda = getComputedStyle(alvo).borderTopLeftRadius;
    const raioAlvo = borda.includes("%") ? Math.min(r.width, r.height) * parseFloat(borda) / 100 : parseFloat(borda);
    const raio = Math.min(Math.max(8, (raioAlvo || 0) + 5), w / 2, h / 2);
    caminho += `M${x + raio} ${y}H${x + w - raio}Q${x + w} ${y} ${x + w} ${y + raio}V${y + h - raio}Q${x + w} ${y + h} ${x + w - raio} ${y + h}H${x + raio}Q${x} ${y + h} ${x} ${y + h - raio}V${y + raio}Q${x} ${y} ${x + raio} ${y}Z`;
    Object.assign(destaque.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${raio}px` });
  }
  // A regra evenodd deixa o interior do alvo transparente, inclusive para elementos fixos.
  recorte.setAttribute("d", caminho);
}
function posicionar() {
  if (!dialogo.open) return;
  const emEtapas = etapas.length > 0 && !convite;
  cabecalho.hidden = Boolean(convite);
  dialogo.classList.toggle("tutorial-em-etapas", emEtapas);
  fecharTutorial.textContent = emEtapas ? "Pular" : "Fechar";
  fecharTutorial.setAttribute("aria-label", emEtapas ? "Pular tutorial" : "Fechar tutorial");
  const viewport = window.visualViewport;
  const margem = 12;
  const estiloDialogo = getComputedStyle(dialogo);
  const segura = (lado) => parseFloat(estiloDialogo.getPropertyValue(`--tutorial-safe-${lado}`)) || 0;
  const limites = {
    esquerda: (viewport?.offsetLeft || 0) + margem + segura("left"),
    topo: (viewport?.offsetTop || 0) + margem + segura("top"),
    direita: (viewport?.offsetLeft || 0) + (viewport?.width || innerWidth) - margem - segura("right"),
    base: (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) - margem - segura("bottom"),
  };
  const inferior = document.querySelector(".bottom-nav");
  if (inferior?.getClientRects().length) limites.base = Math.min(limites.base, inferior.getBoundingClientRect().top - margem);
  const largura = Math.min(400, limites.direita - limites.esquerda);
  dialogo.style.width = `${largura}px`;
  const estiloCartao = getComputedStyle(cartao);
  const alturaNatural = Math.ceil(corpo.scrollHeight + cabecalho.getBoundingClientRect().height + acoes.getBoundingClientRect().height
    + (cabecalho.hidden ? 0 : parseFloat(getComputedStyle(cabecalho).marginBottom))
    + parseFloat(getComputedStyle(acoes).marginTop) + parseFloat(estiloCartao.paddingTop) + parseFloat(estiloCartao.paddingBottom)
    + parseFloat(estiloCartao.borderTopWidth) + parseFloat(estiloCartao.borderBottomWidth));
  const alturaDisponivel = Math.max(44, limites.base - limites.topo);
  let r = alvo?.isConnected ? alvo.getBoundingClientRect() : null;
  let altura = Math.min(alturaNatural, alturaDisponivel);
  let x = limites.direita - largura;
  let y = limites.base - altura;
  let lado = "sem-alvo";
  if (r?.width && r?.height) {
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
      const livre = Math.max(acima, abaixo);
      const alturaMinima = Math.min(altura, alturaNatural - corpo.scrollHeight + Math.min(corpo.scrollHeight, 96));
      if (livre >= alturaMinima) {
        lado = acima >= abaixo ? "acima" : "abaixo";
        altura = Math.min(altura, livre);
        x = centroX;
        y = lado === "acima" ? r.top - distancia - altura : r.bottom + distancia;
      } else {
        // Uma referência grande ou fora da tela nunca pode expulsar os controles.
        // A orientação textual continua disponível sem um destaque enganoso.
        r = null;
      }
    }
  }
  x = limitar(x, limites.esquerda, limites.direita - largura);
  y = limitar(y, limites.topo, limites.base - altura);
  desenharSombra(r);
  destaque.hidden = !r?.width || !r?.height;
  dialogo.dataset.lado = lado;
  Object.assign(dialogo.style, { left: `${x}px`, top: `${y}px`, maxHeight: `${altura}px` });
  corpo.tabIndex = corpo.scrollHeight > corpo.clientHeight + 1 ? 0 : -1;
  conexao.hidden = !r?.width || !r?.height || altura < 80;
  if (!conexao.hidden) {
    const vertical = lado === "acima" || lado === "abaixo";
    const cx = vertical ? limitar(r.left + r.width / 2, x + 20, x + largura - 20) : lado === "direita" ? x : x + largura;
    const cy = vertical ? lado === "acima" ? y + altura : y : limitar(r.top + r.height / 2, y + 20, y + altura - 20);
    Object.assign(conexao.style, { left: `${cx - 6}px`, top: `${cy - 6}px` });
  }
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
    selecionarAlvo(etapa);
    texto.textContent = alvo ? etapa.texto : etapa.alternativa || etapa.texto;
    atualizarReabertura();
  }
  agendarPosicao();
}
window.addEventListener("resize", atualizarAlvo);
window.visualViewport?.addEventListener("resize", atualizarAlvo);
document.addEventListener("scroll", (evento) => { if (evento.target !== corpo) agendarPosicao(); }, true);
const observador = new ResizeObserver(agendarPosicao);
observador.observe(document.body);
observador.observe(cartao);

function botao(rotulo, acao, principal = false) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = rotulo;
  if (principal) b.className = "tutorial-primario";
  b.addEventListener("click", acao);
  acoes.append(b);
}
function limpar() {
  corpo.scrollTop = 0;
  alvo = null;
  alvoPendente = null;
  destaque.hidden = true;
  conexao.hidden = true;
  pontos.hidden = true;
  pontos.replaceChildren();
  reabrir.hidden = true;
  reabrir.textContent = "";
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
    { titulo: "Aqui estão os módulos", texto: innerWidth <= 1000 ? "Toque no livro verde para ver as aulas do curso." : "Use este controle para expandir ou recolher os módulos.", seletor: "#abrirModulos, #alternarModulos" },
    { titulo: "Próxima aula", texto: "Use este botão para seguir. Algumas aulas têm atividades antes de continuar.", seletor: "#btnProximaAula, .navegacao-aulas" },
  ];
  return [
    { titulo: "Encontre os cursos", texto: innerWidth >= 768 && innerWidth <= 1100 ? "Abra o menu e toque em Cursos para ver o que você pode aprender." : "Toque em Cursos para ver o que você pode aprender.", seletor: '.bottom-nav a[href="Cursos.html"], header nav a[href="Cursos.html"], #menuToggle' },
    { titulo: "Comece a aprender", texto: "Toque em Ver curso para conhecer as aulas. Depois, você pode iniciar ou continuar.", alternativa: "Na página Cursos, escolha o que quer aprender. Depois, toque em iniciar ou continuar.", seletor: "#listaCursos .card .btn-card, #cursosDestaque .curso-card a[href]", link: ["Ver cursos (sair do tutorial)", "Cursos.html"] },
    { titulo: "Ajuste o site", texto: innerWidth < 768 ? "Abra Perfil para ajustar letras e cores ou ouvir o texto." : innerWidth <= 1000 ? "Abra o menu para ajustar letras e cores ou ouvir o texto." : "Use este botão para ajustar letras e cores ou ouvir o texto.", alternativa: "Procure Ajustar letras e cores no menu do site.", seletor: "#btnAcessibilidade, #abrirContaMobile, #menuToggle" },
    { titulo: "Precisa de ajuda?", texto: innerWidth >= 768 && innerWidth <= 1100 ? "Abra o menu e toque em Contato e Suporte quando precisar de ajuda." : "Toque em Contato e Suporte quando precisar de ajuda.", seletor: '.bottom-nav a[href="ContatoSuporte.html"], header nav a[href="ContatoSuporte.html"], #menuToggle', link: ["Contato e Suporte (sair do tutorial)", "ContatoSuporte.html"] },
  ];
}
function atualizarReabertura() {
  reabrir.hidden = passo !== etapas.length - 1;
  reabrir.textContent = reabrir.hidden ? "" : innerWidth <= 1100 || !visivel("footer .tutorial-acesso")
    ? "Para rever, abra o menu e procure “Precisa de uma orientação?”."
    : "Para rever, use “Como usar o TechSênior” no rodapé.";
}
function mostrarPasso(focar = true) {
  limpar();
  // Reavalia os caminhos reais quando muda a largura ou o tamanho das letras.
  etapas = configurarEtapas(tipoAtual);
  const etapa = etapas[passo];
  titulo.textContent = etapa.titulo;
  progresso.textContent = `Passo ${passo + 1} de ${etapas.length}`;
  pontos.hidden = false;
  etapas.forEach((_, indice) => {
    const ponto = document.createElement("span");
    ponto.classList.toggle("atual", indice === passo);
    ponto.classList.toggle("feito", indice < passo);
    pontos.append(ponto);
  });
  atualizarReabertura();
  selecionarAlvo(etapa);
  texto.textContent = alvo ? etapa.texto : etapa.alternativa || etapa.texto;
  if (etapa.link && !(tipoAtual === "geral" && passo === 1 && alvo && /\/Cursos\.html$/.test(location.pathname))) linkContexto(...etapa.link);
  if (passo) botao("Voltar", () => { passo--; mostrarPasso(); });
  botao(passo === etapas.length - 1 ? "Concluir" : "Próximo", () => {
    if (passo === etapas.length - 1) modal.fechar();
    else { passo++; mostrarPasso(); }
  }, true);
  if (focar) {
    titulo.focus({ preventScroll: true });
  }
  posicionar();
}
function iniciar(tipo) {
  guardar(tipo);
  convite = null;
  tipoAtual = tipo;
  passo = 0;
  abrirTutorial();
  mostrarPasso();
}
function convidar(tipo) {
  limpar();
  etapas = [];
  convite = tipo;
  titulo.textContent = tipo === "aula" ? "Quer aprender a usar esta página?" : "Bem-vindo ao TechSênior!";
  texto.textContent = tipo === "aula" ? "Vamos mostrar onde ficam os módulos e como passar para a próxima aula." : "É sua primeira vez por aqui? Podemos mostrar como encontrar os cursos, ajustar as letras e pedir ajuda.";
  botao("Agora não", modal.fechar);
  botao(tipo === "aula" ? "Mostrar como usar" : "Conhecer o site", () => iniciar(tipo), true);
  abrirTutorial();
  titulo.focus();
  posicionar();
}
function escolher() {
  limpar();
  etapas = [];
  convite = null;
  titulo.textContent = "Como usar o TechSênior";
  texto.textContent = aula ? "Escolha o que quer conhecer. Você pode parar a qualquer momento." : "Conheça o site. Para aprender a usar as aulas, abra um curso e escolha esta mesma opção no menu.";
  botao("Conhecer o site", () => iniciar("geral"), true);
  if (aula && !document.getElementById("cursoLayout")?.hidden) botao("Como usar as aulas", () => iniciar("aula"));
  else linkContexto("Encontrar um curso para aprender a usar as aulas", "Cursos.html");
  abrirTutorial();
  titulo.focus();
  posicionar();
}
// O rodapé preserva o acesso do desktop, sem duplicar ações no mesmo menu.
for (const nav of document.querySelectorAll("footer .coluna:has(a[href='Cursos.html'])")) {
  const acesso = document.createElement("a");
  acesso.href = "#como-usar-techsenior";
  acesso.className = "tutorial-acesso";
  acesso.textContent = "Como usar o TechSênior";
  acesso.addEventListener("click", (evento) => { evento.preventDefault(); escolher(); });
  nav.append(acesso);
}
const sidebar = document.getElementById("sidebar");
const preferencias = document.getElementById("drawerPreferencias");
function orientarAulas() {
  if (aula && !document.getElementById("cursoLayout")?.hidden) { iniciar("aula"); return; }
  limpar();
  etapas = [];
  convite = null;
  titulo.textContent = "Abra um curso primeiro";
  texto.textContent = "Escolha um curso e abra uma aula. Depois, use “Como usar as aulas” no menu.";
  linkContexto("Encontrar um curso", "Cursos.html");
  abrirTutorial();
  titulo.focus();
  posicionar();
}
if (sidebar) {
  const orientacao = document.createElement("section");
  orientacao.className = "orientacao-menu";
  orientacao.setAttribute("aria-labelledby", "tituloOrientacao");
  orientacao.innerHTML = `<h2 id="tituloOrientacao">Precisa de uma orientação?</h2>
    <p>Você pode rever as instruções quando quiser.</p>`;
  for (const [rotulo, acao] of [["Conhecer o site", () => iniciar("geral")], ["Como usar as aulas", orientarAulas]]) {
    const acesso = document.createElement("button");
    acesso.type = "button";
    acesso.textContent = rotulo;
    acesso.addEventListener("click", acao);
    orientacao.append(acesso);
  }
  if (preferencias) preferencias.before(orientacao);
  else sidebar.append(orientacao);
}
// Links reais, agrupados e sem copiar toda a navegação do rodapé.
if (aula && sidebar) {
  const informacoes = document.createElement("details");
  informacoes.className = "tutorial-institucional";
  const resumo = document.createElement("summary");
  resumo.innerHTML = `<i class="fa-solid fa-circle-info" aria-hidden="true"></i>
    <span><strong>Informações do site</strong><small>Projeto, políticas e contato.</small></span>
    <i class="fa-solid fa-chevron-down informacoes-seta" aria-hidden="true"></i>`;
  resumo.setAttribute("aria-controls", "gruposInformacoesSite");
  resumo.setAttribute("aria-expanded", "false");
  informacoes.addEventListener("toggle", () => resumo.setAttribute("aria-expanded", String(informacoes.open)));
  const grupos = document.createElement("div");
  grupos.id = "gruposInformacoesSite";
  const fontes = new Map();
  document.querySelectorAll("footer a:not(.tutorial-acesso)").forEach((link) => {
    if (!fontes.has(link.href)) fontes.set(link.href, link);
  });
  const categorias = [
    ["Sobre o projeto", ["Sobre Nós.html", "https://www.instagram.com/techsenior_tcc/"]],
    ["Políticas e segurança", ["Termos de Uso.html", "Política de Privacidade.html", "Declaração de Acessibilidade.html", "Regras da Comunidade.html"]],
    ["Ajuda e contato", ["ContatoSuporte.html"]],
  ];
  for (const [nome, destinos] of categorias) {
    const grupo = document.createElement("div");
    grupo.className = "informacoes-grupo";
    const cabecalho = document.createElement("h3");
    cabecalho.textContent = nome;
    grupo.append(cabecalho);
    for (const destino of destinos) {
      const href = new URL(destino, location.href).href;
      const fonte = fontes.get(href);
      if (!fonte) continue;
      // Copia o link do rodapé sem retirar destinos da navegação original.
      const link = fonte.cloneNode(true);
      link.removeAttribute("id");
      link.classList.add("informacoes-link");
      grupo.append(link);
      fontes.delete(href);
    }
    if (grupo.children.length > 1) grupos.append(grupo);
  }
  informacoes.append(resumo, grupos);
  if (preferencias) preferencias.before(informacoes);
  else sidebar.append(informacoes);
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
