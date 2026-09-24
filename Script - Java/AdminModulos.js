import { auth } from "./Firebase-config.js";
import { criarBloqueio, configurarModais, escapeHtml } from "./AdminComum.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";

import {
  meuPerfil,
  buscarCurso,
  listarModulosDoCurso,
  criarModulo,
  editarModulo,
  excluirModulo,
} from "../dataconnect-generated/esm/index.esm.js";

// ==========================================
// ELEMENTOS
// ==========================================

const nomeCursoAdmin = document.getElementById("nomeCursoAdmin");

const descricaoCursoAdmin = document.getElementById("descricaoCursoAdmin");

const estadoModulos = document.getElementById("estadoModulos");

const listaModulosAdmin = document.getElementById("listaModulosAdmin");

const btnNovoModulo = document.getElementById("btnNovoModulo");

const modalModulo = document.getElementById("modalModulo");

const formModulo = document.getElementById("formModulo");

const btnFecharModalModulo = document.getElementById("btnFecharModalModulo");

const btnCancelarModulo = document.getElementById("btnCancelarModulo");

const nomeModulo = document.getElementById("nomeModulo");

const descricaoModulo = document.getElementById("descricaoModulo");

const contadorDescricaoModulo = document.getElementById(
  "contadorDescricaoModulo",
);

const duracaoModulo = document.getElementById("duracaoModulo");

const duracaoModuloPersonalizada = document.getElementById(
  "duracaoModuloPersonalizada",
);

const duracaoModuloHoras = document.getElementById("duracaoModuloHoras");

const duracaoModuloMinutos = document.getElementById("duracaoModuloMinutos");

const btnSalvarModulo = document.getElementById("btnSalvarModulo");

const tituloModalModulo = document.getElementById("tituloModalModulo");

// ==========================================
// ID DO CURSO
// ==========================================

const parametros = new URLSearchParams(window.location.search);

const cursoId = parametros.get("cursoId");

// ==========================================
// VERIFICAR ID
// ==========================================

const cursoValido =
  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
    cursoId || "",
  );
if (!cursoValido) {
  alert("Curso não informado.");

  window.location.href = "Admin.html";
}

// ==========================================
// ESTADO PARA GUARDAR MÓDULOS CARREGADOS
// ==========================================

let modulosCarregados = [];

let moduloEmEdicao = null;

// ==========================================
// AUTENTICAÇÃO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
  if (!cursoValido) return;
  if (!usuario) {
    window.location.href = "Login.html";

    return;
  }

  try {
    const respostaPerfil = await meuPerfil();

    const perfil = respostaPerfil.data.usuarios?.[0];

    if (!perfil || perfil.tipoUsuario?.nome !== "Administrador") {
      negarAcesso();

      return;
    }

    await carregarPagina();
  } catch (erro) {
    console.error("Erro ao carregar gerenciamento de módulos:", erro);

    estadoModulos.hidden = false;

    estadoModulos.textContent = "Não foi possível carregar os módulos.";
  }
});

// ==========================================
// NEGAR ACESSO
// ==========================================

function negarAcesso() {
  alert("Você não possui permissão para acessar o painel administrativo.");

  window.location.href = "index.html";
}

// ==========================================
// CARREGAR PÁGINA
// ==========================================

async function carregarPagina() {
  await carregarCurso();

  await carregarModulos();
}

// ==========================================
// CARREGAR CURSO
// ==========================================

async function carregarCurso() {
  const resposta = await buscarCurso(
    {
      id: cursoId,
    },
    {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    },
  );

  const curso = resposta.data.curso;

  if (!curso) {
    alert("Curso não encontrado.");

    window.location.href = "Admin.html";

    return;
  }

  nomeCursoAdmin.textContent = curso.nome;

  const linkTesteFinal = document.getElementById("linkTesteFinal");
  linkTesteFinal.href = `AdminQuizCurso.html?cursoId=${encodeURIComponent(cursoId)}`;
  linkTesteFinal.hidden = false;

  descricaoCursoAdmin.textContent = "Organize os módulos e etapas deste curso.";

  document.title = `Módulos - ${curso.nome} | TechSênior`;
}

// ==========================================
// CARREGAR MÓDULOS
// ==========================================

async function carregarModulos() {
  estadoModulos.hidden = false;

  estadoModulos.textContent = "Carregando módulos...";

  listaModulosAdmin.hidden = true;

  try {
    const resposta = await listarModulosDoCurso(
      {
        cursoId,
      },
      {
        fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
      },
    );

    const modulos = resposta.data.modulos || [];
    modulosCarregados = modulos;

    mostrarModulos(modulos);

    estadoModulos.hidden = true;

    listaModulosAdmin.hidden = false;
  } catch (erro) {
    console.error("Erro ao carregar módulos:", erro);

    estadoModulos.hidden = false;

    estadoModulos.textContent = "Não foi possível carregar os módulos.";
  }
}

// ==========================================
// MOSTRAR MÓDULOS
// ==========================================

function mostrarModulos(modulos) {
  listaModulosAdmin.innerHTML = "";

  if (modulos.length === 0) {
    listaModulosAdmin.innerHTML = `
      <div class="mensagem">
        Este curso ainda não possui módulos.
      </div>
    `;

    return;
  }

  modulos.forEach((modulo, indice) => {
    const card = document.createElement("article");

    card.classList.add(
      "curso-admin",
      "modulo-admin-card"
    );

    card.innerHTML = `
      <div class="curso-icone modulo-numero">
        <span>Módulo</span>
        <strong>${modulo.ordem}</strong>
      </div>

      <div class="curso-info">
        <div class="curso-titulo">
          <h3>${escapeHtml(modulo.nome)}</h3>
        </div>

        <p>${escapeHtml(modulo.descricao || "Módulo sem descrição.")}</p>

        <div class="curso-detalhes">
          <span>
            <i class="fa-solid fa-list-ol"></i>
            Módulo ${modulo.ordem}
          </span>
          <span>
            <i class="fa-regular fa-clock"></i>
            ${formatarDuracao(modulo.duracaoMinutos)}
          </span>
        </div>

        <div class="curso-acoes modulo-acoes">

          <button
            class="btn-modulos"
            type="button"
            data-acao="gerenciar"
          >
            <i class="fa-solid fa-folder-open"></i>
            Gerenciar
          </button>

          <button
            class="btn-editar"
            type="button"
            data-acao="editar"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Editar
          </button>

          <button
            class="btn-ordem"
            type="button"
            data-acao="subir"
            ${indice === 0 ? "disabled" : ""}
            aria-label="Mover módulo para cima"
          >
            <i class="fa-solid fa-arrow-up"></i>
            Subir
          </button>

          <button
            class="btn-ordem"
            type="button"
            data-acao="descer"
            ${indice === modulos.length - 1 ? "disabled" : ""}
            aria-label="Mover módulo para baixo"
          >
            <i class="fa-solid fa-arrow-down"></i>
            Descer
          </button>

          <button
            class="btn-excluir"
            type="button"
            data-acao="excluir"
          >
            <i class="fa-solid fa-trash"></i>
            Excluir
          </button>

        </div>

      </div>
    `;

    card.querySelector("[data-acao='editar']").addEventListener("click", () => {
      abrirEdicaoModulo(modulo.id);
    });

    card
      .querySelector("[data-acao='gerenciar']")
      .addEventListener("click", () => {
        abrirGerenciamentoModulo(modulo.id);
      });

    card.querySelector("[data-acao='subir']").addEventListener("click", () => {
      moverModulo(modulo.id, -1);
    });

    card.querySelector("[data-acao='descer']").addEventListener("click", () => {
      moverModulo(modulo.id, 1);
    });

    card
      .querySelector('[data-acao="excluir"]')
      .addEventListener("click", async () => {
        if (
          prompt(
            `Excluir o módulo "${modulo.nome}"? Esta ação não pode ser desfeita. Digite EXCLUIR para confirmar.`,
          ) !== "EXCLUIR"
        )
          return;
        await bloquearModulos(async () => {
          try {
            await excluirModulo({ id: modulo.id });
            await carregarModulos();
          } catch (erro) {
            console.error("Erro ao excluir módulo:", erro);

            alert(
              "Não foi possível excluir o módulo. Atualize a página e tente novamente.",
            );
          }
        });
      });
    listaModulosAdmin.appendChild(card);
  });
}

function abrirGerenciamentoModulo(moduloId) {
  window.location.href = `AdminModulo.html?cursoId=${encodeURIComponent(cursoId)}&moduloId=${encodeURIComponent(moduloId)}`;
}

const bloquearModulos = criarBloqueio(document.querySelector("main"));
const moverModulo = (...args) =>
  bloquearModulos(() => moverModuloInterno(...args));
configurarModais([[modalModulo, fecharModalModulo]]);

async function moverModuloInterno(moduloId, direcao) {
  const indice = modulosCarregados.findIndex(
    (modulo) => modulo.id === moduloId,
  );

  const destino = indice + direcao;

  if (indice < 0 || destino < 0 || destino >= modulosCarregados.length) {
    return;
  }

  const moduloAtual = modulosCarregados[indice];
  const moduloDestino = modulosCarregados[destino];
  const maiorOrdem = Math.max(
    ...modulosCarregados.map((modulo) => Number(modulo.ordem) || 0),
    0,
  );

  try {
    await atualizarOrdemModulo(moduloAtual, maiorOrdem + 1);

    await atualizarOrdemModulo(moduloDestino, moduloAtual.ordem);

    await atualizarOrdemModulo(moduloAtual, moduloDestino.ordem);

    await carregarModulos();
  } catch (erro) {
    console.error("Erro ao reordenar módulo:", erro);

    alert("Não foi possível alterar a ordem do módulo.");
  }
}

async function atualizarOrdemModulo(modulo, ordem) {
  await editarModulo({
    id: modulo.id,
    nome: modulo.nome,
    descricao: modulo.descricao ?? null,
    ordem,
    duracaoMinutos: modulo.duracaoMinutos ?? null,
    imagem: modulo.imagem ?? null,
  });
}

// ==========================================
// DURAÇÃO DO MÓDULO
// ==========================================

function obterDuracaoModuloEmMinutos() {
  if (duracaoModulo.value !== "personalizada") {
    return Number(duracaoModulo.value);
  }

  const horas = Number(duracaoModuloHoras.value) || 0;

  const minutos = Number(duracaoModuloMinutos.value) || 0;

  return horas * 60 + minutos;
}

// ==========================================
// FORMATAR DURAÇÃO
// ==========================================

function formatarDuracao(totalMinutos) {
  if (totalMinutos === null || totalMinutos === undefined) {
    return "Duração não informada";
  }

  const total = Number(totalMinutos);

  if (total < 60) {
    return `${total} min`;
  }

  const horas = Math.floor(total / 60);

  const minutos = total % 60;

  if (minutos === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutos}min`;
}

// ==========================================
// NOVO MÓDULO
// ==========================================

btnNovoModulo.addEventListener("click", () => {
  moduloEmEdicao = null;

  abrirModalModulo();
});

// ==========================================
// MODAL DE MÓDULO
// ==========================================

function abrirModalModulo() {
  formModulo.reset();

  duracaoModuloPersonalizada.hidden = true;

  duracaoModuloHoras.value = 0;

  duracaoModuloMinutos.value = 0;

  contadorDescricaoModulo.textContent = "0 / 500";

  atualizarTextosDoModal();

  modalModulo.hidden = false;

  nomeModulo.focus();
}

function abrirEdicaoModulo(moduloId) {
  const modulo = modulosCarregados.find((item) => item.id === moduloId);

  if (!modulo) {
    alert("Módulo não encontrado.");

    return;
  }

  moduloEmEdicao = modulo;

  formModulo.reset();

  nomeModulo.value = modulo.nome || "";

  descricaoModulo.value = modulo.descricao || "";

  contadorDescricaoModulo.textContent = `${descricaoModulo.value.length} / 500`;

  preencherDuracaoModulo(modulo.duracaoMinutos);

  atualizarTextosDoModal();

  modalModulo.hidden = false;

  nomeModulo.focus();
}

function fecharModalModulo() {
  modalModulo.hidden = true;

  moduloEmEdicao = null;

  formModulo.reset();

  duracaoModuloPersonalizada.hidden = true;

  duracaoModuloHoras.value = 0;

  duracaoModuloMinutos.value = 0;

  contadorDescricaoModulo.textContent = "0 / 500";

  atualizarTextosDoModal();
}

function atualizarTextosDoModal() {
  const editando = moduloEmEdicao !== null;

  tituloModalModulo.textContent = editando ? "Editar módulo" : "Criar módulo";

  btnSalvarModulo.innerHTML = editando
    ? `
      <i class="fa-solid fa-floppy-disk"></i>
      Salvar alterações
    `
    : `
      <i class="fa-solid fa-floppy-disk"></i>
      Criar módulo
    `;
}

function preencherDuracaoModulo(duracaoMinutos) {
  const duracoesPadrao = [5, 10, 15, 20, 30, 45, 60];

  const duracao = Number(duracaoMinutos);

  if (duracoesPadrao.includes(duracao)) {
    duracaoModulo.value = String(duracao);

    duracaoModuloPersonalizada.hidden = true;

    duracaoModuloHoras.value = 0;

    duracaoModuloMinutos.value = 0;

    return;
  }

  duracaoModulo.value = "personalizada";

  duracaoModuloPersonalizada.hidden = false;

  duracaoModuloHoras.value = Math.floor(duracao / 60);

  duracaoModuloMinutos.value = duracao % 60;
}

btnFecharModalModulo.addEventListener("click", fecharModalModulo);

btnCancelarModulo.addEventListener("click", fecharModalModulo);

duracaoModulo.addEventListener("change", () => {
  const personalizada = duracaoModulo.value === "personalizada";

  duracaoModuloPersonalizada.hidden = !personalizada;

  if (personalizada) {
    duracaoModuloHoras.focus();
  } else {
    duracaoModuloHoras.value = 0;
    duracaoModuloMinutos.value = 0;
  }
});

descricaoModulo.addEventListener("input", () => {
  contadorDescricaoModulo.textContent = `${descricaoModulo.value.length} / 500`;
});

formModulo.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (btnSalvarModulo.disabled) return;

  const nome = nomeModulo.value.trim();

  const descricao = descricaoModulo.value.trim();

  const duracaoMinutos = obterDuracaoModuloEmMinutos();

  const editando = moduloEmEdicao !== null;

  // ======================================
  // VALIDAR NOME
  // ======================================

  if (nome.length < 3 || nome.length > 70) {
    alert("O nome do módulo deve ter entre 3 e 70 caracteres.");

    nomeModulo.focus();

    return;
  }

  // ======================================
  // VALIDAR DURAÇÃO
  // ======================================

  if (
    !Number.isFinite(duracaoMinutos) ||
    duracaoMinutos <= 0 ||
    duracaoMinutos > 1440
  ) {
    alert("Informe uma duração válida para o módulo.");

    return;
  }

  // ======================================
  // SALVAR
  // ======================================

  btnSalvarModulo.disabled = true;

  btnSalvarModulo.textContent = editando ? "Salvando..." : "Criando...";

  try {
    if (editando) {
      await editarModulo({
        id: moduloEmEdicao.id,

        nome,

        descricao: descricao || null,

        ordem: moduloEmEdicao.ordem,

        duracaoMinutos,

        imagem: moduloEmEdicao.imagem ?? null,
      });

      alert("Módulo atualizado com sucesso!");
    } else {
      const maiorOrdem =
        modulosCarregados.length === 0
          ? 0
          : Math.max(
              ...modulosCarregados.map((modulo) => Number(modulo.ordem) || 0),
            );

      const novaOrdem = maiorOrdem + 1;

      await criarModulo({
        cursoId,

        nome,

        descricao: descricao || null,

        ordem: novaOrdem,

        duracaoMinutos,

        imagem: null,
      });

      alert("Módulo criado com sucesso!");
    }

    fecharModalModulo();

    await carregarModulos();
  } catch (erro) {
    console.error(
      editando ? "Erro ao atualizar módulo:" : "Erro ao criar módulo:",
      erro,
    );

    alert(
      editando
        ? "Não foi possível atualizar o módulo."
        : "Não foi possível criar o módulo.",
    );
  } finally {
    btnSalvarModulo.disabled = false;

    atualizarTextosDoModal();
  }
});
