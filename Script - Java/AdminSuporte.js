import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { meuPerfil } from "../dataconnect-generated/esm/index.esm.js";
import { carregarSuporte, mudarStatusSuporte, STATUS_SUPORTE } from "./ServicoSuporte.js";
const area = document.getElementById("suporteAdmin");
const lista = document.getElementById("listaSuporte");
const estado = document.getElementById("estadoSuporte");
async function carregar() {
  estado.textContent = "Carregando solicitações...";
  try {
    const itens = await carregarSuporte();
    lista.replaceChildren();
    estado.textContent = itens.length ? itens.length + " solicitações" : "Nenhuma solicitação recebida.";
    for (const item of itens) {
      const card = document.createElement("article"); card.className = "solicitacao-suporte";
      const titulo = document.createElement("h3"); titulo.textContent = item.assunto;
      const pessoa = document.createElement("p"); pessoa.textContent = item.usuario.nome + " • " + item.usuario.email;
      const mensagem = document.createElement("p"); mensagem.className = "suporte-mensagem"; mensagem.textContent = item.mensagem;
      const data = document.createElement("p"); data.textContent = new Date(item.criadoEm).toLocaleString("pt-BR");
      const label = document.createElement("label"); label.textContent = "Status da solicitação";
      const select = document.createElement("select");
      for (const status of STATUS_SUPORTE) { const option = document.createElement("option"); option.value = option.textContent = status; select.append(option); }
      select.value = item.status; label.append(select);
      const feedback = document.createElement("p"); feedback.setAttribute("role", "status");
      const salvar = document.createElement("button"); salvar.textContent = "Salvar status"; salvar.type = "button";
      salvar.addEventListener("click", async () => {
        salvar.disabled = select.disabled = true;
        try { await mudarStatusSuporte(item.id, select.value); feedback.textContent = "Status atualizado."; }
        catch (erro) { console.error(erro); feedback.textContent = "Não foi possível salvar. Tente novamente."; }
        finally { salvar.disabled = select.disabled = false; }
      });
      card.append(titulo, pessoa, data, mensagem, label, salvar, feedback); lista.append(card);
    }
  } catch (erro) { console.error(erro); estado.textContent = "Não foi possível carregar as solicitações. Tente novamente."; }
}
onAuthStateChanged(auth, async (usuario) => {
  area.hidden = true;
  if (!usuario) return;
  try {
    const perfil = (await meuPerfil()).data?.usuarios?.[0];
    if (perfil?.tipoUsuario?.nome !== "Administrador") return;
    area.hidden = false; await carregar();
  } catch (erro) { console.error(erro); }
});
document.getElementById("atualizarSuporte").addEventListener("click", carregar);
