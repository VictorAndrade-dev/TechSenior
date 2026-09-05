import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




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

export interface Curso_Key {
  id: UUIDString;
  __typename?: 'Curso_Key';
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

