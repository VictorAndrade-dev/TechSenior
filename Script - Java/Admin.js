import { auth } from "./Firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    meuPerfil,
    listarCursosAdmin
} from "../dataconnect-generated/esm/index.esm.js";


// ==========================================
// ELEMENTOS
// ==========================================

const listaCursosAdmin =
    document.getElementById("listaCursosAdmin");

const estadoCarregamento =
    document.getElementById("estadoCarregamento");

const totalCursos =
    document.getElementById("totalCursos");

const totalPublicados =
    document.getElementById("totalPublicados");

const totalRascunhos =
    document.getElementById("totalRascunhos");

const totalDesativados =
    document.getElementById("totalDesativados");

const btnNovoCurso =
    document.getElementById("btnNovoCurso");


// ==========================================
// AUTENTICAÇÃO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "Login.html";
        return;
    }

    try {

        // ==================================
        // VERIFICAR PERFIL
        // ==================================

        const respostaPerfil = await meuPerfil();

        const perfil =
            respostaPerfil.data.usuarios?.[0];

        if (!perfil) {
            negarAcesso();
            return;
        }


        // ==================================
        // VERIFICAR ADMINISTRADOR
        // ==================================

        if (
            perfil.tipoUsuario?.nome !==
            "Administrador"
        ) {
            negarAcesso();
            return;
        }


        // ==================================
        // CARREGAR PAINEL
        // ==================================

        await carregarCursos();

    } catch (erro) {

        console.error(
            "Erro ao acessar o painel:",
            erro
        );

        estadoCarregamento.textContent =
            "Não foi possível carregar o painel administrativo.";
    }

});


// ==========================================
// NEGAR ACESSO
// ==========================================

function negarAcesso() {

    alert(
        "Você não possui permissão para acessar o painel administrativo."
    );

    window.location.href = "index.html";

}


// ==========================================
// CARREGAR CURSOS
// ==========================================

async function carregarCursos() {

    estadoCarregamento.textContent =
        "Carregando cursos...";

    try {

        const resposta =
            await listarCursosAdmin();

        const cursos =
            resposta.data.cursos || [];


        atualizarResumo(cursos);
        mostrarCursos(cursos);


        estadoCarregamento.hidden = true;
        listaCursosAdmin.hidden = false;

    } catch (erro) {

        console.error(
            "Erro ao carregar cursos:",
            erro
        );

        estadoCarregamento.textContent =
            "Erro ao carregar os cursos.";
    }

}


// ==========================================
// RESUMO
// ==========================================

function atualizarResumo(cursos) {

    const publicados =
        cursos.filter(
            curso =>
                curso.ativo &&
                curso.publicado
        );

    const rascunhos =
        cursos.filter(
            curso =>
                curso.ativo &&
                !curso.publicado
        );

    const desativados =
        cursos.filter(
            curso =>
                !curso.ativo
        );


    totalCursos.textContent =
        cursos.length;

    totalPublicados.textContent =
        publicados.length;

    totalRascunhos.textContent =
        rascunhos.length;

    totalDesativados.textContent =
        desativados.length;

}


// ==========================================
// MOSTRAR CURSOS
// ==========================================

function mostrarCursos(cursos) {

    listaCursosAdmin.innerHTML = "";

    if (cursos.length === 0) {

        listaCursosAdmin.innerHTML = `
            <div class="mensagem">
                Nenhum curso cadastrado.
            </div>
        `;

        return;
    }


    cursos.forEach(curso => {

        const card =
            document.createElement("article");

        card.classList.add("curso-admin");


        const status =
            obterStatusCurso(curso);


        card.innerHTML = `
            <div class="curso-icone">
                <i class="${
                    curso.icone ||
                    "fa-solid fa-book"
                }"></i>
            </div>

            <div class="curso-info">

                <div class="curso-titulo">

                    <h3>
                        ${curso.nome}
                    </h3>

                    <span class="status ${status.classe}">
                        ${status.texto}
                    </span>

                </div>

                <p>
                    ${
                        curso.descricao ||
                        "Curso sem descrição."
                    }
                </p>

                <div class="curso-detalhes">

                    <span>
                        <i class="fa-solid fa-signal"></i>
                        ${curso.dificuldade}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${curso.cargaHoraria} min
                    </span>

                </div>

            </div>

            <div class="curso-acoes">

                <button
                    class="btn-editar"
                    data-id="${curso.id}"
                    type="button"
                >
                    <i class="fa-solid fa-pen"></i>
                    Editar
                </button>

            </div>
        `;


        listaCursosAdmin.appendChild(card);

    });

}


// ==========================================
// STATUS DO CURSO
// ==========================================

function obterStatusCurso(curso) {

    if (!curso.ativo) {

        return {
            texto: "Desativado",
            classe: "desativado"
        };

    }


    if (curso.publicado) {

        return {
            texto: "Publicado",
            classe: "publicado"
        };

    }


    return {
        texto: "Rascunho",
        classe: "rascunho"
    };

}


// ==========================================
// NOVO CURSO
// ==========================================

btnNovoCurso.addEventListener(
    "click",
    () => {

        console.log(
            "Abrir formulário de novo curso"
        );

    }
);
