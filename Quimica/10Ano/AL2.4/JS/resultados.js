// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL24 = {
    preparado: false,
}

let tubos

let claridadeTubos
let embrulhosTubos

// Tubos com respetivos embrulhos, ordenados pela posição em que aparecem no site
let nomesTubos = ['A', 'B', 'C', 'D', 'E']
let embrulhos = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
}


function prepararResultados() {
    if (Q10_AL24.preparado) {
        return
    }

    // Selecionar os Butões
    tubos = document.getElementsByName('tubo')

    // Selecionar os Spans com os Resultados
    claridadeTubos = document.getElementsByName('claridadeTubo')
    embrulhosTubos = document.getElementsByName('embrulhoTubo')

    Q10_AL24.preparado = true
    curva()
}


// Alterar os embrulhos dos Tubos e as aparências dos Butões
function escolherTubo(letraTubo, embrulhoEscolhido) {
    let posLetra, posEmbrulho

    // Retirar o embrulho ao tubo que o tinha antes
    let tempLetraTubo
    for (let key in nomesTubos) {
        tempLetraTubo = nomesTubos[key]
        if (embrulhos[tempLetraTubo] == embrulhoEscolhido) {
            tubos[embrulhoEscolhido * 5 + tempLetraTubo.codePointAt(0) - 65].className = 'escolha'
            tubos[embrulhos[letraTubo] * 5 + tempLetraTubo.codePointAt(0) - 65].className = 'escolha-atual'
            embrulhos[tempLetraTubo] = embrulhos[letraTubo]
            break
        }
    }
    
    // Obter as posições da letra (coluna) e embrulho (linha)
    posLetra = letraTubo.codePointAt(0) - 65
    posEmbrulho = embrulhos[letraTubo]

    // Alterar os aspetos do butão da letra selecionada
    tubos[posEmbrulho * 5 + posLetra].className = 'escolha'
    tubos[embrulhoEscolhido * 5 + posLetra].className = 'escolha-atual'

    // Atualizar o Objeto que guarda os embrulhos de cada tubo
    embrulhos[letraTubo] = embrulhoEscolhido
}


// Mostrar o Resultado
function curva() {
    let letraTubo
    for (let key in nomesTubos) {
        letraTubo = nomesTubos[key]
        embrulhoTubo = embrulhos[letraTubo]

        // Ordenar os tubos por claridade do conteúdo
        let claridadePos = embrulhoTubo
        switch (embrulhoTubo) {
            case 1:
                claridadePos = 3
                break;
            case 2:
                claridadePos = 1
                break;
            case 3:
                claridadePos = 2
                break;
            default:
                break;
        }

        claridadeTubos[claridadePos].innerText = `Tubo ${letraTubo}`
        embrulhosTubos[claridadePos].innerText = `Tubo ${letraTubo}`
    }
}