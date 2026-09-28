import { auth } from './Firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { QueryFetchPolicy } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-data-connect.js';
import { meuPerfil, buscarCurso } from '../dataconnect-generated/esm/index.esm.js';
import { iniciarEditorQuiz } from './AdminQuiz.js';

const cursoId = new URLSearchParams(window.location.search).get('cursoId');
const valido = /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(cursoId || '');
if (!valido) {
  alert('Curso não informado ou inválido.');
  window.location.href = 'Admin.html';
}

onAuthStateChanged(auth, async usuario => {
  if (!valido) return;
  if (!usuario) { window.location.href = 'Login.html'; return; }
  try {
    const perfil = (await meuPerfil()).data.usuarios?.[0];
    if (perfil?.tipoUsuario?.nome !== 'Administrador') {
      alert('Você não possui permissão para acessar o painel administrativo.');
      window.location.href = 'index.html';
      return;
    }
    const curso = (await buscarCurso({id: cursoId}, {fetchPolicy: QueryFetchPolicy.SERVER_ONLY})).data.curso;
    if (!curso) { alert('Curso não encontrado.'); window.location.href = 'Admin.html'; return; }
    const voltar = `AdminModulos.html?cursoId=${encodeURIComponent(cursoId)}`;
    document.getElementById('linkVoltarModulos').href = voltar;
    document.getElementById('btnVoltarModulos').href = voltar;
    document.getElementById('trilhaModulo').textContent = `${curso.nome} > Teste final`;
    document.getElementById('descricaoModuloAdmin').textContent = curso.nome;
    document.title = `Teste final — ${curso.nome} | TechSênior`;
    await iniciarEditorQuiz({cursoId});
  } catch (erro) {
    console.error('Erro ao carregar teste final:', erro);
    document.getElementById('estadoQuiz').textContent = 'Não foi possível carregar o teste final. Atualize a página para tentar novamente.';
  }
});
