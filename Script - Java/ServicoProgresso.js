import { db } from "./Firebase-config.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

function criarProgressoVazio(totalModulos) {
  return new Array(totalModulos).fill(false);
}

export async function carregarProgressoCurso(uid, cursoId, totalModulos) {
  const referencia = doc(db, "usuarios", uid, "progresso", cursoId);
  const documento = await getDoc(referencia);

  if (!documento.exists()) {
    return {
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
      moduloAtual: 0,
      modulosConcluidos: criarProgressoVazio(totalModulos),
    };
  }

  const moduloAtual = Number.isInteger(dados.moduloAtual)
    && dados.moduloAtual >= 0
    && dados.moduloAtual < totalModulos
    ? dados.moduloAtual
    : 0;

  return { moduloAtual, modulosConcluidos };
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
