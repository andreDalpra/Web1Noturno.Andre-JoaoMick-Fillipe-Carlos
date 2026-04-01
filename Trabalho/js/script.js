//JAVASCRIPT PARA AS TELAS 
console.log("SCRIPT JS CARREGOU");
// Variável global com o usuário logado
var usuarioLogado = null;

function validaLogin() {
    var email = document.getElementById("EDemail").value.trim();
    var senha = document.getElementById("EDsenha").value.trim();

    //Funcao de erro
    function erroLogin(p_mensagem) {
        alert(p_mensagem);
        document.getElementById("EDemail").value = "";
        document.getElementById("EDsenha").value = "";
        document.getElementById("EDemail").focus();
    }

    // Validação de campos vazios
    if (email === "" || senha === "") {
        erroLogin("Por favor, preencha todos os campos.");
        return false;
    }

    // Validação de formato do email
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        erroLogin("Por favor, insira um e-mail válido.");
        return false;
    }

    // Validação do tamanho mínimo da senha
    if (senha.length < 6) {
        erroLogin("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    // Extrai o nome de usuário antes do @
    var nomeUsuario = email.split("@")[0];

    //Limpa o usuario antigo para evitar conflitos
    deslogar(false);

    // Define o usuário logado e redireciona para o index
    usuarioLogado = { email: email, nome: nomeUsuario, senha: senha};
    if (lembrarUsuario()) {
        //Guarda o usuario no localStorage para manter o login.
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }
    else {
        //Guarda o usuario na sessionStorage para manter o login apenas na sessão atual.
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }

    //Redireciona para a pÃ¡gina principal
    window.location.href = "index.html";

    return true;
}

function getUsuarioLogado() {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || JSON.parse(sessionStorage.getItem("usuarioLogado"));       
    return usuarioLogado;
}

function deslogar(p_redirecionar) {
    //Removendo a session do usuario logado e redirecionando para a tela de login
    usuarioLogado = null;

    sessionStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioLogado");
    if (p_redirecionar) {
        window.location.href = "login.html";
    }
}

function lembrarUsuario() {
    var lembrar = document.getElementById("lembrarMe").checked;
    return lembrar;
}

//PARTE DE TREINOS
//Gerencia a parte de treinos, permitindo criar, editar e deletar treinos
function iniciarTreinos() {
    let tabela = document.querySelector("#tabelaTreinos tbody")
    let modal = document.getElementById("modal")

    let addBtn = document.getElementById("addBtn")
    let salvar = document.getElementById("salvar")
    let cancelar = document.getElementById("cancelar")

    let editIndex = null

    // pega do localStorage ou cria array vazio
    let treinos = JSON.parse(localStorage.getItem("treinos")) || []


    // abre modal
    addBtn.onclick = () => {
        modal.style.display = "block"
        limparCampos()
        editIndex = null
    }

    // cancelar
    cancelar.onclick = () => {
        modal.style.display = "none"
    }


    // limpa campos
    function limparCampos() {
        document.getElementById("nome").value = ""
        document.getElementById("grupo").value = ""
        document.getElementById("series").value = ""
        document.getElementById("reps").value = ""
    }


    // salvar treino
    salvar.onclick = () => {

        let nome = document.getElementById("nome").value
        let grupo = document.getElementById("grupo").value
        let series = document.getElementById("series").value
        let reps = document.getElementById("reps").value

        let treino = {
            nome,
            grupo,
            series,
            reps
        }

        if (editIndex === null) {
            treinos.push(treino)
        } else {
            treinos[editIndex] = treino
            editIndex = null
        }

        salvarLocalStorage()
        renderTabela()

        modal.style.display = "none"
    }


    // salva no localStorage
    function salvarLocalStorage() {
        localStorage.setItem("treinos", JSON.stringify(treinos))
    }


    // renderiza tabela
    function renderTabela() {

        tabela.innerHTML = ""

        treinos.forEach((t, index) => {

            let row = tabela.insertRow()

            row.innerHTML = `
        <td>${t.nome}</td>
        <td>${t.grupo}</td>
        <td>${t.series}</td>
        <td>${t.reps}</td>
        <td>
            <button onclick="editar(${index})">✏</button>
            <button onclick="deletar(${index})">❌</button>
        </td>
        `
        })

    }


    // editar
    window.editar = function (index) {

        let t = treinos[index]

        document.getElementById("nome").value = t.nome
        document.getElementById("grupo").value = t.grupo
        document.getElementById("series").value = t.series
        document.getElementById("reps").value = t.reps

        editIndex = index

        modal.style.display = "block"
    }


    // deletar
    window.deletar = function (index) {

        if (confirm("Deseja realmente deletar este treino?")) {
            treinos.splice(index, 1)
            salvarLocalStorage()
            renderTabela()
        }

    }


    // carrega tabela ao abrir pÃ¡gina
    renderTabela()
}
