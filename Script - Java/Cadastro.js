// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================


const mostrarSenha = document.getElementById("mostrarSenha");

const senha = document.getElementById("senha");



if (mostrarSenha) {


    mostrarSenha.addEventListener("click", () => {



        if (senha.type === "password") {


            senha.type = "text";


            mostrarSenha.innerHTML = `
                <i class="fa-solid fa-eye-slash"></i>
            `;



        } else {


            senha.type = "password";


            mostrarSenha.innerHTML = `
                <i class="fa-solid fa-eye"></i>
            `;


        }



    });


}






// ==========================================
// CADASTRO
// ==========================================


const formCadastro = document.getElementById("formCadastro");



if (formCadastro) {



    formCadastro.addEventListener("submit", (evento) => {



        evento.preventDefault();





        const nome = document.getElementById("nome").value;

        const email = document.getElementById("email").value;

        const senhaUsuario = document.getElementById("senha").value;

        const confirmarSenha = document.getElementById("confirmarSenha").value;

        const aceitarTermos = document.getElementById("aceitarTermos").checked;








        // Verifica campos vazios


        if (
            nome === "" ||
            email === "" ||
            senhaUsuario === "" ||
            confirmarSenha === ""
        ) {


            alert("Preencha todos os campos antes de continuar.");

            return;


        }







        // Verifica confirmação de senha


        if (senhaUsuario !== confirmarSenha) {


            alert("As senhas não são iguais.");

            return;


        }







        // Verifica aceite dos termos


        if (!aceitarTermos) {


            alert(
                "É necessário aceitar os Termos de Uso e a Política de Privacidade."
            );


            return;


        }








        // Salva dados simulando cadastro


        localStorage.setItem(
            "usuarioNome",
            nome
        );


        localStorage.setItem(
            "usuarioEmail",
            email
        );


        localStorage.setItem(
            "usuarioSenha",
            senhaUsuario
        );







        alert("Cadastro realizado com sucesso!");







        // Envia para login


        window.location.href = "Login.html";



    });



}