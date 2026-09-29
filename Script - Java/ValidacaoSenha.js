export function avaliarSenha(senha) {
  const regras = [
    ["Entre 10 e 32 caracteres", senha.length >= 10 && senha.length <= 32],
    ["Uma letra maiúscula", /\p{Lu}/u.test(senha)],
    ["Uma letra minúscula", /\p{Ll}/u.test(senha)],
    ["Um número", /[0-9]/.test(senha)],
    ["Um símbolo", /[^\p{L}\p{N}\s]/u.test(senha)],
    ["Sem espaços", senha.length > 0 && !/\s/.test(senha)],
  ];
  const pontos = regras.filter(([, valida]) => valida).length;
  const nivel = pontos === 6 ? "forte" : pontos >= 4 ? "media" : "fraca";
  return { regras, valida: pontos === 6, nivel };
}

export function configurarValidacaoSenha(senha, confirmacao) {
  const painel = document.createElement("div");
  painel.className = "validacao-senha";
  painel.id = "regrasSenha";
  painel.setAttribute("aria-live", "polite");
  senha.closest(".campo").after(painel);
  senha.setAttribute("aria-describedby", painel.id);
  for (const campo of [senha, confirmacao]) {
    campo.minLength = 10;
    campo.maxLength = 32;
    campo.autocomplete = "new-password";
  }
  const atualizar = () => {
    const resultado = avaliarSenha(senha.value);
    painel.replaceChildren();
    const titulo = document.createElement("p");
    titulo.className = `senha-nivel ${resultado.nivel}`;
    titulo.id = "nivelSenha";
    titulo.textContent = `Senha ${resultado.nivel === "media" ? "média" : resultado.nivel}`;
    painel.append(titulo);
    const progresso = document.createElement("progress");
    progresso.className = `senha-progresso ${resultado.nivel}`;
    progresso.max = 6;
    progresso.value = pontosDaSenha(resultado.regras);
    progresso.setAttribute("aria-label", `${titulo.textContent}; ${progresso.value} de 6 requisitos atendidos`);
    painel.append(progresso);
    for (const [texto, valida] of resultado.regras) {
      const linha = document.createElement("p");
      linha.textContent = `${valida ? "✓" : "○"} ${texto}`;
      linha.classList.toggle("valida", valida);
      painel.append(linha);
    }
    const iguais = senha.value === confirmacao.value;
    const aviso = document.createElement("p");
    aviso.textContent = confirmacao.value ? (iguais ? "✓ As senhas coincidem." : "○ As senhas não coincidem.") : "Confirme sua senha abaixo.";
    painel.append(aviso);
    senha.setCustomValidity(resultado.valida ? "" : "Sua senha deve atender a todas as regras indicadas.");
    confirmacao.setCustomValidity(iguais ? "" : "As senhas não coincidem.");
    return resultado.valida && iguais;
  };
  senha.addEventListener("input", atualizar);
  confirmacao.addEventListener("input", atualizar);
  atualizar();
  return atualizar;
}

function pontosDaSenha(regras) {
  return regras.filter(([, valida]) => valida).length;
}
