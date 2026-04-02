//Funcao de erro somente isso mesmo
function erro(p_mensagem, p_campos = []) {
    //Mostra a mensagem de erro
    alert(p_mensagem);

    //Limpa cada campo que foi passado de parametro
    p_campos.forEach(function (id) {
        var campo = document.getElementById(id);
        //Se o campo existir limpar ele
        if (campo) {
            campo.value = "";
        }
    });
}