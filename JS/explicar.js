// Variáveis Globais para a função das Contas

let mostrarExpContasPronto = false
let expContasArray = []
let expContasAberto = 0
let pos = 0
let mostrarExtraTempo = 400

function mostrarExpContas(num) {
    if (!mostrarExpContasPronto) {
        // Selecionar os parágrafos
        expContasArray = document.getElementsByName('exp-contas')

        mostrarExpContasPronto = true
    }
    // Se tentarmos abrir o que já está aberto, fecha-o
    if (num == expContasAberto) {
        expContasArray[num - 1].style.display = 'none'
        expContasAberto = 0
    // Fechar o que está atualmente aberto
    } else {
        expContasArray[num - 1].style.display = 'block'

        if (expContasAberto != 0) {
            expContasArray[expContasAberto - 1].style.display = 'none'
        }
        expContasAberto = num
    }
}


function mostrarExtra(keyWord) {
    let extra = document.getElementById(keyWord)
    

    if (extra.processando) {
        return
    }

    // Esconde o elemento, se já estiver visível
    if (extra.classList.contains('is-visible')) {
        extra.processando = true

        // Dá a altura atual do elemento
        extra.style.height = extra.scrollHeight + 'px'
    
        // Pôe a altura a 0
        window.setTimeout(function () {
            extra.style.height = '0'
        }, 1)
    
        // Quando a transição está completa, esconde o elemento
        window.setTimeout(function () {
            extra.classList.remove('is-visible')
            extra.processando = false
        }, mostrarExtraTempo)

    } // Mostra o elemento, se ainda estiver escondido
    else {
        extra.processando = true

        // Obter a altura 'natural' do elemento
        extra.style.display = 'block' // Torná-lo visível
        let height = extra.scrollHeight + 'px' // Obter a altura
        extra.style.display = '' // Escondê-lo de novo

        extra.classList.add('is-visible') // Torna o elemento visível
        extra.style.height = height // Atualiza a altura máxima

        // Quando a transição estiver completa, remove a inline max-height para que o contentor possa mudar de dimensões
        window.setTimeout(function () {
            extra.style.height = ''
            extra.processando = false
        }, mostrarExtraTempo)
    }
}