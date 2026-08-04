//MOSTRAR SENHA

const senhaUsuario = document.getElementById("senhaUsuario");

const mostrarSenha = document.getElementById("mostrarSenha");

const senha = localStorage.getItem("usuarioSenha") || "";

let senhaVisivel = false;

if (senhaUsuario && mostrarSenha) {
  mostrarSenha.addEventListener("click", () => {
    senhaVisivel = !senhaVisivel;

    if (senhaVisivel) {
      senhaUsuario.textContent = senha;

      mostrarSenha.innerHTML = `

            <i class="fa-solid fa-eye-slash"></i>

            `;
    } else {
      senhaUsuario.textContent = "*".repeat(senha.length);

      mostrarSenha.innerHTML = `

            <i class="fa-solid fa-eye"></i>

            `;
    }
  });
}

//MUDAR NOME

const nomePerfil = document.getElementById("nomePerfil");

const nomeUsuario = localStorage.getItem("usuarioNome");

if (nomePerfil && nomeUsuario) {
  nomePerfil.textContent = nomeUsuario;
}

//MUDAR EMAIL

const emailUsuario = document.getElementById("emailUsuario");

const email = localStorage.getItem("usuarioEmail");

if (emailUsuario && email) {
  emailUsuario.textContent = email;
}
