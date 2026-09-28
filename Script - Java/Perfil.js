import { listarAtividade, resumirAtividade } from "./ServicoAtividade.js";
import { excluirConta } from "./ServicoConta.js";
import { auth } from "./Firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  listarCursos,
  listarModulosDoCurso,
  meuPerfil,
} from "../dataconnect-generated/esm/index.esm.js";
import { carregarProgressoCurso } from "./ServicoProgresso.js";

const perfilContainer = document.getElementById("perfilContainer");
const estadoPerfil = document.getElementById("estadoPerfil");
const conteudoPerfil = document.getElementById("conteudoPerfil");
const nomePerfil = document.getElementById("nomePerfil");
const emailUsuario = document.getElementById("emailUsuario");
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPerfilImagem = document.getElementById("fotoPerfilImagem");
const avatarIniciais = document.getElementById("avatarIniciais");
const tipoConta = document.getElementById("tipoConta");
const cursosIniciados = document.getElementById("cursosIniciados");
const cursosDisponiveis = document.getElementById("cursosDisponiveis");
const totalCursosIniciados = document.getElementById("totalCursosIniciados");
const totalCursosConcluidos = document.getElementById("totalCursosConcluidos");
const totalModulosConcluidos = document.getElementById("totalModulosConcluidos");
const btnSair = document.getElementById("btnSair");

let uidInicializado = null;
let excluindoConta = false;

onAuthStateChanged(auth, async (usuario) => {
  if (!usuario) {
    if (excluindoConta) return;
    window.location.replace("Login.html");
    return;
  }

  if (uidInicializado === usuario.uid) return;
  uidInicializado = usuario.uid;

  const [resultadoPerfil, resultadoCursos] = await Promise.allSettled([
    carregarIdentidade(usuario),
    carregarCursos(usuario.uid),
    carregarFrequencia(usuario.uid),
  ]);

  if (resultadoPerfil.status === "rejected") {
    console.error("Erro inesperado ao carregar identidade:", resultadoPerfil.reason);
    aplicarIdentidade(usuario, null);
    mostrarEstadoPerfil(
      "Não foi possível carregar todos os dados da sua conta. Exibimos as informações disponíveis no login.",
      "aviso",
    );
  }

  if (resultadoCursos.status === "rejected") {
    console.error("Erro inesperado ao carregar cursos:", resultadoCursos.reason);
    mostrarErroCursos();
  }

  conteudoPerfil.hidden = false;
  perfilContainer.setAttribute("aria-busy", "false");
});

async function carregarIdentidade(usuario) {
  try {
    const resposta = await meuPerfil();
    const dados = resposta.data?.usuarios?.[0] || null;

    if (!dados) {
      aplicarIdentidade(usuario, null);
      mostrarEstadoPerfil(
        "Seu perfil detalhado não foi encontrado. Exibimos as informações disponíveis no login.",
        "aviso",
      );
      return;
    }

    const nomeBanco = dados.nome?.trim();
    if (nomeBanco && usuario.displayName !== nomeBanco) {
      try {
        await updateProfile(usuario, { displayName: nomeBanco });
      } catch (erro) {
        console.warn("Não foi possível sincronizar o nome no Firebase:", erro);
      }
    }

    aplicarIdentidade(usuario, dados);
    estadoPerfil.hidden = true;
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
    aplicarIdentidade(usuario, null);
    mostrarEstadoPerfil(
      "Não foi possível carregar todos os dados da sua conta. Exibimos as informações disponíveis no login.",
      "erro",
    );
  }
}

function aplicarIdentidade(usuario, dados) {
  const email = dados?.email || usuario.email || "E-mail não disponível";
  const nome = dados?.nome?.trim()
    || usuario.displayName?.trim()
    || obterNomePeloEmail(usuario.email)
    || "Usuário";

  nomePerfil.textContent = nome;
  emailUsuario.textContent = email;
  atualizarBotaoUsuario(nome);
  configurarAvatar(usuario.photoURL, nome);
  tipoConta.textContent = identificarTipoConta(usuario.providerData);
  const senhaLocal = usuario.providerData.some((p) => p.providerId === "password");
  const alterarSenha = document.querySelector('a[href="EsqueciSenha.html"]');
  if (alterarSenha) alterarSenha.closest(".config-card").hidden = !senhaLocal;
  document.getElementById("campoSenhaExclusao").hidden = !senhaLocal;
  document.getElementById("senhaExclusao").required = senhaLocal;
  document.getElementById("avisoGoogleExclusao").hidden = senhaLocal;
}

function atualizarBotaoUsuario(nome) {
  const botaoUsuario = document.getElementById("btnUsuario");
  if (!botaoUsuario) return;
  const icone = document.createElement("i");
  icone.className = "fa-solid fa-user";
  icone.setAttribute("aria-hidden", "true");
  botaoUsuario.replaceChildren(icone, document.createTextNode(nome));
}

function obterNomePeloEmail(email) {
  const parteInicial = email?.split("@")[0]?.trim();
  return parteInicial || "";
}

function obterIniciais(nome) {
  const partes = nome.split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "U";
  const primeira = Array.from(partes[0])[0] || "";
  const ultima = partes.length > 1
    ? Array.from(partes[partes.length - 1])[0] || ""
    : "";
  return `${primeira}${ultima}`.toLocaleUpperCase("pt-BR");
}

function configurarAvatar(photoURL, nome) {
  const mostrarIniciais = () => {
    fotoPerfilImagem.hidden = true;
    fotoPerfilImagem.removeAttribute("src");
    avatarIniciais.hidden = false;
    fotoPerfil.classList.remove("com-foto");
  };

  avatarIniciais.textContent = obterIniciais(nome);
  avatarIniciais.hidden = false;
  fotoPerfilImagem.hidden = true;
  fotoPerfilImagem.alt = `Foto de perfil de ${nome}`;

  if (!photoURL) {
    mostrarIniciais();
    return;
  }

  fotoPerfilImagem.onload = () => {
    fotoPerfilImagem.hidden = false;
    avatarIniciais.hidden = true;
    fotoPerfil.classList.add("com-foto");
  };
  fotoPerfilImagem.onerror = mostrarIniciais;
  fotoPerfilImagem.src = photoURL;
}

function identificarTipoConta(provedores = []) {
  const ids = provedores.map((provedor) => provedor.providerId);
  if (ids.includes("google.com")) return "Conta conectada com Google";
  if (ids.includes("password")) return "Conta com e-mail e senha";
  return "Conta autenticada";
}

function mostrarEstadoPerfil(texto, tipo) {
  estadoPerfil.className = `estado-perfil ${tipo}`;
  estadoPerfil.replaceChildren();
  const icone = document.createElement("i");
  icone.className = tipo === "erro"
    ? "fa-solid fa-circle-exclamation"
    : "fa-solid fa-circle-info";
  icone.setAttribute("aria-hidden", "true");
  const mensagem = document.createElement("span");
  mensagem.textContent = texto;
  estadoPerfil.append(icone, mensagem);
  estadoPerfil.hidden = false;
}

async function carregarCursos(uid) {
  try {
    const resposta = await listarCursos();
    const cursos = resposta.data?.cursos || [];
    const resultados = await Promise.allSettled(
      cursos.map((curso) => carregarCursoComProgresso(uid, curso)),
    );

    const carregados = resultados
      .filter((resultado) => resultado.status === "fulfilled")
      .map((resultado) => resultado.value);
    const falhas = resultados.filter((resultado) => resultado.status === "rejected");

    falhas.forEach((falha) => {
      console.error("Um curso não pôde ser carregado:", falha.reason);
    });

    renderizarCursos(carregados, falhas.length > 0);
  } catch (erro) {
    console.error("Erro ao carregar cursos publicados:", erro);
    mostrarErroCursos();
  }
}

async function carregarCursoComProgresso(uid, curso) {
  const respostaModulos = await listarModulosDoCurso({ cursoId: curso.id });
  const modulos = respostaModulos.data?.modulos || [];
  const progresso = await carregarProgressoCurso(uid, curso.id, modulos.length);
  const modulosConcluidos = progresso.modulosConcluidos.filter(Boolean).length;
  const percentual = modulos.length > 0
    ? Math.round((modulosConcluidos / modulos.length) * 100)
    : 0;

  return {
    ...curso,
    iniciado: progresso.iniciado === true,
    cursoConcluido: progresso.cursoConcluido === true,
    modulosConcluidos,
    percentual,
    totalModulos: modulos.length,
  };
}

function renderizarCursos(cursos, possuiFalhas) {
  const iniciados = cursos.filter(
    (curso) => curso.iniciado || curso.percentual > 0 || curso.cursoConcluido,
  );
  const novos = cursos.filter(
    (curso) => !curso.iniciado && curso.percentual === 0 && !curso.cursoConcluido,
  );

  atualizarResumo(iniciados);
  preencherListaCursos(
    cursosIniciados,
    iniciados,
    "Você ainda não iniciou nenhum curso.",
  );
  preencherListaCursos(
    cursosDisponiveis,
    novos,
    cursos.length === 0
      ? "Nenhum curso está disponível no momento."
      : "Você já iniciou todos os cursos disponíveis.",
  );

  if (possuiFalhas) {
    const aviso = criarEstadoLista(
      "Alguns cursos não puderam ser carregados. Tente atualizar a página mais tarde.",
      "aviso",
    );
    cursosIniciados.prepend(aviso);
  }
}

function atualizarResumo(cursos) {
  totalCursosIniciados.textContent = String(cursos.length);
  totalCursosConcluidos.textContent = String(
    cursos.filter((curso) => curso.cursoConcluido).length,
  );
  totalModulosConcluidos.textContent = String(
    cursos.reduce((total, curso) => total + curso.modulosConcluidos, 0),
  );
}

function preencherListaCursos(container, cursos, mensagemVazia) {
  container.replaceChildren();
  if (cursos.length === 0) {
    container.appendChild(criarEstadoLista(mensagemVazia));
    return;
  }
  cursos.forEach((curso) => container.appendChild(criarCardCurso(curso)));
}

function criarCardCurso(curso) {
  const card = document.createElement("article");
  card.className = "card-curso";

  const topo = document.createElement("div");
  topo.className = "card-curso-topo";
  const iconeContainer = document.createElement("span");
  iconeContainer.className = "icone-curso";
  const icone = document.createElement("i");
  icone.className = obterClasseIcone(curso.icone);
  icone.setAttribute("aria-hidden", "true");
  iconeContainer.appendChild(icone);

  const estado = document.createElement("span");
  estado.className = `status-curso ${obterClasseStatus(curso)}`;
  estado.textContent = obterTextoStatus(curso);
  topo.append(iconeContainer, estado);

  const titulo = document.createElement("h3");
  titulo.textContent = curso.nome;
  card.append(topo, titulo);

  if (curso.descricao) {
    const descricao = document.createElement("p");
    descricao.textContent = curso.descricao;
    card.appendChild(descricao);
  }

  if (curso.percentual > 0 || curso.cursoConcluido) {
    card.appendChild(criarProgressoCurso(curso));
  }

  const link = document.createElement("a");
  link.className = "btn-card-curso";
  link.href = `Curso.html?id=${encodeURIComponent(curso.id)}`;
  link.textContent = curso.cursoConcluido
    ? "Revisar curso"
    : curso.percentual > 0
      ? "Continuar aprendendo"
      : "Começar curso";
  card.appendChild(link);
  return card;
}

function criarProgressoCurso(curso) {
  const progresso = document.createElement("div");
  progresso.className = "progresso";
  const textos = document.createElement("div");
  textos.className = "progresso-textos";
  const porcentagem = document.createElement("strong");
  porcentagem.textContent = `${curso.percentual}%`;
  const modulos = document.createElement("span");
  modulos.textContent = `${curso.modulosConcluidos} de ${curso.totalModulos} módulos concluídos`;
  textos.append(porcentagem, modulos);

  const barra = document.createElement("div");
  barra.className = "barra";
  barra.setAttribute("role", "progressbar");
  barra.setAttribute("aria-label", `Progresso no curso ${curso.nome}`);
  barra.setAttribute("aria-valuemin", "0");
  barra.setAttribute("aria-valuemax", "100");
  barra.setAttribute("aria-valuenow", String(curso.percentual));
  const preenchimento = document.createElement("div");
  preenchimento.className = "barra-preenchida";
  preenchimento.style.width = `${curso.percentual}%`;
  barra.appendChild(preenchimento);
  progresso.append(textos, barra);
  return progresso;
}

function obterTextoStatus(curso) {
  if (curso.cursoConcluido) return "Curso concluído";
  if (curso.percentual === 100) return "Módulos concluídos";
  if (curso.percentual > 0) return "Em andamento";
  return "Não iniciado";
}

function obterClasseStatus(curso) {
  if (curso.cursoConcluido) return "concluido";
  if (curso.percentual === 100) return "modulos-concluidos";
  if (curso.percentual > 0) return "andamento";
  return "novo";
}

function obterClasseIcone(classe) {
  const valor = String(classe || "").trim();
  return /^fa-(solid|regular|brands) fa-[a-z0-9-]+$/.test(valor)
    ? valor
    : "fa-solid fa-book-open";
}

function criarEstadoLista(texto, tipo = "") {
  const estado = document.createElement("p");
  estado.className = `estado-lista ${tipo}`.trim();
  estado.textContent = texto;
  return estado;
}

function mostrarErroCursos() {
  totalCursosIniciados.textContent = "—";
  totalCursosConcluidos.textContent = "—";
  totalModulosConcluidos.textContent = "—";
  cursosIniciados.replaceChildren(
    criarEstadoLista("Não foi possível carregar seus cursos. Tente atualizar a página.", "erro"),
  );
  cursosDisponiveis.replaceChildren(
    criarEstadoLista("Os cursos disponíveis não puderam ser carregados agora.", "erro"),
  );
}

if (btnSair) {
  btnSair.addEventListener("click", async () => {
    const confirmar = window.confirm("Tem certeza que deseja sair da sua conta?");
    if (!confirmar) return;

    try {
      btnSair.disabled = true;
      btnSair.textContent = "Saindo...";
      await signOut(auth);
      window.location.href = "Login.html";
    } catch (erro) {
      console.error("Erro ao sair:", erro);
      window.alert("Não foi possível sair da conta. Tente novamente.");
      btnSair.disabled = false;
      btnSair.textContent = "Sair";
    }
  });
}

async function carregarFrequencia(uid) {
  const resumo = document.getElementById("resumoFrequencia");
  try {
    const atividades = await listarAtividade(uid);
    const { semana, sequencia, diasAtivos, estudouHoje } = resumirAtividade(atividades);
    resumo.textContent = diasAtivos + " dias ativos nos últimos 7 dias • Sequência atual: " + sequencia + " dias." + (!estudouHoje && sequencia ? " Estude hoje para manter sua sequência." : "");
    const container = document.getElementById("semanaEstudos");
    container.replaceChildren();
    for (const dia of semana) {
      const item = document.createElement("div");
      item.className = "dia-estudo" + (dia.ativo ? " ativo" : "");
      item.textContent = dia.data.toLocaleDateString("pt-BR", {weekday: "short"}) + " " + (dia.ativo ? "✓" : "—");
      item.setAttribute("aria-label", dia.data.toLocaleDateString("pt-BR") + (dia.ativo ? ": dia ativo" : ": sem atividade"));
      container.append(item);
    }
    const ultima = document.getElementById("ultimaAtividade");
    ultima.replaceChildren();
    if (!atividades.length) { ultima.textContent = "Seu histórico começa quando você estudar um curso. Vamos começar?"; return; }
    const atividade = atividades[0];
    const texto = document.createElement("p");
    const data = atividade.ultimoAcesso?.toDate?.();
    texto.textContent = (atividade.cursoNome || "Curso") + " • " + (atividade.moduloNome || "Módulo " + (atividade.moduloAtual + 1)) + (data ? " • " + data.toLocaleString("pt-BR") : "");
    const link = document.createElement("a");
    link.href = "Curso.html?id=" + encodeURIComponent(atividade.cursoId);
    link.textContent = "Continuar";
    ultima.append(texto, link);
  } catch (erro) { console.error(erro); resumo.textContent = "Não foi possível carregar sua atividade. Tente atualizar a página."; }
}

const dialogExcluir = document.getElementById("dialogExcluirConta");
const confirmarExclusao = document.getElementById("confirmarExclusao");
const cancelarExclusao = document.getElementById("cancelarExclusao");
document.getElementById("abrirExcluirConta").addEventListener("click", () => {
  document.getElementById("formExcluirConta").reset();
  document.getElementById("erroExclusao").textContent = "";
  dialogExcluir.showModal();
  cancelarExclusao.focus();
});
cancelarExclusao.addEventListener("click", () => dialogExcluir.close());
dialogExcluir.addEventListener("cancel", (evento) => { if (confirmarExclusao.disabled) evento.preventDefault(); });
document.getElementById("formExcluirConta").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (confirmarExclusao.disabled) return;
  confirmarExclusao.disabled = cancelarExclusao.disabled = true;
  const mensagem = document.getElementById("erroExclusao");
  mensagem.textContent = "Confirmando sua identidade e excluindo seus dados...";
  try {
    excluindoConta = true;
    await excluirConta(document.getElementById("senhaExclusao").value);
    window.location.replace("index.html");
  } catch (erro) {
    excluindoConta = false;
    mensagem.textContent = erro.code?.startsWith("auth/") ? "Não foi possível confirmar sua identidade. Confira sua senha ou tente novamente com Google." : erro.message;
    confirmarExclusao.disabled = cancelarExclusao.disabled = false;
  }
});
