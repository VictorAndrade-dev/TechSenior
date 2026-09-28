const lerPreferencia = (chave, padrao) => {
  try {
    return localStorage.getItem(chave) || padrao;
  } catch {
    return padrao;
  }
};

const salvarPreferencia = (chave, valor) => {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* O navegador pode bloquear o armazenamento de preferências. */
  }
};

function atualizarLogos(tema) {
  const origem = tema === "escuro"
    ? "Imagens/Logo-TechSenior-Dark.svg"
    : "Imagens/Logo-TechSenior-Light.svg";
  document.querySelectorAll("[data-logo-tema], .logo img, .logo-footer img, [class$='-logo'] img").forEach((logo) => {
    if (logo.getAttribute("src") !== origem) logo.setAttribute("src", origem);
  });
}

export function textoVisivel(raiz) {
  if (!raiz) return "";
  const ignorar = "header, nav, aside, footer, script, style, [hidden], [aria-hidden='true'], #painelAcessibilidade, .acessibilidade-controles, .copyright, input, textarea, select, .sidebar";
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  const partes = [];
  while (walker.nextNode()) {
    const no = walker.currentNode;
    const pai = no.parentElement;
    if (!no.textContent.trim() || !pai || pai.closest(ignorar)) continue;
    if (pai.closest("button") && !pai.closest("[id*='Alternativas'], .quiz-alternativas, .alternativas")) continue;
    let visivel = true;
    for (let elemento = pai; elemento; elemento = elemento.parentElement) {
      const estilo = getComputedStyle(elemento);
      if (estilo.display === "none" || estilo.visibility === "hidden" || estilo.opacity === "0") {
        visivel = false;
        break;
      }
    }
    if (visivel && pai.getClientRects().length) partes.push(no.textContent.trim());
  }
  return partes.join(". ");
}

export function configurarAcessibilidade(sidebar, destinoDrawer) {
  const escalas = [90, 100, 110, 120];
  let escala = Number(lerPreferencia("tamanhoFonte", "100"));
  if (!escalas.includes(escala)) escala = 100;
  let tema = lerPreferencia("tema", "claro") === "escuro" ? "escuro" : "claro";
  let velocidade = Number(lerPreferencia("velocidadeVoz", "1"));
  if (![0.8, 1, 1.2].includes(velocidade)) velocidade = 1;

  document.documentElement.dataset.tamanhoFonte = escala;
  document.documentElement.style.fontSize = `${escala}%`;
  document.documentElement.dataset.tema = tema;
  atualizarLogos(tema);

  const painel = document.createElement("div");
  painel.id = "painelAcessibilidade";
  painel.innerHTML = `
    <button type="button" id="btnAcessibilidade" aria-expanded="false" aria-controls="opcoesAcessibilidade" aria-label="Abrir opções de acessibilidade" title="Acessibilidade">
      <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
    </button>
    <div id="opcoesAcessibilidade" hidden></div>`;
  document.body.append(painel);

  const opcoes = painel.querySelector("#opcoesAcessibilidade");
  const controles = document.createElement("div");
  controles.className = "acessibilidade-controles";
  controles.innerHTML = `
    <h2>Acessibilidade</h2>
    <section class="a11y-secao" aria-labelledby="a11yTexto">
      <h3 id="a11yTexto">Texto <output id="escalaTexto"></output></h3>
      <div class="a11y-grupo">
        <button type="button" data-fonte="menos" aria-label="Diminuir texto">A−</button>
        <button type="button" data-fonte="normal" aria-label="Restaurar texto para 100%">A</button>
        <button type="button" data-fonte="mais" aria-label="Aumentar texto">A+</button>
      </div>
    </section>
    <section class="a11y-secao" aria-labelledby="a11yTema">
      <h3 id="a11yTema">Aparência</h3>
      <div class="a11y-grupo">
        <button type="button" data-tema="claro">Claro</button>
        <button type="button" data-tema="escuro">Escuro</button>
      </div>
    </section>
    <section class="a11y-secao" aria-labelledby="a11yLeitura">
      <h3 id="a11yLeitura">Leitura por voz</h3>
      <div class="a11y-grupo">
        <button type="button" id="ouvirPagina"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Ouvir</button>
        <button type="button" id="pausarVoz" disabled><i class="fa-solid fa-pause" aria-hidden="true"></i> <span>Pausar</span></button>
        <button type="button" id="pararVoz" disabled><i class="fa-solid fa-stop" aria-hidden="true"></i> Parar</button>
      </div>
    </section>
    <section class="a11y-secao" aria-labelledby="a11yVelocidade">
      <h3 id="a11yVelocidade">Velocidade</h3>
      <div class="a11y-grupo">
        <button type="button" data-velocidade="0.8">0.8x</button>
        <button type="button" data-velocidade="1">1x</button>
        <button type="button" data-velocidade="1.2">1.2x</button>
      </div>
    </section>
    <p id="estadoVoz" class="a11y-status" role="status" aria-live="polite"></p>`;

  const reposicionar = () => {
    const destino = sidebar && innerWidth <= 1000
      ? (destinoDrawer || sidebar)
      : opcoes;
    if (controles.parentElement !== destino) destino.append(controles);
    painel.classList.toggle("no-drawer", destino !== opcoes);
  };
  reposicionar();
  window.addEventListener("resize", reposicionar);

  const abrir = painel.querySelector("#btnAcessibilidade");
  abrir.addEventListener("click", () => {
    opcoes.hidden = !opcoes.hidden;
    abrir.setAttribute("aria-expanded", String(!opcoes.hidden));
    if (!opcoes.hidden) opcoes.querySelector("button")?.focus();
  });
  painel.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape" || opcoes.hidden) return;
    opcoes.hidden = true;
    abrir.setAttribute("aria-expanded", "false");
    abrir.focus();
  });

  function aplicar() {
    document.documentElement.dataset.tamanhoFonte = escala;
    document.documentElement.style.fontSize = `${escala}%`;
    document.documentElement.dataset.tema = tema;
    atualizarLogos(tema);
    controles.querySelector("output").textContent = `${escala}%`;
    controles.querySelector("[data-fonte='menos']").disabled = escala === 90;
    controles.querySelector("[data-fonte='mais']").disabled = escala === 120;
    controles.querySelectorAll("[data-tema]").forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.dataset.tema === tema));
    });
    controles.querySelectorAll("[data-velocidade]").forEach((botao) => {
      botao.setAttribute("aria-pressed", String(Number(botao.dataset.velocidade) === velocidade));
    });
    salvarPreferencia("tamanhoFonte", escala);
    salvarPreferencia("tema", tema);
    salvarPreferencia("velocidadeVoz", velocidade);
  }

  controles.querySelectorAll("[data-fonte]").forEach((botao) => botao.addEventListener("click", () => {
    if (botao.dataset.fonte === "normal") {
      escala = 100;
    } else {
      const direcao = botao.dataset.fonte === "mais" ? 1 : -1;
      escala = escalas[Math.max(0, Math.min(escalas.length - 1, escalas.indexOf(escala) + direcao))];
    }
    aplicar();
  }));
  controles.querySelectorAll("[data-tema]").forEach((botao) => botao.addEventListener("click", () => {
    tema = botao.dataset.tema;
    aplicar();
  }));
  controles.querySelectorAll("[data-velocidade]").forEach((botao) => botao.addEventListener("click", () => {
    velocidade = Number(botao.dataset.velocidade);
    aplicar();
    controles.querySelector("#estadoVoz").textContent = "Velocidade aplicada na próxima leitura.";
  }));
  aplicar();

  const ouvir = controles.querySelector("#ouvirPagina");
  const pausar = controles.querySelector("#pausarVoz");
  const pausarTexto = pausar.querySelector("span");
  const parar = controles.querySelector("#pararVoz");
  const estado = controles.querySelector("#estadoVoz");
  if (!("speechSynthesis" in window)) {
    ouvir.disabled = true;
    estado.textContent = "Este navegador não oferece leitura por voz.";
    return;
  }

  let geracao = 0;
  let pausada = false;
  function cancelar() {
    geracao += 1;
    speechSynthesis.cancel();
    pausada = false;
    pausarTexto.textContent = "Pausar";
    pausar.disabled = true;
    parar.disabled = true;
    estado.textContent = "Leitura parada.";
  }

  ouvir.addEventListener("click", () => {
    cancelar();
    const raiz = document.querySelector(".conteudo-aula") || document.querySelector("main");
    const texto = textoVisivel(raiz);
    if (!texto) {
      estado.textContent = "Não há conteúdo visível para ler agora.";
      return;
    }
    const partes = texto.match(/.{1,220}(?:\s|$)|\S{1,220}/g) || [texto];
    const atual = geracao;
    const falar = (indice) => {
      if (atual !== geracao) return;
      if (indice >= partes.length) {
        pausar.disabled = true;
        parar.disabled = true;
        estado.textContent = "Leitura concluída.";
        return;
      }
      const fala = new SpeechSynthesisUtterance(partes[indice]);
      fala.lang = "pt-BR";
      fala.rate = velocidade;
      fala.onend = () => falar(indice + 1);
      fala.onerror = () => {
        if (atual === geracao) {
          cancelar();
          estado.textContent = "Não foi possível continuar a leitura. Tente ouvir novamente.";
        }
      };
      speechSynthesis.speak(fala);
    };
    pausar.disabled = false;
    parar.disabled = false;
    estado.textContent = "Lendo o conteúdo visível.";
    falar(0);
  });

  pausar.addEventListener("click", () => {
    pausada = !pausada;
    if (pausada) speechSynthesis.pause();
    else speechSynthesis.resume();
    pausarTexto.textContent = pausada ? "Continuar" : "Pausar";
    estado.textContent = pausada ? "Leitura pausada." : "Leitura retomada.";
  });
  parar.addEventListener("click", cancelar);
  document.addEventListener("techsenior:parar-leitura", cancelar);
  window.addEventListener("pagehide", cancelar);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelar();
  });
}
