import { iniciarEditorQuiz } from './AdminQuiz.js';
import { criarBloqueio, configurarModais } from './AdminComum.js';
import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";
import {
  meuPerfil, buscarCurso, listarModulosDoCurso,
  listarConteudosDoModulo, criarConteudoModulo, editarConteudoModulo,
  excluirConteudoModulo,
} from "../dataconnect-generated/esm/index.esm.js";

const linkVoltarModulos = document.getElementById("linkVoltarModulos");
const btnVoltarModulos = document.getElementById("btnVoltarModulos");
const trilhaModulo = document.getElementById("trilhaModulo");
const nomeModuloAdmin = document.getElementById("nomeModuloAdmin");
const descricaoModuloAdmin = document.getElementById("descricaoModuloAdmin");
const dadosModulo = document.getElementById("dadosModulo");
const estadoConteudos = document.getElementById("estadoConteudos");
const listaConteudos = document.getElementById("listaConteudos");
const btnNovoConteudo = document.getElementById("btnNovoConteudo");
const modalConteudo = document.getElementById("modalConteudo");
const formConteudo = document.getElementById("formConteudo");
const tituloModalConteudo = document.getElementById("tituloModalConteudo");
const tipoConteudo = document.getElementById("tipoConteudo");
const tituloConteudo = document.getElementById("tituloConteudo");
const campoConteudo = document.getElementById("campoConteudo");
const textoConteudo = document.getElementById("textoConteudo");
const campoUrlConteudo = document.getElementById("campoUrlConteudo");
const urlConteudo = document.getElementById("urlConteudo");
const campoAltTextoConteudo = document.getElementById("campoAltTextoConteudo");
const altTextoConteudo = document.getElementById("altTextoConteudo");
const btnFecharModalConteudo = document.getElementById("btnFecharModalConteudo");
const btnCancelarConteudo = document.getElementById("btnCancelarConteudo");
const btnSalvarConteudo = document.getElementById("btnSalvarConteudo");

const parametros = new URLSearchParams(window.location.search);
const cursoId = parametros.get("cursoId");
const moduloId = parametros.get("moduloId");
const uuid = /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
const parametrosValidos = uuid.test(cursoId || '') && uuid.test(moduloId || '');
let cursoAtual = null;
let moduloAtual = null;
let conteudosCarregados = [];
let conteudoEmEdicao = null;

if (!parametrosValidos) {
  alert("Curso ou módulo não informado.");
  window.location.href = cursoId
    ? `AdminModulos.html?cursoId=${encodeURIComponent(cursoId)}`
    : "Admin.html";
}

onAuthStateChanged(auth, async (usuario) => {
  if (!parametrosValidos) return;
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
    console.error("Erro ao carregar o gerenciamento do módulo:", erro);
    estadoConteudos.hidden = false;
    estadoConteudos.textContent = "Não foi possível carregar o módulo.";
  }
});

function negarAcesso() {
  alert("Você não possui permissão para acessar o painel administrativo.");
  window.location.href = "index.html";
}

async function carregarPagina() {
  await carregarCursoEModulo();
  if (!moduloAtual) return;
  await Promise.all([carregarConteudos(), iniciarEditorQuiz({cursoId, moduloId})]);
}

async function carregarCursoEModulo() {
  const [respostaCurso, respostaModulos] = await Promise.all([
    buscarCurso({ id: cursoId }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }),
    listarModulosDoCurso({ cursoId }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }),
  ]);

  cursoAtual = respostaCurso.data.curso;
  if (!cursoAtual) {
    alert("Curso não encontrado.");
    window.location.href = "Admin.html";
    return;
  }

  moduloAtual = respostaModulos.data.modulos?.find((modulo) =>
    modulo.id.replaceAll('-', '').toLowerCase() === moduloId.replaceAll('-', '').toLowerCase(),
  );
  if (!moduloAtual) {
    alert("Módulo não encontrado neste curso.");
    window.location.href = `AdminModulos.html?cursoId=${encodeURIComponent(cursoId)}`;
    return;
  }

  const urlModulos = `AdminModulos.html?cursoId=${encodeURIComponent(cursoId)}`;
  linkVoltarModulos.href = urlModulos;
  btnVoltarModulos.href = urlModulos;
  trilhaModulo.textContent = `${cursoAtual.nome} > Módulo ${moduloAtual.ordem}`;
  nomeModuloAdmin.textContent = moduloAtual.nome;
  descricaoModuloAdmin.textContent = moduloAtual.descricao || "Organize os conteúdos e o quiz deste módulo.";
  dadosModulo.innerHTML = `
    <span><i class="fa-solid fa-list-ol" aria-hidden="true"></i> Ordem ${escapeHtml(moduloAtual.ordem)}</span>
    <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${escapeHtml(formatarDuracao(moduloAtual.duracaoMinutos))}</span>
  `;
  document.title = `${moduloAtual.nome} | Administração | TechSênior`;
}

async function carregarConteudos() {
  estadoConteudos.hidden = false;
  estadoConteudos.textContent = "Carregando conteúdos...";
  listaConteudos.hidden = true;
  try {
    const resposta = await listarConteudosDoModulo(
      { moduloId },
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    conteudosCarregados = resposta.data.conteudoModulos || [];
    mostrarConteudos();
    estadoConteudos.hidden = true;
    listaConteudos.hidden = false;
  } catch (erro) {
    console.error("Erro ao carregar conteúdos:", erro);
    estadoConteudos.hidden = false;
    estadoConteudos.textContent = "Não foi possível carregar os conteúdos.";
  }
}

function mostrarConteudos() {
  listaConteudos.innerHTML = "";
  if (conteudosCarregados.length === 0) {
    listaConteudos.innerHTML = '<div class="mensagem">Este módulo ainda não possui conteúdos.</div>';
    return;
  }

  conteudosCarregados.forEach((conteudo, indice) => {
    const card = document.createElement("article");
    card.className = "curso-admin painel-item-admin";
    card.innerHTML = `
      <div class="curso-icone"><strong>${escapeHtml(conteudo.ordem)}</strong></div>
      <div class="curso-info">
        <div class="curso-titulo">
          <h3>${escapeHtml(conteudo.titulo || "Conteúdo sem título")}</h3>
          <span class="etiqueta-conteudo">${escapeHtml(formatarTipoConteudo(conteudo.tipo))}</span>
        </div>
        <p>${escapeHtml(resumoConteudo(conteudo))}</p>
        <div class="curso-detalhes"><span><i class="fa-solid fa-list-ol" aria-hidden="true"></i> Conteúdo ${escapeHtml(conteudo.ordem)}</span></div>
        <div class="curso-acoes">
          <button class="btn-ordem" type="button" data-acao="subir-conteudo" ${indice === 0 ? "disabled" : ""} aria-label="Mover conteúdo para cima"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i> Subir</button>
          <button class="btn-ordem" type="button" data-acao="descer-conteudo" ${indice === conteudosCarregados.length - 1 ? "disabled" : ""} aria-label="Mover conteúdo para baixo"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> Descer</button>
          <button class="btn-excluir" type="button" data-acao="excluir-conteudo">Excluir</button>
          <button class="btn-editar" type="button" data-acao="editar-conteudo"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Editar</button>
        </div>
      </div>
    `;
    card.querySelector("[data-acao='editar-conteudo']").addEventListener("click", () => abrirEdicaoConteudo(conteudo.id));
    card.querySelector("[data-acao='subir-conteudo']").addEventListener("click", () => moverConteudo(conteudo.id, -1));
    card.querySelector("[data-acao='descer-conteudo']").addEventListener("click", () => moverConteudo(conteudo.id, 1));
    card.querySelector('[data-acao="excluir-conteudo"]').addEventListener('click', async () => {
      if (!confirm('Excluir este conteúdo? Esta ação não pode ser desfeita.')) return;
      await bloquearConteudos(async () => {
        try { await excluirConteudoModulo({id: conteudo.id}); await carregarConteudos(); }
        catch (erro) { console.error(erro); alert('Não foi possível excluir o conteúdo.'); }
      });
    });
    listaConteudos.appendChild(card);
  });
}

function abrirNovoConteudo() {
  conteudoEmEdicao = null;
  prepararFormularioConteudo();
  modalConteudo.hidden = false;
  tituloConteudo.focus();
}

function abrirEdicaoConteudo(conteudoId) {
  const conteudo = conteudosCarregados.find((item) => item.id === conteudoId);
  if (!conteudo) {
    alert("Conteúdo não encontrado.");
    return;
  }
  conteudoEmEdicao = conteudo;
  formConteudo.reset();
  tipoConteudo.value = conteudo.tipo || "texto";
  tituloConteudo.value = conteudo.titulo || "";
  textoConteudo.value = conteudo.conteudo || "";
  urlConteudo.value = conteudo.url || "";
  altTextoConteudo.value = conteudo.altTexto || "";
  atualizarCamposConteudo();
  atualizarTextosModalConteudo();
  modalConteudo.hidden = false;
  tituloConteudo.focus();
}

function prepararFormularioConteudo() {
  formConteudo.reset();
  tipoConteudo.value = "texto";
  atualizarCamposConteudo();
  atualizarTextosModalConteudo();
}

function fecharModalConteudo() {
  modalConteudo.hidden = true;
  conteudoEmEdicao = null;
  prepararFormularioConteudo();
}

function atualizarCamposConteudo() {
  const imagem = tipoConteudo.value === "imagem";
  campoConteudo.hidden = imagem;
  campoUrlConteudo.hidden = !imagem;
  campoAltTextoConteudo.hidden = !imagem;
  textoConteudo.required = !imagem;
  urlConteudo.required = imagem;
  altTextoConteudo.required = imagem;
}

function atualizarTextosModalConteudo() {
  const editando = conteudoEmEdicao !== null;
  tituloModalConteudo.textContent = editando ? "Editar conteúdo" : "Novo conteúdo";
  btnSalvarConteudo.innerHTML = editando
    ? '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Salvar alterações'
    : '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Criar conteúdo';
}

async function moverConteudoInterno(conteudoId, direcao) {
  const indice = conteudosCarregados.findIndex((conteudo) => conteudo.id === conteudoId);
  const destino = indice + direcao;
  if (indice < 0 || destino < 0 || destino >= conteudosCarregados.length) return;
  try {
    await trocarOrdens(conteudosCarregados, conteudosCarregados[indice], conteudosCarregados[destino], atualizarConteudo);
    await carregarConteudos();
  } catch (erro) {
    console.error("Erro ao reordenar conteúdo:", erro);
    alert("Não foi possível alterar a ordem do conteúdo.");
  }
}

async function atualizarConteudo(conteudo, ordem) {
  await editarConteudoModulo({
    id: conteudo.id, tipo: conteudo.tipo, titulo: conteudo.titulo ?? null,
    conteudo: conteudo.conteudo ?? null, url: conteudo.url ?? null,
    altTexto: conteudo.altTexto ?? null, ordem,
  });
}

formConteudo.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (btnSalvarConteudo.disabled) return;
  const imagem = tipoConteudo.value === "imagem";
  const titulo = normalizarVazio(tituloConteudo.value);
  const conteudo = imagem ? null : normalizarVazio(textoConteudo.value);
  const url = imagem ? normalizarVazio(urlConteudo.value) : null;
  const altTexto = imagem ? normalizarVazio(altTextoConteudo.value) : null;

  if (!imagem && !conteudo) {
    alert("Preencha o conteúdo.");
    textoConteudo.focus();
    return;
  }
  if (imagem && (!url || !altTexto)) {
    alert("Informe a URL e o texto alternativo da imagem.");
    return;
  }

  const editando = conteudoEmEdicao !== null;
  btnSalvarConteudo.disabled = true;
  try {
    if (editando) {
      await editarConteudoModulo({
        id: conteudoEmEdicao.id,
        tipo: tipoConteudo.value,
        titulo,
        conteudo,
        url,
        altTexto,
        ordem: conteudoEmEdicao.ordem,
      });
    } else {
      await criarConteudoModulo({
        moduloId,
        tipo: tipoConteudo.value,
        titulo,
        conteudo,
        url,
        altTexto,
        ordem: proximaOrdem(conteudosCarregados),
      });
    }
    fecharModalConteudo();
    await carregarConteudos();
  } catch (erro) {
    console.error("Erro ao salvar conteúdo:", erro);
    alert("Não foi possível salvar o conteúdo.");
  } finally {
    btnSalvarConteudo.disabled = false;
    atualizarTextosModalConteudo();
  }
});

btnNovoConteudo.addEventListener("click", abrirNovoConteudo);
tipoConteudo.addEventListener("change", atualizarCamposConteudo);
btnFecharModalConteudo.addEventListener("click", fecharModalConteudo);
btnCancelarConteudo.addEventListener("click", fecharModalConteudo);

async function trocarOrdens(lista, itemAtual, itemDestino, atualizar) {
  const maiorOrdem = Math.max(
    ...lista.map((item) => Number(item.ordem) || 0),
    0,
  );
  const ordemTemporaria = maiorOrdem + 1;
  const ordemAtual = itemAtual.ordem;
  const ordemDestino = itemDestino.ordem;
  await atualizar(itemAtual, ordemTemporaria);
  await atualizar(itemDestino, ordemAtual);
  await atualizar(itemAtual, ordemDestino);
}

function proximaOrdem(lista) {
  if (lista.length === 0) return 1;
  return Math.max(...lista.map((item) => Number(item.ordem) || 0)) + 1;
}

function normalizarVazio(valor) {
  const texto = valor.trim();
  return texto || null;
}

function resumoConteudo(conteudo) {
  if (conteudo.tipo === "imagem") {
    return conteudo.altTexto || conteudo.url || "Imagem sem descrição.";
  }
  return conteudo.conteudo || "Conteúdo sem texto.";
}

function formatarTipoConteudo(tipo) {
  const tipos = {
    texto: "Texto",
    imagem: "Imagem",
    importante: "Importante",
    dica: "Dica",
  };
  return tipos[tipo] || tipo || "Conteúdo";
}

function formatarDuracao(totalMinutos) {
  if (totalMinutos === null || totalMinutos === undefined) {
    return "Duração não informada";
  }
  const total = Number(totalMinutos);
  if (total < 60) return `${total} min`;
  const horas = Math.floor(total / 60);
  const minutos = total % 60;
  return minutos === 0 ? `${horas}h` : `${horas}h ${minutos}min`;
}

function escapeHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const bloquearConteudos = criarBloqueio(document.getElementById('secaoConteudos'));
const moverConteudo = (...args) => bloquearConteudos(() => moverConteudoInterno(...args));
configurarModais([[modalConteudo, fecharModalConteudo]]);
