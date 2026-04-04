//Variaveis globais da tela
let tabelaTreinos = null;

//Campos do modal
let nome = null;
let grupo = null;
let serie = null;
let reps = null;
let editIndex = null; // Variável para controlar se estamos editando ou adicionando um treino

//Metodo que inicia as variaveis globais da tela, chamado no onload do index.html
function iniciaTreino() {
    tabelaTreinos = document.querySelector("#tabelaTreinos tbody");
    nome = document.getElementById("EDnome");
    grupo = document.getElementById("EDgrupo");
    serie = document.getElementById("EDserie");
    reps = document.getElementById("EDreps");

    //Carrega a tabela de treinos
    carregarTabelaTreinos();
}

//Abre o modal que adicionar treino
function adicionarTreino() {
    //Abre o modal
    abreModal();

    //Limpa os campos do modal
    limparCampos();
}

//Chamado no botao de salvar no modal de treino
function salvarTreino() {
    //Primeiro validar os campos
    if (!validarTreino()) {
        return;
    }

    //Criar o objeto treino
    let treino = {
        nome: nome.value.trim(),
        grupo: grupo.value.trim(),
        series: serie.value.trim(),
        reps: reps.value.trim()
    };

    //Salvar o treino no localStorage
    salvarTreinoLocalStorage(treino);

    //Fechar o modal
    fechaModal();

    //Recarregar a tabela de treinos apos adicionar o novo treino
    carregarTabelaTreinos();

}

function editarTreino(p_index) {
    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

    // Obter o treino a ser editado
    let treino = treinos[p_index];

    // Preencher os campos do modal com os dados do treino
    nome.value = treino.nome;
    grupo.value = treino.grupo;
    serie.value = treino.series;
    reps.value = treino.reps;

    // Abrir o modal
    abreModal();

    // Definir o index do treino que está sendo editado
    editIndex = p_index;
}

function excluirTreino(p_index) {
    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

    // Remover o treino do array
    treinos.splice(p_index, 1);

    // Salvar o array atualizado no localStorage
    localStorage.setItem("treinos", JSON.stringify(treinos));

    // Recarregar a tabela de treinos após a exclusão
    carregarTabelaTreinos();
}

function salvarTreinoLocalStorage(p_treino) {
    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];
    
    // Adicionar o novo treino
    treinos.push(p_treino);
    
    // Salvar de volta no localStorage
    localStorage.setItem("treinos", JSON.stringify(treinos));
}

function carregarTabelaTreinos() {
    // Limpar a tabela
    tabelaTreinos.innerHTML = "";   

    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

    // Preencher a tabela com os treinos
    treinos.forEach(function(treino, index) {
        //Inserindo cada coluna do treino na tabela
        let row = tabelaTreinos.insertRow();
        row.insertCell(0).textContent = treino.nome;
        row.insertCell(1).textContent = treino.grupo;
        row.insertCell(2).textContent = treino.series;
        row.insertCell(3).textContent = treino.reps;

        
        let cellAcoes = row.insertCell(4);

       cellAcoes.innerHTML = `
    <button onclick="editarTreino(${index})">✏️</button>
    <button onclick="excluirTreino(${index})">❌</button>
`;
    });
}


function validarTreino() {
    //Variaveis com .trim() somente para validar.
    let nomeTreino = nome.value.trim();
    let grupoTreino = grupo.value.trim();
    let serieTreino = serie.value.trim();
    let repsTreino = reps.value.trim();

    if (nomeTreino === "" || grupoTreino === "" || serieTreino === "" || repsTreino === "") {
        erro("Por favor, preencha todos os campos do treino.");
        return false;
    }

    if (nomeTreino.length < 3) {
        erro("O nome do treino deve ter pelo menos 3 caracteres.", ["EDnome"]);
        return false;
    }

    if (grupoTreino.length < 3) {
        erro("O grupo muscular deve ter pelo menos 3 caracteres.", ["EDgrupo"]);
        return false;
    }

    if (Number(serieTreino) <= 0 || !Number.isInteger(Number(serieTreino))) {
        erro("As series devem ser um numero inteiro maior que zero.", ["EDserie"]);
        return false;
    }

    if (Number(repsTreino) <= 0 || !Number.isInteger(Number(repsTreino))) {
        erro("As repeticoes devem ser um numero inteiro maior que zero.", ["EDreps"]);
        return false;
    }

    return true;
}

function limparCampos() {
    nome.value = "";
    grupo.value = "";
    serie.value = "";
    reps.value = "";
}

function abreModal() {
    document.getElementById("modal").style.display = "block";
}

function fechaModal() {
    document.getElementById("modal").style.display = "none";
}
