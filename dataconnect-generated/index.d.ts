import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AlternativaQuiz_Key {
  id: UUIDString;
  __typename?: 'AlternativaQuiz_Key';
}

export interface AtualizarNomeUsuarioData {
  usuario_updateMany: number;
}

export interface AtualizarNomeUsuarioVariables {
  nome: string;
}

export interface BuscarCursoData {
  curso?: {
    id: UUIDString;
    nome: string;
    descricao?: string | null;
    dificuldade: string;
    cargaHoraria: number;
    imagem?: string | null;
    icone?: string | null;
    ativo?: boolean | null;
    publicado?: boolean | null;
  } & Curso_Key;
}

export interface BuscarCursoVariables {
  id: UUIDString;
}

export interface BuscarQuizDoModuloData {
  quizzes: ({
    id: UUIDString;
    tipo: string;
    moduloId?: UUIDString | null;
  } & Quiz_Key)[];
}

export interface BuscarQuizDoModuloVariables {
  moduloId: UUIDString;
}

export interface CadastrarUsuarioData {
  usuario_insert: Usuario_Key;
}

export interface CadastrarUsuarioVariables {
  nome: string;
  email: string;
}

export interface Certificado_Key {
  usuarioId: UUIDString;
  cursoId: UUIDString;
  __typename?: 'Certificado_Key';
}

export interface ConteudoModulo_Key {
  id: UUIDString;
  __typename?: 'ConteudoModulo_Key';
}

export interface CriarAlternativaQuizData {
  alternativaQuiz_insert: AlternativaQuiz_Key;
}

export interface CriarAlternativaQuizVariables {
  questaoId: UUIDString;
  texto: string;
  correta: boolean;
  explicacao?: string | null;
  ordem: number;
}

export interface CriarConteudoModuloData {
  conteudoModulo_insert: ConteudoModulo_Key;
}

export interface CriarConteudoModuloVariables {
  moduloId: UUIDString;
  tipo: string;
  titulo?: string | null;
  conteudo?: string | null;
  url?: string | null;
  altTexto?: string | null;
  ordem: number;
}

export interface CriarCursoData {
  curso_insert: Curso_Key;
}

export interface CriarCursoVariables {
  nome: string;
  descricao?: string | null;
  dificuldade: string;
  cargaHoraria: number;
  imagem?: string | null;
  icone?: string | null;
  ativo: boolean;
}

export interface CriarModuloData {
  modulo_insert: Modulo_Key;
}

export interface CriarModuloVariables {
  cursoId: UUIDString;
  nome: string;
  descricao?: string | null;
  ordem: number;
  duracaoMinutos?: number | null;
  imagem?: string | null;
}

export interface CriarQuestaoQuizData {
  questaoQuiz_insert: QuestaoQuiz_Key;
}

export interface CriarQuestaoQuizVariables {
  quizId: UUIDString;
  pergunta: string;
  ordem: number;
}

export interface CriarQuizData {
  quiz_insert: Quiz_Key;
}

export interface CriarQuizVariables {
  cursoId: UUIDString;
  moduloId?: UUIDString | null;
  tipo: string;
}

export interface Curso_Key {
  id: UUIDString;
  __typename?: 'Curso_Key';
}

export interface EditarAlternativaQuizData {
  alternativaQuiz_update?: AlternativaQuiz_Key | null;
}

export interface EditarAlternativaQuizVariables {
  id: UUIDString;
  texto: string;
  correta: boolean;
  explicacao?: string | null;
  ordem: number;
}

export interface EditarConteudoModuloData {
  conteudoModulo_update?: ConteudoModulo_Key | null;
}

export interface EditarConteudoModuloVariables {
  id: UUIDString;
  tipo: string;
  titulo?: string | null;
  conteudo?: string | null;
  url?: string | null;
  altTexto?: string | null;
  ordem: number;
}

export interface EditarCursoData {
  curso_update?: Curso_Key | null;
}

export interface EditarCursoVariables {
  id: UUIDString;
  nome: string;
  descricao?: string | null;
  dificuldade: string;
  cargaHoraria: number;
  imagem?: string | null;
  icone?: string | null;
  ativo: boolean;
  publicado: boolean;
}

export interface EditarModuloData {
  modulo_update?: Modulo_Key | null;
}

export interface EditarModuloVariables {
  id: UUIDString;
  nome: string;
  descricao?: string | null;
  ordem: number;
  duracaoMinutos?: number | null;
  imagem?: string | null;
}

export interface EditarQuestaoQuizData {
  questaoQuiz_update?: QuestaoQuiz_Key | null;
}

export interface EditarQuestaoQuizVariables {
  id: UUIDString;
  pergunta: string;
  ordem: number;
}

export interface EditarQuizData {
  quiz_update?: Quiz_Key | null;
}

export interface EditarQuizVariables {
  id: UUIDString;
  tipo: string;
}

export interface ExcluirCursoData {
  curso_delete?: Curso_Key | null;
}

export interface ExcluirCursoVariables {
  id: UUIDString;
}

export interface ExcluirUsuarioPorEmailData {
  usuario_deleteMany: number;
}

export interface ExcluirUsuarioPorEmailVariables {
  email: string;
}

export interface ListarAlternativasDaQuestaoData {
  alternativaQuizs: ({
    id: UUIDString;
    texto: string;
    correta: boolean;
    explicacao?: string | null;
    ordem: number;
  } & AlternativaQuiz_Key)[];
}

export interface ListarAlternativasDaQuestaoVariables {
  questaoId: UUIDString;
}

export interface ListarConteudosDoModuloData {
  conteudoModulos: ({
    id: UUIDString;
    tipo: string;
    titulo?: string | null;
    conteudo?: string | null;
    url?: string | null;
    altTexto?: string | null;
    ordem: number;
  } & ConteudoModulo_Key)[];
}

export interface ListarConteudosDoModuloVariables {
  moduloId: UUIDString;
}

export interface ListarCursosAdminData {
  cursos: ({
    id: UUIDString;
    nome: string;
    descricao?: string | null;
    dificuldade: string;
    cargaHoraria: number;
    imagem?: string | null;
    icone?: string | null;
    ativo?: boolean | null;
    publicado?: boolean | null;
    criadoEm?: TimestampString | null;
    atualizadoEm?: TimestampString | null;
  } & Curso_Key)[];
}

export interface ListarCursosData {
  cursos: ({
    id: UUIDString;
    nome: string;
    descricao?: string | null;
    dificuldade: string;
    cargaHoraria: number;
    imagem?: string | null;
    icone?: string | null;
    ativo?: boolean | null;
    publicado?: boolean | null;
  } & Curso_Key)[];
}

export interface ListarModulosDoCursoData {
  modulos: ({
    id: UUIDString;
    nome: string;
    descricao?: string | null;
    ordem: number;
    duracaoMinutos?: number | null;
    imagem?: string | null;
  } & Modulo_Key)[];
}

export interface ListarModulosDoCursoVariables {
  cursoId: UUIDString;
}

export interface ListarQuestoesDoQuizData {
  questaoQuizs: ({
    id: UUIDString;
    pergunta: string;
    ordem: number;
  } & QuestaoQuiz_Key)[];
}

export interface ListarQuestoesDoQuizVariables {
  quizId: UUIDString;
}

export interface MeuPerfilData {
  usuarios: ({
    id: UUIDString;
    firebaseUid: string;
    nome: string;
    email: string;
    dataNascimento?: DateString | null;
    fotoPerfil?: string | null;
    tipoUsuario: {
      id: UUIDString;
      nome: string;
    } & TipoUsuario_Key;
  } & Usuario_Key)[];
}

export interface Modulo_Key {
  id: UUIDString;
  __typename?: 'Modulo_Key';
}

export interface QuestaoQuiz_Key {
  id: UUIDString;
  __typename?: 'QuestaoQuiz_Key';
}

export interface Quiz_Key {
  id: UUIDString;
  __typename?: 'Quiz_Key';
}

export interface StatusCurso_Key {
  id: UUIDString;
  __typename?: 'StatusCurso_Key';
}

export interface StatusModulo_Key {
  id: UUIDString;
  __typename?: 'StatusModulo_Key';
}

export interface TipoUsuario_Key {
  id: UUIDString;
  __typename?: 'TipoUsuario_Key';
}

export interface UsuarioCurso_Key {
  usuarioId: UUIDString;
  cursoId: UUIDString;
  __typename?: 'UsuarioCurso_Key';
}

export interface UsuarioModulo_Key {
  usuarioId: UUIDString;
  moduloId: UUIDString;
  __typename?: 'UsuarioModulo_Key';
}

export interface Usuario_Key {
  id: UUIDString;
  __typename?: 'Usuario_Key';
}

interface ListarCursosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListarCursosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListarCursosData, undefined>;
  operationName: string;
}
export const listarCursosRef: ListarCursosRef;

export function listarCursos(options?: ExecuteQueryOptions): QueryPromise<ListarCursosData, undefined>;
export function listarCursos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListarCursosData, undefined>;

interface BuscarCursoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BuscarCursoVariables): QueryRef<BuscarCursoData, BuscarCursoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BuscarCursoVariables): QueryRef<BuscarCursoData, BuscarCursoVariables>;
  operationName: string;
}
export const buscarCursoRef: BuscarCursoRef;

export function buscarCurso(vars: BuscarCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarCursoData, BuscarCursoVariables>;
export function buscarCurso(dc: DataConnect, vars: BuscarCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarCursoData, BuscarCursoVariables>;

interface ListarModulosDoCursoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarModulosDoCursoVariables): QueryRef<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListarModulosDoCursoVariables): QueryRef<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;
  operationName: string;
}
export const listarModulosDoCursoRef: ListarModulosDoCursoRef;

export function listarModulosDoCurso(vars: ListarModulosDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;
export function listarModulosDoCurso(dc: DataConnect, vars: ListarModulosDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;

interface ListarConteudosDoModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarConteudosDoModuloVariables): QueryRef<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListarConteudosDoModuloVariables): QueryRef<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;
  operationName: string;
}
export const listarConteudosDoModuloRef: ListarConteudosDoModuloRef;

export function listarConteudosDoModulo(vars: ListarConteudosDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;
export function listarConteudosDoModulo(dc: DataConnect, vars: ListarConteudosDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;

interface CriarCursoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarCursoVariables): MutationRef<CriarCursoData, CriarCursoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarCursoVariables): MutationRef<CriarCursoData, CriarCursoVariables>;
  operationName: string;
}
export const criarCursoRef: CriarCursoRef;

export function criarCurso(vars: CriarCursoVariables): MutationPromise<CriarCursoData, CriarCursoVariables>;
export function criarCurso(dc: DataConnect, vars: CriarCursoVariables): MutationPromise<CriarCursoData, CriarCursoVariables>;

interface CriarModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarModuloVariables): MutationRef<CriarModuloData, CriarModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarModuloVariables): MutationRef<CriarModuloData, CriarModuloVariables>;
  operationName: string;
}
export const criarModuloRef: CriarModuloRef;

export function criarModulo(vars: CriarModuloVariables): MutationPromise<CriarModuloData, CriarModuloVariables>;
export function criarModulo(dc: DataConnect, vars: CriarModuloVariables): MutationPromise<CriarModuloData, CriarModuloVariables>;

interface CriarConteudoModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarConteudoModuloVariables): MutationRef<CriarConteudoModuloData, CriarConteudoModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarConteudoModuloVariables): MutationRef<CriarConteudoModuloData, CriarConteudoModuloVariables>;
  operationName: string;
}
export const criarConteudoModuloRef: CriarConteudoModuloRef;

export function criarConteudoModulo(vars: CriarConteudoModuloVariables): MutationPromise<CriarConteudoModuloData, CriarConteudoModuloVariables>;
export function criarConteudoModulo(dc: DataConnect, vars: CriarConteudoModuloVariables): MutationPromise<CriarConteudoModuloData, CriarConteudoModuloVariables>;

interface BuscarQuizDoModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BuscarQuizDoModuloVariables): QueryRef<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BuscarQuizDoModuloVariables): QueryRef<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;
  operationName: string;
}
export const buscarQuizDoModuloRef: BuscarQuizDoModuloRef;

export function buscarQuizDoModulo(vars: BuscarQuizDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;
export function buscarQuizDoModulo(dc: DataConnect, vars: BuscarQuizDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;

interface ListarQuestoesDoQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarQuestoesDoQuizVariables): QueryRef<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListarQuestoesDoQuizVariables): QueryRef<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;
  operationName: string;
}
export const listarQuestoesDoQuizRef: ListarQuestoesDoQuizRef;

export function listarQuestoesDoQuiz(vars: ListarQuestoesDoQuizVariables, options?: ExecuteQueryOptions): QueryPromise<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;
export function listarQuestoesDoQuiz(dc: DataConnect, vars: ListarQuestoesDoQuizVariables, options?: ExecuteQueryOptions): QueryPromise<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;

interface ListarAlternativasDaQuestaoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarAlternativasDaQuestaoVariables): QueryRef<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListarAlternativasDaQuestaoVariables): QueryRef<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;
  operationName: string;
}
export const listarAlternativasDaQuestaoRef: ListarAlternativasDaQuestaoRef;

export function listarAlternativasDaQuestao(vars: ListarAlternativasDaQuestaoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;
export function listarAlternativasDaQuestao(dc: DataConnect, vars: ListarAlternativasDaQuestaoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;

interface ListarCursosAdminRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListarCursosAdminData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListarCursosAdminData, undefined>;
  operationName: string;
}
export const listarCursosAdminRef: ListarCursosAdminRef;

export function listarCursosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListarCursosAdminData, undefined>;
export function listarCursosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListarCursosAdminData, undefined>;

interface EditarCursoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarCursoVariables): MutationRef<EditarCursoData, EditarCursoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarCursoVariables): MutationRef<EditarCursoData, EditarCursoVariables>;
  operationName: string;
}
export const editarCursoRef: EditarCursoRef;

export function editarCurso(vars: EditarCursoVariables): MutationPromise<EditarCursoData, EditarCursoVariables>;
export function editarCurso(dc: DataConnect, vars: EditarCursoVariables): MutationPromise<EditarCursoData, EditarCursoVariables>;

interface EditarModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarModuloVariables): MutationRef<EditarModuloData, EditarModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarModuloVariables): MutationRef<EditarModuloData, EditarModuloVariables>;
  operationName: string;
}
export const editarModuloRef: EditarModuloRef;

export function editarModulo(vars: EditarModuloVariables): MutationPromise<EditarModuloData, EditarModuloVariables>;
export function editarModulo(dc: DataConnect, vars: EditarModuloVariables): MutationPromise<EditarModuloData, EditarModuloVariables>;

interface EditarConteudoModuloRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarConteudoModuloVariables): MutationRef<EditarConteudoModuloData, EditarConteudoModuloVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarConteudoModuloVariables): MutationRef<EditarConteudoModuloData, EditarConteudoModuloVariables>;
  operationName: string;
}
export const editarConteudoModuloRef: EditarConteudoModuloRef;

export function editarConteudoModulo(vars: EditarConteudoModuloVariables): MutationPromise<EditarConteudoModuloData, EditarConteudoModuloVariables>;
export function editarConteudoModulo(dc: DataConnect, vars: EditarConteudoModuloVariables): MutationPromise<EditarConteudoModuloData, EditarConteudoModuloVariables>;

interface CriarQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarQuizVariables): MutationRef<CriarQuizData, CriarQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarQuizVariables): MutationRef<CriarQuizData, CriarQuizVariables>;
  operationName: string;
}
export const criarQuizRef: CriarQuizRef;

export function criarQuiz(vars: CriarQuizVariables): MutationPromise<CriarQuizData, CriarQuizVariables>;
export function criarQuiz(dc: DataConnect, vars: CriarQuizVariables): MutationPromise<CriarQuizData, CriarQuizVariables>;

interface EditarQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarQuizVariables): MutationRef<EditarQuizData, EditarQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarQuizVariables): MutationRef<EditarQuizData, EditarQuizVariables>;
  operationName: string;
}
export const editarQuizRef: EditarQuizRef;

export function editarQuiz(vars: EditarQuizVariables): MutationPromise<EditarQuizData, EditarQuizVariables>;
export function editarQuiz(dc: DataConnect, vars: EditarQuizVariables): MutationPromise<EditarQuizData, EditarQuizVariables>;

interface CriarQuestaoQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarQuestaoQuizVariables): MutationRef<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarQuestaoQuizVariables): MutationRef<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;
  operationName: string;
}
export const criarQuestaoQuizRef: CriarQuestaoQuizRef;

export function criarQuestaoQuiz(vars: CriarQuestaoQuizVariables): MutationPromise<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;
export function criarQuestaoQuiz(dc: DataConnect, vars: CriarQuestaoQuizVariables): MutationPromise<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;

interface EditarQuestaoQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarQuestaoQuizVariables): MutationRef<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarQuestaoQuizVariables): MutationRef<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;
  operationName: string;
}
export const editarQuestaoQuizRef: EditarQuestaoQuizRef;

export function editarQuestaoQuiz(vars: EditarQuestaoQuizVariables): MutationPromise<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;
export function editarQuestaoQuiz(dc: DataConnect, vars: EditarQuestaoQuizVariables): MutationPromise<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;

interface CriarAlternativaQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarAlternativaQuizVariables): MutationRef<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CriarAlternativaQuizVariables): MutationRef<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;
  operationName: string;
}
export const criarAlternativaQuizRef: CriarAlternativaQuizRef;

export function criarAlternativaQuiz(vars: CriarAlternativaQuizVariables): MutationPromise<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;
export function criarAlternativaQuiz(dc: DataConnect, vars: CriarAlternativaQuizVariables): MutationPromise<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;

interface EditarAlternativaQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarAlternativaQuizVariables): MutationRef<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EditarAlternativaQuizVariables): MutationRef<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;
  operationName: string;
}
export const editarAlternativaQuizRef: EditarAlternativaQuizRef;

export function editarAlternativaQuiz(vars: EditarAlternativaQuizVariables): MutationPromise<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;
export function editarAlternativaQuiz(dc: DataConnect, vars: EditarAlternativaQuizVariables): MutationPromise<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;

interface ExcluirCursoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirCursoVariables): MutationRef<ExcluirCursoData, ExcluirCursoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ExcluirCursoVariables): MutationRef<ExcluirCursoData, ExcluirCursoVariables>;
  operationName: string;
}
export const excluirCursoRef: ExcluirCursoRef;

export function excluirCurso(vars: ExcluirCursoVariables): MutationPromise<ExcluirCursoData, ExcluirCursoVariables>;
export function excluirCurso(dc: DataConnect, vars: ExcluirCursoVariables): MutationPromise<ExcluirCursoData, ExcluirCursoVariables>;

interface CadastrarUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CadastrarUsuarioVariables): MutationRef<CadastrarUsuarioData, CadastrarUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CadastrarUsuarioVariables): MutationRef<CadastrarUsuarioData, CadastrarUsuarioVariables>;
  operationName: string;
}
export const cadastrarUsuarioRef: CadastrarUsuarioRef;

export function cadastrarUsuario(vars: CadastrarUsuarioVariables): MutationPromise<CadastrarUsuarioData, CadastrarUsuarioVariables>;
export function cadastrarUsuario(dc: DataConnect, vars: CadastrarUsuarioVariables): MutationPromise<CadastrarUsuarioData, CadastrarUsuarioVariables>;

interface MeuPerfilRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<MeuPerfilData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<MeuPerfilData, undefined>;
  operationName: string;
}
export const meuPerfilRef: MeuPerfilRef;

export function meuPerfil(options?: ExecuteQueryOptions): QueryPromise<MeuPerfilData, undefined>;
export function meuPerfil(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<MeuPerfilData, undefined>;

interface ExcluirUsuarioPorEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirUsuarioPorEmailVariables): MutationRef<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ExcluirUsuarioPorEmailVariables): MutationRef<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;
  operationName: string;
}
export const excluirUsuarioPorEmailRef: ExcluirUsuarioPorEmailRef;

export function excluirUsuarioPorEmail(vars: ExcluirUsuarioPorEmailVariables): MutationPromise<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;
export function excluirUsuarioPorEmail(dc: DataConnect, vars: ExcluirUsuarioPorEmailVariables): MutationPromise<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;

interface AtualizarNomeUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AtualizarNomeUsuarioVariables): MutationRef<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AtualizarNomeUsuarioVariables): MutationRef<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;
  operationName: string;
}
export const atualizarNomeUsuarioRef: AtualizarNomeUsuarioRef;

export function atualizarNomeUsuario(vars: AtualizarNomeUsuarioVariables): MutationPromise<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;
export function atualizarNomeUsuario(dc: DataConnect, vars: AtualizarNomeUsuarioVariables): MutationPromise<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;

