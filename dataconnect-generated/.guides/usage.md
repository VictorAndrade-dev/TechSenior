# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listarCursos, buscarCurso, listarModulosDoCurso, listarConteudosDoModulo, criarCurso, criarModulo, criarConteudoModulo, buscarQuizDoModulo, listarQuestoesDoQuiz, listarAlternativasDaQuestao } from '@dataconnect/generated';


// Operation ListarCursos: 
const { data } = await ListarCursos(dataConnect);

// Operation BuscarCurso:  For variables, look at type BuscarCursoVars in ../index.d.ts
const { data } = await BuscarCurso(dataConnect, buscarCursoVars);

// Operation ListarModulosDoCurso:  For variables, look at type ListarModulosDoCursoVars in ../index.d.ts
const { data } = await ListarModulosDoCurso(dataConnect, listarModulosDoCursoVars);

// Operation ListarConteudosDoModulo:  For variables, look at type ListarConteudosDoModuloVars in ../index.d.ts
const { data } = await ListarConteudosDoModulo(dataConnect, listarConteudosDoModuloVars);

// Operation CriarCurso:  For variables, look at type CriarCursoVars in ../index.d.ts
const { data } = await CriarCurso(dataConnect, criarCursoVars);

// Operation CriarModulo:  For variables, look at type CriarModuloVars in ../index.d.ts
const { data } = await CriarModulo(dataConnect, criarModuloVars);

// Operation CriarConteudoModulo:  For variables, look at type CriarConteudoModuloVars in ../index.d.ts
const { data } = await CriarConteudoModulo(dataConnect, criarConteudoModuloVars);

// Operation BuscarQuizDoModulo:  For variables, look at type BuscarQuizDoModuloVars in ../index.d.ts
const { data } = await BuscarQuizDoModulo(dataConnect, buscarQuizDoModuloVars);

// Operation ListarQuestoesDoQuiz:  For variables, look at type ListarQuestoesDoQuizVars in ../index.d.ts
const { data } = await ListarQuestoesDoQuiz(dataConnect, listarQuestoesDoQuizVars);

// Operation ListarAlternativasDaQuestao:  For variables, look at type ListarAlternativasDaQuestaoVars in ../index.d.ts
const { data } = await ListarAlternativasDaQuestao(dataConnect, listarAlternativasDaQuestaoVars);


```