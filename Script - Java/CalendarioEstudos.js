export function dataLocal(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

export function resumirAtividade(atividades, hoje = new Date()) {
  const dias = new Set(atividades.map((item) => item.dataChave));
  const inicioSemana = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const deslocamentoSegunda = (inicioSemana.getDay() + 6) % 7;
  inicioSemana.setDate(inicioSemana.getDate() - deslocamentoSegunda);
  const semana = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date(inicioSemana.getFullYear(), inicioSemana.getMonth(), inicioSemana.getDate() + indice);
    const chave = dataLocal(data);
    return { data, chave, ativo: dias.has(chave), hoje: chave === dataLocal(hoje) };
  });
  const cursor = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (!dias.has(dataLocal(cursor))) cursor.setDate(cursor.getDate() - 1);
  let sequencia = 0;
  while (dias.has(dataLocal(cursor))) { sequencia++; cursor.setDate(cursor.getDate() - 1); }
  const diasDoMes = Array.from({ length: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate() }, (_, indice) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), indice + 1);
    const chave = dataLocal(data);
    return { data, chave, ativo: dias.has(chave), hoje: chave === dataLocal(hoje) };
  });
  return {
    semana,
    diasDoMes,
    sequencia,
    diasAtivos: semana.filter((dia) => dia.ativo).length,
    diasAtivosNoMes: diasDoMes.filter((dia) => dia.ativo).length,
    estudouHoje: dias.has(dataLocal(hoje)),
  };
}
