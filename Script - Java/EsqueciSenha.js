// ========================================
// RECUPERAÇÃO DE SENHA
// ========================================

const formRecuperacao = document.getElementById("formRecuperacao");
const emailInput = document.getElementById("email");
const mensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formRecuperacao.addEventListener("submit", function (event) {

    // Impede o formulário de recarregar a página
    event.preventDefault();

    const email = emailInput.value.trim();

    // Limpa mensagem anterior
    mensagem.textContent = "";
    mensagem.className = "mensagem";


    // ========================================
    // VALIDAÇÃO
    // ========================================

    if (email === "") {

        mostrarMensagem(
            "Por favor, informe seu e-mail.",
            "erro"
        );

        emailInput.focus();

        return;
    }


    // Verificação simples do formato do e-mail
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
    // SIMULAÇÃO DO ENVIO
    // ========================================

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";


    setTimeout(() => {

        mostrarMensagem(
            "Se este e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.",
            "sucesso"
        );

        emailInput.value = "";

        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar instruções";

    }, 1000);

});


// ========================================
// FUNÇÃO DE MENSAGEM
// ========================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = `mensagem ${tipo}`;

}