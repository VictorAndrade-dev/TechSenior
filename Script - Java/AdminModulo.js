import { iniciarEditorQuiz } from "./AdminQuiz.js";

import { criarBloqueio, configurarModais } from "./AdminComum.js";

import { auth } from "./Firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";

import {

  meuPerfil,

  buscarCurso,

  listarModulosDoCurso,

  listarConteudosDoModulo,

  criarConteudoModulo,

  editarConteudoModulo,

  excluirConteudoModulo,

} from "../dataconnect-generated/esm/index.esm.js";

import { supabase } from "./Supabase-config.js";


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

const btnFecharModalConteudo = document.getElementById(

  "btnFecharModalConteudo",

);

const btnCancelarConteudo = document.getElementById("btnCancelarConteudo");

const btnSalvarConteudo = document.getElementById("btnSalvarConteudo");


const camposMidiaConteudo = document.getElementById("camposMidiaConteudo");
const campoArquivoConteudo = document.getElementById("campoArquivoConteudo");
const arquivoConteudo = document.getElementById("arquivoConteudo");
const btnOrigemArquivo = document.getElementById("btnOrigemArquivo");
const btnOrigemUrl = document.getElementById("btnOrigemUrl");

const rotuloOrigemMidia = document.getElementById("rotuloOrigemMidia");
const descricaoOrigemArquivo = document.getElementById("descricaoOrigemArquivo");
const descricaoOrigemUrl = document.getElementById("descricaoOrigemUrl");
const rotuloArquivoMidia = document.getElementById("rotuloArquivoMidia");
const iconeUploadMidia = document.getElementById("iconeUploadMidia");
const textoUploadMidia = document.getElementById("textoUploadMidia");
const ajudaUploadMidia = document.getElementById("ajudaUploadMidia");
const rotuloUrlMidia = document.getElementById("rotuloUrlMidia");
const rotuloAltTextoConteudo = document.getElementById("rotuloAltTextoConteudo");
const ajudaAltTextoConteudo = document.getElementById("ajudaAltTextoConteudo");

const previewMidiaConteudo = document.getElementById("previewMidiaConteudo");
const imagemPreviewConteudo = document.getElementById("imagemPreviewConteudo");
const videoPreviewConteudo = document.getElementById("videoPreviewConteudo");
const youtubePreviewConteudo = document.getElementById("youtubePreviewConteudo");

const parametros = new URLSearchParams(window.location.search);

const cursoId = parametros.get("cursoId");

const moduloId = parametros.get("moduloId");

const uuid =

  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

const parametrosValidos = uuid.test(cursoId || "") && uuid.test(moduloId || "");

let cursoAtual = null;

let moduloAtual = null;

let conteudosCarregados = [];

let conteudoEmEdicao = null;


let arquivoMidiaSelecionado = null;

let origemMidia = "arquivo";

let urlPreviewLocal = null;


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

  await Promise.all([

    carregarConteudos(),

    iniciarEditorQuiz({ cursoId, moduloId }),

  ]);

}


async function carregarCursoEModulo() {

  const [respostaCurso, respostaModulos] = await Promise.all([

    buscarCurso({ id: cursoId }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }),

    listarModulosDoCurso(

      { cursoId },

      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },

    ),

  ]);


  cursoAtual = respostaCurso.data.curso;

  if (!cursoAtual) {

    alert("Curso não encontrado.");

    window.location.href = "Admin.html";

    return;

  }


  moduloAtual = respostaModulos.data.modulos?.find(

    (modulo) =>

      modulo.id.replaceAll("-", "").toLowerCase() ===

      moduloId.replaceAll("-", "").toLowerCase(),

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

  descricaoModuloAdmin.textContent =

    moduloAtual.descricao || "Organize os conteúdos e o quiz deste módulo.";

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

    listaConteudos.innerHTML =

      '<div class="mensagem">Este módulo ainda não possui conteúdos.</div>';

    return;

  }


  conteudosCarregados.forEach((conteudo, indice) => {

    const card = document.createElement("article");

    card.className = "curso-admin painel-item-admin conteudo-admin-card";


    card.innerHTML = `

      <div class="curso-icone"><strong>${escapeHtml(conteudo.ordem)}</strong></div>

      <div class="curso-info">

        <div class="curso-titulo">

          <h3>${escapeHtml(conteudo.titulo || "Conteúdo sem título")}</h3>

          <span class="etiqueta-conteudo">${escapeHtml(formatarTipoConteudo(conteudo.tipo))}</span>

        </div>

        <p>${escapeHtml(resumoConteudo(conteudo))}</p>

        <div class="curso-detalhes"><span><i class="fa-solid fa-list-ol" aria-hidden="true"></i> Conteúdo ${escapeHtml(conteudo.ordem)}</span></div>

        <div class="curso-acoes acoes-conteudo-admin">

          <button
            class="btn-editar"
            type="button"
            data-acao="editar-conteudo"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Editar
          </button>

          <div class="grupo-ordem">

            <button
              class="btn-ordem"
              type="button"
              data-acao="subir-conteudo"
              ${indice === 0 ? "disabled" : ""}
              aria-label="Mover conteúdo para cima"
              title="Mover para cima"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>

            <button
              class="btn-ordem"
              type="button"
              data-acao="descer-conteudo"
              ${indice === conteudosCarregados.length - 1 ? "disabled" : ""}
              aria-label="Mover conteúdo para baixo"
              title="Mover para baixo"
            >
              <i class="fa-solid fa-arrow-down"></i>
            </button>

          </div>

          <button
            class="btn-excluir"
            type="button"
            data-acao="excluir-conteudo"
          >
            <i class="fa-solid fa-trash"></i>
            Excluir
          </button>

        </div>
        </div>

      </div>

    `;

    card

      .querySelector("[data-acao='editar-conteudo']")

      .addEventListener("click", () => abrirEdicaoConteudo(conteudo.id));

    card

      .querySelector("[data-acao='subir-conteudo']")

      .addEventListener("click", () => moverConteudo(conteudo.id, -1));

    card

      .querySelector("[data-acao='descer-conteudo']")

      .addEventListener("click", () => moverConteudo(conteudo.id, 1));

    card

      .querySelector('[data-acao="excluir-conteudo"]')

      .addEventListener("click", async () => {

        if (!confirm("Excluir este conteúdo? Esta ação não pode ser desfeita."))

          return;

        await bloquearConteudos(async () => {

          try {

            await excluirConteudoModulo({ id: conteudo.id });

            await carregarConteudos();

          } catch (erro) {

            console.error(erro);

            alert("Não foi possível excluir o conteúdo.");

          }

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

  arquivoMidiaSelecionado = null;
  origemMidia = conteudo.url ? "url" : "arquivo";

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
  arquivoMidiaSelecionado = null;
  origemMidia = "arquivo";

  limparUrlPreviewLocal();
  esconderPreviewMidia();
  atualizarCamposConteudo();
  atualizarTextosModalConteudo();
}

function fecharModalConteudo() {

  modalConteudo.hidden = true;

  conteudoEmEdicao = null;

  prepararFormularioConteudo();

}


function atualizarCamposConteudo() {
  const tipo = tipoConteudo.value;
  const imagem = tipo === "imagem";
  const video = tipo === "video";
  const midia = imagem || video;

  campoConteudo.hidden = midia;
  camposMidiaConteudo.hidden = !midia;
  textoConteudo.required = !midia;
  altTextoConteudo.required = midia;

  if (!midia) {
    campoArquivoConteudo.hidden = true;
    campoUrlConteudo.hidden = true;
    urlConteudo.required = false;
    esconderPreviewMidia();
    return;
  }

  if (imagem) {
    arquivoConteudo.accept = "image/jpeg,image/png,image/webp";
    rotuloOrigemMidia.textContent = "Origem da imagem";
    descricaoOrigemArquivo.textContent = "Escolha uma imagem do computador";
    descricaoOrigemUrl.textContent = "Cole o endereço de uma imagem";
    rotuloArquivoMidia.textContent = "Arquivo da imagem";
    iconeUploadMidia.className = "fa-regular fa-image";
    textoUploadMidia.textContent = "Clique para escolher uma imagem";
    ajudaUploadMidia.textContent = "JPG, PNG ou WEBP • máximo 5 MB";
    rotuloUrlMidia.textContent = "URL da imagem";
    urlConteudo.placeholder = "https://exemplo.com/imagem.jpg";
    rotuloAltTextoConteudo.textContent = "Texto alternativo";
    altTextoConteudo.placeholder = "Ex.: Pessoa idosa utilizando um celular";
    ajudaAltTextoConteudo.textContent = "Descreva de forma breve o que aparece na imagem.";
  } else {
    arquivoConteudo.accept = "video/mp4,video/webm";
    rotuloOrigemMidia.textContent = "Origem do vídeo";
    descricaoOrigemArquivo.textContent = "Escolha um vídeo do computador";
    descricaoOrigemUrl.textContent = "Cole um link do YouTube ou vídeo direto";
    rotuloArquivoMidia.textContent = "Arquivo do vídeo";
    iconeUploadMidia.className = "fa-solid fa-video";
    textoUploadMidia.textContent = "Clique para escolher um vídeo";
    ajudaUploadMidia.textContent = "MP4 ou WEBM • máximo 50 MB";
    rotuloUrlMidia.textContent = "URL do vídeo";
    urlConteudo.placeholder = "https://youtube.com/... ou https://.../video.mp4";
    rotuloAltTextoConteudo.textContent = "Descrição do vídeo";
    altTextoConteudo.placeholder = "Ex.: Tutorial mostrando como adicionar um contato";
    ajudaAltTextoConteudo.textContent = "Descreva brevemente o conteúdo do vídeo para acessibilidade.";
  }

  atualizarOrigemMidia();
}

function atualizarOrigemMidia() {
  const usandoArquivo = origemMidia === "arquivo";

  campoArquivoConteudo.hidden = !usandoArquivo;
  campoUrlConteudo.hidden = usandoArquivo;

  btnOrigemArquivo.classList.toggle("ativo", usandoArquivo);
  btnOrigemUrl.classList.toggle("ativo", !usandoArquivo);

  urlConteudo.required = !usandoArquivo;

  if (usandoArquivo) {
    if (arquivoMidiaSelecionado) {
      mostrarPreviewArquivo(arquivoMidiaSelecionado);
    } else {
      esconderPreviewMidia();
    }
  } else {
    mostrarPreviewUrl();
  }
}

function escolherOrigemArquivo() {
  origemMidia = "arquivo";
  atualizarOrigemMidia();
}

function escolherOrigemUrl() {
  origemMidia = "url";
  atualizarOrigemMidia();
  urlConteudo.focus();
}

function validarArquivoMidia(arquivo) {
  const tipo = tipoConteudo.value;

  if (tipo === "imagem") {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(arquivo.type)) {
      alert("Escolha uma imagem JPG, PNG ou WEBP.");
      return false;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5 MB.");
      return false;
    }

    return true;
  }

  if (tipo === "video") {
    const tiposPermitidos = ["video/mp4", "video/webm"];

    if (!tiposPermitidos.includes(arquivo.type)) {
      alert("Escolha um vídeo MP4 ou WEBM.");
      return false;
    }

    if (arquivo.size > 50 * 1024 * 1024) {
      alert("O vídeo deve ter no máximo 50 MB.");
      return false;
    }

    return true;
  }

  return false;
}

function mostrarPreviewArquivo(arquivo) {
  limparUrlPreviewLocal();
  esconderElementosPreview();

  urlPreviewLocal = URL.createObjectURL(arquivo);

  if (tipoConteudo.value === "imagem") {
    imagemPreviewConteudo.src = urlPreviewLocal;
    imagemPreviewConteudo.alt = altTextoConteudo.value || "Pré-visualização da imagem";
    imagemPreviewConteudo.hidden = false;
  } else if (tipoConteudo.value === "video") {
    videoPreviewConteudo.src = urlPreviewLocal;
    videoPreviewConteudo.hidden = false;
  }

  previewMidiaConteudo.hidden = false;
}

function mostrarPreviewUrl() {
  const url = urlConteudo.value.trim();
  esconderElementosPreview();

  if (!url) {
    previewMidiaConteudo.hidden = true;
    return;
  }

  if (tipoConteudo.value === "imagem") {
    imagemPreviewConteudo.src = url;
    imagemPreviewConteudo.alt = altTextoConteudo.value || "Pré-visualização da imagem";
    imagemPreviewConteudo.hidden = false;
    previewMidiaConteudo.hidden = false;
    return;
  }

  if (tipoConteudo.value === "video") {
    const youtubeId = extrairIdYoutube(url);

    if (youtubeId) {
      youtubePreviewConteudo.src = `https://www.youtube.com/embed/${youtubeId}`;
      youtubePreviewConteudo.hidden = false;
    } else {
      videoPreviewConteudo.src = url;
      videoPreviewConteudo.hidden = false;
    }

    previewMidiaConteudo.hidden = false;
  }
}

function extrairIdYoutube(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const partes = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(partes[0])) return partes[1] || null;
    }
  } catch (erro) {
    return null;
  }

  return null;
}

function esconderElementosPreview() {
  imagemPreviewConteudo.hidden = true;
  videoPreviewConteudo.hidden = true;
  youtubePreviewConteudo.hidden = true;

  imagemPreviewConteudo.removeAttribute("src");

  videoPreviewConteudo.pause();
  videoPreviewConteudo.removeAttribute("src");
  videoPreviewConteudo.load();

  youtubePreviewConteudo.removeAttribute("src");
}

function esconderPreviewMidia() {
  previewMidiaConteudo.hidden = true;
  esconderElementosPreview();
}

function limparUrlPreviewLocal() {
  if (!urlPreviewLocal) return;
  URL.revokeObjectURL(urlPreviewLocal);
  urlPreviewLocal = null;
}

formConteudo.addEventListener(

  "submit",

  async (evento) => {

    evento.preventDefault();


    if (btnSalvarConteudo.disabled) {

      return;

    }


    const tipo =

      tipoConteudo.value;


    const imagem =

      tipo === "imagem";


    const video =

      tipo === "video";


    const midia =

      imagem || video;


    const titulo =

      normalizarVazio(

        tituloConteudo.value,

      );


    const conteudo =

      midia

        ? null

        : normalizarVazio(

            textoConteudo.value,

          );


    const altTexto =

      midia

        ? normalizarVazio(

            altTextoConteudo.value,

          )

        : null;


    let url = null;


    // CONTEÚDO TEXTUAL


    if (

      !midia &&

      !conteudo

    ) {

      alert(

        "Preencha o conteúdo.",

      );


      textoConteudo.focus();


      return;

    }


    // IMAGEM / VÍDEO


    if (midia) {

      if (!altTexto) {

        alert(

          imagem

            ? "Informe o texto alternativo da imagem."

            : "Informe uma descrição para o vídeo.",

        );


        altTextoConteudo.focus();


        return;

      }


      if (

        origemMidia === "arquivo" &&

        !arquivoMidiaSelecionado &&

        !conteudoEmEdicao?.url

      ) {

        alert(

          imagem

            ? "Escolha uma imagem do computador."

            : "Escolha um vídeo do computador.",

        );


        return;

      }


      if (

        origemMidia === "url"

      ) {

        url =

          normalizarVazio(

            urlConteudo.value,

          );


        if (!url) {

          alert(

            imagem

              ? "Informe a URL da imagem."

              : "Informe a URL do vídeo.",

          );


          urlConteudo.focus();


          return;

        }

      }

    }


    const editando =

      conteudoEmEdicao !== null;


    btnSalvarConteudo.disabled =

      true;


    try {


      // FAZ O UPLOAD PRIMEIRO


      if (

        midia &&

        origemMidia === "arquivo"

      ) {


        if (

          arquivoMidiaSelecionado

        ) {

          url =

            await enviarArquivoSupabase(

              arquivoMidiaSelecionado,

              tipo,

            );

        } else {

          // Edição sem trocar o arquivo.

          url =

            conteudoEmEdicao?.url ||

            null;

        }

      }


      // SALVA NO DATACONNECT


      if (editando) {


        await editarConteudoModulo({

          id: conteudoEmEdicao.id,

          tipo,

          titulo,

          conteudo,

          url,

          altTexto,

          ordem:

            conteudoEmEdicao.ordem,

        });


      } else {


        await criarConteudoModulo({

          moduloId,

          tipo,

          titulo,

          conteudo,

          url,

          altTexto,

          ordem:

            proximaOrdem(

              conteudosCarregados,

            ),

        });


      }


      fecharModalConteudo();


      await carregarConteudos();


    } catch (erro) {


      console.error(

        "Erro ao salvar conteúdo:",

        erro,

      );


      alert(

        "Não foi possível salvar o conteúdo.",

      );


    } finally {


      btnSalvarConteudo.disabled =

        false;


      atualizarTextosModalConteudo();


    }

  },

);


function atualizarTextosModalConteudo() {

  const editando = conteudoEmEdicao !== null;

  tituloModalConteudo.textContent = editando

    ? "Editar conteúdo"

    : "Novo conteúdo";

  btnSalvarConteudo.innerHTML = editando

    ? '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Salvar alterações'

    : '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Criar conteúdo';

}


async function moverConteudoInterno(conteudoId, direcao) {

  const indice = conteudosCarregados.findIndex(

    (conteudo) => conteudo.id === conteudoId,

  );

  const destino = indice + direcao;

  if (indice < 0 || destino < 0 || destino >= conteudosCarregados.length)

    return;

  try {

    await trocarOrdens(

      conteudosCarregados,

      conteudosCarregados[indice],

      conteudosCarregados[destino],

      atualizarConteudo,

    );

    await carregarConteudos();

  } catch (erro) {

    console.error("Erro ao reordenar conteúdo:", erro);

    alert("Não foi possível alterar a ordem do conteúdo.");

  }

}


async function atualizarConteudo(conteudo, ordem) {

  await editarConteudoModulo({

    id: conteudo.id,

    tipo: conteudo.tipo,

    titulo: conteudo.titulo ?? null,

    conteudo: conteudo.conteudo ?? null,

    url: conteudo.url ?? null,

    altTexto: conteudo.altTexto ?? null,

    ordem,

  });

}


btnNovoConteudo.addEventListener("click", abrirNovoConteudo);

tipoConteudo.addEventListener("change", () => {
  arquivoConteudo.value = "";
  arquivoMidiaSelecionado = null;
  limparUrlPreviewLocal();
  esconderPreviewMidia();
  atualizarCamposConteudo();
});

btnFecharModalConteudo.addEventListener("click", fecharModalConteudo);

btnCancelarConteudo.addEventListener("click", fecharModalConteudo);


btnOrigemArquivo.addEventListener("click", escolherOrigemArquivo);


btnOrigemUrl.addEventListener("click", escolherOrigemUrl);


arquivoConteudo.addEventListener("change", () => {

  const arquivo = arquivoConteudo.files?.[0];


  if (!arquivo) {
    arquivoMidiaSelecionado = null;
    esconderPreviewMidia();
    return;
  }


  if (!validarArquivoMidia(arquivo)) {

    arquivoConteudo.value = "";

    arquivoMidiaSelecionado = null;

    return;

  }


  arquivoMidiaSelecionado = arquivo;


  mostrarPreviewArquivo(arquivo);

});


urlConteudo.addEventListener("input", mostrarPreviewUrl);


altTextoConteudo.addEventListener("input", () => {
  if (tipoConteudo.value === "imagem") {
    imagemPreviewConteudo.alt =
      altTextoConteudo.value || "Pré-visualização da imagem";
  }
});


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

    return (

      conteudo.altTexto ||

      conteudo.url ||

      "Imagem sem descrição."

    );

  }


  if (conteudo.tipo === "video") {

    return (

      conteudo.altTexto ||

      conteudo.url ||

      "Vídeo sem descrição."

    );

  }


  return (

    conteudo.conteudo ||

    "Conteúdo sem texto."

  );

}


function formatarTipoConteudo(tipo) {

  const tipos = {

    texto: "Texto",

    imagem: "Imagem",

    video: "Vídeo",

    importante: "Importante",

    dica: "Dica",

  };


  return (

    tipos[tipo] ||

    tipo ||

    "Conteúdo"

  );

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


const bloquearConteudos = criarBloqueio(

  document.getElementById("secaoConteudos"),

);

const moverConteudo = (...args) =>

  bloquearConteudos(() => moverConteudoInterno(...args));

configurarModais([[modalConteudo, fecharModalConteudo]]);


async function enviarArquivoSupabase(arquivo, tipo) {

  const extensao = arquivo.name.split(".").pop().toLowerCase();


  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;


  const caminho = `cursos/${cursoId}/modulos/${moduloId}/${nomeArquivo}`;


  const bucket =

    tipo === "video" ? "techsenior-videos" : "techsenior-conteudos";


  const { error } = await supabase.storage

    .from(bucket)

    .upload(caminho, arquivo, {

      contentType: arquivo.type,

      cacheControl: "3600",

      upsert: false,

    });


  if (error) {

    console.error("Erro no upload:", error);


    throw new Error("Não foi possível enviar o arquivo.");

  }


  const { data } = supabase.storage.from(bucket).getPublicUrl(caminho);


  return data.publicUrl;

}
