import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";

import {
  buscarQuizDoModulo,
  buscarQuizFinalDoCurso,
  criarQuiz,
  listarQuestoesDoQuiz,
  criarQuestaoQuiz,
  editarQuestaoQuiz,
  listarAlternativasDaQuestao,
  criarAlternativaQuiz,
  editarAlternativaQuiz,
  excluirQuestaoQuiz,
  excluirAlternativaQuiz,
} from "../dataconnect-generated/esm/index.esm.js";

import {
  escapeHtml,
  normalizarVazio,
  proximaOrdem,
  trocarOrdens,
  configurarModais,
  criarBloqueio,
  configurarCamposComLimite,
  atualizarContadoresCampos
} from "./AdminComum.js";

// Editor compartilhado; o contexto determina o tipo e nunca permite alterá-lo.
export async function iniciarEditorQuiz({ cursoId, moduloId = null }) {
  configurarCamposComLimite();
  
  if (document.querySelector("[data-editor-quiz]").dataset.iniciado) return;
  document.querySelector("[data-editor-quiz]").dataset.iniciado = "true";
  const final = moduloId === null;
  const estadoQuiz = document.getElementById("estadoQuiz");
  const listaQuestoes = document.getElementById("listaQuestoes");
  const btnCriarQuiz = document.getElementById("btnCriarQuiz");
  const btnNovaQuestao = document.getElementById("btnNovaQuestao");
  const modalQuestao = document.getElementById("modalQuestao");
  const formQuestao = document.getElementById("formQuestao");
  const tituloModalQuestao = document.getElementById("tituloModalQuestao");
  const perguntaQuiz = document.getElementById("perguntaQuiz");
  const btnFecharModalQuestao = document.getElementById(
    "btnFecharModalQuestao",
  );
  const btnCancelarQuestao = document.getElementById("btnCancelarQuestao");
  const btnSalvarQuestao = document.getElementById("btnSalvarQuestao");
  const modalAlternativa = document.getElementById("modalAlternativa");
  const formAlternativa = document.getElementById("formAlternativa");
  const tituloModalAlternativa = document.getElementById(
    "tituloModalAlternativa",
  );
  const textoAlternativa = document.getElementById("textoAlternativa");
  const alternativaCorreta = document.getElementById("alternativaCorreta");
  const explicacaoAlternativa = document.getElementById(
    "explicacaoAlternativa",
  );
  const btnFecharModalAlternativa = document.getElementById(
    "btnFecharModalAlternativa",
  );
  const btnCancelarAlternativa = document.getElementById(
    "btnCancelarAlternativa",
  );
  const btnSalvarAlternativa = document.getElementById("btnSalvarAlternativa");
  const erroAlternativa = document.getElementById("erroAlternativa");
  let quizAtual = null;
  let questoesCarregadas = [];
  let alternativasPorQuestao = new Map();
  let questaoEmEdicao = null;
  let alternativaEmEdicao = null;
  let questaoDaAlternativa = null;
  const executarBloqueado = criarBloqueio(
    document.querySelector("[data-editor-quiz]"),
  );
  const bloquear = async (operacao) => {
    await executarBloqueado(operacao);
    btnNovaQuestao.disabled = final && questoesCarregadas.length >= 15;
  };
  function questaoCompleta(questao) {
    const alternativas = alternativasPorQuestao.get(questao.id) || [];
    return (
      alternativas.length >= 2 &&
      alternativas.length <= 5 &&
      alternativas.filter((a) => a.correta).length === 1
    );
  }
  async function excluirItem(mensagem, operacao, id) {
    if (!confirm(mensagem)) return;
    await bloquear(async () => {
      try {
        await operacao({ id });
        await carregarQuiz();
      } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir. Atualize a página e tente novamente.");
      }
    });
  }
  async function carregarQuiz() {
    estadoQuiz.hidden = false;
    estadoQuiz.textContent = "Carregando quiz...";
    listaQuestoes.hidden = true;
    btnNovaQuestao.hidden = true;
    btnCriarQuiz.hidden = true;

    try {
      const resposta = await (
        final ? buscarQuizFinalDoCurso : buscarQuizDoModulo
      )(final ? { cursoId } : { moduloId }, {
        fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
      });
      quizAtual = resposta.data.quizzes?.[0] || null;

      if (!quizAtual) {
        btnCriarQuiz.hidden = false;
        btnNovaQuestao.hidden = true;
        estadoQuiz.textContent = "Este quiz ainda não foi criado.";
        listaQuestoes.innerHTML = "";
        return;
      }

      btnCriarQuiz.hidden = true;
      await carregarQuestoes();
      btnNovaQuestao.hidden = false;
    } catch (erro) {
      console.error("Erro ao carregar quiz:", erro);
      estadoQuiz.hidden = false;
      estadoQuiz.textContent = "Não foi possível carregar o quiz.";
    }
  }

  async function criarQuizDoModulo() {
    btnCriarQuiz.disabled = true;
    try {
      await criarQuiz({ cursoId, moduloId, tipo: final ? "final" : "modulo" });
      await carregarQuiz();
    } catch (erro) {
      console.error("Erro ao criar quiz:", erro);
      alert("Não foi possível criar o quiz.");
    } finally {
      btnCriarQuiz.disabled = false;
    }
  }

  async function carregarQuestoes() {
    const resposta = await listarQuestoesDoQuiz(
      { quizId: quizAtual.id },
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    questoesCarregadas = resposta.data.questaoQuizs || [];

    const alternativas = await Promise.all(
      questoesCarregadas.map(async (questao) => {
        const respostaAlternativas = await listarAlternativasDaQuestao(
          { questaoId: questao.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        return [questao.id, respostaAlternativas.data.alternativaQuizs || []];
      }),
    );
    alternativasPorQuestao = new Map(alternativas);
    mostrarQuestoes();
    estadoQuiz.hidden = !final;
    const total = questoesCarregadas.length;
    const completas = questoesCarregadas.filter(questaoCompleta).length;
    const completo = total >= 10 && total <= 15 && completas === total;
    if (final) {
      estadoQuiz.classList.add("resumo-quiz-admin");
      estadoQuiz.innerHTML = `
        <div class="indicador-teste-final">
          <i class="fa-solid fa-list-ol" aria-hidden="true"></i>
          <span>
            <strong>${total} / 10</strong>
            <small>Questões cadastradas</small>
          </span>
        </div>
        <div class="indicador-teste-final">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
          <span>
            <strong>${completas}</strong>
            <small>Questões completas</small>
          </span>
        </div>
        <div class="indicador-teste-final ${completo ? "is-completo" : "is-incompleto"}">
          <i class="fa-solid ${completo ? "fa-check" : "fa-circle-exclamation"}" aria-hidden="true"></i>
          <span>
            <strong>${completo ? "Completo" : "Incompleto"}</strong>
            <small>Status do teste</small>
          </span>
        </div>
        <div class="indicador-teste-final">
          <i class="fa-solid fa-list-ol" aria-hidden="true"></i>
          <span>
            <strong>15</strong>
            <small>Máximo de questões</small>
          </span>
        </div>
      `;
    }
    btnNovaQuestao.disabled = final && total >= 15;
    listaQuestoes.hidden = false;
  }

  function mostrarQuestoes() {
    listaQuestoes.innerHTML = "";
    if (questoesCarregadas.length === 0) {
      listaQuestoes.innerHTML =
        '<div class="mensagem">Crie a primeira questão deste quiz.</div>';
      return;
    }

    questoesCarregadas.forEach((questao, indiceQuestao) => {
      const card = document.createElement("article");
      card.className = "questao-admin";
      card.innerHTML = `
      <header class="questao-admin__cabecalho">
        <div class="questao-admin__identificacao">
          <span class="questao-admin__numero">${escapeHtml(questao.ordem)}</span>
          <h3>Questão ${escapeHtml(questao.ordem)}</h3>
        </div>
        <span class="questao-admin__status ${questaoCompleta(questao) ? "is-completa" : ""}">
          ${questaoCompleta(questao) ? "Completa" : "Incompleta"}
        </span>
      </header>

      <div class="questao-admin__enunciado">
        ${escapeHtml(questao.pergunta)}
      </div>

      <div class="questao-admin__barra-acoes">
        <button
          class="btn-modulos"
          type="button"
          data-acao="nova-alternativa"
          ${
            (alternativasPorQuestao.get(questao.id) || []).length >= 5
              ? "disabled"
              : ""
          }
        >
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          Nova alternativa
        </button>

        <button
          class="btn-editar"
          type="button"
          data-acao="editar-questao"
        >
          <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          Editar
        </button>

        <div class="questao-admin__ordem">
          <button
            class="btn-ordem"
            type="button"
            data-acao="subir-questao"
            ${indiceQuestao === 0 ? "disabled" : ""}
            aria-label="Mover questão para cima"
            title="Mover para cima"
          >
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>

          <button
            class="btn-ordem"
            type="button"
            data-acao="descer-questao"
            ${
              indiceQuestao === questoesCarregadas.length - 1
                ? "disabled"
                : ""
            }
            aria-label="Mover questão para baixo"
            title="Mover para baixo"
          >
            <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </button>
        </div>

        <button
          class="btn-excluir"
          type="button"
          data-acao="excluir-questao"
        >
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
          Excluir
        </button>
      </div>

      <p class="questao-admin__ajuda">
        Para completar: pelo menos <strong>2 alternativas</strong> e exatamente <strong>1 correta</strong>.
      </p>

      <section class="questao-admin__alternativas" aria-label="Alternativas da questão ${escapeHtml(questao.ordem)}">
        <header class="questao-admin__alternativas-cabecalho">
          <h4>Alternativas</h4>
          <span>${(alternativasPorQuestao.get(questao.id) || []).length}/5</span>
        </header>
        ${
          (alternativasPorQuestao.get(questao.id) || []).length === 0
            ? '<p class="questao-admin__vazio">Esta questão ainda não possui alternativas.</p>'
            : `<div class="alternativas-admin">${montarAlternativas(questao)}</div>`
        }
      </section>
    `;

      card
        .querySelector("[data-acao='subir-questao']")
        .addEventListener("click", () => moverQuestao(questao.id, -1));
      card
        .querySelector("[data-acao='descer-questao']")
        .addEventListener("click", () => moverQuestao(questao.id, 1));
      card
        .querySelector("[data-acao='editar-questao']")
        .addEventListener("click", () => abrirEdicaoQuestao(questao.id));
      card
        .querySelector("[data-acao='nova-alternativa']")
        .addEventListener("click", () => abrirNovaAlternativa(questao.id));
      card
        .querySelectorAll("[data-acao='editar-alternativa']")
        .forEach((botao) => {
          botao.addEventListener("click", () =>
            abrirEdicaoAlternativa(questao.id, botao.dataset.alternativaId),
          );
        });
      card
        .querySelectorAll("[data-acao='subir-alternativa']")
        .forEach((botao) => {
          botao.addEventListener("click", () =>
            moverAlternativa(questao.id, botao.dataset.alternativaId, -1),
          );
        });
      card
        .querySelectorAll("[data-acao='descer-alternativa']")
        .forEach((botao) => {
          botao.addEventListener("click", () =>
            moverAlternativa(questao.id, botao.dataset.alternativaId, 1),
          );
        });
      card
        .querySelector('[data-acao="excluir-questao"]')
        .addEventListener("click", () =>
          excluirItem(
            "Excluir esta questão e todas as suas alternativas?",
            excluirQuestaoQuiz,
            questao.id,
          ),
        );
      card
        .querySelectorAll('[data-acao="excluir-alternativa"]')
        .forEach((botao) =>
          botao.addEventListener("click", () =>
            excluirItem(
              "Excluir esta alternativa? A questão poderá ficar incompleta.",
              excluirAlternativaQuiz,
              botao.dataset.alternativaId,
            ),
          ),
        );
      listaQuestoes.appendChild(card);
    });
  }

  function montarAlternativas(questao) {
    const alternativas = alternativasPorQuestao.get(questao.id) || [];
    if (alternativas.length === 0) {
      return '<p class="questao-admin__vazio">Esta questão ainda não possui alternativas.</p>';
    }

    return alternativas
      .map(
        (alternativa, indice) => `
    <article class="alternativa-admin ${alternativa.correta ? "is-correta" : ""}">
      <div class="alternativa-admin__linha">
        <span class="alternativa-admin__letra" aria-hidden="true">${String.fromCharCode(65 + indice)}</span>
        <div class="alternativa-admin__conteudo">
          <div class="alternativa-admin__resposta">${escapeHtml(alternativa.texto)}</div>
        </div>
        <div class="alternativa-admin__lateral">
          <span class="alternativa-admin__status ${alternativa.correta ? "is-correta" : "is-incorreta"}">
            ${alternativa.correta ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Correta' : "Incorreta"}
          </span>
          <div class="alternativa-admin__acoes">
            <button
              class="btn-editar"
              type="button"
              data-acao="editar-alternativa"
              data-alternativa-id="${alternativa.id}"
            >
              <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
              Editar
            </button>

            <div class="alternativa-admin__ordem">
              <button
                class="btn-ordem"
                type="button"
                data-acao="subir-alternativa"
                data-alternativa-id="${alternativa.id}"
                ${indice === 0 ? "disabled" : ""}
                aria-label="Mover alternativa para cima"
              >
                <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
              </button>

              <button
                class="btn-ordem"
                type="button"
                data-acao="descer-alternativa"
                data-alternativa-id="${alternativa.id}"
                ${indice === alternativas.length - 1 ? "disabled" : ""}
                aria-label="Mover alternativa para baixo"
              >
                <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>

            <button
              class="btn-excluir"
              type="button"
              data-acao="excluir-alternativa"
              data-alternativa-id="${alternativa.id}"
            >
              <i class="fa-solid fa-trash" aria-hidden="true"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
      ${
        alternativa.explicacao && String(alternativa.explicacao).trim()
          ? `<section class="alternativa-admin__explicacao" aria-label="Explicação da alternativa ${String.fromCharCode(65 + indice)}">
              <h5>Explicação</h5>
              <p>${escapeHtml(alternativa.explicacao)}</p>
            </section>`
          : ""
      }
    </article>
  `,
      )
      .join("");
  }

  function abrirNovaQuestao() {
    if (final && questoesCarregadas.length >= 15) return;
    if (!quizAtual) {
      alert("Crie o quiz antes de adicionar questões.");
      return;
    }
    questaoEmEdicao = null;
    prepararFormularioQuestao();
    modalQuestao.hidden = false;
    perguntaQuiz.focus();
  }

  function abrirEdicaoQuestao(questaoId) {
    const questao = questoesCarregadas.find((item) => item.id === questaoId);
    if (!questao) {
      alert("Questão não encontrada.");
      return;
    }
    questaoEmEdicao = questao;
    perguntaQuiz.value = questao.pergunta || "";

    atualizarTextosModalQuestao();
    atualizarContadoresCampos(modalQuestao);

    modalQuestao.hidden = false;
    perguntaQuiz.focus();
  }

  function prepararFormularioQuestao() {
    formQuestao.reset();
    atualizarTextosModalQuestao();
    atualizarContadoresCampos(modalQuestao);
  }

  function fecharModalQuestao() {
    modalQuestao.hidden = true;
    questaoEmEdicao = null;
    prepararFormularioQuestao();
  }

  function atualizarTextosModalQuestao() {
    const editando = questaoEmEdicao !== null;
    tituloModalQuestao.textContent = editando
      ? "Editar questão"
      : "Nova questão";
    btnSalvarQuestao.innerHTML = editando
      ? '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Salvar alterações'
      : '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Criar questão';
  }

  async function moverQuestaoInterno(questaoId, direcao) {
    const indice = questoesCarregadas.findIndex(
      (questao) => questao.id === questaoId,
    );
    const destino = indice + direcao;
    if (indice < 0 || destino < 0 || destino >= questoesCarregadas.length)
      return;
    try {
      await trocarOrdens(
        questoesCarregadas,
        questoesCarregadas[indice],
        questoesCarregadas[destino],
        atualizarQuestao,
      );
      await carregarQuiz();
    } catch (erro) {
      console.error("Erro ao reordenar questão:", erro);
      alert("Não foi possível alterar a ordem da questão.");
    }
  }

  async function atualizarQuestao(questao, ordem) {
    await editarQuestaoQuiz({
      id: questao.id,
      pergunta: questao.pergunta,
      ordem,
    });
  }

  function abrirNovaAlternativa(questaoId) {
    if ((alternativasPorQuestao.get(questaoId) || []).length >= 5) return;
    const questao = questoesCarregadas.find((item) => item.id === questaoId);
    if (!questao) {
      alert("Questão não encontrada.");
      return;
    }
    questaoDaAlternativa = questao;
    alternativaEmEdicao = null;
    prepararFormularioAlternativa();
    modalAlternativa.hidden = false;
    textoAlternativa.focus();
  }

  function abrirEdicaoAlternativa(questaoId, alternativaId) {
    erroAlternativa.hidden = true;
    const questao = questoesCarregadas.find((item) => item.id === questaoId);
    const alternativa = alternativasPorQuestao
      .get(questaoId)
      ?.find((item) => item.id === alternativaId);

    if (!questao || !alternativa) {
      alert("Alternativa não encontrada.");
      return;
    }

    questaoDaAlternativa = questao;
    alternativaEmEdicao = alternativa;
    formAlternativa.reset();
    textoAlternativa.value = alternativa.texto || "";
    alternativaCorreta.checked = Boolean(alternativa.correta);
    explicacaoAlternativa.value = alternativa.explicacao || "";

    atualizarTextosModalAlternativa();
    atualizarContadoresCampos(modalAlternativa);
    modalAlternativa.hidden = false;
    textoAlternativa.focus();
  }

  function prepararFormularioAlternativa() {
    erroAlternativa.hidden = true;
    formAlternativa.reset();
    atualizarTextosModalAlternativa();
    atualizarContadoresCampos(modalAlternativa);
  }

  function fecharModalAlternativa() {
    modalAlternativa.hidden = true;
    alternativaEmEdicao = null;
    questaoDaAlternativa = null;
    prepararFormularioAlternativa();
  }

  function atualizarTextosModalAlternativa() {
    const editando = alternativaEmEdicao !== null;
    tituloModalAlternativa.textContent = editando
      ? "Editar alternativa"
      : "Nova alternativa";
    btnSalvarAlternativa.innerHTML = editando
      ? '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Salvar alterações'
      : '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Criar alternativa';
  }

  async function moverAlternativaInterno(questaoId, alternativaId, direcao) {
    const alternativas = alternativasPorQuestao.get(questaoId) || [];
    const indice = alternativas.findIndex(
      (alternativa) => alternativa.id === alternativaId,
    );
    const destino = indice + direcao;
    if (indice < 0 || destino < 0 || destino >= alternativas.length) return;
    try {
      await trocarOrdens(
        alternativas,
        alternativas[indice],
        alternativas[destino],
        atualizarAlternativa,
      );
      await carregarQuiz();
    } catch (erro) {
      console.error("Erro ao reordenar alternativa:", erro);
      alert("Não foi possível alterar a ordem da alternativa.");
    }
  }

  async function atualizarAlternativa(alternativa, ordem) {
    await editarAlternativaQuiz({
      id: alternativa.id,
      texto: alternativa.texto,
      correta: Boolean(alternativa.correta),
      explicacao: alternativa.explicacao ?? null,
      ordem,
    });
  }

  const moverQuestao = (...args) =>
    bloquear(() => moverQuestaoInterno(...args));
  const moverAlternativa = (...args) =>
    bloquear(() => moverAlternativaInterno(...args));
  formQuestao.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (btnSalvarQuestao.disabled) return;
    const pergunta = perguntaQuiz.value.trim();
    if (!pergunta) {
      alert("Informe a pergunta.");
      perguntaQuiz.focus();
      return;
    }
    const editando = questaoEmEdicao !== null;
    if (!editando && final && questoesCarregadas.length >= 15) {
      alert("O teste final permite no máximo 15 questões.");
      return;
    }
    btnSalvarQuestao.disabled = true;
    try {
      if (editando) {
        await editarQuestaoQuiz({
          id: questaoEmEdicao.id,
          pergunta,
          ordem: questaoEmEdicao.ordem,
        });
      } else {
        await criarQuestaoQuiz({
          quizId: quizAtual.id,
          pergunta,
          ordem: proximaOrdem(questoesCarregadas),
        });
      }
      fecharModalQuestao();
      await carregarQuiz();
    } catch (erro) {
      console.error("Erro ao salvar questão:", erro);
      alert("Não foi possível salvar a questão.");
    } finally {
      btnSalvarQuestao.disabled = false;
      atualizarTextosModalQuestao();
    }
  });

  formAlternativa.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (btnSalvarAlternativa.disabled) return;
    if (!questaoDaAlternativa) return;

    const texto = textoAlternativa.value.trim();
    const correta = alternativaCorreta.checked;
    const explicacao = normalizarVazio(explicacaoAlternativa.value);
    if (!texto) {
      alert("Informe o texto da alternativa.");
      textoAlternativa.focus();
      return;
    }

    const editando = alternativaEmEdicao !== null;
    const atuais = alternativasPorQuestao.get(questaoDaAlternativa.id) || [];
    if (!editando && atuais.length >= 5) {
      alert("Uma questão permite no máximo 5 alternativas.");
      return;
    }
    if (
      alternativaEmEdicao?.correta &&
      !correta &&
      !atuais.some((a) => a.correta && a.id !== alternativaEmEdicao.id)
    ) {
      erroAlternativa.textContent =
        "Uma questão precisa possuir uma alternativa correta. Marque outra alternativa como correta antes de desmarcar esta.";
      erroAlternativa.hidden = false;
      alternativaCorreta.focus();
      return;
    }
    btnSalvarAlternativa.disabled = true;
    try {
      if (editando) {
        await editarAlternativaQuiz({
          id: alternativaEmEdicao.id,
          texto,
          correta,
          explicacao,
          ordem: alternativaEmEdicao.ordem,
        });
      } else {
        const alternativas =
          alternativasPorQuestao.get(questaoDaAlternativa.id) || [];
        await criarAlternativaQuiz({
          questaoId: questaoDaAlternativa.id,
          texto,
          correta,
          explicacao,
          ordem: proximaOrdem(alternativas),
        });
      }
      fecharModalAlternativa();
      await carregarQuiz();
    } catch (erro) {
      console.error("Erro ao salvar alternativa:", erro);
      alert("Não foi possível salvar a alternativa.");
    } finally {
      btnSalvarAlternativa.disabled = false;
      atualizarTextosModalAlternativa();
    }
  });

  btnCriarQuiz.addEventListener("click", () => bloquear(criarQuizDoModulo));
  btnNovaQuestao.addEventListener("click", abrirNovaQuestao);
  btnFecharModalQuestao.addEventListener("click", fecharModalQuestao);
  btnCancelarQuestao.addEventListener("click", fecharModalQuestao);
  btnFecharModalAlternativa.addEventListener("click", fecharModalAlternativa);
  btnCancelarAlternativa.addEventListener("click", fecharModalAlternativa);
  configurarModais([
    [modalQuestao, fecharModalQuestao],
    [modalAlternativa, fecharModalAlternativa],
  ]);
  await carregarQuiz();
}
