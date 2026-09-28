import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { avaliarSenha } from '../Script - Java/ValidacaoSenha.js';
import { dataLocal, resumirAtividade } from '../Script - Java/CalendarioEstudos.js';

// Limites, cada requisito ausente, espaços e letras acentuadas.
for (const senha of ['', 'Abc1!', 'abcdefgh1!', 'ABCDEFGH1!', 'Abcdefghi!', 'Abcdefghi1', 'Abcdefgh1! ', 'Abcdefgh1!' + 'a'.repeat(23)]) {
  assert.equal(avaliarSenha(senha).valida, false, `Não deveria aceitar: ${senha}`);
}
for (const senha of ['Abcdefgh1!', 'Abcdefgh1!' + 'a'.repeat(22), 'Ábcdefgh1!']) assert.equal(avaliarSenha(senha).valida, true);
const hoje = new Date(2026, 0, 1, 0, 15);
assert.equal(dataLocal(hoje), '2026-01-01');
const atividade = (...dias) => dias.map(dataChave => ({ dataChave }));
assert.equal(resumirAtividade([], hoje).sequencia, 0);
assert.equal(resumirAtividade(atividade('2026-01-01', '2025-12-31', '2025-12-30'), hoje).sequencia, 3);
assert.equal(resumirAtividade(atividade('2025-12-31', '2025-12-30'), hoje).sequencia, 2);
assert.equal(resumirAtividade(atividade('2025-12-30'), hoje).sequencia, 0);
assert.equal(resumirAtividade(atividade('2026-01-01', '2026-01-01'), hoje).diasAtivos, 1);
assert.equal(resumirAtividade(atividade('2025-12-25'), hoje).diasAtivos, 0);
assert.equal(resumirAtividade([], hoje).semana.length, 7);

const arquivos = fs.readdirSync('.').filter(nome => nome.endsWith('.html'));
for (const arquivo of arquivos) {
  const html = fs.readFileSync(arquivo, 'utf8');
  const ids = new Set();
  for (const [, id] of html.matchAll(/\bid="([^"]+)"/g)) {
    assert(!ids.has(id), `${arquivo}: ID duplicado ${id}`); ids.add(id);
  }
  assert(!/href="Comunidade\.html"/.test(html), `${arquivo}: comunidade fora de escopo`);
  assert(!/Maria, 68|João, 72|\+1000|Lora|Open Sans/.test(html), `${arquivo}: conteúdo legado`);
  if (html.includes('Script - Java/Padrão.js')) assert(html.includes('type="importmap"'), `${arquivo}: falta importmap`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const destino = decodeURIComponent(url.split(/[?#]/)[0]);
    if (destino) assert(fs.existsSync(path.resolve(destino)), `${arquivo}: referência inexistente ${destino}`);
  }
}
for (const arquivo of fs.readdirSync('Script - Java').filter(nome => nome.endsWith('.js'))) {
  execFileSync(process.execPath, ['--check', path.join('Script - Java', arquivo)], { stdio: 'pipe' });
}
console.log('OK: política de senha, calendário e sequência, IDs, referências locais, importmaps e sintaxe de todos os scripts.');
