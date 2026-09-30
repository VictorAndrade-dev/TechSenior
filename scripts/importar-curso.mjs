import { readFile } from "node:fs/promises";
import path from "node:path";

const CONNECTOR_CONFIG = {
  connector: "example",
  serviceId: "tech-senior-service",
  location: "southamerica-east1",
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isOptionalText(value) {
  return value === undefined || value === null || typeof value === "string";
}

function addTextError(errors, value, label, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) errors.push(`${label}: campo obrigatório.`);
    return;
  }
  if (typeof value !== "string" || (required && value.trim() === "")) {
    errors.push(`${label}: informe um texto${required ? " não vazio" : " ou null"}.`);
  }
}

function validateOptionalTextFields(record, keys, label, errors) {
  for (const key of keys) {
    if (!isOptionalText(record[key])) {
      errors.push(`${label}.${key}: deve ser texto ou null.`);
    }
  }
}

function validateOrder(value, label, errors) {
  if (!Number.isInteger(value) || value < 1) {
    errors.push(`${label}: ordem deve ser um número inteiro positivo.`);
  }
}

function validateUniqueOrders(items, label, errors) {
  const seen = new Set();
  for (const [index, item] of items.entries()) {
    if (!isRecord(item) || !Number.isInteger(item.ordem) || item.ordem < 1) continue;
    if (seen.has(item.ordem)) {
      errors.push(`${label}[${index}].ordem: valor ${item.ordem} duplicado.`);
    }
    seen.add(item.ordem);
  }
}

function validateAlternativas(questao, label, errors) {
  if (!Array.isArray(questao.alternativas)) {
    errors.push(`${label}.alternativas: deve ser um array.`);
    return;
  }
  if (questao.alternativas.length < 2 || questao.alternativas.length > 5) {
    errors.push(`${label}.alternativas: informe de 2 a 5 alternativas.`);
  }

  let corretas = 0;
  for (const [index, alternativa] of questao.alternativas.entries()) {
    const altLabel = `${label}.alternativas[${index}]`;
    if (!isRecord(alternativa)) {
      errors.push(`${altLabel}: deve ser um objeto.`);
      continue;
    }
    addTextError(errors, alternativa.texto, `${altLabel}.texto`, { required: true });
    if (typeof alternativa.correta !== "boolean") {
      errors.push(`${altLabel}.correta: deve ser boolean.`);
    } else if (alternativa.correta) {
      corretas += 1;
    }
    validateOptionalTextFields(alternativa, ["explicacao"], altLabel, errors);
    validateOrder(alternativa.ordem, `${altLabel}.ordem`, errors);
  }
  if (corretas !== 1) {
    errors.push(`${label}.alternativas: deve haver exatamente uma alternativa correta.`);
  }
  validateUniqueOrders(questao.alternativas, `${label}.alternativas`, errors);
}

function validateQuestoes(questoes, label, errors, { min = 1, max = Infinity } = {}) {
  if (!Array.isArray(questoes)) {
    errors.push(`${label}: deve ser um array.`);
    return;
  }
  if (questoes.length < min || questoes.length > max) {
    const faixa = Number.isFinite(max) ? `de ${min} a ${max}` : `pelo menos ${min}`;
    errors.push(`${label}: informe ${faixa} questões.`);
  }

  for (const [index, questao] of questoes.entries()) {
    const questaoLabel = `${label}[${index}]`;
    if (!isRecord(questao)) {
      errors.push(`${questaoLabel}: deve ser um objeto.`);
      continue;
    }
    addTextError(errors, questao.pergunta, `${questaoLabel}.pergunta`, { required: true });
    validateOrder(questao.ordem, `${questaoLabel}.ordem`, errors);
    validateAlternativas(questao, questaoLabel, errors);
  }
  validateUniqueOrders(questoes, label, errors);
}

function validateCursoData(data) {
  const errors = [];
  if (!isRecord(data)) return ["raiz: deve ser um objeto JSON."];

  const curso = data.curso;
  if (!isRecord(curso)) {
    errors.push("curso: deve ser um objeto.");
  } else {
    addTextError(errors, curso.nome, "curso.nome", { required: true });
    addTextError(errors, curso.dificuldade, "curso.dificuldade", { required: true });
    if (!Number.isInteger(curso.cargaHoraria) || curso.cargaHoraria <= 0) {
      errors.push("curso.cargaHoraria: deve ser um número inteiro positivo.");
    }
    if (curso.ativo !== undefined && typeof curso.ativo !== "boolean") {
      errors.push("curso.ativo: deve ser boolean.");
    }
    if (curso.publicado !== undefined && typeof curso.publicado !== "boolean") {
      errors.push("curso.publicado: deve ser boolean, se informado.");
    }
    validateOptionalTextFields(curso, ["descricao", "imagem", "icone"], "curso", errors);
  }

  if (!Array.isArray(data.modulos) || data.modulos.length === 0) {
    errors.push("modulos: informe um array com pelo menos um módulo.");
  } else {
    for (const [moduleIndex, modulo] of data.modulos.entries()) {
      const moduleLabel = `modulos[${moduleIndex}]`;
      if (!isRecord(modulo)) {
        errors.push(`${moduleLabel}: deve ser um objeto.`);
        continue;
      }
      addTextError(errors, modulo.nome, `${moduleLabel}.nome`, { required: true });
      validateOrder(modulo.ordem, `${moduleLabel}.ordem`, errors);
      validateOptionalTextFields(modulo, ["descricao", "imagem"], moduleLabel, errors);
      if (modulo.duracaoMinutos !== undefined && modulo.duracaoMinutos !== null
        && (!Number.isInteger(modulo.duracaoMinutos) || modulo.duracaoMinutos <= 0)) {
        errors.push(`${moduleLabel}.duracaoMinutos: deve ser inteiro positivo ou null.`);
      }

      if (modulo.conteudos !== undefined && !Array.isArray(modulo.conteudos)) {
        errors.push(`${moduleLabel}.conteudos: deve ser um array.`);
      } else {
        const conteudos = modulo.conteudos ?? [];
        for (const [contentIndex, conteudo] of conteudos.entries()) {
          const contentLabel = `${moduleLabel}.conteudos[${contentIndex}]`;
          if (!isRecord(conteudo)) {
            errors.push(`${contentLabel}: deve ser um objeto.`);
            continue;
          }
          addTextError(errors, conteudo.tipo, `${contentLabel}.tipo`, { required: true });
          validateOrder(conteudo.ordem, `${contentLabel}.ordem`, errors);
          validateOptionalTextFields(conteudo, ["titulo", "conteudo", "url", "altTexto"], contentLabel, errors);
        }
        validateUniqueOrders(conteudos, `${moduleLabel}.conteudos`, errors);
      }

      if (modulo.quiz !== undefined && modulo.quiz !== null) {
        if (!isRecord(modulo.quiz)) {
          errors.push(`${moduleLabel}.quiz: deve ser um objeto ou null.`);
        } else {
          validateQuestoes(modulo.quiz.questoes, `${moduleLabel}.quiz.questoes`, errors);
        }
      }
    }
    validateUniqueOrders(data.modulos, "modulos", errors);
  }

  if (!isRecord(data.testeFinal)) {
    errors.push("testeFinal: obrigatório e deve ser um objeto.");
  } else {
    validateQuestoes(data.testeFinal.questoes, "testeFinal.questoes", errors, { min: 10, max: 15 });
  }
  return errors;
}

function getAlternativesTotal(data) {
  let total = 0;
  for (const modulo of data.modulos) {
    for (const questao of modulo.quiz?.questoes ?? []) total += questao.alternativas.length;
  }
  for (const questao of data.testeFinal.questoes) total += questao.alternativas.length;
  return total;
}

function getImportSummary(data) {
  const contents = data.modulos.reduce((total, modulo) => total + (modulo.conteudos?.length ?? 0), 0);
  const moduleQuizzes = data.modulos.filter((modulo) => modulo.quiz != null);
  const moduleQuestions = moduleQuizzes.reduce((total, modulo) => total + modulo.quiz.questoes.length, 0);
  const finalQuestions = data.testeFinal.questoes.length;
  return {
    modules: data.modulos.length,
    contents,
    moduleQuizzes: moduleQuizzes.length,
    moduleQuestions,
    finalQuestions,
    alternatives: getAlternativesTotal(data),
  };
}

function printSummary(data) {
  const summary = getImportSummary(data);
  console.log(`Curso: ${data.curso.nome}`);
  console.log(`Módulos: ${summary.modules}`);
  console.log(`Conteúdos: ${summary.contents}`);
  console.log(`Quizzes de módulo: ${summary.moduleQuizzes}`);
  console.log(`Questões de módulo: ${summary.moduleQuestions}`);
  console.log(`Questões do teste final: ${summary.finalQuestions}`);
  console.log(`Alternativas totais: ${summary.alternatives}`);
}

function getReturnedId(response, fieldName) {
  const id = response?.data?.[fieldName]?.id;
  if (typeof id !== "string" || id.length === 0) {
    throw new Error(`A mutation não retornou o ID esperado em ${fieldName}.`);
  }
  return id;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const jsonPath = args.find((arg) => arg !== "--dry-run");

  if (!jsonPath) {
    console.error("Uso: node scripts/importar-curso.mjs <arquivo.json> [--dry-run]");
    process.exitCode = 1;
    return;
  }

  let data;
  try {
    const resolvedPath = path.resolve(process.cwd(), jsonPath);
    data = JSON.parse(await readFile(resolvedPath, "utf8"));
  } catch (error) {
    console.error(`[ERRO] Não foi possível carregar o JSON: ${getErrorMessage(error)}`);
    process.exitCode = 1;
    return;
  }

  const validationErrors = validateCursoData(data);
  if (validationErrors.length > 0) {
    console.error("[VALIDAÇÃO] Encontrados erros no JSON:");
    for (const error of validationErrors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log("[VALIDAÇÃO] JSON válido.");
  if (dryRun) {
    console.log("[DRY-RUN] Nenhuma chamada ao Data Connect será feita.");
    printSummary(data);
    return;
  }

  const adminUid = process.env.ADMIN_UID?.trim();
  if (!adminUid) {
    console.error("[ERRO] Defina ADMIN_UID no ambiente antes da importação.");
    process.exitCode = 1;
    return;
  }

  const [{ initializeApp }, { getDataConnect }] = await Promise.all([
    import("firebase-admin/app"),
    import("firebase-admin/data-connect"),
  ]);
  const impersonation = { impersonate: { authClaims: { sub: adminUid } } };
  const app = initializeApp({ projectId: "tech-senior" });
  const dataConnect = getDataConnect(CONNECTOR_CONFIG, app);
  const created = { modules: [], contents: [], quizzes: [], questions: [], alternatives: [] };
  let courseId;
  let currentStage = "CriarCurso";
  let publicationAttempted = false;

  const runMutation = (name, variables) => dataConnect.executeMutation(name, variables, impersonation);

  try {
    console.log(`[CURSO] Criando ${data.curso.nome}...`);
    const courseResult = await runMutation("CriarCurso", {
      nome: data.curso.nome,
      descricao: data.curso.descricao ?? null,
      dificuldade: data.curso.dificuldade,
      cargaHoraria: data.curso.cargaHoraria,
      imagem: data.curso.imagem ?? null,
      icone: data.curso.icone ?? null,
      ativo: true,
    });
    courseId = getReturnedId(courseResult, "curso_insert");
    console.log(`[CURSO] Criado: ${courseId}`);

    for (const [moduleIndex, modulo] of data.modulos.entries()) {
      currentStage = `CriarModulo (${moduleIndex + 1}/${data.modulos.length}: ${modulo.nome})`;
      console.log(`\n[MÓDULO ${moduleIndex + 1}/${data.modulos.length}] ${modulo.nome}`);
      const moduleResult = await runMutation("CriarModulo", {
        cursoId: courseId,
        nome: modulo.nome,
        descricao: modulo.descricao ?? null,
        ordem: modulo.ordem,
        duracaoMinutos: modulo.duracaoMinutos ?? null,
        imagem: modulo.imagem ?? null,
      });
      const moduloId = getReturnedId(moduleResult, "modulo_insert");
      created.modules.push(moduloId);
      console.log(`  Criado: ${moduloId}`);

      const conteudos = modulo.conteudos ?? [];
      for (const [contentIndex, conteudo] of conteudos.entries()) {
        currentStage = `CriarConteudoModulo (${modulo.nome}, conteúdo ${contentIndex + 1}/${conteudos.length})`;
        const contentResult = await runMutation("CriarConteudoModulo", {
          moduloId,
          tipo: conteudo.tipo,
          titulo: conteudo.titulo ?? null,
          conteudo: conteudo.conteudo ?? null,
          url: conteudo.url ?? null,
          altTexto: conteudo.altTexto ?? null,
          ordem: conteudo.ordem,
        });
        created.contents.push(getReturnedId(contentResult, "conteudoModulo_insert"));
        console.log(`  [CONTEÚDO ${contentIndex + 1}/${conteudos.length}] criado`);
      }

      if (modulo.quiz != null) {
        currentStage = `CriarQuiz (módulo ${modulo.nome})`;
        const quizResult = await runMutation("CriarQuiz", {
          cursoId: courseId,
          moduloId,
          tipo: "modulo",
        });
        const quizId = getReturnedId(quizResult, "quiz_insert");
        created.quizzes.push(quizId);
        console.log(`  [QUIZ] criado: ${quizId}`);
        await importQuestions(modulo.quiz.questoes, quizId, `QUIZ ${modulo.nome}`, runMutation, created, (stage) => {
          currentStage = stage;
        });
      }
    }

    currentStage = "CriarQuiz (teste final)";
    console.log("\n[TESTE FINAL]");
    const finalQuizResult = await runMutation("CriarQuiz", {
      cursoId: courseId,
      moduloId: null,
      tipo: "final",
    });
    const finalQuizId = getReturnedId(finalQuizResult, "quiz_insert");
    created.quizzes.push(finalQuizId);
    console.log(`[QUIZ] criado: ${finalQuizId}`);
    console.log(`Criando ${data.testeFinal.questoes.length} questões...`);
    await importQuestions(data.testeFinal.questoes, finalQuizId, "TESTE FINAL", runMutation, created, (stage) => {
      currentStage = stage;
    });

    currentStage = "EditarCurso (publicação)";
    publicationAttempted = true;
    const publishResult = await runMutation("EditarCurso", {
      id: courseId,
      nome: data.curso.nome,
      descricao: data.curso.descricao ?? null,
      dificuldade: data.curso.dificuldade,
      cargaHoraria: data.curso.cargaHoraria,
      imagem: data.curso.imagem ?? null,
      icone: data.curso.icone ?? null,
      ativo: true,
      publicado: true,
    });
    if (!publishResult?.data?.curso_update) {
      throw new Error("A mutation EditarCurso não confirmou a atualização do curso.");
    }
    console.log("\n[PUBLICAÇÃO] Curso publicado.");
    console.log("\nIMPORTAÇÃO CONCLUÍDA");
    console.log(`Curso ID: ${courseId}`);
    console.log(`Módulos: ${created.modules.length}`);
    console.log(`Conteúdos: ${created.contents.length}`);
    console.log(`Quizzes: ${created.quizzes.length}`);
    console.log(`Questões: ${created.questions.length}`);
    console.log(`Alternativas: ${created.alternatives.length}`);
  } catch (error) {
    console.error("\nIMPORTAÇÃO INTERROMPIDA");
    console.error(`Curso ID: ${courseId ?? "não criado"}`);
    console.error(`Etapa: ${currentStage}`);
    console.error(`Erro: ${getErrorMessage(error)}`);
    console.error("Entidades já criadas:");
    console.error(`- módulos: ${created.modules.length} (${created.modules.join(", ") || "nenhum"})`);
    console.error(`- conteúdos: ${created.contents.length} (${created.contents.join(", ") || "nenhum"})`);
    console.error(`- quizzes: ${created.quizzes.length} (${created.quizzes.join(", ") || "nenhum"})`);
    console.error(`- questões: ${created.questions.length} (${created.questions.join(", ") || "nenhuma"})`);
    console.error(`- alternativas: ${created.alternatives.length} (${created.alternatives.join(", ") || "nenhuma"})`);
    if (publicationAttempted) {
      console.error("A publicação não foi confirmada. Confira o status do curso no Admin antes de tentar novamente.");
    } else {
      console.error("O curso permaneceu como rascunho (não publicado).");
    }
    console.error("Não execute novamente o mesmo JSON antes de tratar este curso.");
    process.exitCode = 1;
  } finally {
    await app.delete();
  }
}

async function importQuestions(questoes, quizId, label, runMutation, created, setStage) {
  for (const [questionIndex, questao] of questoes.entries()) {
    setStage(`CriarQuestaoQuiz (${label}, questão ${questionIndex + 1}/${questoes.length})`);
    const questionResult = await runMutation("CriarQuestaoQuiz", {
      quizId,
      pergunta: questao.pergunta,
      ordem: questao.ordem,
    });
    const questaoId = getReturnedId(questionResult, "questaoQuiz_insert");
    created.questions.push(questaoId);
    console.log(`  [QUESTÃO ${questionIndex + 1}/${questoes.length}] criada: ${questaoId}`);

    for (const [alternativeIndex, alternativa] of questao.alternativas.entries()) {
      setStage(`CriarAlternativaQuiz (${label}, questão ${questionIndex + 1}, alternativa ${alternativeIndex + 1}/${questao.alternativas.length})`);
      const alternativeResult = await runMutation("CriarAlternativaQuiz", {
        questaoId,
        texto: alternativa.texto,
        correta: alternativa.correta,
        explicacao: alternativa.explicacao ?? null,
        ordem: alternativa.ordem,
      });
      created.alternatives.push(getReturnedId(alternativeResult, "alternativaQuiz_insert"));
      console.log(`    [ALTERNATIVA ${alternativeIndex + 1}/${questao.alternativas.length}] criada`);
    }
  }
}

await main();
