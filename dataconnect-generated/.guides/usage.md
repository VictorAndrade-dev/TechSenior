# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { cadastrarUsuario, meuPerfil } from '@dataconnect/generated';


// Operation CadastrarUsuario:  For variables, look at type CadastrarUsuarioVars in ../index.d.ts
const { data } = await CadastrarUsuario(dataConnect, cadastrarUsuarioVars);

// Operation MeuPerfil: 
const { data } = await MeuPerfil(dataConnect);


```