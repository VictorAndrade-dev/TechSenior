import { auth } from "./Firebase-config.js";

import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  QueryFetchPolicy,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";

import {
  meuPerfil,
  buscarCurso,
  listarModulosDoCurso,
  criarModulo,
} from "../dataconnect-generated/esm/index.esm.js";


// ==========================================
// ELEMENTOS
// ==========================================


const nomeCursoAdmin =
  document.getElementById("nomeCursoAdmin");

const descricaoCursoAdmin =
  document.getElementById("descricaoCursoAdmin");

const estadoModulos =
  document.getElementById("estadoModulos");

const listaModulosAdmin =
  document.getElementById("listaModulosAdmin");

const btnNovoModulo =
  document.getElementById("btnNovoModulo");

  const modalModulo =
  document.getElementById("modalModulo");

const formModulo =
  document.getElementById("formModulo");

const btnFecharModalModulo =
  document.getElementById("btnFecharModalModulo");

const btnCancelarModulo =
  document.getElementById("btnCancelarModulo");

const nomeModulo =
  document.getElementById("nomeModulo");

const descricaoModulo =
  document.getElementById("descricaoModulo");

const contadorDescricaoModulo =
  document.getElementById("contadorDescricaoModulo");

const duracaoModulo =
  document.getElementById("duracaoModulo");

const duracaoModuloPersonalizada =
  document.getElementById("duracaoModuloPersonalizada");

const duracaoModuloHoras =
  document.getElementById("duracaoModuloHoras");

const duracaoModuloMinutos =
  document.getElementById("duracaoModuloMinutos");

const btnSalvarModulo =
  document.getElementById("btnSalvarModulo");


// ==========================================
// ID DO CURSO
// ==========================================

const parametros =
  new URLSearchParams(window.location.search);

const cursoId =
  parametros.get("cursoId");


// ==========================================
// VERIFICAR ID
// ==========================================

if (!cursoId) {
  alert("Curso não informado.");

  window.location.href = "Admin.html";
}

// ==========================================
// ESTADO PARA GUARDAR MÓDULOS CARREGADOS
// ==========================================

let modulosCarregados = [];

// ==========================================
// AUTENTICAÇÃO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
  if (!usuario) {
    window.location.href = "Login.html";

    return;
  }

  try {
    const respostaPerfil =
      await meuPerfil();

    const perfil =
      respostaPerfil.data.usuarios?.[0];

    if (
      !perfil ||
      perfil.tipoUsuario?.nome !== "Administrador"
    ) {
      negarAcesso();

      return;
    }

    await carregarPagina();
  } catch (erro) {
    console.error(
      "Erro ao carregar gerenciamento de módulos:",
      erro,
    );

    estadoModulos.hidden = false;

    estadoModulos.textContent =
      "Não foi possível carregar os módulos.";
  }
});


// ==========================================
// NEGAR ACESSO
// ==========================================

function negarAcesso() {
  alert(
    "Você não possui permissão para acessar o painel administrativo.",
  );

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
  const resposta =
    await buscarCurso(
      {
        id: cursoId,
      },
      {
        fetchPolicy:
          QueryFetchPolicy.SERVER_ONLY,
      },
    );

  const curso =
    resposta.data.curso;

  if (!curso) {
    alert("Curso não encontrado.");

    window.location.href = "Admin.html";

    return;
  }

  nomeCursoAdmin.textContent =
    curso.nome;

  descricaoCursoAdmin.textContent =
    "Organize os módulos e etapas deste curso.";

  document.title =
    `Módulos - ${curso.nome} | TechSênior`;
}


// ==========================================
// CARREGAR MÓDULOS
// ==========================================

async function carregarModulos() {
  estadoModulos.hidden = false;

  estadoModulos.textContent =
    "Carregando módulos...";

  listaModulosAdmin.hidden = true;

  try {
    const resposta =
      await listarModulosDoCurso(
        {
          cursoId,
        },
        {
          fetchPolicy:
            QueryFetchPolicy.SERVER_ONLY,
        },
      );

    const modulos =
      resposta.data.modulos || [];
      modulosCarregados = modulos;

    mostrarModulos(modulos);

    estadoModulos.hidden = true;

    listaModulosAdmin.hidden = false;
  } catch (erro) {
    console.error(
      "Erro ao carregar módulos:",
      erro,
    );

    estadoModulos.hidden = false;

    estadoModulos.textContent =
      "Não foi possível carregar os módulos.";
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

  modulos.forEach((modulo) => {
    const card =
      document.createElement("article");

    card.classList.add("curso-admin");

    card.innerHTML = `
      <div class="curso-icone">
        <strong>
          ${modulo.ordem}
        </strong>
      </div>

      <div class="curso-info">

        <div class="curso-titulo">
          <h3>
            ${modulo.nome}
          </h3>
        </div>

        <p>
          ${
            modulo.descricao ||
            "Módulo sem descrição."
          }
        </p>

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

      </div>
    `;

    listaModulosAdmin.appendChild(card);
  });
}

// ==========================================
// DURAÇÃO DO MÓDULO
// ==========================================

function obterDuracaoModuloEmMinutos() {
  if (
    duracaoModulo.value !== "personalizada"
  ) {
    return Number(duracaoModulo.value);
  }

  const horas =
    Number(duracaoModuloHoras.value) || 0;

  const minutos =
    Number(duracaoModuloMinutos.value) || 0;

  return horas * 60 + minutos;
}

// ==========================================
// FORMATAR DURAÇÃO
// ==========================================

function formatarDuracao(totalMinutos) {
  if (
    totalMinutos === null ||
    totalMinutos === undefined
  ) {
    return "Duração não informada";
  }

  const total =
    Number(totalMinutos);

  if (total < 60) {
    return `${total} min`;
  }

  const horas =
    Math.floor(total / 60);

  const minutos =
    total % 60;

  if (minutos === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutos}min`;
}


// ==========================================
// NOVO MÓDULO
// ==========================================

btnNovoModulo.addEventListener("click", () => {
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

  contadorDescricaoModulo.textContent =
    "0 / 500";

  modalModulo.hidden = false;

  nomeModulo.focus();
}

function fecharModalModulo() {
  modalModulo.hidden = true;

  formModulo.reset();

  duracaoModuloPersonalizada.hidden = true;

  duracaoModuloHoras.value = 0;

  duracaoModuloMinutos.value = 0;

  contadorDescricaoModulo.textContent =
    "0 / 500";
}

btnFecharModalModulo.addEventListener(
  "click",
  fecharModalModulo,
);

btnCancelarModulo.addEventListener(
  "click",
  fecharModalModulo,
);

duracaoModulo.addEventListener("change", () => {
  const personalizada =
    duracaoModulo.value === "personalizada";

  duracaoModuloPersonalizada.hidden =
    !personalizada;

  if (personalizada) {
    duracaoModuloHoras.focus();
  } else {
    duracaoModuloHoras.value = 0;
    duracaoModuloMinutos.value = 0;
  }
});

descricaoModulo.addEventListener("input", () => {
  contadorDescricaoModulo.textContent =
    `${descricaoModulo.value.length} / 500`;
});

formModulo.addEventListener(
  "submit",
  async (evento) => {
    evento.preventDefault();

    const nome =
      nomeModulo.value.trim();

    const descricao =
      descricaoModulo.value.trim();

    const duracaoMinutos =
      obterDuracaoModuloEmMinutos();


    // ======================================
    // VALIDAR NOME
    // ======================================

    if (
      nome.length < 3 ||
      nome.length > 70
    ) {
      alert(
        "O nome do módulo deve ter entre 3 e 70 caracteres.",
      );

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
      alert(
        "Informe uma duração válida para o módulo.",
      );

      return;
    }


    // ======================================
    // CALCULAR PRÓXIMA ORDEM
    // ======================================

    const maiorOrdem =
      modulosCarregados.length === 0
        ? 0
        : Math.max(
            ...modulosCarregados.map(
              (modulo) =>
                Number(modulo.ordem) || 0,
            ),
          );

    const novaOrdem =
      maiorOrdem + 1;


    // ======================================
    // SALVAR
    // ======================================

    btnSalvarModulo.disabled = true;

    btnSalvarModulo.textContent =
      "Criando...";

    try {
      await criarModulo({
        cursoId,

        nome,

        descricao:
          descricao || null,

        ordem:
          novaOrdem,

        duracaoMinutos,

        imagem:
          null,
      });


      alert(
        "Módulo criado com sucesso!",
      );

      fecharModalModulo();

      await carregarModulos();

    } catch (erro) {
      console.error(
        "Erro ao criar módulo:",
        erro,
      );

      alert(
        "Não foi possível criar o módulo.",
      );

    } finally {
      btnSalvarModulo.disabled =
        false;

      btnSalvarModulo.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Criar módulo
      `;
    }
  },
);