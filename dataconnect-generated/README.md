# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListarCursos*](#listarcursos)
  - [*BuscarCurso*](#buscarcurso)
  - [*ListarModulosDoCurso*](#listarmodulosdocurso)
  - [*ListarConteudosDoModulo*](#listarconteudosdomodulo)
  - [*MeuPerfil*](#meuperfil)
- [**Mutations**](#mutations)
  - [*CadastrarUsuario*](#cadastrarusuario)
  - [*ExcluirUsuarioPorEmail*](#excluirusuarioporemail)
  - [*AtualizarNomeUsuario*](#atualizarnomeusuario)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListarCursos
You can execute the `ListarCursos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarCursos(options?: ExecuteQueryOptions): QueryPromise<ListarCursosData, undefined>;

interface ListarCursosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListarCursosData, undefined>;
}
export const listarCursosRef: ListarCursosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarCursos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListarCursosData, undefined>;

interface ListarCursosRef {
  ...
  (dc: DataConnect): QueryRef<ListarCursosData, undefined>;
}
export const listarCursosRef: ListarCursosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarCursosRef:
```typescript
const name = listarCursosRef.operationName;
console.log(name);
```

### Variables
The `ListarCursos` query has no variables.
### Return Type
Recall that executing the `ListarCursos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarCursosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
  } & Curso_Key)[];
}
```
### Using `ListarCursos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarCursos } from '@dataconnect/generated';


// Call the `listarCursos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarCursos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarCursos(dataConnect);

console.log(data.cursos);

// Or, you can use the `Promise` API.
listarCursos().then((response) => {
  const data = response.data;
  console.log(data.cursos);
});
```

### Using `ListarCursos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarCursosRef } from '@dataconnect/generated';


// Call the `listarCursosRef()` function to get a reference to the query.
const ref = listarCursosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarCursosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cursos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cursos);
});
```

## BuscarCurso
You can execute the `BuscarCurso` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
buscarCurso(vars: BuscarCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarCursoData, BuscarCursoVariables>;

interface BuscarCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BuscarCursoVariables): QueryRef<BuscarCursoData, BuscarCursoVariables>;
}
export const buscarCursoRef: BuscarCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
buscarCurso(dc: DataConnect, vars: BuscarCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarCursoData, BuscarCursoVariables>;

interface BuscarCursoRef {
  ...
  (dc: DataConnect, vars: BuscarCursoVariables): QueryRef<BuscarCursoData, BuscarCursoVariables>;
}
export const buscarCursoRef: BuscarCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the buscarCursoRef:
```typescript
const name = buscarCursoRef.operationName;
console.log(name);
```

### Variables
The `BuscarCurso` query requires an argument of type `BuscarCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BuscarCursoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `BuscarCurso` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BuscarCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
  } & Curso_Key;
}
```
### Using `BuscarCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, buscarCurso, BuscarCursoVariables } from '@dataconnect/generated';

// The `BuscarCurso` query requires an argument of type `BuscarCursoVariables`:
const buscarCursoVars: BuscarCursoVariables = {
  id: ..., 
};

// Call the `buscarCurso()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await buscarCurso(buscarCursoVars);
// Variables can be defined inline as well.
const { data } = await buscarCurso({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await buscarCurso(dataConnect, buscarCursoVars);

console.log(data.curso);

// Or, you can use the `Promise` API.
buscarCurso(buscarCursoVars).then((response) => {
  const data = response.data;
  console.log(data.curso);
});
```

### Using `BuscarCurso`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, buscarCursoRef, BuscarCursoVariables } from '@dataconnect/generated';

// The `BuscarCurso` query requires an argument of type `BuscarCursoVariables`:
const buscarCursoVars: BuscarCursoVariables = {
  id: ..., 
};

// Call the `buscarCursoRef()` function to get a reference to the query.
const ref = buscarCursoRef(buscarCursoVars);
// Variables can be defined inline as well.
const ref = buscarCursoRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = buscarCursoRef(dataConnect, buscarCursoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.curso);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.curso);
});
```

## ListarModulosDoCurso
You can execute the `ListarModulosDoCurso` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarModulosDoCurso(vars: ListarModulosDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;

interface ListarModulosDoCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarModulosDoCursoVariables): QueryRef<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;
}
export const listarModulosDoCursoRef: ListarModulosDoCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarModulosDoCurso(dc: DataConnect, vars: ListarModulosDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;

interface ListarModulosDoCursoRef {
  ...
  (dc: DataConnect, vars: ListarModulosDoCursoVariables): QueryRef<ListarModulosDoCursoData, ListarModulosDoCursoVariables>;
}
export const listarModulosDoCursoRef: ListarModulosDoCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarModulosDoCursoRef:
```typescript
const name = listarModulosDoCursoRef.operationName;
console.log(name);
```

### Variables
The `ListarModulosDoCurso` query requires an argument of type `ListarModulosDoCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListarModulosDoCursoVariables {
  cursoId: UUIDString;
}
```
### Return Type
Recall that executing the `ListarModulosDoCurso` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarModulosDoCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListarModulosDoCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarModulosDoCurso, ListarModulosDoCursoVariables } from '@dataconnect/generated';

// The `ListarModulosDoCurso` query requires an argument of type `ListarModulosDoCursoVariables`:
const listarModulosDoCursoVars: ListarModulosDoCursoVariables = {
  cursoId: ..., 
};

// Call the `listarModulosDoCurso()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarModulosDoCurso(listarModulosDoCursoVars);
// Variables can be defined inline as well.
const { data } = await listarModulosDoCurso({ cursoId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarModulosDoCurso(dataConnect, listarModulosDoCursoVars);

console.log(data.modulos);

// Or, you can use the `Promise` API.
listarModulosDoCurso(listarModulosDoCursoVars).then((response) => {
  const data = response.data;
  console.log(data.modulos);
});
```

### Using `ListarModulosDoCurso`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarModulosDoCursoRef, ListarModulosDoCursoVariables } from '@dataconnect/generated';

// The `ListarModulosDoCurso` query requires an argument of type `ListarModulosDoCursoVariables`:
const listarModulosDoCursoVars: ListarModulosDoCursoVariables = {
  cursoId: ..., 
};

// Call the `listarModulosDoCursoRef()` function to get a reference to the query.
const ref = listarModulosDoCursoRef(listarModulosDoCursoVars);
// Variables can be defined inline as well.
const ref = listarModulosDoCursoRef({ cursoId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarModulosDoCursoRef(dataConnect, listarModulosDoCursoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.modulos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.modulos);
});
```

## ListarConteudosDoModulo
You can execute the `ListarConteudosDoModulo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarConteudosDoModulo(vars: ListarConteudosDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;

interface ListarConteudosDoModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarConteudosDoModuloVariables): QueryRef<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;
}
export const listarConteudosDoModuloRef: ListarConteudosDoModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarConteudosDoModulo(dc: DataConnect, vars: ListarConteudosDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;

interface ListarConteudosDoModuloRef {
  ...
  (dc: DataConnect, vars: ListarConteudosDoModuloVariables): QueryRef<ListarConteudosDoModuloData, ListarConteudosDoModuloVariables>;
}
export const listarConteudosDoModuloRef: ListarConteudosDoModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarConteudosDoModuloRef:
```typescript
const name = listarConteudosDoModuloRef.operationName;
console.log(name);
```

### Variables
The `ListarConteudosDoModulo` query requires an argument of type `ListarConteudosDoModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListarConteudosDoModuloVariables {
  moduloId: UUIDString;
}
```
### Return Type
Recall that executing the `ListarConteudosDoModulo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarConteudosDoModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListarConteudosDoModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarConteudosDoModulo, ListarConteudosDoModuloVariables } from '@dataconnect/generated';

// The `ListarConteudosDoModulo` query requires an argument of type `ListarConteudosDoModuloVariables`:
const listarConteudosDoModuloVars: ListarConteudosDoModuloVariables = {
  moduloId: ..., 
};

// Call the `listarConteudosDoModulo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarConteudosDoModulo(listarConteudosDoModuloVars);
// Variables can be defined inline as well.
const { data } = await listarConteudosDoModulo({ moduloId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarConteudosDoModulo(dataConnect, listarConteudosDoModuloVars);

console.log(data.conteudoModulos);

// Or, you can use the `Promise` API.
listarConteudosDoModulo(listarConteudosDoModuloVars).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulos);
});
```

### Using `ListarConteudosDoModulo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarConteudosDoModuloRef, ListarConteudosDoModuloVariables } from '@dataconnect/generated';

// The `ListarConteudosDoModulo` query requires an argument of type `ListarConteudosDoModuloVariables`:
const listarConteudosDoModuloVars: ListarConteudosDoModuloVariables = {
  moduloId: ..., 
};

// Call the `listarConteudosDoModuloRef()` function to get a reference to the query.
const ref = listarConteudosDoModuloRef(listarConteudosDoModuloVars);
// Variables can be defined inline as well.
const ref = listarConteudosDoModuloRef({ moduloId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarConteudosDoModuloRef(dataConnect, listarConteudosDoModuloVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conteudoModulos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulos);
});
```

## MeuPerfil
You can execute the `MeuPerfil` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
meuPerfil(options?: ExecuteQueryOptions): QueryPromise<MeuPerfilData, undefined>;

interface MeuPerfilRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<MeuPerfilData, undefined>;
}
export const meuPerfilRef: MeuPerfilRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
meuPerfil(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<MeuPerfilData, undefined>;

interface MeuPerfilRef {
  ...
  (dc: DataConnect): QueryRef<MeuPerfilData, undefined>;
}
export const meuPerfilRef: MeuPerfilRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the meuPerfilRef:
```typescript
const name = meuPerfilRef.operationName;
console.log(name);
```

### Variables
The `MeuPerfil` query has no variables.
### Return Type
Recall that executing the `MeuPerfil` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MeuPerfilData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `MeuPerfil`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, meuPerfil } from '@dataconnect/generated';


// Call the `meuPerfil()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await meuPerfil();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await meuPerfil(dataConnect);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
meuPerfil().then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

### Using `MeuPerfil`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, meuPerfilRef } from '@dataconnect/generated';


// Call the `meuPerfilRef()` function to get a reference to the query.
const ref = meuPerfilRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = meuPerfilRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CadastrarUsuario
You can execute the `CadastrarUsuario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
cadastrarUsuario(vars: CadastrarUsuarioVariables): MutationPromise<CadastrarUsuarioData, CadastrarUsuarioVariables>;

interface CadastrarUsuarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CadastrarUsuarioVariables): MutationRef<CadastrarUsuarioData, CadastrarUsuarioVariables>;
}
export const cadastrarUsuarioRef: CadastrarUsuarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cadastrarUsuario(dc: DataConnect, vars: CadastrarUsuarioVariables): MutationPromise<CadastrarUsuarioData, CadastrarUsuarioVariables>;

interface CadastrarUsuarioRef {
  ...
  (dc: DataConnect, vars: CadastrarUsuarioVariables): MutationRef<CadastrarUsuarioData, CadastrarUsuarioVariables>;
}
export const cadastrarUsuarioRef: CadastrarUsuarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cadastrarUsuarioRef:
```typescript
const name = cadastrarUsuarioRef.operationName;
console.log(name);
```

### Variables
The `CadastrarUsuario` mutation requires an argument of type `CadastrarUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CadastrarUsuarioVariables {
  nome: string;
  email: string;
}
```
### Return Type
Recall that executing the `CadastrarUsuario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CadastrarUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CadastrarUsuarioData {
  usuario_insert: Usuario_Key;
}
```
### Using `CadastrarUsuario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cadastrarUsuario, CadastrarUsuarioVariables } from '@dataconnect/generated';

// The `CadastrarUsuario` mutation requires an argument of type `CadastrarUsuarioVariables`:
const cadastrarUsuarioVars: CadastrarUsuarioVariables = {
  nome: ..., 
  email: ..., 
};

// Call the `cadastrarUsuario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cadastrarUsuario(cadastrarUsuarioVars);
// Variables can be defined inline as well.
const { data } = await cadastrarUsuario({ nome: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cadastrarUsuario(dataConnect, cadastrarUsuarioVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
cadastrarUsuario(cadastrarUsuarioVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `CadastrarUsuario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cadastrarUsuarioRef, CadastrarUsuarioVariables } from '@dataconnect/generated';

// The `CadastrarUsuario` mutation requires an argument of type `CadastrarUsuarioVariables`:
const cadastrarUsuarioVars: CadastrarUsuarioVariables = {
  nome: ..., 
  email: ..., 
};

// Call the `cadastrarUsuarioRef()` function to get a reference to the mutation.
const ref = cadastrarUsuarioRef(cadastrarUsuarioVars);
// Variables can be defined inline as well.
const ref = cadastrarUsuarioRef({ nome: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cadastrarUsuarioRef(dataConnect, cadastrarUsuarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## ExcluirUsuarioPorEmail
You can execute the `ExcluirUsuarioPorEmail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirUsuarioPorEmail(vars: ExcluirUsuarioPorEmailVariables): MutationPromise<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;

interface ExcluirUsuarioPorEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirUsuarioPorEmailVariables): MutationRef<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;
}
export const excluirUsuarioPorEmailRef: ExcluirUsuarioPorEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirUsuarioPorEmail(dc: DataConnect, vars: ExcluirUsuarioPorEmailVariables): MutationPromise<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;

interface ExcluirUsuarioPorEmailRef {
  ...
  (dc: DataConnect, vars: ExcluirUsuarioPorEmailVariables): MutationRef<ExcluirUsuarioPorEmailData, ExcluirUsuarioPorEmailVariables>;
}
export const excluirUsuarioPorEmailRef: ExcluirUsuarioPorEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirUsuarioPorEmailRef:
```typescript
const name = excluirUsuarioPorEmailRef.operationName;
console.log(name);
```

### Variables
The `ExcluirUsuarioPorEmail` mutation requires an argument of type `ExcluirUsuarioPorEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirUsuarioPorEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `ExcluirUsuarioPorEmail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirUsuarioPorEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirUsuarioPorEmailData {
  usuario_deleteMany: number;
}
```
### Using `ExcluirUsuarioPorEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirUsuarioPorEmail, ExcluirUsuarioPorEmailVariables } from '@dataconnect/generated';

// The `ExcluirUsuarioPorEmail` mutation requires an argument of type `ExcluirUsuarioPorEmailVariables`:
const excluirUsuarioPorEmailVars: ExcluirUsuarioPorEmailVariables = {
  email: ..., 
};

// Call the `excluirUsuarioPorEmail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirUsuarioPorEmail(excluirUsuarioPorEmailVars);
// Variables can be defined inline as well.
const { data } = await excluirUsuarioPorEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirUsuarioPorEmail(dataConnect, excluirUsuarioPorEmailVars);

console.log(data.usuario_deleteMany);

// Or, you can use the `Promise` API.
excluirUsuarioPorEmail(excluirUsuarioPorEmailVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_deleteMany);
});
```

### Using `ExcluirUsuarioPorEmail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirUsuarioPorEmailRef, ExcluirUsuarioPorEmailVariables } from '@dataconnect/generated';

// The `ExcluirUsuarioPorEmail` mutation requires an argument of type `ExcluirUsuarioPorEmailVariables`:
const excluirUsuarioPorEmailVars: ExcluirUsuarioPorEmailVariables = {
  email: ..., 
};

// Call the `excluirUsuarioPorEmailRef()` function to get a reference to the mutation.
const ref = excluirUsuarioPorEmailRef(excluirUsuarioPorEmailVars);
// Variables can be defined inline as well.
const ref = excluirUsuarioPorEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirUsuarioPorEmailRef(dataConnect, excluirUsuarioPorEmailVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_deleteMany);
});
```

## AtualizarNomeUsuario
You can execute the `AtualizarNomeUsuario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
atualizarNomeUsuario(vars: AtualizarNomeUsuarioVariables): MutationPromise<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;

interface AtualizarNomeUsuarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AtualizarNomeUsuarioVariables): MutationRef<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;
}
export const atualizarNomeUsuarioRef: AtualizarNomeUsuarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
atualizarNomeUsuario(dc: DataConnect, vars: AtualizarNomeUsuarioVariables): MutationPromise<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;

interface AtualizarNomeUsuarioRef {
  ...
  (dc: DataConnect, vars: AtualizarNomeUsuarioVariables): MutationRef<AtualizarNomeUsuarioData, AtualizarNomeUsuarioVariables>;
}
export const atualizarNomeUsuarioRef: AtualizarNomeUsuarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the atualizarNomeUsuarioRef:
```typescript
const name = atualizarNomeUsuarioRef.operationName;
console.log(name);
```

### Variables
The `AtualizarNomeUsuario` mutation requires an argument of type `AtualizarNomeUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AtualizarNomeUsuarioVariables {
  nome: string;
}
```
### Return Type
Recall that executing the `AtualizarNomeUsuario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AtualizarNomeUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AtualizarNomeUsuarioData {
  usuario_updateMany: number;
}
```
### Using `AtualizarNomeUsuario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, atualizarNomeUsuario, AtualizarNomeUsuarioVariables } from '@dataconnect/generated';

// The `AtualizarNomeUsuario` mutation requires an argument of type `AtualizarNomeUsuarioVariables`:
const atualizarNomeUsuarioVars: AtualizarNomeUsuarioVariables = {
  nome: ..., 
};

// Call the `atualizarNomeUsuario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await atualizarNomeUsuario(atualizarNomeUsuarioVars);
// Variables can be defined inline as well.
const { data } = await atualizarNomeUsuario({ nome: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await atualizarNomeUsuario(dataConnect, atualizarNomeUsuarioVars);

console.log(data.usuario_updateMany);

// Or, you can use the `Promise` API.
atualizarNomeUsuario(atualizarNomeUsuarioVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_updateMany);
});
```

### Using `AtualizarNomeUsuario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, atualizarNomeUsuarioRef, AtualizarNomeUsuarioVariables } from '@dataconnect/generated';

// The `AtualizarNomeUsuario` mutation requires an argument of type `AtualizarNomeUsuarioVariables`:
const atualizarNomeUsuarioVars: AtualizarNomeUsuarioVariables = {
  nome: ..., 
};

// Call the `atualizarNomeUsuarioRef()` function to get a reference to the mutation.
const ref = atualizarNomeUsuarioRef(atualizarNomeUsuarioVars);
// Variables can be defined inline as well.
const ref = atualizarNomeUsuarioRef({ nome: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = atualizarNomeUsuarioRef(dataConnect, atualizarNomeUsuarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_updateMany);
});
```

