import { auth } from "./Firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

/* ==========================================
            CURSO - CELULAR
========================================== */

const modulos = [
  {
    titulo: "Conhecendo o seu celular",
    descricao:
      "O celular é um aparelho compacto que reúne várias ferramentas no mesmo lugar: telefone, câmara de fotos, recados por mensagem, relógio e acesso à internet para conversar com quem você ama.\n\n1. OS BOTÕES FÍSICOS:\nNa lateral do aparelho, você encontra o Botão de Ligar (um toque rápido acende/apaga a tela) e os Botões de Volume (para aumentar ou diminuir o som).\n\n2. COMO USAR OS DEDOS NA TELA:\n• Toque rápido: Abre aplicativos e seleciona opções.\n• Toque longo (segurar): Mostra opções extras ou permite mover itens de lugar.\n\n3. A BARRA DE TOPO:\nNo topo da tela você sempre enxerga as horas, o nível da bateria e o sinal da internet/Wi-Fi.",
    imagem: "Imagens/CelularCurso.png",
    importante:
      "Nem todos os celulares são iguais. Alguns podem ter os botões de volume do lado esquerdo e outros do lado direito, mas a função é a mesma.",
    dica: "Se tocar em algo errado, procure o botão ou gesto de Voltar na parte inferior da tela para retornar em segurança.",
    duracao: "5 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Você tocou sem querer em uma opção e a tela do seu celular mudou para algo estranho. Qual é a melhor atitude a tomar?",
      opcoes: [
        "Desligar o celular imediatamente para não estragar.",
        "Manter a calma e procurar pelo botão ou gesto de 'Voltar' para retornar à tela anterior.",
        "Levar o celular imediatamente para um técnico consertar.",
        "Tocar rapidamente em todos os botões da tela ao mesmo tempo.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto. O celular funciona com bateria interna e desligar bruscamente não corrige o toque acidental.",
        "Correto! O botão ou gesto 'Voltar' serve exatamente para desfazer uma ação e retornar à tela anterior em segurança.",
        "Incorreto. Um toque acidental é algo comum do dia a dia e não significa que o aparelho esteja quebrado.",
        "Incorreto. Tocar em vários botões ao mesmo tempo pode abrir outros aplicativos e confundir ainda mais.",
      ],
    },
  },
  {
    titulo: "Ligações e contatos",
    descricao:
      "Aprenda como fazer, atender e encerrar chamadas telefônicas, além de organizar sua agenda de contatos de forma simples.",
    imagem: "Imagens/Cursos/Celular/modulo2.png",
    importante:
      "Verifique sempre se está ligando para o número correto antes de discar.",
    dica: "Salve seus contatos com nomes fáceis de lembrar para não precisar digitar o número toda vez.",
    duracao: "6 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Para não precisar digitar o número de um parente toda vez que quiser ligar, o que você deve fazer no seu celular?",
      opcoes: [
        "Anotar o número em um pedaço de papel e colar atrás do aparelho.",
        "Salvar o número e o nome da pessoa na sua Lista de Contatos (Agenda).",
        "Mandar uma mensagem de texto para o seu próprio número.",
        "Decorar o número completo de cor.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto. Papeis podem rasgar, molhar ou se perder facilmente.",
        "Correto! Salvando o nome e o número na agenda, basta um toque sobre o nome para realizar a chamada.",
        "Incorreto. Mandar uma mensagem para você mesmo não cria um atalho na sua agenda de chamadas.",
        "Incorreto. Decorar vários números exige muito esforço e pode levar a erros na hora de discar.",
      ],
    },
  },
  {
    titulo: "Mensagens",
    descricao:
      "Descubra como enviar mensagens de texto e se comunicar com seus amigos e familiares rápida e com segurança.",
    imagem: "Imagens/Cursos/Celular/modulo3.png",
    importante:
      "Leia a mensagem com atenção antes de apertar o botão de enviar.",
    dica: "Você pode utilizar mensagens de voz caso ache mais fácil e rápido do que digitar.",
    duracao: "8 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Sua mão está doendo para digitar um texto longo no teclado do celular. Qual recurso facilita esse envio?",
      opcoes: [
        "Tirar uma foto do teclado do computador.",
        "Utilizar o recurso de gravar e enviar uma Mensagem de Voz.",
        "Apagar o aplicativo de mensagens.",
        "Escrever a mensagem em uma folha e encostar na tela.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto. Tirar foto de outro teclado não insere o texto na sua conversa.",
        "Correto! A mensagem de voz permite que você fale diretamente no microfone do celular sem cansar as mãos.",
        "Incorreto. Apagar o aplicativo fará com que você perca o contato com seus familiares.",
        "Incorreto. Encostar papel na tela não faz o celular reconhecer as letras escritas.",
      ],
    },
  },
  {
    titulo: "Câmera e fotos",
    descricao:
      "Aprenda a tirar fotos bonitas, gravar vídeos dos seus momentos especiais e visualizá-los na sua galeria.",
    imagem: "Imagens/Cursos/Celular/modulo4.png",
    importante:
      "Limpe a lente da câmera com um pano macio para as fotos não saírem embaçadas.",
    dica: "Segure o celular com as duas mãos para evitar que a foto saia tremida.",
    duracao: "10 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "As fotos que você tira no celular estão ficando embaçadas ou escuras. O que pode resolver isso antes de tirar a foto?",
      opcoes: [
        "Limpar suavemente a lente da câmera do aparelho com um pano macio e limpo.",
        "Sacudir o celular com força para tirar a poeira interna.",
        "Reiniciar o celular e apagar todos os contatos.",
        "Colocar o celular debaixo de uma torneira com água.",
      ],
      correta: 0,
      explicacoes: [
        "Correto! Marcas de dedos e poeira na lente externa são os principais motivos de fotos embaçadas.",
        "Incorreto. Sacudir o aparelho pode danificar as peças internas ou fazer o celular cair.",
        "Incorreto. Apagar seus dados não interfere na limpeza física da câmera.",
        "Incorreto. Molhar o celular pode danificar o aparelho permanentemente.",
      ],
    },
  },
  {
    titulo: "Aplicativos úteis",
    descricao:
      "Descubra como os aplicativos podem te ajudar no dia a dia, desde a previsão do tempo até alarmes e relógio.",
    imagem: "Imagens/Cursos/Celular/modulo5.png",
    importante:
      "Baixe e instale aplicativos apenas pela loja oficial do seu aparelho (Play Store ou App Store).",
    dica: "Peça ajuda a alguém de confiança se tiver dúvidas ao instalar um novo aplicativo.",
    duracao: "8 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Você recebeu uma mensagem no celular sugerindo clicar em um link para baixar um novo aplicativo. Como proceder com segurança?",
      opcoes: [
        "Clicar no link imediatamente sem ler a mensagem.",
        "Ignorar o link da mensagem e procurar o aplicativo apenas dentro da loja oficial (Play Store ou App Store).",
        "Enviar o link para todos os seus amigos de uma vez.",
        "Digitar suas senhas bancárias no link recebido.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto. Clicar em links desconhecidos pode instalar vírus no seu telefone.",
        "Correto! As lojas oficiais analisam os aplicativos antes de disponibilizá-los, garantindo a sua segurança.",
        "Incorreto. Compartilhar o link pode colocar a segurança dos seus amigos em risco.",
        "Incorreto. Nunca digite senhas bancárias em links recebidos por mensagem.",
      ],
    },
  },
  {
    titulo: "Dicas de organização e segurança",
    descricao:
      "Mantenha seu aparelho seguro, proteja suas senhas e aprenda a organizar seus aplicativos principais na tela inicial.",
    imagem: "Imagens/Cursos/Celular/modulo6.png",
    importante:
      "Nunca compartilhe suas senhas nem códigos recebidos por mensagem com desconhecidos.",
    dica: "Ajuste o brilho da tela e o tamanho da fonte nas configurações para ler com mais conforto.",
    duracao: "12 minutos",
    nivel: "Iniciante",
    quiz: {
      pergunta:
        "Uma pessoa ligou dizendo ser do seu banco e pediu um código que chegou no seu celular. O que você NUNCA deve fazer?",
      opcoes: [
        "Desligar a ligação e entrar em contato direto com o seu banco.",
        "Fornecer o código ou suas senhas de acesso para essa pessoa.",
        "Perguntar a um familiar de confiança sobre o ocorrido.",
        "Anotar o número de quem ligou.",
      ],
      correta: 1,
      explicacoes: [
        "Incorreto (no sentido da pergunta). Desligar e ligar de volta para o banco é a atitude SEGURA a se tomar.",
        "Correto! Você NUNCA deve fornecer códigos ou senhas por telefone. Bancos de verdade nunca pedem isso.",
        "Incorreto (no sentido da pergunta). Pedir ajuda a familiares de confiança é uma boa prática.",
        "Incorreto (no sentido da pergunta). Anotar o número pode ajudar a identificar tentativas de golpe.",
      ],
    },
  },
];

/* ==========================================
            ELEMENTOS DA PÁGINA
========================================== */
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
            PROGRESSO NO LOCALSTORAGE
========================================== */
let progresso = JSON.parse(localStorage.getItem("cursoCelular"));

if (!progresso || progresso.length !== modulos.length) {
  progresso = new Array(modulos.length).fill(false);
}

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
  localStorage.setItem("cursoCelular", JSON.stringify(progresso));
}

/* ==========================================
            INICIALIZAÇÃO DA PÁGINA
========================================== */
function inicializarCurso() {
  carregarModulo(moduloAtual);
}

onAuthStateChanged(auth, (usuario) => {
  if (!usuario) {
    window.location.href = "Login.html";
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarCurso, { once: true });
    return;
  }

  inicializarCurso();
});
