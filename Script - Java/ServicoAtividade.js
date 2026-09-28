import { dataLocal } from "./CalendarioEstudos.js";
export { dataLocal, resumirAtividade } from "./CalendarioEstudos.js";
import { auth, db } from "./Firebase-config.js";
import { collection, doc, getDocs, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

export async function registrarAtividade(cursoId, moduloAtual, cursoNome = "", moduloNome = "") {
  const usuario = auth.currentUser;
  if (!usuario || !cursoId) return;
  const dataChave = dataLocal();
  const ref = doc(db, "usuarios", usuario.uid, "atividade", dataChave);
  await runTransaction(db, async (transacao) => {
    const anterior = await transacao.get(ref);
    transacao.set(ref, {
      dataChave, cursoId, moduloAtual,
      ...(cursoNome ? { cursoNome } : {}), ...(moduloNome ? { moduloNome } : {}),
      ultimoAcesso: serverTimestamp(),
      ...(!anterior.exists() ? { primeiroAcesso: serverTimestamp() } : {}),
    }, { merge: true });
  });
}

export async function listarAtividade(uid) {
  if (auth.currentUser?.uid !== uid) throw new Error("Sessão inválida.");
  const resposta = await getDocs(collection(db, "usuarios", uid, "atividade"));
  return resposta.docs.map((item) => item.data()).sort((a, b) => b.dataChave.localeCompare(a.dataChave));
}

