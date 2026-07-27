// ==========================================
// CONTROLE UNIVERSAL DOS MODAIS DOS CURSOS
// ==========================================
const botoesVerCurso = document.querySelectorAll(".btn-card");

botoesVerCurso.forEach(botao => {
    botao.addEventListener("click", (e) => {
        e.preventDefault();

        // Pega o ID do modal que está guardado no "data-modal" do botão
        const idModal = botao.getAttribute("data-modal");
        const modalTarget = document.getElementById(idModal);

        if (modalTarget) {
            modalTarget.style.display = "flex";

            // Configura o botão de fechar DESTE modal específico
            const botaoFechar = modalTarget.querySelector(".fechar-modal");
            if (botaoFechar) {
                botaoFechar.onclick = () => {
                    modalTarget.style.display = "none";
                };
            }

            // Configura o clique fora DESTE modal específico
            modalTarget.onclick = (evento) => {
                if (evento.target === modalTarget) {
                    modalTarget.style.display = "none";
                }
            };
        }
    });
});

// ===========================

// ANIMAÇÃO DOS CARDS

// ===========================

const cards = document.querySelectorAll(".card");



cards.forEach(card => {



    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px)";

        card.style.transition = "0.3s";

    });



    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0)";

    });



});



// ===========================

// ANIMAÇÃO AO APARECER NA TELA

// ===========================

const observador = new IntersectionObserver((entradas) => {



    entradas.forEach((entrada) => {



        if (entrada.isIntersecting) {



            entrada.target.style.opacity = "1";

            entrada.target.style.transform = "translateY(0)";

        }



    });



});



cards.forEach((card) => {



    card.style.opacity = "0";

    card.style.transform = "translateY(40px)";

    card.style.transition = "0.8s";



    observador.observe(card);



});



//Botão Comecar (CTA)



const btnComecar = document.getElementById("btnComecar");



if (btnComecar) {



    // Verifica se o usuário está logado

    const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";



    // Altera o texto do botão caso esteja logado

    if (usuarioLogado) {



        btnComecar.innerHTML = `

            <i class="fa-solid fa-graduation-cap"></i>

            Continuar aprendendo

        `;



    }



    // Define a ação do botão

    btnComecar.addEventListener("click", () => {



        if (usuarioLogado) {



            document.getElementById("cursos").scrollIntoView({

                behavior: "smooth"

            });



        } else {



            window.location.href = "Login.html";



        }



    });



}





// ==========================================
// FAQ (Accordion Corrigido para Responsivo)
// ==========================================
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
    accordion.addEventListener("click", () => {
        accordion.classList.toggle("active");
        const resposta = accordion.nextElementSibling;

        if (accordion.classList.contains("active")) {
            // Define a altura exata para iniciar a animação suave
            resposta.style.maxHeight = resposta.scrollHeight + "px";
            resposta.style.padding = "20px 25px";

            // Remédio para o celular: após terminar a animação (.4s = 400ms), 
            // liberamos a altura para se adaptar caso a tela mude de tamanho
            setTimeout(() => {
                if (accordion.classList.contains("active")) {
                    resposta.style.maxHeight = "max-content";
                }
            }, 400);
        } else {
            // Para fechar, precisamos voltar o scrollHeight rapidinho para a transição funcionar
            resposta.style.maxHeight = resposta.scrollHeight + "px";

            // Força o navegador a recalcular antes de zerar
            setTimeout(() => {
                resposta.style.maxHeight = null;
                resposta.style.padding = "0 25px";
            }, 10);
        }
    });
});

// ==========================================

// SCROLL AUTOMÁTICO PARA A SEÇÃO DE CURSOS

// ==========================================

window.addEventListener("load", () => {

    if (window.location.hash === "#cursos") {

        setTimeout(() => {

            const destino = document.getElementById("cursos");

            if (destino) {

                scrollSuave(destino, 2000);

            }

        }, 400);

    }

});





// ==========================================

// FUNÇÃO DE SCROLL SUAVE (CORRIGIDA)

// ==========================================

function scrollSuave(destino, duracao = 2000) {

    const inicio = window.scrollY; // Atualizado de pageYOffset para scrollY



    // getBoundingClientRect().top pega a distância do elemento até a tela visível atual

    // Somando com window.scrollY, temos a posição real do elemento no topo da página

    const posicaoDestino = destino.getBoundingClientRect().top + window.scrollY;

    const fim = posicaoDestino - 90; // Ajuste do seu header

    const distancia = fim - inicio;



    let inicioTempo = null;



    function animar(tempoAtual) {

        if (!inicioTempo) inicioTempo = tempoAtual;



        const tempoDecorrido = tempoAtual - inicioTempo;

        const progresso = Math.min(tempoDecorrido / duracao, 1);



        // Fórmula de Ease In Out

        const ease = progresso < 0.5

            ? 2 * progresso * progresso

            : 1 - Math.pow(-2 * progresso + 2, 2) / 2;



        window.scrollTo(0, inicio + distancia * ease);



        if (progresso < 1) {

            requestAnimationFrame(animar);

        }

    }



    requestAnimationFrame(animar);

}



//BOTÃO CONHEÇA NOSSOS CURSOS



const btnCursos = document.querySelector(".btn-principal");



btnCursos.addEventListener("click", () => {



    scrollSuave(document.getElementById("cursos"));



});



function scrollSuave(destino, duracao = 2000) {



    const inicio = window.pageYOffset;

    const fim = destino.offsetTop - 80;

    const distancia = fim - inicio;



    let inicioTempo = null;



    function animacao(tempoAtual) {



        if (!inicioTempo) inicioTempo = tempoAtual;



        const tempoDecorrido = tempoAtual - inicioTempo;



        const progresso = Math.min(tempoDecorrido / duracao, 1);



        // Ease In Out

        const ease = progresso < 0.5

            ? 2 * progresso * progresso

            : 1 - Math.pow(-2 * progresso + 2, 2) / 2;



        window.scrollTo(0, inicio + distancia * ease);



        if (progresso < 1) {

            requestAnimationFrame(animacao);

        }



    }



    requestAnimationFrame(animacao);



}