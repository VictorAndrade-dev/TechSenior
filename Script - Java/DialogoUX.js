// Coordena os diálogos de orientação e o painel global sem acessar dados do aluno.
export function prepararDialogo(dialogo, aoFechar = () => {}) {
  let origem;
  let overflow;
  let ativo = false;
  function restaurar() {
    if (!ativo || dialogo.open) return;
    ativo = false;
    document.body.style.overflow = overflow;
    aoFechar();
    if (origem?.isConnected && origem.getClientRects().length && !origem.closest("[hidden], [inert]")) origem.focus({ preventScroll: true });
  }
  const fechar = () => { if (dialogo.open) { dialogo.close(); restaurar(); } };
  dialogo.addEventListener("cancel", (evento) => { evento.preventDefault(); fechar(); });
  dialogo.addEventListener("click", (evento) => {
    if (evento.target !== dialogo) return;
    const r = dialogo.getBoundingClientRect();
    if (evento.clientX < r.left || evento.clientX > r.right || evento.clientY < r.top || evento.clientY > r.bottom) fechar();
  });
  dialogo.addEventListener("close", restaurar);
  document.addEventListener("techsenior:abrir-modal", (evento) => {
    if (evento.detail !== dialogo) fechar();
  });
  return {
    abrir(gatilho = document.activeElement) {
      if (dialogo.open) return;
      document.dispatchEvent(new CustomEvent("techsenior:abrir-modal", { detail: dialogo }));
      origem = gatilho;
      overflow = document.body.style.overflow;
      ativo = true;
      document.body.style.overflow = "hidden";
      dialogo.showModal();
    },
    fechar,
  };
}
