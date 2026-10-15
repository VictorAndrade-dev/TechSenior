// Data Connect retorna minutos inteiros. Ausência e valores inválidos não são zero.
function duracaoValida(minutos) {
  return Number.isSafeInteger(minutos) && minutos > 0;
}

export function somarDuracaoModulos(modulos) {
  if (!Array.isArray(modulos) || modulos.length === 0) return null;
  let total = 0;
  for (const modulo of modulos) {
    if (!duracaoValida(modulo?.duracaoMinutos)) return null;
    total += modulo.duracaoMinutos;
    if (!Number.isSafeInteger(total)) return null;
  }
  return total;
}

export function formatarDuracao(minutos) {
  if (!duracaoValida(minutos)) return "Duração a definir";
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;
  if (!horas) return `${restante} min`;
  return restante ? `${horas}h ${restante} min` : `${horas}h`;
}

export function formatarTempoEstimado(minutos) {
  return duracaoValida(minutos)
    ? `Tempo estimado: ${formatarDuracao(minutos)}`
    : "Duração a definir";
}
