import { auth, db } from "./Firebase-config.js";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { collection, doc, getDocs, query, limit, writeBatch, deleteDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { excluirMinhaConta } from "../dataconnect-generated/esm/index.esm.js";

export async function excluirConta(senha) {
  const usuario = auth.currentUser;
  if (!usuario) throw new Error("Entre novamente na sua conta.");
  const provedores = usuario.providerData.map((item) => item.providerId);
  if (provedores.includes("password")) {
    await reauthenticateWithCredential(usuario, EmailAuthProvider.credential(usuario.email, senha));
  } else if (provedores.includes("google.com")) {
    await reauthenticateWithPopup(usuario, new GoogleAuthProvider());
  } else { throw new Error("Este provedor não permite reautenticação nesta tela."); }
  // Não há transação entre produtos Firebase. Operações idempotentes permitem tentar novamente.
  let etapa = "os dados da conta";
  try {
    await excluirMinhaConta();
    etapa = "o progresso e a atividade";
    for (const nome of ["progresso", "atividade"]) {
      const ref = collection(db, "usuarios", usuario.uid, nome);
      for (;;) {
        const pagina = await getDocs(query(ref, limit(400)));
        if (pagina.empty) break;
        const lote = writeBatch(db);
        pagina.docs.forEach((item) => lote.delete(item.ref));
        await lote.commit();
      }
    }
    await deleteDoc(doc(db, "usuarios", usuario.uid));
    etapa = "o acesso à conta";
    await deleteUser(usuario);
    await signOut(auth);
  } catch (erro) {
    console.error("Exclusão interrompida", etapa, erro);
    throw new Error(`Não foi possível excluir ${etapa}. Alguns dados podem já ter sido apagados. Tente novamente para concluir.`, { cause: erro });
  }
}
