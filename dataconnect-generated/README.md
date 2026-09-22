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
  - [*BuscarQuizDoModulo*](#buscarquizdomodulo)
  - [*ListarQuestoesDoQuiz*](#listarquestoesdoquiz)
  - [*ListarAlternativasDaQuestao*](#listaralternativasdaquestao)
  - [*ListarCursosAdmin*](#listarcursosadmin)
  - [*BuscarQuizFinalDoCurso*](#buscarquizfinaldocurso)
  - [*MeuPerfil*](#meuperfil)
- [**Mutations**](#mutations)
  - [*CriarCurso*](#criarcurso)
  - [*CriarModulo*](#criarmodulo)
  - [*CriarConteudoModulo*](#criarconteudomodulo)
  - [*EditarCurso*](#editarcurso)
  - [*EditarModulo*](#editarmodulo)
  - [*EditarConteudoModulo*](#editarconteudomodulo)
  - [*CriarQuiz*](#criarquiz)
  - [*EditarQuiz*](#editarquiz)
  - [*CriarQuestaoQuiz*](#criarquestaoquiz)
  - [*EditarQuestaoQuiz*](#editarquestaoquiz)
  - [*CriarAlternativaQuiz*](#criaralternativaquiz)
  - [*EditarAlternativaQuiz*](#editaralternativaquiz)
  - [*ExcluirCurso*](#excluircurso)
  - [*ExcluirConteudoModulo*](#excluirconteudomodulo)
  - [*ExcluirAlternativaQuiz*](#excluiralternativaquiz)
  - [*ExcluirQuestaoQuiz*](#excluirquestaoquiz)
  - [*ExcluirModulo*](#excluirmodulo)
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
    publicado?: boolean | null;
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
    publicado?: boolean | null;
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

## BuscarQuizDoModulo
You can execute the `BuscarQuizDoModulo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
buscarQuizDoModulo(vars: BuscarQuizDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;

interface BuscarQuizDoModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BuscarQuizDoModuloVariables): QueryRef<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;
}
export const buscarQuizDoModuloRef: BuscarQuizDoModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
buscarQuizDoModulo(dc: DataConnect, vars: BuscarQuizDoModuloVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;

interface BuscarQuizDoModuloRef {
  ...
  (dc: DataConnect, vars: BuscarQuizDoModuloVariables): QueryRef<BuscarQuizDoModuloData, BuscarQuizDoModuloVariables>;
}
export const buscarQuizDoModuloRef: BuscarQuizDoModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the buscarQuizDoModuloRef:
```typescript
const name = buscarQuizDoModuloRef.operationName;
console.log(name);
```

### Variables
The `BuscarQuizDoModulo` query requires an argument of type `BuscarQuizDoModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BuscarQuizDoModuloVariables {
  moduloId: UUIDString;
}
```
### Return Type
Recall that executing the `BuscarQuizDoModulo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BuscarQuizDoModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BuscarQuizDoModuloData {
  quizzes: ({
    id: UUIDString;
    tipo: string;
    moduloId?: UUIDString | null;
  } & Quiz_Key)[];
}
```
### Using `BuscarQuizDoModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, buscarQuizDoModulo, BuscarQuizDoModuloVariables } from '@dataconnect/generated';

// The `BuscarQuizDoModulo` query requires an argument of type `BuscarQuizDoModuloVariables`:
const buscarQuizDoModuloVars: BuscarQuizDoModuloVariables = {
  moduloId: ..., 
};

// Call the `buscarQuizDoModulo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await buscarQuizDoModulo(buscarQuizDoModuloVars);
// Variables can be defined inline as well.
const { data } = await buscarQuizDoModulo({ moduloId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await buscarQuizDoModulo(dataConnect, buscarQuizDoModuloVars);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
buscarQuizDoModulo(buscarQuizDoModuloVars).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `BuscarQuizDoModulo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, buscarQuizDoModuloRef, BuscarQuizDoModuloVariables } from '@dataconnect/generated';

// The `BuscarQuizDoModulo` query requires an argument of type `BuscarQuizDoModuloVariables`:
const buscarQuizDoModuloVars: BuscarQuizDoModuloVariables = {
  moduloId: ..., 
};

// Call the `buscarQuizDoModuloRef()` function to get a reference to the query.
const ref = buscarQuizDoModuloRef(buscarQuizDoModuloVars);
// Variables can be defined inline as well.
const ref = buscarQuizDoModuloRef({ moduloId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = buscarQuizDoModuloRef(dataConnect, buscarQuizDoModuloVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

## ListarQuestoesDoQuiz
You can execute the `ListarQuestoesDoQuiz` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarQuestoesDoQuiz(vars: ListarQuestoesDoQuizVariables, options?: ExecuteQueryOptions): QueryPromise<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;

interface ListarQuestoesDoQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarQuestoesDoQuizVariables): QueryRef<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;
}
export const listarQuestoesDoQuizRef: ListarQuestoesDoQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarQuestoesDoQuiz(dc: DataConnect, vars: ListarQuestoesDoQuizVariables, options?: ExecuteQueryOptions): QueryPromise<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;

interface ListarQuestoesDoQuizRef {
  ...
  (dc: DataConnect, vars: ListarQuestoesDoQuizVariables): QueryRef<ListarQuestoesDoQuizData, ListarQuestoesDoQuizVariables>;
}
export const listarQuestoesDoQuizRef: ListarQuestoesDoQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarQuestoesDoQuizRef:
```typescript
const name = listarQuestoesDoQuizRef.operationName;
console.log(name);
```

### Variables
The `ListarQuestoesDoQuiz` query requires an argument of type `ListarQuestoesDoQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListarQuestoesDoQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `ListarQuestoesDoQuiz` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarQuestoesDoQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListarQuestoesDoQuizData {
  questaoQuizs: ({
    id: UUIDString;
    pergunta: string;
    ordem: number;
  } & QuestaoQuiz_Key)[];
}
```
### Using `ListarQuestoesDoQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarQuestoesDoQuiz, ListarQuestoesDoQuizVariables } from '@dataconnect/generated';

// The `ListarQuestoesDoQuiz` query requires an argument of type `ListarQuestoesDoQuizVariables`:
const listarQuestoesDoQuizVars: ListarQuestoesDoQuizVariables = {
  quizId: ..., 
};

// Call the `listarQuestoesDoQuiz()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarQuestoesDoQuiz(listarQuestoesDoQuizVars);
// Variables can be defined inline as well.
const { data } = await listarQuestoesDoQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarQuestoesDoQuiz(dataConnect, listarQuestoesDoQuizVars);

console.log(data.questaoQuizs);

// Or, you can use the `Promise` API.
listarQuestoesDoQuiz(listarQuestoesDoQuizVars).then((response) => {
  const data = response.data;
  console.log(data.questaoQuizs);
});
```

### Using `ListarQuestoesDoQuiz`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarQuestoesDoQuizRef, ListarQuestoesDoQuizVariables } from '@dataconnect/generated';

// The `ListarQuestoesDoQuiz` query requires an argument of type `ListarQuestoesDoQuizVariables`:
const listarQuestoesDoQuizVars: ListarQuestoesDoQuizVariables = {
  quizId: ..., 
};

// Call the `listarQuestoesDoQuizRef()` function to get a reference to the query.
const ref = listarQuestoesDoQuizRef(listarQuestoesDoQuizVars);
// Variables can be defined inline as well.
const ref = listarQuestoesDoQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarQuestoesDoQuizRef(dataConnect, listarQuestoesDoQuizVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questaoQuizs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questaoQuizs);
});
```

## ListarAlternativasDaQuestao
You can execute the `ListarAlternativasDaQuestao` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarAlternativasDaQuestao(vars: ListarAlternativasDaQuestaoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;

interface ListarAlternativasDaQuestaoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListarAlternativasDaQuestaoVariables): QueryRef<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;
}
export const listarAlternativasDaQuestaoRef: ListarAlternativasDaQuestaoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarAlternativasDaQuestao(dc: DataConnect, vars: ListarAlternativasDaQuestaoVariables, options?: ExecuteQueryOptions): QueryPromise<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;

interface ListarAlternativasDaQuestaoRef {
  ...
  (dc: DataConnect, vars: ListarAlternativasDaQuestaoVariables): QueryRef<ListarAlternativasDaQuestaoData, ListarAlternativasDaQuestaoVariables>;
}
export const listarAlternativasDaQuestaoRef: ListarAlternativasDaQuestaoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarAlternativasDaQuestaoRef:
```typescript
const name = listarAlternativasDaQuestaoRef.operationName;
console.log(name);
```

### Variables
The `ListarAlternativasDaQuestao` query requires an argument of type `ListarAlternativasDaQuestaoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListarAlternativasDaQuestaoVariables {
  questaoId: UUIDString;
}
```
### Return Type
Recall that executing the `ListarAlternativasDaQuestao` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarAlternativasDaQuestaoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListarAlternativasDaQuestaoData {
  alternativaQuizs: ({
    id: UUIDString;
    texto: string;
    correta: boolean;
    explicacao?: string | null;
    ordem: number;
  } & AlternativaQuiz_Key)[];
}
```
### Using `ListarAlternativasDaQuestao`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarAlternativasDaQuestao, ListarAlternativasDaQuestaoVariables } from '@dataconnect/generated';

// The `ListarAlternativasDaQuestao` query requires an argument of type `ListarAlternativasDaQuestaoVariables`:
const listarAlternativasDaQuestaoVars: ListarAlternativasDaQuestaoVariables = {
  questaoId: ..., 
};

// Call the `listarAlternativasDaQuestao()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarAlternativasDaQuestao(listarAlternativasDaQuestaoVars);
// Variables can be defined inline as well.
const { data } = await listarAlternativasDaQuestao({ questaoId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarAlternativasDaQuestao(dataConnect, listarAlternativasDaQuestaoVars);

console.log(data.alternativaQuizs);

// Or, you can use the `Promise` API.
listarAlternativasDaQuestao(listarAlternativasDaQuestaoVars).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuizs);
});
```

### Using `ListarAlternativasDaQuestao`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarAlternativasDaQuestaoRef, ListarAlternativasDaQuestaoVariables } from '@dataconnect/generated';

// The `ListarAlternativasDaQuestao` query requires an argument of type `ListarAlternativasDaQuestaoVariables`:
const listarAlternativasDaQuestaoVars: ListarAlternativasDaQuestaoVariables = {
  questaoId: ..., 
};

// Call the `listarAlternativasDaQuestaoRef()` function to get a reference to the query.
const ref = listarAlternativasDaQuestaoRef(listarAlternativasDaQuestaoVars);
// Variables can be defined inline as well.
const ref = listarAlternativasDaQuestaoRef({ questaoId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarAlternativasDaQuestaoRef(dataConnect, listarAlternativasDaQuestaoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.alternativaQuizs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuizs);
});
```

## ListarCursosAdmin
You can execute the `ListarCursosAdmin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listarCursosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListarCursosAdminData, undefined>;

interface ListarCursosAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListarCursosAdminData, undefined>;
}
export const listarCursosAdminRef: ListarCursosAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listarCursosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListarCursosAdminData, undefined>;

interface ListarCursosAdminRef {
  ...
  (dc: DataConnect): QueryRef<ListarCursosAdminData, undefined>;
}
export const listarCursosAdminRef: ListarCursosAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listarCursosAdminRef:
```typescript
const name = listarCursosAdminRef.operationName;
console.log(name);
```

### Variables
The `ListarCursosAdmin` query has no variables.
### Return Type
Recall that executing the `ListarCursosAdmin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListarCursosAdminData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListarCursosAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listarCursosAdmin } from '@dataconnect/generated';


// Call the `listarCursosAdmin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listarCursosAdmin();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listarCursosAdmin(dataConnect);

console.log(data.cursos);

// Or, you can use the `Promise` API.
listarCursosAdmin().then((response) => {
  const data = response.data;
  console.log(data.cursos);
});
```

### Using `ListarCursosAdmin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listarCursosAdminRef } from '@dataconnect/generated';


// Call the `listarCursosAdminRef()` function to get a reference to the query.
const ref = listarCursosAdminRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listarCursosAdminRef(dataConnect);

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

## BuscarQuizFinalDoCurso
You can execute the `BuscarQuizFinalDoCurso` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
buscarQuizFinalDoCurso(vars: BuscarQuizFinalDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizFinalDoCursoData, BuscarQuizFinalDoCursoVariables>;

interface BuscarQuizFinalDoCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BuscarQuizFinalDoCursoVariables): QueryRef<BuscarQuizFinalDoCursoData, BuscarQuizFinalDoCursoVariables>;
}
export const buscarQuizFinalDoCursoRef: BuscarQuizFinalDoCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
buscarQuizFinalDoCurso(dc: DataConnect, vars: BuscarQuizFinalDoCursoVariables, options?: ExecuteQueryOptions): QueryPromise<BuscarQuizFinalDoCursoData, BuscarQuizFinalDoCursoVariables>;

interface BuscarQuizFinalDoCursoRef {
  ...
  (dc: DataConnect, vars: BuscarQuizFinalDoCursoVariables): QueryRef<BuscarQuizFinalDoCursoData, BuscarQuizFinalDoCursoVariables>;
}
export const buscarQuizFinalDoCursoRef: BuscarQuizFinalDoCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the buscarQuizFinalDoCursoRef:
```typescript
const name = buscarQuizFinalDoCursoRef.operationName;
console.log(name);
```

### Variables
The `BuscarQuizFinalDoCurso` query requires an argument of type `BuscarQuizFinalDoCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BuscarQuizFinalDoCursoVariables {
  cursoId: UUIDString;
}
```
### Return Type
Recall that executing the `BuscarQuizFinalDoCurso` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BuscarQuizFinalDoCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BuscarQuizFinalDoCursoData {
  quizzes: ({
    id: UUIDString;
    tipo: string;
    moduloId?: UUIDString | null;
  } & Quiz_Key)[];
}
```
### Using `BuscarQuizFinalDoCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, buscarQuizFinalDoCurso, BuscarQuizFinalDoCursoVariables } from '@dataconnect/generated';

// The `BuscarQuizFinalDoCurso` query requires an argument of type `BuscarQuizFinalDoCursoVariables`:
const buscarQuizFinalDoCursoVars: BuscarQuizFinalDoCursoVariables = {
  cursoId: ..., 
};

// Call the `buscarQuizFinalDoCurso()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await buscarQuizFinalDoCurso(buscarQuizFinalDoCursoVars);
// Variables can be defined inline as well.
const { data } = await buscarQuizFinalDoCurso({ cursoId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await buscarQuizFinalDoCurso(dataConnect, buscarQuizFinalDoCursoVars);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
buscarQuizFinalDoCurso(buscarQuizFinalDoCursoVars).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `BuscarQuizFinalDoCurso`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, buscarQuizFinalDoCursoRef, BuscarQuizFinalDoCursoVariables } from '@dataconnect/generated';

// The `BuscarQuizFinalDoCurso` query requires an argument of type `BuscarQuizFinalDoCursoVariables`:
const buscarQuizFinalDoCursoVars: BuscarQuizFinalDoCursoVariables = {
  cursoId: ..., 
};

// Call the `buscarQuizFinalDoCursoRef()` function to get a reference to the query.
const ref = buscarQuizFinalDoCursoRef(buscarQuizFinalDoCursoVars);
// Variables can be defined inline as well.
const ref = buscarQuizFinalDoCursoRef({ cursoId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = buscarQuizFinalDoCursoRef(dataConnect, buscarQuizFinalDoCursoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
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

## CriarCurso
You can execute the `CriarCurso` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarCurso(vars: CriarCursoVariables): MutationPromise<CriarCursoData, CriarCursoVariables>;

interface CriarCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarCursoVariables): MutationRef<CriarCursoData, CriarCursoVariables>;
}
export const criarCursoRef: CriarCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarCurso(dc: DataConnect, vars: CriarCursoVariables): MutationPromise<CriarCursoData, CriarCursoVariables>;

interface CriarCursoRef {
  ...
  (dc: DataConnect, vars: CriarCursoVariables): MutationRef<CriarCursoData, CriarCursoVariables>;
}
export const criarCursoRef: CriarCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarCursoRef:
```typescript
const name = criarCursoRef.operationName;
console.log(name);
```

### Variables
The `CriarCurso` mutation requires an argument of type `CriarCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarCursoVariables {
  nome: string;
  descricao?: string | null;
  dificuldade: string;
  cargaHoraria: number;
  imagem?: string | null;
  icone?: string | null;
  ativo: boolean;
}
```
### Return Type
Recall that executing the `CriarCurso` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarCursoData {
  curso_insert: Curso_Key;
}
```
### Using `CriarCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarCurso, CriarCursoVariables } from '@dataconnect/generated';

// The `CriarCurso` mutation requires an argument of type `CriarCursoVariables`:
const criarCursoVars: CriarCursoVariables = {
  nome: ..., 
  descricao: ..., // optional
  dificuldade: ..., 
  cargaHoraria: ..., 
  imagem: ..., // optional
  icone: ..., // optional
  ativo: ..., 
};

// Call the `criarCurso()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarCurso(criarCursoVars);
// Variables can be defined inline as well.
const { data } = await criarCurso({ nome: ..., descricao: ..., dificuldade: ..., cargaHoraria: ..., imagem: ..., icone: ..., ativo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarCurso(dataConnect, criarCursoVars);

console.log(data.curso_insert);

// Or, you can use the `Promise` API.
criarCurso(criarCursoVars).then((response) => {
  const data = response.data;
  console.log(data.curso_insert);
});
```

### Using `CriarCurso`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarCursoRef, CriarCursoVariables } from '@dataconnect/generated';

// The `CriarCurso` mutation requires an argument of type `CriarCursoVariables`:
const criarCursoVars: CriarCursoVariables = {
  nome: ..., 
  descricao: ..., // optional
  dificuldade: ..., 
  cargaHoraria: ..., 
  imagem: ..., // optional
  icone: ..., // optional
  ativo: ..., 
};

// Call the `criarCursoRef()` function to get a reference to the mutation.
const ref = criarCursoRef(criarCursoVars);
// Variables can be defined inline as well.
const ref = criarCursoRef({ nome: ..., descricao: ..., dificuldade: ..., cargaHoraria: ..., imagem: ..., icone: ..., ativo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarCursoRef(dataConnect, criarCursoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.curso_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.curso_insert);
});
```

## CriarModulo
You can execute the `CriarModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarModulo(vars: CriarModuloVariables): MutationPromise<CriarModuloData, CriarModuloVariables>;

interface CriarModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarModuloVariables): MutationRef<CriarModuloData, CriarModuloVariables>;
}
export const criarModuloRef: CriarModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarModulo(dc: DataConnect, vars: CriarModuloVariables): MutationPromise<CriarModuloData, CriarModuloVariables>;

interface CriarModuloRef {
  ...
  (dc: DataConnect, vars: CriarModuloVariables): MutationRef<CriarModuloData, CriarModuloVariables>;
}
export const criarModuloRef: CriarModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarModuloRef:
```typescript
const name = criarModuloRef.operationName;
console.log(name);
```

### Variables
The `CriarModulo` mutation requires an argument of type `CriarModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarModuloVariables {
  cursoId: UUIDString;
  nome: string;
  descricao?: string | null;
  ordem: number;
  duracaoMinutos?: number | null;
  imagem?: string | null;
}
```
### Return Type
Recall that executing the `CriarModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarModuloData {
  modulo_insert: Modulo_Key;
}
```
### Using `CriarModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarModulo, CriarModuloVariables } from '@dataconnect/generated';

// The `CriarModulo` mutation requires an argument of type `CriarModuloVariables`:
const criarModuloVars: CriarModuloVariables = {
  cursoId: ..., 
  nome: ..., 
  descricao: ..., // optional
  ordem: ..., 
  duracaoMinutos: ..., // optional
  imagem: ..., // optional
};

// Call the `criarModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarModulo(criarModuloVars);
// Variables can be defined inline as well.
const { data } = await criarModulo({ cursoId: ..., nome: ..., descricao: ..., ordem: ..., duracaoMinutos: ..., imagem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarModulo(dataConnect, criarModuloVars);

console.log(data.modulo_insert);

// Or, you can use the `Promise` API.
criarModulo(criarModuloVars).then((response) => {
  const data = response.data;
  console.log(data.modulo_insert);
});
```

### Using `CriarModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarModuloRef, CriarModuloVariables } from '@dataconnect/generated';

// The `CriarModulo` mutation requires an argument of type `CriarModuloVariables`:
const criarModuloVars: CriarModuloVariables = {
  cursoId: ..., 
  nome: ..., 
  descricao: ..., // optional
  ordem: ..., 
  duracaoMinutos: ..., // optional
  imagem: ..., // optional
};

// Call the `criarModuloRef()` function to get a reference to the mutation.
const ref = criarModuloRef(criarModuloVars);
// Variables can be defined inline as well.
const ref = criarModuloRef({ cursoId: ..., nome: ..., descricao: ..., ordem: ..., duracaoMinutos: ..., imagem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarModuloRef(dataConnect, criarModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.modulo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.modulo_insert);
});
```

## CriarConteudoModulo
You can execute the `CriarConteudoModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarConteudoModulo(vars: CriarConteudoModuloVariables): MutationPromise<CriarConteudoModuloData, CriarConteudoModuloVariables>;

interface CriarConteudoModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarConteudoModuloVariables): MutationRef<CriarConteudoModuloData, CriarConteudoModuloVariables>;
}
export const criarConteudoModuloRef: CriarConteudoModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarConteudoModulo(dc: DataConnect, vars: CriarConteudoModuloVariables): MutationPromise<CriarConteudoModuloData, CriarConteudoModuloVariables>;

interface CriarConteudoModuloRef {
  ...
  (dc: DataConnect, vars: CriarConteudoModuloVariables): MutationRef<CriarConteudoModuloData, CriarConteudoModuloVariables>;
}
export const criarConteudoModuloRef: CriarConteudoModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarConteudoModuloRef:
```typescript
const name = criarConteudoModuloRef.operationName;
console.log(name);
```

### Variables
The `CriarConteudoModulo` mutation requires an argument of type `CriarConteudoModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarConteudoModuloVariables {
  moduloId: UUIDString;
  tipo: string;
  titulo?: string | null;
  conteudo?: string | null;
  url?: string | null;
  altTexto?: string | null;
  ordem: number;
}
```
### Return Type
Recall that executing the `CriarConteudoModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarConteudoModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarConteudoModuloData {
  conteudoModulo_insert: ConteudoModulo_Key;
}
```
### Using `CriarConteudoModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarConteudoModulo, CriarConteudoModuloVariables } from '@dataconnect/generated';

// The `CriarConteudoModulo` mutation requires an argument of type `CriarConteudoModuloVariables`:
const criarConteudoModuloVars: CriarConteudoModuloVariables = {
  moduloId: ..., 
  tipo: ..., 
  titulo: ..., // optional
  conteudo: ..., // optional
  url: ..., // optional
  altTexto: ..., // optional
  ordem: ..., 
};

// Call the `criarConteudoModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarConteudoModulo(criarConteudoModuloVars);
// Variables can be defined inline as well.
const { data } = await criarConteudoModulo({ moduloId: ..., tipo: ..., titulo: ..., conteudo: ..., url: ..., altTexto: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarConteudoModulo(dataConnect, criarConteudoModuloVars);

console.log(data.conteudoModulo_insert);

// Or, you can use the `Promise` API.
criarConteudoModulo(criarConteudoModuloVars).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_insert);
});
```

### Using `CriarConteudoModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarConteudoModuloRef, CriarConteudoModuloVariables } from '@dataconnect/generated';

// The `CriarConteudoModulo` mutation requires an argument of type `CriarConteudoModuloVariables`:
const criarConteudoModuloVars: CriarConteudoModuloVariables = {
  moduloId: ..., 
  tipo: ..., 
  titulo: ..., // optional
  conteudo: ..., // optional
  url: ..., // optional
  altTexto: ..., // optional
  ordem: ..., 
};

// Call the `criarConteudoModuloRef()` function to get a reference to the mutation.
const ref = criarConteudoModuloRef(criarConteudoModuloVars);
// Variables can be defined inline as well.
const ref = criarConteudoModuloRef({ moduloId: ..., tipo: ..., titulo: ..., conteudo: ..., url: ..., altTexto: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarConteudoModuloRef(dataConnect, criarConteudoModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conteudoModulo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_insert);
});
```

## EditarCurso
You can execute the `EditarCurso` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarCurso(vars: EditarCursoVariables): MutationPromise<EditarCursoData, EditarCursoVariables>;

interface EditarCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarCursoVariables): MutationRef<EditarCursoData, EditarCursoVariables>;
}
export const editarCursoRef: EditarCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarCurso(dc: DataConnect, vars: EditarCursoVariables): MutationPromise<EditarCursoData, EditarCursoVariables>;

interface EditarCursoRef {
  ...
  (dc: DataConnect, vars: EditarCursoVariables): MutationRef<EditarCursoData, EditarCursoVariables>;
}
export const editarCursoRef: EditarCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarCursoRef:
```typescript
const name = editarCursoRef.operationName;
console.log(name);
```

### Variables
The `EditarCurso` mutation requires an argument of type `EditarCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `EditarCurso` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarCursoData {
  curso_update?: Curso_Key | null;
}
```
### Using `EditarCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarCurso, EditarCursoVariables } from '@dataconnect/generated';

// The `EditarCurso` mutation requires an argument of type `EditarCursoVariables`:
const editarCursoVars: EditarCursoVariables = {
  id: ..., 
  nome: ..., 
  descricao: ..., // optional
  dificuldade: ..., 
  cargaHoraria: ..., 
  imagem: ..., // optional
  icone: ..., // optional
  ativo: ..., 
  publicado: ..., 
};

// Call the `editarCurso()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarCurso(editarCursoVars);
// Variables can be defined inline as well.
const { data } = await editarCurso({ id: ..., nome: ..., descricao: ..., dificuldade: ..., cargaHoraria: ..., imagem: ..., icone: ..., ativo: ..., publicado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarCurso(dataConnect, editarCursoVars);

console.log(data.curso_update);

// Or, you can use the `Promise` API.
editarCurso(editarCursoVars).then((response) => {
  const data = response.data;
  console.log(data.curso_update);
});
```

### Using `EditarCurso`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarCursoRef, EditarCursoVariables } from '@dataconnect/generated';

// The `EditarCurso` mutation requires an argument of type `EditarCursoVariables`:
const editarCursoVars: EditarCursoVariables = {
  id: ..., 
  nome: ..., 
  descricao: ..., // optional
  dificuldade: ..., 
  cargaHoraria: ..., 
  imagem: ..., // optional
  icone: ..., // optional
  ativo: ..., 
  publicado: ..., 
};

// Call the `editarCursoRef()` function to get a reference to the mutation.
const ref = editarCursoRef(editarCursoVars);
// Variables can be defined inline as well.
const ref = editarCursoRef({ id: ..., nome: ..., descricao: ..., dificuldade: ..., cargaHoraria: ..., imagem: ..., icone: ..., ativo: ..., publicado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarCursoRef(dataConnect, editarCursoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.curso_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.curso_update);
});
```

## EditarModulo
You can execute the `EditarModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarModulo(vars: EditarModuloVariables): MutationPromise<EditarModuloData, EditarModuloVariables>;

interface EditarModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarModuloVariables): MutationRef<EditarModuloData, EditarModuloVariables>;
}
export const editarModuloRef: EditarModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarModulo(dc: DataConnect, vars: EditarModuloVariables): MutationPromise<EditarModuloData, EditarModuloVariables>;

interface EditarModuloRef {
  ...
  (dc: DataConnect, vars: EditarModuloVariables): MutationRef<EditarModuloData, EditarModuloVariables>;
}
export const editarModuloRef: EditarModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarModuloRef:
```typescript
const name = editarModuloRef.operationName;
console.log(name);
```

### Variables
The `EditarModulo` mutation requires an argument of type `EditarModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarModuloVariables {
  id: UUIDString;
  nome: string;
  descricao?: string | null;
  ordem: number;
  duracaoMinutos?: number | null;
  imagem?: string | null;
}
```
### Return Type
Recall that executing the `EditarModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarModuloData {
  modulo_update?: Modulo_Key | null;
}
```
### Using `EditarModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarModulo, EditarModuloVariables } from '@dataconnect/generated';

// The `EditarModulo` mutation requires an argument of type `EditarModuloVariables`:
const editarModuloVars: EditarModuloVariables = {
  id: ..., 
  nome: ..., 
  descricao: ..., // optional
  ordem: ..., 
  duracaoMinutos: ..., // optional
  imagem: ..., // optional
};

// Call the `editarModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarModulo(editarModuloVars);
// Variables can be defined inline as well.
const { data } = await editarModulo({ id: ..., nome: ..., descricao: ..., ordem: ..., duracaoMinutos: ..., imagem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarModulo(dataConnect, editarModuloVars);

console.log(data.modulo_update);

// Or, you can use the `Promise` API.
editarModulo(editarModuloVars).then((response) => {
  const data = response.data;
  console.log(data.modulo_update);
});
```

### Using `EditarModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarModuloRef, EditarModuloVariables } from '@dataconnect/generated';

// The `EditarModulo` mutation requires an argument of type `EditarModuloVariables`:
const editarModuloVars: EditarModuloVariables = {
  id: ..., 
  nome: ..., 
  descricao: ..., // optional
  ordem: ..., 
  duracaoMinutos: ..., // optional
  imagem: ..., // optional
};

// Call the `editarModuloRef()` function to get a reference to the mutation.
const ref = editarModuloRef(editarModuloVars);
// Variables can be defined inline as well.
const ref = editarModuloRef({ id: ..., nome: ..., descricao: ..., ordem: ..., duracaoMinutos: ..., imagem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarModuloRef(dataConnect, editarModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.modulo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.modulo_update);
});
```

## EditarConteudoModulo
You can execute the `EditarConteudoModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarConteudoModulo(vars: EditarConteudoModuloVariables): MutationPromise<EditarConteudoModuloData, EditarConteudoModuloVariables>;

interface EditarConteudoModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarConteudoModuloVariables): MutationRef<EditarConteudoModuloData, EditarConteudoModuloVariables>;
}
export const editarConteudoModuloRef: EditarConteudoModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarConteudoModulo(dc: DataConnect, vars: EditarConteudoModuloVariables): MutationPromise<EditarConteudoModuloData, EditarConteudoModuloVariables>;

interface EditarConteudoModuloRef {
  ...
  (dc: DataConnect, vars: EditarConteudoModuloVariables): MutationRef<EditarConteudoModuloData, EditarConteudoModuloVariables>;
}
export const editarConteudoModuloRef: EditarConteudoModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarConteudoModuloRef:
```typescript
const name = editarConteudoModuloRef.operationName;
console.log(name);
```

### Variables
The `EditarConteudoModulo` mutation requires an argument of type `EditarConteudoModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarConteudoModuloVariables {
  id: UUIDString;
  tipo: string;
  titulo?: string | null;
  conteudo?: string | null;
  url?: string | null;
  altTexto?: string | null;
  ordem: number;
}
```
### Return Type
Recall that executing the `EditarConteudoModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarConteudoModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarConteudoModuloData {
  conteudoModulo_update?: ConteudoModulo_Key | null;
}
```
### Using `EditarConteudoModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarConteudoModulo, EditarConteudoModuloVariables } from '@dataconnect/generated';

// The `EditarConteudoModulo` mutation requires an argument of type `EditarConteudoModuloVariables`:
const editarConteudoModuloVars: EditarConteudoModuloVariables = {
  id: ..., 
  tipo: ..., 
  titulo: ..., // optional
  conteudo: ..., // optional
  url: ..., // optional
  altTexto: ..., // optional
  ordem: ..., 
};

// Call the `editarConteudoModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarConteudoModulo(editarConteudoModuloVars);
// Variables can be defined inline as well.
const { data } = await editarConteudoModulo({ id: ..., tipo: ..., titulo: ..., conteudo: ..., url: ..., altTexto: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarConteudoModulo(dataConnect, editarConteudoModuloVars);

console.log(data.conteudoModulo_update);

// Or, you can use the `Promise` API.
editarConteudoModulo(editarConteudoModuloVars).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_update);
});
```

### Using `EditarConteudoModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarConteudoModuloRef, EditarConteudoModuloVariables } from '@dataconnect/generated';

// The `EditarConteudoModulo` mutation requires an argument of type `EditarConteudoModuloVariables`:
const editarConteudoModuloVars: EditarConteudoModuloVariables = {
  id: ..., 
  tipo: ..., 
  titulo: ..., // optional
  conteudo: ..., // optional
  url: ..., // optional
  altTexto: ..., // optional
  ordem: ..., 
};

// Call the `editarConteudoModuloRef()` function to get a reference to the mutation.
const ref = editarConteudoModuloRef(editarConteudoModuloVars);
// Variables can be defined inline as well.
const ref = editarConteudoModuloRef({ id: ..., tipo: ..., titulo: ..., conteudo: ..., url: ..., altTexto: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarConteudoModuloRef(dataConnect, editarConteudoModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conteudoModulo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_update);
});
```

## CriarQuiz
You can execute the `CriarQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarQuiz(vars: CriarQuizVariables): MutationPromise<CriarQuizData, CriarQuizVariables>;

interface CriarQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarQuizVariables): MutationRef<CriarQuizData, CriarQuizVariables>;
}
export const criarQuizRef: CriarQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarQuiz(dc: DataConnect, vars: CriarQuizVariables): MutationPromise<CriarQuizData, CriarQuizVariables>;

interface CriarQuizRef {
  ...
  (dc: DataConnect, vars: CriarQuizVariables): MutationRef<CriarQuizData, CriarQuizVariables>;
}
export const criarQuizRef: CriarQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarQuizRef:
```typescript
const name = criarQuizRef.operationName;
console.log(name);
```

### Variables
The `CriarQuiz` mutation requires an argument of type `CriarQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarQuizVariables {
  cursoId: UUIDString;
  moduloId?: UUIDString | null;
  tipo: string;
}
```
### Return Type
Recall that executing the `CriarQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarQuizData {
  quiz_insert: Quiz_Key;
}
```
### Using `CriarQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarQuiz, CriarQuizVariables } from '@dataconnect/generated';

// The `CriarQuiz` mutation requires an argument of type `CriarQuizVariables`:
const criarQuizVars: CriarQuizVariables = {
  cursoId: ..., 
  moduloId: ..., // optional
  tipo: ..., 
};

// Call the `criarQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarQuiz(criarQuizVars);
// Variables can be defined inline as well.
const { data } = await criarQuiz({ cursoId: ..., moduloId: ..., tipo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarQuiz(dataConnect, criarQuizVars);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
criarQuiz(criarQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

### Using `CriarQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarQuizRef, CriarQuizVariables } from '@dataconnect/generated';

// The `CriarQuiz` mutation requires an argument of type `CriarQuizVariables`:
const criarQuizVars: CriarQuizVariables = {
  cursoId: ..., 
  moduloId: ..., // optional
  tipo: ..., 
};

// Call the `criarQuizRef()` function to get a reference to the mutation.
const ref = criarQuizRef(criarQuizVars);
// Variables can be defined inline as well.
const ref = criarQuizRef({ cursoId: ..., moduloId: ..., tipo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarQuizRef(dataConnect, criarQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

## EditarQuiz
You can execute the `EditarQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarQuiz(vars: EditarQuizVariables): MutationPromise<EditarQuizData, EditarQuizVariables>;

interface EditarQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarQuizVariables): MutationRef<EditarQuizData, EditarQuizVariables>;
}
export const editarQuizRef: EditarQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarQuiz(dc: DataConnect, vars: EditarQuizVariables): MutationPromise<EditarQuizData, EditarQuizVariables>;

interface EditarQuizRef {
  ...
  (dc: DataConnect, vars: EditarQuizVariables): MutationRef<EditarQuizData, EditarQuizVariables>;
}
export const editarQuizRef: EditarQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarQuizRef:
```typescript
const name = editarQuizRef.operationName;
console.log(name);
```

### Variables
The `EditarQuiz` mutation requires an argument of type `EditarQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarQuizVariables {
  id: UUIDString;
  tipo: string;
}
```
### Return Type
Recall that executing the `EditarQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarQuizData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `EditarQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarQuiz, EditarQuizVariables } from '@dataconnect/generated';

// The `EditarQuiz` mutation requires an argument of type `EditarQuizVariables`:
const editarQuizVars: EditarQuizVariables = {
  id: ..., 
  tipo: ..., 
};

// Call the `editarQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarQuiz(editarQuizVars);
// Variables can be defined inline as well.
const { data } = await editarQuiz({ id: ..., tipo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarQuiz(dataConnect, editarQuizVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
editarQuiz(editarQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `EditarQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarQuizRef, EditarQuizVariables } from '@dataconnect/generated';

// The `EditarQuiz` mutation requires an argument of type `EditarQuizVariables`:
const editarQuizVars: EditarQuizVariables = {
  id: ..., 
  tipo: ..., 
};

// Call the `editarQuizRef()` function to get a reference to the mutation.
const ref = editarQuizRef(editarQuizVars);
// Variables can be defined inline as well.
const ref = editarQuizRef({ id: ..., tipo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarQuizRef(dataConnect, editarQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## CriarQuestaoQuiz
You can execute the `CriarQuestaoQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarQuestaoQuiz(vars: CriarQuestaoQuizVariables): MutationPromise<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;

interface CriarQuestaoQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarQuestaoQuizVariables): MutationRef<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;
}
export const criarQuestaoQuizRef: CriarQuestaoQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarQuestaoQuiz(dc: DataConnect, vars: CriarQuestaoQuizVariables): MutationPromise<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;

interface CriarQuestaoQuizRef {
  ...
  (dc: DataConnect, vars: CriarQuestaoQuizVariables): MutationRef<CriarQuestaoQuizData, CriarQuestaoQuizVariables>;
}
export const criarQuestaoQuizRef: CriarQuestaoQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarQuestaoQuizRef:
```typescript
const name = criarQuestaoQuizRef.operationName;
console.log(name);
```

### Variables
The `CriarQuestaoQuiz` mutation requires an argument of type `CriarQuestaoQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarQuestaoQuizVariables {
  quizId: UUIDString;
  pergunta: string;
  ordem: number;
}
```
### Return Type
Recall that executing the `CriarQuestaoQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarQuestaoQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarQuestaoQuizData {
  questaoQuiz_insert: QuestaoQuiz_Key;
}
```
### Using `CriarQuestaoQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarQuestaoQuiz, CriarQuestaoQuizVariables } from '@dataconnect/generated';

// The `CriarQuestaoQuiz` mutation requires an argument of type `CriarQuestaoQuizVariables`:
const criarQuestaoQuizVars: CriarQuestaoQuizVariables = {
  quizId: ..., 
  pergunta: ..., 
  ordem: ..., 
};

// Call the `criarQuestaoQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarQuestaoQuiz(criarQuestaoQuizVars);
// Variables can be defined inline as well.
const { data } = await criarQuestaoQuiz({ quizId: ..., pergunta: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarQuestaoQuiz(dataConnect, criarQuestaoQuizVars);

console.log(data.questaoQuiz_insert);

// Or, you can use the `Promise` API.
criarQuestaoQuiz(criarQuestaoQuizVars).then((response) => {
  const data = response.data;
  console.log(data.questaoQuiz_insert);
});
```

### Using `CriarQuestaoQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarQuestaoQuizRef, CriarQuestaoQuizVariables } from '@dataconnect/generated';

// The `CriarQuestaoQuiz` mutation requires an argument of type `CriarQuestaoQuizVariables`:
const criarQuestaoQuizVars: CriarQuestaoQuizVariables = {
  quizId: ..., 
  pergunta: ..., 
  ordem: ..., 
};

// Call the `criarQuestaoQuizRef()` function to get a reference to the mutation.
const ref = criarQuestaoQuizRef(criarQuestaoQuizVars);
// Variables can be defined inline as well.
const ref = criarQuestaoQuizRef({ quizId: ..., pergunta: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarQuestaoQuizRef(dataConnect, criarQuestaoQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.questaoQuiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.questaoQuiz_insert);
});
```

## EditarQuestaoQuiz
You can execute the `EditarQuestaoQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarQuestaoQuiz(vars: EditarQuestaoQuizVariables): MutationPromise<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;

interface EditarQuestaoQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarQuestaoQuizVariables): MutationRef<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;
}
export const editarQuestaoQuizRef: EditarQuestaoQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarQuestaoQuiz(dc: DataConnect, vars: EditarQuestaoQuizVariables): MutationPromise<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;

interface EditarQuestaoQuizRef {
  ...
  (dc: DataConnect, vars: EditarQuestaoQuizVariables): MutationRef<EditarQuestaoQuizData, EditarQuestaoQuizVariables>;
}
export const editarQuestaoQuizRef: EditarQuestaoQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarQuestaoQuizRef:
```typescript
const name = editarQuestaoQuizRef.operationName;
console.log(name);
```

### Variables
The `EditarQuestaoQuiz` mutation requires an argument of type `EditarQuestaoQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarQuestaoQuizVariables {
  id: UUIDString;
  pergunta: string;
  ordem: number;
}
```
### Return Type
Recall that executing the `EditarQuestaoQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarQuestaoQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarQuestaoQuizData {
  questaoQuiz_update?: QuestaoQuiz_Key | null;
}
```
### Using `EditarQuestaoQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarQuestaoQuiz, EditarQuestaoQuizVariables } from '@dataconnect/generated';

// The `EditarQuestaoQuiz` mutation requires an argument of type `EditarQuestaoQuizVariables`:
const editarQuestaoQuizVars: EditarQuestaoQuizVariables = {
  id: ..., 
  pergunta: ..., 
  ordem: ..., 
};

// Call the `editarQuestaoQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarQuestaoQuiz(editarQuestaoQuizVars);
// Variables can be defined inline as well.
const { data } = await editarQuestaoQuiz({ id: ..., pergunta: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarQuestaoQuiz(dataConnect, editarQuestaoQuizVars);

console.log(data.questaoQuiz_update);

// Or, you can use the `Promise` API.
editarQuestaoQuiz(editarQuestaoQuizVars).then((response) => {
  const data = response.data;
  console.log(data.questaoQuiz_update);
});
```

### Using `EditarQuestaoQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarQuestaoQuizRef, EditarQuestaoQuizVariables } from '@dataconnect/generated';

// The `EditarQuestaoQuiz` mutation requires an argument of type `EditarQuestaoQuizVariables`:
const editarQuestaoQuizVars: EditarQuestaoQuizVariables = {
  id: ..., 
  pergunta: ..., 
  ordem: ..., 
};

// Call the `editarQuestaoQuizRef()` function to get a reference to the mutation.
const ref = editarQuestaoQuizRef(editarQuestaoQuizVars);
// Variables can be defined inline as well.
const ref = editarQuestaoQuizRef({ id: ..., pergunta: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarQuestaoQuizRef(dataConnect, editarQuestaoQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.questaoQuiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.questaoQuiz_update);
});
```

## CriarAlternativaQuiz
You can execute the `CriarAlternativaQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
criarAlternativaQuiz(vars: CriarAlternativaQuizVariables): MutationPromise<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;

interface CriarAlternativaQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CriarAlternativaQuizVariables): MutationRef<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;
}
export const criarAlternativaQuizRef: CriarAlternativaQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
criarAlternativaQuiz(dc: DataConnect, vars: CriarAlternativaQuizVariables): MutationPromise<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;

interface CriarAlternativaQuizRef {
  ...
  (dc: DataConnect, vars: CriarAlternativaQuizVariables): MutationRef<CriarAlternativaQuizData, CriarAlternativaQuizVariables>;
}
export const criarAlternativaQuizRef: CriarAlternativaQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the criarAlternativaQuizRef:
```typescript
const name = criarAlternativaQuizRef.operationName;
console.log(name);
```

### Variables
The `CriarAlternativaQuiz` mutation requires an argument of type `CriarAlternativaQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CriarAlternativaQuizVariables {
  questaoId: UUIDString;
  texto: string;
  correta: boolean;
  explicacao?: string | null;
  ordem: number;
}
```
### Return Type
Recall that executing the `CriarAlternativaQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CriarAlternativaQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CriarAlternativaQuizData {
  alternativaQuiz_insert: AlternativaQuiz_Key;
}
```
### Using `CriarAlternativaQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, criarAlternativaQuiz, CriarAlternativaQuizVariables } from '@dataconnect/generated';

// The `CriarAlternativaQuiz` mutation requires an argument of type `CriarAlternativaQuizVariables`:
const criarAlternativaQuizVars: CriarAlternativaQuizVariables = {
  questaoId: ..., 
  texto: ..., 
  correta: ..., 
  explicacao: ..., // optional
  ordem: ..., 
};

// Call the `criarAlternativaQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await criarAlternativaQuiz(criarAlternativaQuizVars);
// Variables can be defined inline as well.
const { data } = await criarAlternativaQuiz({ questaoId: ..., texto: ..., correta: ..., explicacao: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await criarAlternativaQuiz(dataConnect, criarAlternativaQuizVars);

console.log(data.alternativaQuiz_insert);

// Or, you can use the `Promise` API.
criarAlternativaQuiz(criarAlternativaQuizVars).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_insert);
});
```

### Using `CriarAlternativaQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, criarAlternativaQuizRef, CriarAlternativaQuizVariables } from '@dataconnect/generated';

// The `CriarAlternativaQuiz` mutation requires an argument of type `CriarAlternativaQuizVariables`:
const criarAlternativaQuizVars: CriarAlternativaQuizVariables = {
  questaoId: ..., 
  texto: ..., 
  correta: ..., 
  explicacao: ..., // optional
  ordem: ..., 
};

// Call the `criarAlternativaQuizRef()` function to get a reference to the mutation.
const ref = criarAlternativaQuizRef(criarAlternativaQuizVars);
// Variables can be defined inline as well.
const ref = criarAlternativaQuizRef({ questaoId: ..., texto: ..., correta: ..., explicacao: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = criarAlternativaQuizRef(dataConnect, criarAlternativaQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alternativaQuiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_insert);
});
```

## EditarAlternativaQuiz
You can execute the `EditarAlternativaQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarAlternativaQuiz(vars: EditarAlternativaQuizVariables): MutationPromise<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;

interface EditarAlternativaQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarAlternativaQuizVariables): MutationRef<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;
}
export const editarAlternativaQuizRef: EditarAlternativaQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarAlternativaQuiz(dc: DataConnect, vars: EditarAlternativaQuizVariables): MutationPromise<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;

interface EditarAlternativaQuizRef {
  ...
  (dc: DataConnect, vars: EditarAlternativaQuizVariables): MutationRef<EditarAlternativaQuizData, EditarAlternativaQuizVariables>;
}
export const editarAlternativaQuizRef: EditarAlternativaQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarAlternativaQuizRef:
```typescript
const name = editarAlternativaQuizRef.operationName;
console.log(name);
```

### Variables
The `EditarAlternativaQuiz` mutation requires an argument of type `EditarAlternativaQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarAlternativaQuizVariables {
  id: UUIDString;
  texto: string;
  correta: boolean;
  explicacao?: string | null;
  ordem: number;
}
```
### Return Type
Recall that executing the `EditarAlternativaQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarAlternativaQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarAlternativaQuizData {
  alternativaQuiz_update?: AlternativaQuiz_Key | null;
}
```
### Using `EditarAlternativaQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarAlternativaQuiz, EditarAlternativaQuizVariables } from '@dataconnect/generated';

// The `EditarAlternativaQuiz` mutation requires an argument of type `EditarAlternativaQuizVariables`:
const editarAlternativaQuizVars: EditarAlternativaQuizVariables = {
  id: ..., 
  texto: ..., 
  correta: ..., 
  explicacao: ..., // optional
  ordem: ..., 
};

// Call the `editarAlternativaQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarAlternativaQuiz(editarAlternativaQuizVars);
// Variables can be defined inline as well.
const { data } = await editarAlternativaQuiz({ id: ..., texto: ..., correta: ..., explicacao: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarAlternativaQuiz(dataConnect, editarAlternativaQuizVars);

console.log(data.alternativaQuiz_update);

// Or, you can use the `Promise` API.
editarAlternativaQuiz(editarAlternativaQuizVars).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_update);
});
```

### Using `EditarAlternativaQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarAlternativaQuizRef, EditarAlternativaQuizVariables } from '@dataconnect/generated';

// The `EditarAlternativaQuiz` mutation requires an argument of type `EditarAlternativaQuizVariables`:
const editarAlternativaQuizVars: EditarAlternativaQuizVariables = {
  id: ..., 
  texto: ..., 
  correta: ..., 
  explicacao: ..., // optional
  ordem: ..., 
};

// Call the `editarAlternativaQuizRef()` function to get a reference to the mutation.
const ref = editarAlternativaQuizRef(editarAlternativaQuizVars);
// Variables can be defined inline as well.
const ref = editarAlternativaQuizRef({ id: ..., texto: ..., correta: ..., explicacao: ..., ordem: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarAlternativaQuizRef(dataConnect, editarAlternativaQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alternativaQuiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_update);
});
```

## ExcluirCurso
You can execute the `ExcluirCurso` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirCurso(vars: ExcluirCursoVariables): MutationPromise<ExcluirCursoData, ExcluirCursoVariables>;

interface ExcluirCursoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirCursoVariables): MutationRef<ExcluirCursoData, ExcluirCursoVariables>;
}
export const excluirCursoRef: ExcluirCursoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirCurso(dc: DataConnect, vars: ExcluirCursoVariables): MutationPromise<ExcluirCursoData, ExcluirCursoVariables>;

interface ExcluirCursoRef {
  ...
  (dc: DataConnect, vars: ExcluirCursoVariables): MutationRef<ExcluirCursoData, ExcluirCursoVariables>;
}
export const excluirCursoRef: ExcluirCursoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirCursoRef:
```typescript
const name = excluirCursoRef.operationName;
console.log(name);
```

### Variables
The `ExcluirCurso` mutation requires an argument of type `ExcluirCursoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirCursoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ExcluirCurso` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirCursoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirCursoData {
  curso_delete?: Curso_Key | null;
}
```
### Using `ExcluirCurso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirCurso, ExcluirCursoVariables } from '@dataconnect/generated';

// The `ExcluirCurso` mutation requires an argument of type `ExcluirCursoVariables`:
const excluirCursoVars: ExcluirCursoVariables = {
  id: ..., 
};

// Call the `excluirCurso()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirCurso(excluirCursoVars);
// Variables can be defined inline as well.
const { data } = await excluirCurso({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirCurso(dataConnect, excluirCursoVars);

console.log(data.curso_delete);

// Or, you can use the `Promise` API.
excluirCurso(excluirCursoVars).then((response) => {
  const data = response.data;
  console.log(data.curso_delete);
});
```

### Using `ExcluirCurso`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirCursoRef, ExcluirCursoVariables } from '@dataconnect/generated';

// The `ExcluirCurso` mutation requires an argument of type `ExcluirCursoVariables`:
const excluirCursoVars: ExcluirCursoVariables = {
  id: ..., 
};

// Call the `excluirCursoRef()` function to get a reference to the mutation.
const ref = excluirCursoRef(excluirCursoVars);
// Variables can be defined inline as well.
const ref = excluirCursoRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirCursoRef(dataConnect, excluirCursoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.curso_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.curso_delete);
});
```

## ExcluirConteudoModulo
You can execute the `ExcluirConteudoModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirConteudoModulo(vars: ExcluirConteudoModuloVariables): MutationPromise<ExcluirConteudoModuloData, ExcluirConteudoModuloVariables>;

interface ExcluirConteudoModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirConteudoModuloVariables): MutationRef<ExcluirConteudoModuloData, ExcluirConteudoModuloVariables>;
}
export const excluirConteudoModuloRef: ExcluirConteudoModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirConteudoModulo(dc: DataConnect, vars: ExcluirConteudoModuloVariables): MutationPromise<ExcluirConteudoModuloData, ExcluirConteudoModuloVariables>;

interface ExcluirConteudoModuloRef {
  ...
  (dc: DataConnect, vars: ExcluirConteudoModuloVariables): MutationRef<ExcluirConteudoModuloData, ExcluirConteudoModuloVariables>;
}
export const excluirConteudoModuloRef: ExcluirConteudoModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirConteudoModuloRef:
```typescript
const name = excluirConteudoModuloRef.operationName;
console.log(name);
```

### Variables
The `ExcluirConteudoModulo` mutation requires an argument of type `ExcluirConteudoModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirConteudoModuloVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ExcluirConteudoModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirConteudoModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirConteudoModuloData {
  conteudoModulo_delete?: ConteudoModulo_Key | null;
}
```
### Using `ExcluirConteudoModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirConteudoModulo, ExcluirConteudoModuloVariables } from '@dataconnect/generated';

// The `ExcluirConteudoModulo` mutation requires an argument of type `ExcluirConteudoModuloVariables`:
const excluirConteudoModuloVars: ExcluirConteudoModuloVariables = {
  id: ..., 
};

// Call the `excluirConteudoModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirConteudoModulo(excluirConteudoModuloVars);
// Variables can be defined inline as well.
const { data } = await excluirConteudoModulo({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirConteudoModulo(dataConnect, excluirConteudoModuloVars);

console.log(data.conteudoModulo_delete);

// Or, you can use the `Promise` API.
excluirConteudoModulo(excluirConteudoModuloVars).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_delete);
});
```

### Using `ExcluirConteudoModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirConteudoModuloRef, ExcluirConteudoModuloVariables } from '@dataconnect/generated';

// The `ExcluirConteudoModulo` mutation requires an argument of type `ExcluirConteudoModuloVariables`:
const excluirConteudoModuloVars: ExcluirConteudoModuloVariables = {
  id: ..., 
};

// Call the `excluirConteudoModuloRef()` function to get a reference to the mutation.
const ref = excluirConteudoModuloRef(excluirConteudoModuloVars);
// Variables can be defined inline as well.
const ref = excluirConteudoModuloRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirConteudoModuloRef(dataConnect, excluirConteudoModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conteudoModulo_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conteudoModulo_delete);
});
```

## ExcluirAlternativaQuiz
You can execute the `ExcluirAlternativaQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirAlternativaQuiz(vars: ExcluirAlternativaQuizVariables): MutationPromise<ExcluirAlternativaQuizData, ExcluirAlternativaQuizVariables>;

interface ExcluirAlternativaQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirAlternativaQuizVariables): MutationRef<ExcluirAlternativaQuizData, ExcluirAlternativaQuizVariables>;
}
export const excluirAlternativaQuizRef: ExcluirAlternativaQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirAlternativaQuiz(dc: DataConnect, vars: ExcluirAlternativaQuizVariables): MutationPromise<ExcluirAlternativaQuizData, ExcluirAlternativaQuizVariables>;

interface ExcluirAlternativaQuizRef {
  ...
  (dc: DataConnect, vars: ExcluirAlternativaQuizVariables): MutationRef<ExcluirAlternativaQuizData, ExcluirAlternativaQuizVariables>;
}
export const excluirAlternativaQuizRef: ExcluirAlternativaQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirAlternativaQuizRef:
```typescript
const name = excluirAlternativaQuizRef.operationName;
console.log(name);
```

### Variables
The `ExcluirAlternativaQuiz` mutation requires an argument of type `ExcluirAlternativaQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirAlternativaQuizVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ExcluirAlternativaQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirAlternativaQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirAlternativaQuizData {
  alternativaQuiz_delete?: AlternativaQuiz_Key | null;
}
```
### Using `ExcluirAlternativaQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirAlternativaQuiz, ExcluirAlternativaQuizVariables } from '@dataconnect/generated';

// The `ExcluirAlternativaQuiz` mutation requires an argument of type `ExcluirAlternativaQuizVariables`:
const excluirAlternativaQuizVars: ExcluirAlternativaQuizVariables = {
  id: ..., 
};

// Call the `excluirAlternativaQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirAlternativaQuiz(excluirAlternativaQuizVars);
// Variables can be defined inline as well.
const { data } = await excluirAlternativaQuiz({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirAlternativaQuiz(dataConnect, excluirAlternativaQuizVars);

console.log(data.alternativaQuiz_delete);

// Or, you can use the `Promise` API.
excluirAlternativaQuiz(excluirAlternativaQuizVars).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_delete);
});
```

### Using `ExcluirAlternativaQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirAlternativaQuizRef, ExcluirAlternativaQuizVariables } from '@dataconnect/generated';

// The `ExcluirAlternativaQuiz` mutation requires an argument of type `ExcluirAlternativaQuizVariables`:
const excluirAlternativaQuizVars: ExcluirAlternativaQuizVariables = {
  id: ..., 
};

// Call the `excluirAlternativaQuizRef()` function to get a reference to the mutation.
const ref = excluirAlternativaQuizRef(excluirAlternativaQuizVars);
// Variables can be defined inline as well.
const ref = excluirAlternativaQuizRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirAlternativaQuizRef(dataConnect, excluirAlternativaQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alternativaQuiz_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_delete);
});
```

## ExcluirQuestaoQuiz
You can execute the `ExcluirQuestaoQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirQuestaoQuiz(vars: ExcluirQuestaoQuizVariables): MutationPromise<ExcluirQuestaoQuizData, ExcluirQuestaoQuizVariables>;

interface ExcluirQuestaoQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirQuestaoQuizVariables): MutationRef<ExcluirQuestaoQuizData, ExcluirQuestaoQuizVariables>;
}
export const excluirQuestaoQuizRef: ExcluirQuestaoQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirQuestaoQuiz(dc: DataConnect, vars: ExcluirQuestaoQuizVariables): MutationPromise<ExcluirQuestaoQuizData, ExcluirQuestaoQuizVariables>;

interface ExcluirQuestaoQuizRef {
  ...
  (dc: DataConnect, vars: ExcluirQuestaoQuizVariables): MutationRef<ExcluirQuestaoQuizData, ExcluirQuestaoQuizVariables>;
}
export const excluirQuestaoQuizRef: ExcluirQuestaoQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirQuestaoQuizRef:
```typescript
const name = excluirQuestaoQuizRef.operationName;
console.log(name);
```

### Variables
The `ExcluirQuestaoQuiz` mutation requires an argument of type `ExcluirQuestaoQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirQuestaoQuizVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ExcluirQuestaoQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirQuestaoQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirQuestaoQuizData {
  alternativaQuiz_deleteMany: number;
  questaoQuiz_delete?: QuestaoQuiz_Key | null;
}
```
### Using `ExcluirQuestaoQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirQuestaoQuiz, ExcluirQuestaoQuizVariables } from '@dataconnect/generated';

// The `ExcluirQuestaoQuiz` mutation requires an argument of type `ExcluirQuestaoQuizVariables`:
const excluirQuestaoQuizVars: ExcluirQuestaoQuizVariables = {
  id: ..., 
};

// Call the `excluirQuestaoQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirQuestaoQuiz(excluirQuestaoQuizVars);
// Variables can be defined inline as well.
const { data } = await excluirQuestaoQuiz({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirQuestaoQuiz(dataConnect, excluirQuestaoQuizVars);

console.log(data.alternativaQuiz_deleteMany);
console.log(data.questaoQuiz_delete);

// Or, you can use the `Promise` API.
excluirQuestaoQuiz(excluirQuestaoQuizVars).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_deleteMany);
  console.log(data.questaoQuiz_delete);
});
```

### Using `ExcluirQuestaoQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirQuestaoQuizRef, ExcluirQuestaoQuizVariables } from '@dataconnect/generated';

// The `ExcluirQuestaoQuiz` mutation requires an argument of type `ExcluirQuestaoQuizVariables`:
const excluirQuestaoQuizVars: ExcluirQuestaoQuizVariables = {
  id: ..., 
};

// Call the `excluirQuestaoQuizRef()` function to get a reference to the mutation.
const ref = excluirQuestaoQuizRef(excluirQuestaoQuizVars);
// Variables can be defined inline as well.
const ref = excluirQuestaoQuizRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirQuestaoQuizRef(dataConnect, excluirQuestaoQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alternativaQuiz_deleteMany);
console.log(data.questaoQuiz_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alternativaQuiz_deleteMany);
  console.log(data.questaoQuiz_delete);
});
```

## ExcluirModulo
You can execute the `ExcluirModulo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
excluirModulo(vars: ExcluirModuloVariables): MutationPromise<ExcluirModuloData, ExcluirModuloVariables>;

interface ExcluirModuloRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ExcluirModuloVariables): MutationRef<ExcluirModuloData, ExcluirModuloVariables>;
}
export const excluirModuloRef: ExcluirModuloRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
excluirModulo(dc: DataConnect, vars: ExcluirModuloVariables): MutationPromise<ExcluirModuloData, ExcluirModuloVariables>;

interface ExcluirModuloRef {
  ...
  (dc: DataConnect, vars: ExcluirModuloVariables): MutationRef<ExcluirModuloData, ExcluirModuloVariables>;
}
export const excluirModuloRef: ExcluirModuloRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the excluirModuloRef:
```typescript
const name = excluirModuloRef.operationName;
console.log(name);
```

### Variables
The `ExcluirModulo` mutation requires an argument of type `ExcluirModuloVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ExcluirModuloVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ExcluirModulo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ExcluirModuloData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ExcluirModuloData {
  quiz_deleteMany: number;
  modulo_delete?: Modulo_Key | null;
}
```
### Using `ExcluirModulo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, excluirModulo, ExcluirModuloVariables } from '@dataconnect/generated';

// The `ExcluirModulo` mutation requires an argument of type `ExcluirModuloVariables`:
const excluirModuloVars: ExcluirModuloVariables = {
  id: ..., 
};

// Call the `excluirModulo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await excluirModulo(excluirModuloVars);
// Variables can be defined inline as well.
const { data } = await excluirModulo({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await excluirModulo(dataConnect, excluirModuloVars);

console.log(data.quiz_deleteMany);
console.log(data.modulo_delete);

// Or, you can use the `Promise` API.
excluirModulo(excluirModuloVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_deleteMany);
  console.log(data.modulo_delete);
});
```

### Using `ExcluirModulo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, excluirModuloRef, ExcluirModuloVariables } from '@dataconnect/generated';

// The `ExcluirModulo` mutation requires an argument of type `ExcluirModuloVariables`:
const excluirModuloVars: ExcluirModuloVariables = {
  id: ..., 
};

// Call the `excluirModuloRef()` function to get a reference to the mutation.
const ref = excluirModuloRef(excluirModuloVars);
// Variables can be defined inline as well.
const ref = excluirModuloRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = excluirModuloRef(dataConnect, excluirModuloVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_deleteMany);
console.log(data.modulo_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_deleteMany);
  console.log(data.modulo_delete);
});
```

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

