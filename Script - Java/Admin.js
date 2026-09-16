import { auth } from "./Firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";

import {
  meuPerfil,
  listarCursosAdmin,
  criarCurso,
  editarCurso,
  excluirCurso,
} from "../dataconnect-generated/esm/index.esm.js";

// ==========================================
// ESTADO
// ==========================================

let cursoEmEdicao = null;
let cursosCarregados = [];

const DURACOES_PADRAO = [15, 30, 45, 60, 90, 120];

const LIMITE_DESCRICAO = 500;
const MINIMO_DESCRICAO = 30;

const DURACAO_MINIMA = 10;
const DURACAO_MAXIMA = 1440; // 24 horas

// ==========================================
// ELEMENTOS
// ==========================================

const listaCursosAdmin = document.getElementById("listaCursosAdmin");

const estadoCarregamento = document.getElementById("estadoCarregamento");

const totalCursos = document.getElementById("totalCursos");

const totalPublicados = document.getElementById("totalPublicados");

const totalRascunhos = document.getElementById("totalRascunhos");

const totalDesativados = document.getElementById("totalDesativados");

const btnNovoCurso = document.getElementById("btnNovoCurso");

const modalNovoCurso = document.getElementById("modalNovoCurso");

const formNovoCurso = document.getElementById("formNovoCurso");

const btnFecharModal = document.getElementById("btnFecharModal");

const btnCancelarCurso = document.getElementById("btnCancelarCurso");

const btnSalvarCurso = document.getElementById("btnSalvarCurso");

const btnExcluirCurso = document.getElementById("btnExcluirCurso");

const tituloModalCurso = document.getElementById("tituloModalCurso");

const nomeCurso = document.getElementById("nomeCurso");

const descricaoCurso = document.getElementById("descricaoCurso");

const contadorDescricao = document.getElementById("contadorDescricao");

const erroDescricao = document.getElementById("erroDescricao");

const dificuldadeCurso = document.getElementById("dificuldadeCurso");

const iconeCurso = document.getElementById("iconeCurso");

const cargaHorariaCurso = document.getElementById("cargaHorariaCurso");

const duracaoPersonalizada = document.getElementById("duracaoPersonalizada");

const duracaoHoras = document.getElementById("duracaoHoras");

const duracaoMinutos = document.getElementById("duracaoMinutos");

const campoStatusCurso = document.getElementById("campoStatusCurso");

const statusCurso = document.getElementById("statusCurso");

// ==========================================
// CONSTANTES DE ADMINISTRAÇÃO
// ==========================================

const areaGerenciarModulos = document.getElementById("areaGerenciarModulos");

const btnGerenciarModulos = document.getElementById("btnGerenciarModulos");

// ==========================================
// AUTENTICAÇÃO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
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

    await carregarCursos();
  } catch (erro) {
    console.error("Erro ao acessar o painel:", erro);

    estadoCarregamento.hidden = false;

    estadoCarregamento.textContent =
      "Não foi possível carregar o painel administrativo.";
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
// CARREGAR CURSOS
// ==========================================

async function carregarCursos() {
  estadoCarregamento.hidden = false;

  estadoCarregamento.textContent = "Atualizando cursos...";

  try {
    const resposta = await listarCursosAdmin({
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });

    const cursos = resposta.data.cursos || [];

    cursosCarregados = cursos;

    atualizarResumo(cursos);

    mostrarCursos(cursos);

    estadoCarregamento.hidden = true;

    listaCursosAdmin.hidden = false;
  } catch (erro) {
    console.error("Erro ao carregar cursos:", erro);

    estadoCarregamento.hidden = false;

    estadoCarregamento.textContent = "Erro ao carregar os cursos.";
  }
}

// ==========================================
// RESUMO
// ==========================================

function atualizarResumo(cursos) {
  const publicados = cursos.filter((curso) => curso.ativo && curso.publicado);

  const rascunhos = cursos.filter((curso) => curso.ativo && !curso.publicado);

  const desativados = cursos.filter((curso) => !curso.ativo);

  totalCursos.textContent = cursos.length;

  totalPublicados.textContent = publicados.length;

  totalRascunhos.textContent = rascunhos.length;

  totalDesativados.textContent = desativados.length;
}

// ==========================================
// MOSTRAR CURSOS
// ==========================================

function mostrarCursos(cursos) {
  listaCursosAdmin.innerHTML = "";

  if (cursos.length === 0) {
    listaCursosAdmin.innerHTML = `
      <div class="mensagem">
        Nenhum curso cadastrado.
      </div>
    `;

    return;
  }

  cursos.forEach((curso) => {
    const card = document.createElement("article");

    const status = obterStatusCurso(curso);

    card.classList.add("curso-admin");

    card.innerHTML = `
        <div class="curso-icone">

          <i class="${curso.icone || "fa-solid fa-book"}"></i>

        </div>


        <div class="curso-info">

          <div class="curso-titulo">

            <h3>
              ${curso.nome}
            </h3>

            <span
              class="status ${status.classe}"
            >
              ${status.texto}
            </span>

          </div>


          <p>
            ${curso.descricao || "Curso sem descrição."}
          </p>


          <div class="curso-detalhes">

            <span>
              <i
                class="fa-solid fa-signal"
              ></i>

              ${curso.dificuldade}
            </span>


            <span>
              <i
                class="fa-regular fa-clock"
              ></i>

              ${formatarDuracao(curso.cargaHoraria)}
            </span>

          </div>

        </div>


        <div class="curso-acoes">

          <button
            class="btn-editar"
            data-id="${curso.id}"
            type="button"
          >

            <i
              class="fa-solid fa-pen"
            ></i>

            Editar

          </button>

        </div>
      `;

    listaCursosAdmin.appendChild(card);
  });

  document.querySelectorAll(".btn-editar").forEach((botao) => {
    botao.addEventListener("click", () => {
      abrirEdicaoCurso(botao.dataset.id);
    });
  });
}

// ==========================================
// STATUS DO CURSO
// ==========================================

function obterStatusCurso(curso) {
  if (!curso.ativo) {
    return {
      texto: "Desativado",
      classe: "desativado",
    };
  }

  if (curso.publicado) {
    return {
      texto: "Publicado",
      classe: "publicado",
    };
  }

  return {
    texto: "Rascunho",
    classe: "rascunho",
  };
}

function obterValorStatusCurso(curso) {
  if (!curso.ativo) {
    return "desativado";
  }

  if (curso.publicado) {
    return "publicado";
  }

  return "rascunho";
}

function converterStatusParaBanco(status) {
  if (status === "publicado") {
    return {
      ativo: true,
      publicado: true,
    };
  }

  if (status === "desativado") {
    return {
      ativo: false,
      publicado: false,
    };
  }

  return {
    ativo: true,
    publicado: false,
  };
}

// ==========================================
// FORMATAR DURAÇÃO
// ==========================================

function formatarDuracao(totalMinutos) {
  const minutosTotais = Number(totalMinutos) || 0;

  if (minutosTotais < 60) {
    return `${minutosTotais} min`;
  }

  const horas = Math.floor(minutosTotais / 60);

  const minutos = minutosTotais % 60;

  if (minutos === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutos}min`;
}

// ==========================================
// NOVO CURSO
// ==========================================

btnNovoCurso.addEventListener("click", () => {
  prepararNovoCurso();

  modalNovoCurso.hidden = false;

  requestAnimationFrame(() => {
    ajustarAlturaTextarea();

    nomeCurso.focus();
  });
});

function prepararNovoCurso() {
  cursoEmEdicao = null;

  formNovoCurso.reset();

  tituloModalCurso.textContent = "Criar curso";

  erroDescricao.hidden = true;

  duracaoPersonalizada.hidden = true;

  duracaoHoras.value = 0;

  duracaoMinutos.value = 0;

  descricaoCurso.style.height = "";

  campoStatusCurso.hidden = true;

  statusCurso.value = "rascunho";

  btnExcluirCurso.hidden = true;

  areaGerenciarModulos.hidden = true;
  
  atualizarContadorDescricao();

  atualizarBotaoSalvar();
}

// ==========================================
// ABRIR EDIÇÃO DE CURSO
// ==========================================

function abrirEdicaoCurso(id) {
  const curso = cursosCarregados.find((item) => item.id === id);

  if (!curso) {
    return;
  }

  cursoEmEdicao = curso;

  btnExcluirCurso.hidden = !(curso.ativo && !curso.publicado);

  tituloModalCurso.textContent = "Editar curso";

  nomeCurso.value = curso.nome || "";

  descricaoCurso.value = curso.descricao || "";

  dificuldadeCurso.value = curso.dificuldade || "";

  campoStatusCurso.hidden = false;

  areaGerenciarModulos.hidden = false;

  statusCurso.value = obterValorStatusCurso(curso);

  iconeCurso.value = curso.icone || "fa-solid fa-book";

  configurarDuracaoParaEdicao(curso.cargaHoraria);

  erroDescricao.hidden = true;

  atualizarContadorDescricao();

  atualizarBotaoSalvar();

  modalNovoCurso.hidden = false;

  requestAnimationFrame(() => {
    ajustarAlturaTextarea();
  });
}

// ==========================================
// DURAÇÃO
// ==========================================

function configurarDuracaoParaEdicao(totalMinutos) {
  const minutosTotais = Number(totalMinutos) || 0;

  if (DURACOES_PADRAO.includes(minutosTotais)) {
    cargaHorariaCurso.value = String(minutosTotais);

    duracaoPersonalizada.hidden = true;

    duracaoHoras.value = 0;

    duracaoMinutos.value = 0;

    return;
  }

  cargaHorariaCurso.value = "personalizada";

  duracaoPersonalizada.hidden = false;

  duracaoHoras.value = Math.floor(minutosTotais / 60);

  duracaoMinutos.value = minutosTotais % 60;
}

cargaHorariaCurso.addEventListener("change", () => {
  const personalizada = cargaHorariaCurso.value === "personalizada";

  duracaoPersonalizada.hidden = !personalizada;

  if (personalizada) {
    duracaoHoras.focus();
  } else {
    duracaoHoras.value = 0;

    duracaoMinutos.value = 0;
  }
});

// ==========================================
// CONVERTER DURAÇÃO PARA MINUTOS
// ==========================================

function obterDuracaoEmMinutos() {
  if (cargaHorariaCurso.value !== "personalizada") {
    return Number(cargaHorariaCurso.value);
  }

  const horas = Number(duracaoHoras.value) || 0;

  const minutos = Number(duracaoMinutos.value) || 0;

  return horas * 60 + minutos;
}

// ==========================================
// VALIDAR DURAÇÃO PERSONALIZADA
// ==========================================

function duracaoPersonalizadaValida() {
  if (cargaHorariaCurso.value !== "personalizada") {
    return true;
  }

  const horas = Number(duracaoHoras.value);

  const minutos = Number(duracaoMinutos.value);

  return (
    Number.isFinite(horas) &&
    Number.isFinite(minutos) &&
    horas >= 0 &&
    horas <= 24 &&
    minutos >= 0 &&
    minutos <= 59
  );
}

// ==========================================
// DESCRIÇÃO
// ==========================================

function ajustarAlturaTextarea() {
  descricaoCurso.style.height = "auto";

  descricaoCurso.style.height = `${descricaoCurso.scrollHeight}px`;
}

// ==========================================
// CONTADOR DA DESCRIÇÃO
// ==========================================

function atualizarContadorDescricao() {
  const quantidade = descricaoCurso.value.length;

  contadorDescricao.textContent = `${quantidade} / ${LIMITE_DESCRICAO}`;

  contadorDescricao.classList.remove("proximo-limite", "limite-critico");

  if (quantidade >= 475) {
    contadorDescricao.classList.add("limite-critico");
  } else if (quantidade >= 400) {
    contadorDescricao.classList.add("proximo-limite");
  }
}

// ==========================================
// VALIDAR DESCRIÇÃO
// ==========================================

function descricaoValida() {
  const tamanho = descricaoCurso.value.trim().length;

  return tamanho === 0 || tamanho >= MINIMO_DESCRICAO;
}

// ==========================================
// EVENTOS DA DESCRIÇÃO
// ==========================================

descricaoCurso.addEventListener("input", () => {
  atualizarContadorDescricao();

  ajustarAlturaTextarea();

  erroDescricao.hidden = true;
});

descricaoCurso.addEventListener("blur", () => {
  erroDescricao.hidden = descricaoValida();
});

// ==========================================
// FECHAR MODAL
// ==========================================

btnFecharModal.addEventListener("click", fecharModalNovoCurso);

btnCancelarCurso.addEventListener("click", fecharModalNovoCurso);

function fecharModalNovoCurso() {
  modalNovoCurso.hidden = true;

  formNovoCurso.reset();

  cursoEmEdicao = null;

  tituloModalCurso.textContent = "Criar curso";

  erroDescricao.hidden = true;

  duracaoPersonalizada.hidden = true;

  duracaoHoras.value = 0;

  duracaoMinutos.value = 0;

  descricaoCurso.style.height = "";

  campoStatusCurso.hidden = true;

  statusCurso.value = "rascunho";

  btnExcluirCurso.hidden = true;

  areaGerenciarModulos.hidden = true;

  atualizarContadorDescricao();

  atualizarBotaoSalvar();
}

// ==========================================
// BOTÃO SALVAR
// ==========================================

function atualizarBotaoSalvar(carregando = false) {
  if (carregando) {
    btnSalvarCurso.textContent = cursoEmEdicao ? "Salvando..." : "Criando...";

    return;
  }

  btnSalvarCurso.innerHTML = cursoEmEdicao
    ? `
        <i
          class="fa-solid fa-floppy-disk"
        ></i>

        Salvar alterações
      `
    : `
        <i
          class="fa-solid fa-floppy-disk"
        ></i>

        Criar curso
      `;
}

// ==========================================
// SALVAR CURSO
// ==========================================

formNovoCurso.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = nomeCurso.value.trim();

  const descricao = descricaoCurso.value.trim();

  const dificuldade = dificuldadeCurso.value;

  const cargaHoraria = obterDuracaoEmMinutos();

  const icone = iconeCurso.value;

  // ======================================
  // VALIDAR NOME
  // ======================================

  if (nome.length < 3 || nome.length > 70) {
    alert("O nome do curso deve ter entre 3 e 70 caracteres.");

    nomeCurso.focus();

    return;
  }

  // ======================================
  // VALIDAR DESCRIÇÃO
  // ======================================

  if (descricao.length > LIMITE_DESCRICAO) {
    alert(`A descrição pode ter no máximo ${LIMITE_DESCRICAO} caracteres.`);

    descricaoCurso.focus();

    return;
  }

  if (!descricaoValida()) {
    erroDescricao.hidden = false;

    descricaoCurso.focus();

    return;
  }

  // ======================================
  // VALIDAR DIFICULDADE
  // ======================================

  if (!dificuldade) {
    alert("Selecione a dificuldade do curso.");

    dificuldadeCurso.focus();

    return;
  }

  // ======================================
  // VALIDAR DURAÇÃO PERSONALIZADA
  // ======================================

  if (!duracaoPersonalizadaValida()) {
    alert("Informe uma duração personalizada válida.");

    return;
  }

  // ======================================
  // VALIDAR DURAÇÃO TOTAL
  // ======================================

  if (
    !Number.isFinite(cargaHoraria) ||
    cargaHoraria < DURACAO_MINIMA ||
    cargaHoraria > DURACAO_MAXIMA
  ) {
    alert("A duração deve estar entre 10 minutos e 24 horas.");

    return;
  }

  const editando = Boolean(cursoEmEdicao);

  const cursoOriginal = cursoEmEdicao;

  const dadosStatus = editando
    ? converterStatusParaBanco(statusCurso.value)
    : {
        ativo: true,
        publicado: false,
      };

  // ======================================
  // BLOQUEAR BOTÃO
  // ======================================

  btnSalvarCurso.disabled = true;

  atualizarBotaoSalvar(true);

  try {
    // ====================================
    // EDITAR
    // ====================================

    if (editando) {
      await editarCurso({
        id: cursoOriginal.id,

        nome,

        descricao: descricao || null,

        dificuldade,

        cargaHoraria,

        imagem: cursoOriginal.imagem || null,

        icone: icone || null,

        ativo: dadosStatus.ativo,

        publicado: dadosStatus.publicado,
      });

      alert("Curso atualizado com sucesso!");
    }

    // ====================================
    // CRIAR
    // ====================================
    else {
      await criarCurso({
        nome,

        descricao: descricao || null,

        dificuldade,

        cargaHoraria,

        imagem: null,

        icone: icone || null,

        ativo: true,
      });

      alert("Curso criado com sucesso!");
    }

    // ====================================
    // FECHAR E ATUALIZAR
    // ====================================

    fecharModalNovoCurso();

    await carregarCursos();
  } catch (erro) {
    console.error(
      editando ? "Erro ao editar curso:" : "Erro ao criar curso:",
      erro,
    );

    alert(
      editando
        ? "Não foi possível atualizar o curso."
        : "Não foi possível criar o curso.",
    );
  } finally {
    btnSalvarCurso.disabled = false;

    atualizarBotaoSalvar();
  }
});

// ==========================================
// EXCLUIR CURSO
// ==========================================

btnExcluirCurso.addEventListener("click", async () => {
  if (!cursoEmEdicao) {
    return;
  }

  const curso = cursoEmEdicao;

  const confirmou = confirm(
    `Excluir "${curso.nome}"?\n\n` +
      "Esta ação é permanente e não poderá ser desfeita.",
  );

  if (!confirmou) {
    return;
  }

  btnExcluirCurso.disabled = true;

  btnSalvarCurso.disabled = true;

  btnExcluirCurso.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Excluindo...
    `;

  try {
    await excluirCurso({
      id: curso.id,
    });

    alert("Curso excluído com sucesso!");

    fecharModalNovoCurso();

    await carregarCursos();
  } catch (erro) {
    console.error("Erro ao excluir curso:", erro);

    alert(
      "Não foi possível excluir o curso. " +
        "Se ele já possui módulos ou outros dados vinculados, " +
        "use a opção Desativado.",
    );
  } finally {
    btnExcluirCurso.disabled = false;

    btnSalvarCurso.disabled = false;

    btnExcluirCurso.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Excluir curso
      `;
  }
});
