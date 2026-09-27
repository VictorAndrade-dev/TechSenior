import { auth, db } from "./Firebase-config.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

function criarProgressoVazio(totalModulos) {
  return new Array(totalModulos).fill(false);
}

function dadosTesteFinal(dados = {}) {
  return {
    testeFinalAprovado: dados.testeFinalAprovado === true,
    melhorNota: Number.isFinite(dados.melhorNota) ? dados.melhorNota : 0,
    tentativasTesteFinal: Number.isInteger(dados.tentativasTesteFinal)
      ? dados.tentativasTesteFinal : 0,
    cursoConcluido: dados.cursoConcluido === true,
    concluidoEm: dados.concluidoEm || null,
    ultimoResultadoTesteFinal: dados.ultimoResultadoTesteFinal || null,
  };
}

export async function carregarProgressoCurso(uid, cursoId, totalModulos) {
  const referencia = doc(db, "usuarios", uid, "progresso", cursoId);
  const documento = await getDoc(referencia);

  if (!documento.exists()) {
    return {
      ...dadosTesteFinal(),
      moduloAtual: 0,
      modulosConcluidos: criarProgressoVazio(totalModulos),
    };
  }

  const dados = documento.data();
  const modulosConcluidos = Array.isArray(dados.modulosConcluidos)
    ? dados.modulosConcluidos.map((concluido) => concluido === true)
    : criarProgressoVazio(totalModulos);

  if (modulosConcluidos.length !== totalModulos) {
    return {
      ...dadosTesteFinal(dados),
      moduloAtual: 0,
      modulosConcluidos: criarProgressoVazio(totalModulos),
    };
  }

  const moduloAtual = Number.isInteger(dados.moduloAtual)
    && dados.moduloAtual >= 0
    && dados.moduloAtual < totalModulos
    ? dados.moduloAtual
    : 0;

  return { ...dadosTesteFinal(dados), moduloAtual, modulosConcluidos };
}

// Transação preserva a melhor nota e evita perder incrementos entre abas.
// O identificador torna uma repetição do mesmo envio idempotente.
export async function salvarResultadoTesteFinal(
  uid, cursoId, { tentativaId, acertos, total, totalModulos },
) {
  if (auth.currentUser?.uid !== uid) throw new Error("Sessão inválida.");
  if (!tentativaId || !Number.isInteger(total) || total <= 0
    || !Number.isInteger(acertos) || acertos < 0 || acertos > total
    || !Number.isInteger(totalModulos) || totalModulos <= 0) {
    throw new Error("Resultado inválido.");
  }
  const percentual = Math.round((acertos / total) * 100);
  const referencia = doc(db, "usuarios", uid, "progresso", cursoId);
  return runTransaction(db, async (transacao) => {
    const documento = await transacao.get(referencia);
    const dados = documento.data() || {};
    const anterior = dadosTesteFinal(dados);
    if (dados.ultimoResultadoTesteFinal?.tentativaId === tentativaId) return anterior;
    // Uma aprovação já registrada não pode ser desfeita por outra aba.
    if (anterior.testeFinalAprovado) return anterior;
    if (dados.modulosConcluidos?.length !== totalModulos
      || !dados.modulosConcluidos.every((concluido) => concluido === true)) {
      throw new Error("Conclua todos os módulos antes de finalizar o teste.");
    }
    const aprovado = percentual >= 70;
    const resultado = {
      testeFinalAprovado: aprovado,
      melhorNota: Math.max(anterior.melhorNota, percentual),
      tentativasTesteFinal: anterior.tentativasTesteFinal + 1,
      cursoConcluido: aprovado,
      ultimoResultadoTesteFinal: { tentativaId, acertos, total, percentual },
      atualizadoEm: serverTimestamp(),
      ...(aprovado ? { concluidoEm: serverTimestamp() } : {}),
    };
    transacao.set(referencia, resultado, { merge: true });
    return { ...anterior, ...resultado };
  });
}

export async function salvarProgressoCurso(
  uid,
  cursoId,
  moduloAtual,
  modulosConcluidos,
) {
  const concluidos = modulosConcluidos.filter(Boolean).length;
  const percentual = Math.round((concluidos / modulosConcluidos.length) * 100);

  await setDoc(
    doc(db, "usuarios", uid, "progresso", cursoId),
    {
      moduloAtual,
      modulosConcluidos,
      percentual,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true },
  );
}
