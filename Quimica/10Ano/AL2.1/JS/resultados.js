// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL21 = {
    preparado: false,
    processandoAnim: false
}

let liqArray

let liqEscolhidosBin = ['0', '0', '0', '0', '0', '0']
let liqEscolhidosNum = 0

let resultadoAntigo = 'a-menos'
let resultadoNovo


function prepararResultados() {
    if (Q10_AL21.preparado) {
        return
    }

    // Selecionar os Butões
    liqArray = document.getElementsByName('líquido')
    Q10_AL21.preparado = true
    // curva()
}


// Responder à escolha de um líquido
function escolherLiq(pos) {
    // Mudar o estado do Butão e do Binários dos Líquidos escolhidos
    let estado = liqEscolhidosBin[pos]
    if (estado == '0') {
        liqArray[pos].className = 'escolha-atual'
        liqEscolhidosBin[pos] = '1'
        liqEscolhidosNum += 1
    } else  {
        liqArray[pos].className = 'escolha'
        liqEscolhidosBin[pos] = '0'
        liqEscolhidosNum -= 1
    }

    // Mostrar o resultado
    if (liqEscolhidosNum < 2) {
        resultadoNovo = 'a-menos'
    } else if (liqEscolhidosNum > 2) {
        resultadoNovo = 'a-mais'
    } else {
        let mostrar = liqEscolhidosBin.toString().replaceAll(',', '')
        resultadoNovo = mostrar
    }
}


// Mostrar o Resultado
function curva() {
    if (resultadoAntigo != resultadoNovo) {
        if (Q10_AL21.processandoAnim) return
        Q10_AL21.processandoAnim = true
        mostrarExtra(resultadoAntigo)
        window.setTimeout(mostrarExtra, mostrarExtraTempo, resultadoNovo)
        window.setTimeout(function() {
            Q10_AL21.processandoAnim = false
        }, mostrarExtraTempo * 2)
        resultadoAntigo = resultadoNovo
    }
}