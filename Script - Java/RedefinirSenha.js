// ========================================
// REDEFINIÇÃO DE SENHA
// ========================================

const formRedefinicao = document.getElementById("formRedefinicao");
const novaSenhaInput = document.getElementById("novaSenha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const mensagem = document.getElementById("mensagem");
const btnRedefinir = document.getElementById("btnRedefinir");


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formRedefinicao.addEventListener("submit", function (event) {

    // Impede o recarregamento da página
    event.preventDefault();

    const novaSenha = novaSenhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    // Limpa mensagem anterior
    mensagem.textContent = "";
    mensagem.className = "mensagem";


    // ========================================
    // VALIDAÇÃO DOS CAMPOS
    // ========================================

    if (novaSenha === "" || confirmarSenha === "") {

        mostrarMensagem(
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    // ========================================
    // TAMANHO DA SENHA
    // ========================================

    if (novaSenha.length < 6) {

        mostrarMensagem(
            "A senha deve ter pelo menos 6 caracteres.",
            "erro"
        );

        novaSenhaInput.focus();

        return;
    }


    // ========================================
    // CONFIRMAÇÃO DA SENHA
    // ========================================

    if (novaSenha !== confirmarSenha) {

        mostrarMensagem(
            "As senhas não coincidem.",
            "erro"
        );

        confirmarSenhaInput.focus();

        return;
    }


    // ========================================
    // SIMULAÇÃO DA REDEFINIÇÃO
    // ========================================

    btnRedefinir.disabled = true;
    btnRedefinir.textContent = "Redefinindo...";


    setTimeout(() => {

        mostrarMensagem(
            "Senha redefinida com sucesso! Você será redirecionado para o login.",
            "sucesso"
        );

        // Aguarda um pouco para o usuário ler a mensagem
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 2000);

    }, 1000);

});


// ========================================
// FUNÇÃO DE MENSAGEM
// ========================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = `mensagem ${tipo}`;

}