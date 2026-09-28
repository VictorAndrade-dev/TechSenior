import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { carregarProgressoCurso, salvarResultadoTesteFinal } from "./ServicoProgresso.js";
import {
  listarCursos, listarModulosDoCurso, buscarQuizFinalDoCursoAluno,
  listarQuestoesDoQuiz, listarAlternativasDaQuestao,
} from "../dataconnect-generated/esm/index.esm.js";

const cursoId = new URLSearchParams(window.location.search).get("id");
const uuid = /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
const elementos = Object.fromEntries([
  "voltarCurso", "nomeCurso", "tituloTeste", "mensagemTeste", "inicioTeste",
  "quantidadeQuestoes", "iniciarTeste", "tentativaTeste", "numeroQuestao",
  "perguntaTeste", "alternativasTeste", "contadorRespostas", "anteriorTeste",
  "proximaTeste", "finalizarTeste", "resultadoTeste", "tituloResultado",
  "notaResultado", "mensagemResultado", "revisarCurso", "tentarNovamente",
  "revisaoTeste", "recarregarTeste",
].map((id) => [id, document.getElementById(id)]));

let usuarioAtual;
let totalModulos = 0;
let bancoQuestoes = [];
let questoes = [];
let respostas = new Map();
let indiceQuestao = 0;
let tentativaId = null;
let salvando = false;
let tentativaEncerrada = false;

// Entrada e pré-requisitos. Falhas de rede permitem tentar carregar novamente.
if (!uuid.test(cursoId || "")) {
  window.location.replace("Cursos.html");
} else {
  const caminhoCurso = `Curso.html?id=${encodeURIComponent(cursoId)}`;
  elementos.voltarCurso.href = caminhoCurso;
  elementos.revisarCurso.href = caminhoCurso;
  onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) {
      window.location.replace("Login.html");
      return;
    }
    usuarioAtual = usuario;
    await carregarTeste();
  });
}

async function carregarTeste() {
  elementos.recarregarTeste.hidden = true;
  elementos.mensagemTeste.textContent = "Carregando o teste final...";
  try {
    const resultadoCursos = await listarCursos();
    const normalizar = (id) => id.replaceAll("-", "").toLowerCase();
    const curso = resultadoCursos.data?.cursos?.find(
      (item) => normalizar(item.id) === normalizar(cursoId),
    );
    if (!curso || curso.ativo !== true || curso.publicado !== true) {
      window.location.replace("Cursos.html");
      return;
    }
    elementos.nomeCurso.textContent = curso.nome;
    document.title = `Teste final — ${curso.nome} | TechSênior`;
    const resultadoModulos = await listarModulosDoCurso({ cursoId });
    totalModulos = resultadoModulos.data?.modulos?.length || 0;
    const progresso = await carregarProgressoCurso(usuarioAtual.uid, cursoId, totalModulos);
    if (progresso.testeFinalAprovado) {
      mostrarResultado(progresso);
      return;
    }
    if (!totalModulos || !progresso.modulosConcluidos.every((valor) => valor === true)) {
      elementos.mensagemTeste.textContent = "Conclua todos os módulos antes de iniciar o teste final. Use o link Voltar ao curso para continuar suas aulas.";
      return;
    }
    const resultadoQuiz = await buscarQuizFinalDoCursoAluno({ cursoId });
    const quiz = resultadoQuiz.data?.quizzes?.[0];
    if (!quiz) {
      elementos.mensagemTeste.textContent = "Este curso ainda não possui teste final disponível.";
      return;
    }
    const resultadoQuestoes = await listarQuestoesDoQuiz({ quizId: quiz.id });
    bancoQuestoes = await Promise.all((resultadoQuestoes.data?.questaoQuizs || []).map(async (questao) => {
      const resultado = await listarAlternativasDaQuestao({ questaoId: questao.id });
      return { ...questao, alternativas: resultado.data?.alternativaQuizs || [] };
    }));
    // Não excluir silenciosamente questões incompletas nem alterar o total da prova.
    if (!bancoQuestoes.length || bancoQuestoes.some((questao) =>
      questao.alternativas.length < 2
      || questao.alternativas.filter((alternativa) => alternativa.correta === true).length !== 1)) {
      elementos.mensagemTeste.textContent = "O teste final ainda está sendo preparado. Volte ao curso e tente mais tarde.";
      return;
    }
    elementos.mensagemTeste.textContent = "Você concluiu todos os módulos. Agora pode fazer o teste final.";
    elementos.quantidadeQuestoes.textContent = `${bancoQuestoes.length} questões para responder.`;
    elementos.inicioTeste.hidden = false;
  } catch (erro) {
    console.error("Erro ao carregar teste final:", erro);
    elementos.mensagemTeste.textContent = "Não foi possível carregar o teste. Verifique sua conexão e tente novamente.";
    elementos.recarregarTeste.hidden = false;
  }
}

// Fisher-Yates sobre cópias: a ordem fica fixa até a próxima tentativa.
function embaralhar(lista, ordemAnterior = []) {
  const copia = [...lista];
  for (let indice = copia.length - 1; indice > 0; indice--) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[aleatorio]] = [copia[aleatorio], copia[indice]];
  }
  // Evita repetir por acaso a ordem anterior quando há mais de um item.
  if (copia.length > 1 && copia.every((item, indice) => item.id === ordemAnterior[indice]?.id)) {
    [copia[0], copia[1]] = [copia[1], copia[0]];
  }
  return copia;
}

function iniciarTentativa() {
  if (!bancoQuestoes.length || salvando) return;
  const anteriores = questoes;
  questoes = embaralhar(bancoQuestoes, anteriores).map((questao) => ({
    ...questao, alternativas: embaralhar(questao.alternativas,
      anteriores.find((anterior) => anterior.id === questao.id)?.alternativas),
  }));
  respostas = new Map();
  indiceQuestao = 0;
  tentativaId = crypto.randomUUID();
  tentativaEncerrada = false;
  elementos.inicioTeste.hidden = true;
  elementos.resultadoTeste.hidden = true;
  elementos.tentativaTeste.hidden = false;
  elementos.mensagemTeste.textContent =
  "Escolha uma resposta por pergunta. A correção será feita somente ao finalizar.";
  renderizarQuestao();
}

function renderizarQuestao() {
  document.dispatchEvent(new Event("techsenior:parar-leitura"));
  const questao = questoes[indiceQuestao];
  elementos.numeroQuestao.textContent = `Questão ${indiceQuestao + 1} de ${questoes.length}`;
  elementos.perguntaTeste.textContent = questao.pergunta;
  elementos.alternativasTeste.replaceChildren();
  questao.alternativas.forEach((alternativa) => {
    const rotulo = document.createElement("label");
    rotulo.className = "alternativa-teste";
    const opcao = document.createElement("input");
    opcao.type = "radio";
    opcao.name = "respostaTeste";
    opcao.value = alternativa.id;
    opcao.checked = respostas.get(questao.id) === alternativa.id;
    opcao.disabled = tentativaEncerrada;
    const texto = document.createElement("span");
    texto.textContent = alternativa.texto;
    opcao.addEventListener("change", () => {
      respostas.set(questao.id, alternativa.id);
      atualizarNavegacao();
    });
    rotulo.append(opcao, texto);
    elementos.alternativasTeste.append(rotulo);
  });
  atualizarNavegacao();
  elementos.perguntaTeste.focus();
}

function atualizarNavegacao() {
  elementos.contadorRespostas.textContent = `${respostas.size} de ${questoes.length} respondidas`;
  elementos.anteriorTeste.disabled = salvando || indiceQuestao === 0;
  elementos.proximaTeste.disabled = salvando || indiceQuestao === questoes.length - 1;
  elementos.finalizarTeste.disabled = salvando || respostas.size !== questoes.length;
}

async function finalizarTentativa() {
  if (salvando || !tentativaId || respostas.size !== questoes.length) return;
  if (!tentativaEncerrada && !window.confirm("Deseja finalizar o teste? Depois da confirmação, suas respostas não poderão ser alteradas.")) return;
  tentativaEncerrada = true;
  salvando = true;
  elementos.alternativasTeste.querySelectorAll("input").forEach((opcao) => { opcao.disabled = true; });
  atualizarNavegacao();
  elementos.mensagemTeste.textContent = "Salvando seu resultado...";
  const acertos = questoes.filter((questao) => questao.alternativas.some(
    (alternativa) => alternativa.id === respostas.get(questao.id) && alternativa.correta === true,
  )).length;
  try {
    const progresso = await salvarResultadoTesteFinal(usuarioAtual.uid, cursoId, {
      tentativaId, acertos, total: questoes.length, totalModulos,
    });
    const mesmaTentativa = progresso.ultimoResultadoTesteFinal?.tentativaId === tentativaId;
    mostrarResultado(progresso, mesmaTentativa);
  } catch (erro) {
    console.error("Erro ao salvar teste final:", erro);
    elementos.mensagemTeste.textContent = "Não foi possível salvar o resultado. Suas respostas estão mantidas nesta página. Verifique a conexão e clique em Salvar resultado novamente.";
    elementos.finalizarTeste.textContent = "Salvar resultado novamente";
  } finally {
    salvando = false;
    atualizarNavegacao();
  }
}

function mostrarResultado(progresso, revisar = false) {
  const aprovado = progresso.testeFinalAprovado;
  const resultado = progresso.ultimoResultadoTesteFinal;
  elementos.inicioTeste.hidden = true;
  elementos.tentativaTeste.hidden = true;
  elementos.resultadoTeste.hidden = false;
  elementos.mensagemTeste.textContent = "Resultado salvo no seu progresso.";
  elementos.tituloResultado.textContent = aprovado ? "Teste concluído" : "Não aprovado ainda";
  elementos.notaResultado.textContent = resultado
    ? `${resultado.acertos} de ${resultado.total} acertos — ${resultado.percentual}%. Melhor nota: ${progresso.melhorNota}%.`
    : `Melhor nota: ${progresso.melhorNota}%.`;
  elementos.mensagemResultado.textContent = aprovado
    ? "Parabéns! Você foi aprovado no teste final e concluiu o curso."
    : "Você precisa de 70% de acertos. Revise o conteúdo e tente novamente quando quiser.";
  elementos.tentarNovamente.hidden = aprovado;
  elementos.finalizarTeste.textContent = "Finalizar teste";
  elementos.revisaoTeste.replaceChildren();
  if (revisar) renderizarRevisao();
  elementos.tituloResultado.focus();
}

function renderizarRevisao() {
  const titulo = document.createElement("h2");
  titulo.textContent = "Revisão das questões";
  elementos.revisaoTeste.append(titulo);
  questoes.forEach((questao, indice) => {
    const escolhida = questao.alternativas.find((item) => item.id === respostas.get(questao.id));
    const secao = document.createElement("section");
    secao.className = "revisao-questao";
    const pergunta = document.createElement("h3");
    pergunta.textContent = `${indice + 1}. ${questao.pergunta}`;
    const resposta = document.createElement("p");
    resposta.textContent = `Sua resposta: ${escolhida.texto}`;
    const estado = document.createElement("p");
    estado.textContent = escolhida.correta ? "Você acertou esta questão." : "Você errou esta questão. Revise o conteúdo.";
    const detalhes = document.createElement("details");
    const resumo = document.createElement("summary");
    resumo.textContent = "Ver explicação da sua resposta";
    const explicacao = document.createElement("p");
    explicacao.textContent = escolhida.explicacao || "Não há explicação cadastrada para esta alternativa. Revise o conteúdo do curso.";
    detalhes.append(resumo, explicacao);
    secao.append(pergunta, resposta, estado, detalhes);
    elementos.revisaoTeste.append(secao);
  });
}

elementos.iniciarTeste.addEventListener("click", iniciarTentativa);
elementos.tentarNovamente.addEventListener("click", iniciarTentativa);
elementos.finalizarTeste.addEventListener("click", finalizarTentativa);
elementos.recarregarTeste.addEventListener("click", carregarTeste);
elementos.anteriorTeste.addEventListener("click", () => {
  if (indiceQuestao > 0 && !salvando) { indiceQuestao--; renderizarQuestao(); }
});
elementos.proximaTeste.addEventListener("click", () => {
  if (indiceQuestao < questoes.length - 1 && !salvando) { indiceQuestao++; renderizarQuestao(); }
});
