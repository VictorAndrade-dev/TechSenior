// Utilitários pequenos compartilhados pelas telas de gerenciamento.
export function escapeHtml(valor) {
  return String(valor ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export function normalizarVazio(valor) { return valor.trim() || null; }
export function proximaOrdem(lista) {
  return Math.max(0, ...lista.map(item => Number(item.ordem) || 0)) + 1;
}

export async function trocarOrdens(lista, atual, destino, atualizar) {
  const temporaria = proximaOrdem(lista);
  const ordemAtual = atual.ordem;
  const ordemDestino = destino.ordem;
  await atualizar(atual, temporaria);
  await atualizar(destino, ordemAtual);
  await atualizar(atual, ordemDestino);
}

export function criarBloqueio(area) {
  let ocupado = false;
  return async operacao => {
    if (ocupado) return;
    ocupado = true;
    const controles = [...area.querySelectorAll('button')].map(botao => [botao, botao.disabled]);
    controles.forEach(([botao]) => { botao.disabled = true; });
    area.setAttribute('aria-busy', 'true');
    try { return await operacao(); }
    finally {
      ocupado = false;
      controles.forEach(([botao, disabled]) => { if (botao.isConnected) botao.disabled = disabled; });
      area.removeAttribute('aria-busy');
    }
  };
}

export function configurarModais(modais) {
  for (const [modal, fechar] of modais) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', modal.querySelector('h2').id);
    let anterior = document.activeElement;
    document.addEventListener('focusin', evento => {
      if (modal.hidden && !modal.contains(evento.target)) anterior = evento.target;
    });
    new MutationObserver(() => {
      for (const area of document.querySelectorAll('body > main, body > aside')) area.inert = !modal.hidden;
      if (modal.hidden && anterior?.isConnected && !modal.contains(anterior)) anterior.focus();
    }).observe(modal, {attributes: true, attributeFilter: ['hidden']});
    // Não permite cancelar ou enviar novamente enquanto a gravação está pendente.
    modal.addEventListener('click', evento => {
      if (modal.querySelector('button[type="submit"]:disabled')) { evento.preventDefault(); evento.stopImmediatePropagation(); }
    }, true);
    modal.addEventListener('keydown', evento => {
      const salvando = !!modal.querySelector('button[type="submit"]:disabled');
      if (evento.key === 'Escape' && !salvando) { evento.preventDefault(); fechar(); }
      if (evento.key !== 'Tab') return;
      const controles = [...modal.querySelectorAll('button, input, textarea, select, a[href]')]
        .filter(el => !el.disabled && el.getClientRects().length);
      const primeiro = controles[0];
      const ultimo = controles.at(-1);
      if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo?.focus(); }
      if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro?.focus(); }
    });
  }
}

export function configurarCamposComLimite(root = document) {
  const campos = root.querySelectorAll(
    "input[maxlength], textarea[maxlength], input[data-limite], textarea[data-limite]"
  );

  campos.forEach((campo) => {
    if (campo.dataset.limiteConfigurado === "true") return;

    const limite = Number(
      campo.dataset.limite ||
      campo.getAttribute("maxlength")
    );

    if (!Number.isFinite(limite) || limite <= 0) return;

    campo.dataset.limite = String(limite);
    campo.dataset.limiteConfigurado = "true";

    // Permite ultrapassar visualmente o limite.
    campo.removeAttribute("maxlength");

    const container =
      campo.closest(".campo") ||
      campo.parentElement;

    if (!container) return;

    let contador =
      container.querySelector(".contador-caracteres");

    if (!contador) {
      const rodape = document.createElement("div");

      rodape.className =
        "rodape-campo rodape-campo-automatico";

      contador = document.createElement("small");

      contador.className =
        "contador-caracteres";

      contador.setAttribute(
        "aria-live",
        "polite"
      );

      rodape.appendChild(contador);

      container.appendChild(rodape);
    }

    function atualizarContador() {
      const tamanho = campo.value.length;

      contador.textContent =
        `${tamanho} / ${limite}`;

      contador.classList.toggle(
        "proximo-limite",
        tamanho >= limite * 0.9 &&
        tamanho <= limite
      );

      contador.classList.toggle(
        "limite-critico",
        tamanho === limite
      );

      contador.classList.toggle(
        "limite-excedido",
        tamanho > limite
      );

      campo.classList.toggle(
        "campo-limite-excedido",
        tamanho > limite
      );

      campo.setCustomValidity(
        tamanho > limite
          ? `Use no máximo ${limite} caracteres.`
          : ""
      );
    }

    campo.addEventListener(
      "input",
      atualizarContador
    );

    atualizarContador();
  });
}

export function atualizarContadoresCampos(root = document) {
  const campos = root.querySelectorAll(
    "input[data-limite], textarea[data-limite], input[maxlength], textarea[maxlength]"
  );

  campos.forEach((campo) => {
    const limite = Number(
      campo.dataset.limite || campo.getAttribute("maxlength")
    );

    if (!Number.isFinite(limite) || limite <= 0) return;

    const container = campo.closest(".campo") || campo.parentElement;
    if (!container) return;

    const contador = container.querySelector(".contador-caracteres");
    if (!contador) return;

    const tamanho = campo.value.length;

    contador.textContent = `${tamanho} / ${limite}`;

    contador.classList.toggle(
      "proximo-limite",
      tamanho >= limite * 0.9 && tamanho <= limite
    );

    contador.classList.toggle("limite-critico", tamanho === limite);
    contador.classList.toggle("limite-excedido", tamanho > limite);

    campo.classList.toggle("campo-limite-excedido", tamanho > limite);
  });
}