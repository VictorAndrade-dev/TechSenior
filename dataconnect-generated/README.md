# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*MeuPerfil*](#meuperfil)
- [**Mutations**](#mutations)
  - [*CadastrarUsuario*](#cadastrarusuario)

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

