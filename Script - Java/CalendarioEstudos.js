export function dataLocal(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

export function resumirAtividade(atividades, hoje = new Date()) {
  const dias = new Set(atividades.map((item) => item.dataChave));
  const semana = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6 + indice);
    return { data, chave: dataLocal(data), ativo: dias.has(dataLocal(data)) };
  });
  const cursor = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (!dias.has(dataLocal(cursor))) cursor.setDate(cursor.getDate() - 1);
  let sequencia = 0;
  while (dias.has(dataLocal(cursor))) { sequencia++; cursor.setDate(cursor.getDate() - 1); }
  return { semana, sequencia, diasAtivos: semana.filter((dia) => dia.ativo).length, estudouHoje: dias.has(dataLocal(hoje)) };
}
