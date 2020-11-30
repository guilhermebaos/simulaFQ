// Selecionar os parametros para o Serviço de Emails
let service_id = 'default_service'
let template_id = 'projetoal'

// Selecionar os Select com a informação
let temaSelect = document.getElementById('tema')
let textoALSelect = document.getElementById('textoAL')
let zonaSelect = document.getElementById('zona')
let principalSelect = document.getElementById('principal')
let btnEnviar = document.getElementById('enviar')

function enviarEmail() {
    // Muda o Texto do butão
    btnEnviar.innerHTML = 'A Enviar...'

    // Conteúdo do Email
    let templateParams = {
        'tema': temaSelect.value,
        'textoAL': textoALSelect.value,
        'zona': zonaSelect.value,
        'principal': principalSelect.value 
    }

    // Enviar o Email e dizer no butão o resultado
    emailjs.send(service_id, template_id, templateParams).then(function() {
        btnEnviar.innerHTML = 'Enviado!'
        setTimeout(function() {window.location = '/Atividades-Laboratoriais/index.html'}, 3000)
    }, function(erro) {
        alert('Problema no envio do Email! Tente mais tarde!')
        console.log(JSON.stringify(erro))
        btnEnviar.innerHTML = 'Tente mais tarde.'
    })
}