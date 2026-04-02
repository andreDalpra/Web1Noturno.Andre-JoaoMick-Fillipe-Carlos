//JAVASCRIPT PARA AS TELAS 
console.log("SCRIPT JS CARREGOU");
// Variável global com o usuário logado
var usuarioLogado = null;

function iniciaLogin() {

    //Dados do login
    var email = document.getElementById("EDemail").value.trim();
    var senha = document.getElementById("EDsenha").value.trim();

    //Valida as informações do login
    if (!validaLogin(email, senha)) {
        return false;
    }

    //Se deu certo salva no localStorage ou sessionStorage dependendo doq o cara escolher
    salvarDados(email, senha, lembrarUsuario());

    return true;
}

function salvarDados(p_email, p_senha, p_lembrar) {

    //Limpa o usuario antigo para evitar conflitos
    deslogar(false);

    // Extrai o nome de usuário antes do @
    var nomeUsuario = p_email.split("@")[0];

    //Se o usuario quiser ser lembrado salva no localStorage, senao remove do localStorage q nao fique salvo nada
    if (p_lembrar) {
        localStorage.setItem("lembrarUsuario", p_lembrar);
    }
    else {
        localStorage.removeItem("lembrarUsuario");
    }

    // Define o usuário logado e redireciona para o index
    if (p_lembrar) {
        //Guarda o usuario no localStorage para manter o login, com a senha.
        usuarioLogado = { email: p_email, nome: nomeUsuario, senha: p_senha };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }
    else {
        //Guarda o usuario na sessionStorage para manter o login apenas na sessão atual, sem a senha.
        usuarioLogado = { email: p_email, nome: nomeUsuario };
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }

    //Redireciona para a página principal
    window.location.href = "index.html";
}

function validaLogin(p_email, p_senha) {

    // Validação de campos vazios
    if (p_email === "" || p_senha === "") {
        erro("Por favor, preencha todos os campos.");
        return false;
    }

    // Validação de formato do email
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(p_email)) {
        erro("Por favor, insira um e-mail válido.", ["EDemail"]);
        return false;
    }

    // Validação do tamanho mínimo da senha
    if (p_senha.length < 6) {
        erro("A senha deve ter pelo menos 6 caracteres.", ["EDsenha"]);
        return false;
    }

    return true;
}

function getUsuarioLogado() {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || JSON.parse(sessionStorage.getItem("usuarioLogado"));
    return usuarioLogado;
}

//Deslogar o usuario e redireciona pro login com as informações preenchidas, ou limpa lixo na session
function deslogar(p_redirecionar) {
    //Removendo a session do usuario logado e redirecionando para a tela de login
    usuarioLogado = null;

    sessionStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioLogado");

    //Se é loguout e o usuario e a opcao lembrarUsuario for true, redireciona para a tela de login, senao so limpa o usuario logado e deixa na mesma pagina
    if (p_redirecionar) {
        window.location.href = "login.html";
        if (localStorage.getItem("lembrarUsuario") === "true") {
            //Joga na pagina de login, com as opcoes da session
            carregaNoLogin();
        }
    }
}

//Preenche os dados do login de um usuario que marcou a opcao "Lembrar-me"
function carregaNoLogin() {
    document.getElementById("EDemail").value = localStorage.getItem("usuarioLogado") ? JSON.parse(localStorage.getItem("usuarioLogado")).email : "";
    document.getElementById("EDsenha").value = localStorage.getItem("usuarioLogado") ? JSON.parse(localStorage.getItem("usuarioLogado")).senha : "";
    document.getElementById("lembrarMe").checked = localStorage.getItem("lembrarUsuario") === "true";
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
