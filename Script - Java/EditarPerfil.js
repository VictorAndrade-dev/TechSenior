// ========================================
// EDIÇÃO DE INFORMAÇÕES DO PERFIL
// ========================================

const formEdicao = document.getElementById("formEdicao");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

const mensagem = document.getElementById("mensagem");
const btnSalvar = document.getElementById("btnSalvar");


// ========================================
// DADOS DE PROTÓTIPO
// ========================================

// Enquanto o Firebase não estiver conectado,
// utilizamos informações fictícias para testar a tela.

const usuarioProtótipo = {
    nome: "Usuário TechSênior",
    email: "usuario@email.com"
};


// ========================================
// CARREGAR INFORMAÇÕES
// ========================================

function carregarInformacoes() {

    nomeInput.value = usuarioProtótipo.nome;
    emailInput.value = usuarioProtótipo.email;

}


// Carrega as informações assim que a página abre
carregarInformacoes();


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formEdicao.addEventListener("submit", function (event) {

    // Impede o recarregamento da página
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();


    // Limpa mensagem anterior
    mensagem.textContent = "";
    mensagem.className = "mensagem";


    // ========================================
    // VALIDAÇÃO DO NOME
    // ========================================

    if (nome === "") {

        mostrarMensagem(
            "Por favor, informe seu nome.",
            "erro"
        );

        nomeInput.focus();

        return;
    }


    // ========================================
    // VALIDAÇÃO DO E-MAIL
    // ========================================

    if (email === "") {

        mostrarMensagem(
            "Por favor, informe seu e-mail.",
            "erro"
        );

        emailInput.focus();

        return;
    }


    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {

        mostrarMensagem(
            "Digite um e-mail válido.",
            "erro"
        );

        emailInput.focus();

        return;
    }


    // ========================================
    // SIMULAÇÃO DO SALVAMENTO
    // ========================================

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";


    setTimeout(() => {

        // Atualiza os dados do protótipo
        usuarioProtótipo.nome = nome;
        usuarioProtótipo.email = email;


        mostrarMensagem(
            "Suas informações foram atualizadas com sucesso!",
            "sucesso"
        );


        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar alterações";


    }, 1000);

});


// ========================================
// FUNÇÃO DE MENSAGEM
// ========================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = `mensagem ${tipo}`;

}