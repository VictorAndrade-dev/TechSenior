import { QueryFetchPolicy } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js";
import { auth } from "./Firebase-config.js";
import { criarSolicitacaoSuporte, listarSolicitacoesSuporte, atualizarStatusSuporte } from "../dataconnect-generated/esm/index.esm.js";
export const STATUS_SUPORTE = ["Nova", "Em atendimento", "Resolvida"];
export async function enviarSuporte(assunto, mensagem) {
  if (!auth.currentUser) throw new Error("Entre na sua conta para enviar uma solicitação.");
  assunto = assunto.trim(); mensagem = mensagem.trim();
  if (!assunto || assunto.length > 120 || !mensagem || mensagem.length > 5000) throw new Error("Preencha assunto (até 120 caracteres) e mensagem (até 5.000 caracteres).");
  return criarSolicitacaoSuporte({ assunto, mensagem });
}
export async function carregarSuporte() { return (await listarSolicitacoesSuporte({ fetchPolicy: QueryFetchPolicy.SERVER_ONLY })).data?.solicitacaoSuportes || []; }
export async function mudarStatusSuporte(id, status) {
  if (!STATUS_SUPORTE.includes(status)) throw new Error("Status inválido.");
  return atualizarStatusSuporte({ id, status });
}
