import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  carregarProgressoCurso,
  salvarProgressoCurso,
} from "./ServicoProgresso.js";

/* ==========================================
            CURSO - CELULAR
========================================== */

const modulos = [
  {
    titulo: "O que são compras online?",
    descricao:
      "O que são compras online? Compras online são compras realizadas pela internet, utilizando um celular, computador ou tablet. É possível comprar diversos produtos sem precisar sair de casa. Onde podemos comprar? Existem lojas virtuais, aplicativos de lojas, supermercados e marketplaces. Antes de comprar, é importante verificar se o site ou aplicativo é confiável.",
    imagem: "Imagens/CelularCurso.png",
    importante:
      "Nem toda oferta encontrada na internet é verdadeira. É importante verificar a loja, o preço, as avaliações e as condições da compra antes de realizar o pagamento.",
    dica: "Se desconfiar de alguma loja online, procure outra que seja mais bem avaliada ou acesse o site de uma de confiança.",
    duracao: "5 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta: "O que são compras online?",
      opcoes: [
        "Compras realizadas somente em lojas físicas",
        "Compras realizadas pela internet usando um celular, computador ou tablet",
        "Compras que só podem ser feitas por telefone",
        "Compras realizadas sem precisar escolher um produto.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque compras online são realizadas pela internet, e não somente em lojas físicas.",
        "Correto! Compras online são feitas pela internet usando dispositivos como celular, computador ou tablet.",
        "Incorreto, porque uma compra online não precisa ser feita por telefone. Ela pode ser realizada diretamente por sites ou aplicativos.",
        "Incorreto, porque para realizar uma compra é necessário escolher o produto, conferir as informações e só depois finalizar o pedido.",
      ],
    },
  },
  {
    titulo: "Encontrando um produto",
    descricao:
      "Como pesquisar um produto? Primeiro, abra o site ou aplicativo de uma loja confiável. Depois, utilize a barra de pesquisa para procurar o produto desejado. Por exemplo, se você deseja comprar um ventilador, digite 'ventilador' na barra de pesquisa. Mas cuidado! Antes de escolher um produto, observe: O preço; O tamanho e as características; A marca; A quantidade; A avaliação de outros compradores; O valor do frete; O prazo de entrega..",
    imagem: "Imagens/Cursos/Celular/modulo2.png",
    importante:
      "Uma oferta muito abaixo do preço normal pode ser um sinal de golpe. Sempre desconfie de preços que parecem bons demais para serem verdade.",
    dica: "Sempre compare os preços do que você quer comprar, se atentando sempre ao preço dos itens.",
    duracao: "6 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Antes de comprar um produto pela internet, o que é importante verificar?",
      opcoes: [
        "Apenas o nome do produto.",
        "O preço, as características, as avaliações, o frete e o prazo de entrega.",
        "Somente se o produto possui uma foto bonita.",
        "Comprar imediatamente quando encontrar o primeiro produto.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque saber apenas o nome do produto não é suficiente para decidir se a compra vale a pena.",
        "Correto! Verificar essas informações ajuda a escolher o produto certo e evitar surpresas, como frete caro ou prazo de entrega muito longo.",
        "Incorreto, porque uma foto bonita não garante que o produto seja de boa qualidade ou corresponda ao que você precisa.",
        "Incorreto, porque é importante pesquisar e comparar diferentes opções antes de decidir pela compra.",
      ],
    },
  },
  {
    titulo: "Escolhendo um produto",
    descricao:
      "Antes de colocar o produto no carrinho, leia sua descrição com atenção. Verifique se: É realmente o produto que você deseja; O tamanho ou modelo está correto; A quantidade está correta; Existem diferentes opções de cor ou versão; O produto possui garantia, quando aplicável. Depois de escolher o produto, clique em 'Adicionar ao carrinho' ou em um botão semelhante. O carrinho funciona como uma cesta de compras: você pode colocar produtos nele e conferir tudo antes de pagar.",
    imagem: "Imagens/Cursos/Celular/modulo3.png",
    importante:
      "As avaliações de outros compradores podem ajudar a descobrir se o produto realmente corresponde ao anúncio.",
    dica: "Observe principalmente os comentários de pessoas que já receberam e utilizaram o produto.",
    duracao: "8 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Por que é importante ler a descrição e as avaliações de um produto antes de comprá-lo?",
      opcoes: [
        "Para deixar a compra mais demorada.",
        "Para verificar se o produto realmente corresponde ao que você procura e conhecer a experiência de outros compradores.",
        "Porque todas as lojas obrigam o cliente a ler os comentários.",
        "Para conseguir um desconto automaticamente.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque ler as informações não tem o objetivo de atrasar a compra, mas sim de ajudar a fazer uma escolha melhor.",
        "Correto, porque a descrição mostra as características do produto e as avaliações ajudam a conhecer a experiência de pessoas que já compraram.",
        "Incorreto, porque ler os comentários é uma escolha do comprador e serve para ajudar na decisão.",
        "Incorreto, porque ler avaliações ou a descrição de um produto não garante nenhum desconto.",
      ],
    },
  },
  {
    titulo: "Finalizando a compra",
    descricao:
      "Antes de continuar, verifique: Produto escolhido; Quantidade; Preço; Frete; Prazo de entrega; Valor total da compra. Se alguma informação estiver errada, corrija antes de continuar.",
    imagem: "Imagens/Cursos/Celular/modulo4.png",
    importante:
      "Para receber o produto em casa, será necessário informar o endereço de entrega. Verifique se foi adicionado: Nome do destinatário; CEP; Rua; Número; Complemento, se houver; Bairro; Cidade e estado.",
    dica: "Um endereço preenchido incorretamente pode impedir ou atrasar a entrega.",
    duracao: "10 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta: "Antes de finalizar uma compra online, o que devemos conferir",
      opcoes: [
        "Somente o nome do produto.",
        "Somente o preço do produto.",
        "O produto, a quantidade, o endereço, o prazo de entrega e o valor total.",
        "Se o site tem imagens bonitas.",
      ],
      correta: 2,
      explicacoes: [
        "Incorreto, porque saber apenas o nome do produto não garante que todas as informações da compra estejam corretas.",
        "Incorreto, porque além do preço do produto, é importante verificar outros valores, como o frete, e conferir as demais informações.",
        "Correto, porque conferir todos esses dados antes de finalizar ajuda a evitar erros no pedido e cobranças inesperadas.",
        "Incorreto, porque as imagens não são suficientes para garantir que a compra esteja correta. É necessário conferir todas as informações do pedido.",
      ],
    },
  },
  {
    titulo: "Pgagando pela compra",
    descricao:
      "Dependendo da loja, podem existir diferentes formas de pagamento, como: Cartão de crédito; Cartão de débito; PIX; Boleto bancário. Escolha uma forma de pagamento que você conheça e saiba utilizar.",
    imagem: "Imagens/Cursos/Celular/modulo5.png",
    importante:
      "Antes de confirmar, confira novamente o valor total da compra. No caso do PIX ou boleto, verifique se os dados do pagamento correspondem à loja e ao valor da compra.",
    dica: "Nunca faça um pagamento apenas porque alguém enviou uma mensagem dizendo que você ganhou um desconto ou precisa pagar uma taxa.",
    duracao: "8 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Qual cuidado devemos ter antes de realizar o pagamento de uma compra online?",
      opcoes: [
        "Pagar rapidamente sem conferir o valor.",
        "Conferir o valor total e verificar se os dados do pagamento estão corretos.",
        "Enviar nossa senha para confirmar o pagamento.",
        "Fazer o pagamento mesmo quando os dados parecem suspeitos.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque é importante conferir o valor da compra antes de realizar o pagamento",
        "Correto! porque conferir o valor total e os dados do pagamento ajuda a evitar erros e possíveis golpes.",
        "Incorreto, porque senhas são informações pessoais e nunca devem ser compartilhadas com outras pessoas.",
        "Incorreto, porque dados suspeitos podem indicar uma tentativa de golpe. Nesse caso, é melhor não realizar o pagamento até verificar a situação.",
      ],
    },
  },
  {
    titulo: "Finalizando a compra",
    descricao:
      "Essa é uma das etapas mais importantes. Confira: O produto; A quantidade; O endereço; O prazo de entrega; O valor total; A forma de pagamento. Se todas as informações estiverem corretas, confirme a compra.",
    imagem: "Imagens/Cursos/Celular/modulo6.png",
    importante:
      "Após o pagamento, a loja normalmente apresenta uma confirmação do pedido. Guarde: Número do pedido; Comprovante de pagamento; E-mail ou mensagem de confirmação; Prazo estimado de entrega.",
    dica: "Essas informações podem ser importantes caso aconteça algum problema com a compra.",
    duracao: "12 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta: "O que devemos fazer antes de confirmar uma compra online?",
      opcoes: [
        "Clicar em “Confirmar compra” imediatamente.",
        "Conferir o produto, o endereço, o prazo de entrega, o valor total e a forma de pagamento.",
        "Compartilhar o código de confirmação com outra pessoa.",
        "Ignorar as informações do pedido e apenas verificar se o pagamento foi aprovado.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque é importante revisar todas as informações antes de confirmar a compra.",
        "Correto! porque conferir esses dados ajuda a evitar erros no pedido e garante que tudo esteja correto antes do pagamento.",
        "Incorreto, porque códigos de confirmação são informações pessoais e não devem ser compartilhados com outras pessoas.",
        "Incorreto, porque não basta verificar o pagamento. É necessário conferir todos os detalhes do pedido antes de finalizá-lo.",
      ],
    },
  },
  {
    titulo: "Acompanhando a entrega",
    descricao:
      "Muitas lojas possuem uma área chamada 'Meus pedidos' ou 'Acompanhar pedido'. Nela, é possível verificar se o pedido: Está sendo preparado; Já foi enviado; Está em transporte; Saiu para entrega; Foi entregue.",
    imagem: "Imagens/Cursos/Celular/modulo6.png",
    importante:
      "O produto não chegou? Se o prazo de entrega passou, entre em contato com a loja pelos canais oficiais de atendimento.",
    dica: "Evite clicar em links recebidos de desconhecidos dizendo que existe um problema com sua entrega.",
    duracao: "12 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta: "Onde podemos acompanhar o andamento de uma compra realizada pela internet?",
      opcoes: [
        "Somente por meio de mensagens de pessoas desconhecidas.",
        "Na área de “Meus pedidos” ou “Acompanhar pedido” da loja.",
        "Pedindo a senha da loja para um amigo.",
        "Clicando em qualquer link recebido por mensagem.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto, porque mensagens de desconhecidos podem ser tentativas de golpe. O acompanhamento deve ser feito pelos canais oficiais da loja.",
        "Correto! porque a área de “Meus pedidos” permite verificar o andamento da compra e acompanhar a entrega.",
        "Incorreto, porque não é necessário compartilhar ou pedir senhas para acompanhar um pedido.",
        "Incorreto, porque links recebidos de desconhecidos podem ser falsos ou perigosos. O ideal é acessar diretamente o site ou aplicativo oficial da loja.",
      ],
    },
  },
  {
    titulo: "Comprando com segurança",
    descricao:
      "Antes de comprar, procure informações sobre a loja e confira se o endereço do site está correto. Também é importante observar: Se existe canal de atendimento; Se a loja possui informações claras sobre seus produtos; Se existem avaliações de outros clientes; Se o site utiliza uma conexão segura; Se os preços são compatíveis com os praticados normalmente.",
    imagem: "Imagens/Cursos/Celular/modulo6.png",
    importante:
      "Desconfie de: Promoções exageradas; Links enviados por desconhecidos; Mensagens dizendo que sua compra está bloqueada; Pedidos de pagamento de uma 'taxa de entrega' inesperada; Pessoas solicitando códigos recebidos por SMS; Sites com endereço estranho ou diferente do site oficial.",
    dica: "Nunca compartilhe sua senha, códigos de confirmação ou informações bancárias com outras pessoas. Em caso de dúvida, pare a compra e peça ajuda a alguém de confiança antes de realizar o pagamento.",
    duracao: "12 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta: "Qual atitude é mais segura ao fazer uma compra pela internet?",
      opcoes: [
        "Comprar imediatamente quando encontrar uma oferta muito barata.",
        "Compartilhar senhas e códigos de confirmação quando alguém pedir.",
        "Verificar se a loja é confiável e desconfiar de ofertas ou mensagens suspeitas.",
        "Clicar em qualquer link recebido para acompanhar a entrega.",
      ],
      correta: 2,
      explicacoes: [
        "Incorreto, porque ofertas muito abaixo do preço normal podem ser um sinal de golpe. É importante pesquisar antes de comprar.",
        "Incorreto, porque senhas e códigos de confirmação são informações pessoais e nunca devem ser compartilhados.",
        "Correto, porque verificar a loja e desconfiar de situações suspeitas ajuda a evitar golpes e compras fraudulentas.",
        "Incorreto, porque links desconhecidos podem levar a páginas falsas. O ideal é acessar diretamente o site ou aplicativo oficial da loja.",
      ],
    },
  },
];

/* ==========================================
            ELEMENTOS DA PÁGINA
========================================== */
const ID_CURSO = "celular";
let moduloAtual = 0;

const listaModulos = document.querySelector(".lista-modulos");
const conteudoModulo = document.querySelector(".conteudo-aula");

const porcentagemTexto = document.querySelector(".porcentagem");
const barraPreenchimento = document.querySelector(
  ".barra-progresso-preenchimento",
);
const indicadorModuloTopo = document.querySelector(
  ".progresso-texto span:first-child",
);

/* ==========================================
            PROGRESSO DO USUÁRIO
========================================== */
let progresso = new Array(modulos.length).fill(false);
let filaDeSalvamento = Promise.resolve();

/* ==========================================
            CARREGAR CONTEÚDO DO MÓDULO
========================================== */
function carregarModulo(indice) {
  moduloAtual = indice;
  const modulo = modulos[indice];

  // Formatar descrição substituindo quebras duplas de linha por tags de parágrafo <p>
  // E quebras simples \n por <br> dentro do mesmo parágrafo
  const parágrafos = modulo.descricao
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  // Opções do Quiz (Sempre começam limpas)
  const opcoesQuiz = modulo.quiz.opcoes
    .map(
      (opcao, i) => `
        <button class="opcao-quiz" data-index="${i}">
            <span class="letra-opcao">${String.fromCharCode(65 + i)}</span>
            <span class="texto-opcao">${opcao}</span>
        </button>
    `,
    )
    .join("");

  // Preenche o conteúdo dinamicamente
  conteudoModulo.innerHTML = `
        <div class="card-aula-corpo">
            <span class="badge-modulo">Módulo ${indice + 1}</span>

            <div class="bloco-introducao">
                <div class="texto-introducao">
                    <h1>${modulo.titulo}</h1>
                    ${parágrafos}
                </div>

                <div class="imagem-ilustration">
                    <img src="${modulo.imagem}" alt="${modulo.titulo}">
                </div>
            </div>

            <div class="card-destaque card-importante">
                <div class="icone-destaque">
                    <i class="fa-regular fa-lightbulb"></i>
                </div>
                <div class="texto-destaque">
                    <strong>Importante</strong>
                    <p>${modulo.importante}</p>
                </div>
            </div>

            <div class="card-destaque card-dica">
                <div class="icone-destaque">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="texto-destaque">
                    <strong>Dica</strong>
                    <p>${modulo.dica}</p>
                </div>
            </div>

            <div class="container-quiz">
                <div class="header-quiz">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <h3>Teste seu conhecimento</h3>
                </div>
                <p class="pergunta-quiz">${modulo.quiz.pergunta}</p>
                
                <div class="opcoes-container">
                    ${opcoesQuiz}
                </div>

                <div id="feedbackQuiz" class="feedback-quiz"></div>
            </div>

            <div class="navegacao-aula">
                <button id="btnAnterior" class="btn-navegacao ${indice === 0 ? "desabilitado" : "btn-proxima"}" ${indice === 0 ? "disabled" : ""}>
                    <i class="fa-solid fa-arrow-left"></i>
                    Aula anterior
                </button>

                <span class="indicador-modulo-bottom">Módulo ${indice + 1} de ${modulos.length}</span>

                <button id="btnProximo" class="btn-navegacao desabilitado" disabled>
                    Próxima aula
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

  // Atribuir os eventos aos botões recém-criados
  setTimeout(() => {
    configurarEventosQuiz(indice);

    const btnAnterior = document.getElementById("btnAnterior");

    if (btnAnterior && indice > 0) {
      btnAnterior.onclick = () => {
        carregarModulo(indice - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }, 0);

  atualizarSidebar();
  atualizarProgresso();
  salvarProgresso();
}

/* ==========================================
            LÓGICA DO QUIZ COM EXPLICAÇÃO
========================================== */

function configurarEventosQuiz(indiceModulo) {
  const botoesOpcao = document.querySelectorAll(".opcao-quiz");
  const feedback = document.getElementById("feedbackQuiz");
  const btnProximo = document.getElementById("btnProximo");
  const modulo = modulos[indiceModulo];

  botoesOpcao.forEach((btn) => {
    btn.onclick = () => {
      const indexEscolhido = parseInt(btn.getAttribute("data-index"));
      const explicacaoTexto = modulo.quiz.explicacoes[indexEscolhido];

      // Limpa seleções anteriores
      botoesOpcao.forEach((b) =>
        b.classList.remove("correta-selecionada", "errada-selecionada"),
      );

      if (indexEscolhido === modulo.quiz.correta) {
        btn.classList.add("correta-selecionada");
        feedback.className = "feedback-quiz sucesso";
        feedback.innerHTML = `
                    <div class="feedback-conteudo">
                        <p><strong><i class="fa-solid fa-circle-check"></i> Resposta Correta!</strong></p>
                        <p class="explicacao-texto">${explicacaoTexto}</p>
                    </div>
                `;

        // Marcar progresso e salvar
        progresso[indiceModulo] = true;
        salvarProgresso();

        // Habilitar o botão de próxima aula
        if (btnProximo && indiceModulo < modulos.length - 1) {
          btnProximo.classList.remove("desabilitado");
          btnProximo.classList.add("btn-proxima");
          btnProximo.removeAttribute("disabled");
          btnProximo.onclick = () => {
            carregarModulo(indiceModulo + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          };
        }

        atualizarSidebar();
        atualizarProgresso();
      } else {
        btn.classList.add("errada-selecionada");
        feedback.className = "feedback-quiz erro";
        feedback.innerHTML = `
                    <div class="feedback-conteudo">
                        <p><strong><i class="fa-solid fa-circle-xmark"></i> Não foi dessa vez!</strong></p>
                        <p class="explicacao-texto">${explicacaoTexto}</p>
                    </div>
                `;
      }
    };
  });
}

/* ==========================================
            SIDEBAR DINÂMICA
========================================== */
function atualizarSidebar() {
  if (!listaModulos) return;

  listaModulos.innerHTML = "";

  modulos.forEach((modulo, indice) => {
    const item = document.createElement("li");
    item.classList.add("modulo-item");

    if (indice === moduloAtual) {
      item.classList.add("ativo");
    }

    let iconeStatus = "";
    if (progresso[indice]) {
      iconeStatus =
        '<i class="fa-solid fa-circle-check icone-status" style="color: var(--verde-principal);"></i>';
    } else if (indice > 0 && !progresso[indice - 1]) {
      item.classList.add("bloqueado");
      iconeStatus = '<i class="fa-solid fa-lock icone-status"></i>';
    }

    item.innerHTML = `
            <div class="modulo-num">${indice + 1}</div>
            <div class="modulo-info">
                <span class="modulo-titulo">${modulo.titulo}</span>
                ${indice === moduloAtual ? '<span class="tag-status">Atual</span>' : ""}
            </div>
            ${iconeStatus}
        `;

    item.onclick = () => {
      if (item.classList.contains("bloqueado")) {
        return;
      }

      carregarModulo(indice);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    listaModulos.appendChild(item);
  });
}

/* ==========================================
            PROGRESSO DO CURSO
========================================== */
function atualizarProgresso() {
  const concluidos = progresso.filter((item) => item).length;
  const porcentagem = Math.round((concluidos / modulos.length) * 100);

  if (barraPreenchimento) {
    barraPreenchimento.style.width = porcentagem + "%";
  }

  if (porcentagemTexto) {
    porcentagemTexto.textContent = porcentagem + "% concluído";
  }

  if (indicadorModuloTopo) {
    indicadorModuloTopo.textContent = `Módulo ${moduloAtual + 1} de ${modulos.length}`;
  }
}

function salvarProgresso() {
  const usuario = auth.currentUser;

  if (!usuario) {
    return Promise.resolve();
  }

  const moduloParaSalvar = moduloAtual;
  const progressoParaSalvar = [...progresso];

  filaDeSalvamento = filaDeSalvamento
    .catch(() => undefined)
    .then(() =>
      salvarProgressoCurso(
        usuario.uid,
        ID_CURSO,
        moduloParaSalvar,
        progressoParaSalvar,
      ),
    )
    .catch((erro) => {
      console.error("Não foi possível salvar o progresso do curso:", erro);
    });

  return filaDeSalvamento;
}

/* ==========================================
            INICIALIZAÇÃO DA PÁGINA
========================================== */
async function inicializarCurso(usuario) {
  try {
    const progressoSalvo = await carregarProgressoCurso(
      usuario.uid,
      ID_CURSO,
      modulos.length,
    );

    moduloAtual = progressoSalvo.moduloAtual;
    progresso = progressoSalvo.modulosConcluidos;
  } catch (erro) {
    console.error("Não foi possível carregar o progresso do curso:", erro);
  }

  carregarModulo(moduloAtual);
}

onAuthStateChanged(auth, (usuario) => {
  if (!usuario) {
    window.location.href = "Login.html";
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => inicializarCurso(usuario),
      { once: true },
    );
    return;
  }

  inicializarCurso(usuario);
});
