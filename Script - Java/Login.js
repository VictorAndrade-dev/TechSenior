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
// LOGIN
// ==========================================


const formLogin = document.getElementById("formLogin");



if (formLogin) {



    formLogin.addEventListener("submit", (evento) => {


        evento.preventDefault();



        const email = document.getElementById("email").value;

        const senhaUsuario = document.getElementById("senha").value;





        // Validação simples


        if (email === "" || senhaUsuario === "") {


            alert("Preencha todos os campos antes de continuar.");

            return;


        }





        /*
        
        Aqui futuramente entraria a consulta
        ao banco de dados.

        Por enquanto vamos simular
        um login realizado.

        */





        localStorage.setItem(
            "usuarioLogado",
            "true"
        );



        localStorage.setItem(
            "usuarioEmail",
            email
        );






        alert("Login realizado com sucesso!");





        window.location.href = "Cursos.html#cursos";



    });



}