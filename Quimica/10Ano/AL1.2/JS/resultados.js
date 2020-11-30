// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL12 = {
    preparado: false,
}

let salArray
let salEscolhidoPos = 0

let salEscolhidoResp
let corChamaResp


function prepararResultados() {
    if (Q10_AL12.preparado) {
        return
    }

    // Selecionar os Butões
    salArray = document.getElementsByName('salChama')

    // Selecionar os Spans com os Resultados da Tabela
    salEscolhidoResp = document.getElementById('salEscolhidoValue')
    corChamaResp = document.getElementById('corChamaValue')

    corChamaResp.innerText
    
    Q10_AL12.preparado = true
}


// Altera o Sal escolhido, bem como a aparência dos butões
function escolherSal(pos) {

    salArray[salEscolhidoPos].className = 'escolha'
    salArray[pos].className = 'escolha-atual'

    salEscolhidoPos = pos

    curva()
}


// Mostra os Resultados na Tabela, Nome do Sal e Cor da Chama
function curva() {
    if (salEscolhidoPos == '0') {
        salEscolhidoResp.innerText = 'Cloreto de Sódio'
        corChamaResp.innerText = 'Amarelo'
    } else if (salEscolhidoPos == '1') {
        salEscolhidoResp.innerText = 'Cloreto de Cálcio'
        corChamaResp.innerText = 'Vermelho Claro'
    } else if (salEscolhidoPos == '2') {
        salEscolhidoResp.innerText = 'Cloreto de Potássio'
        corChamaResp.innerText = 'Violeta'
    } else if (salEscolhidoPos == '3') {
        salEscolhidoResp.innerText = 'Cloreto de Bário'
        corChamaResp.innerText = 'Verde'
    } else if (salEscolhidoPos == '4') {
        salEscolhidoResp.innerText = 'Cloreto de Lítio'
        corChamaResp.innerText = 'Vermelho Escuro'
    } else if (salEscolhidoPos == '5') {
        salEscolhidoResp.innerText = 'Cloreto de Cobre (II)'
        corChamaResp.innerText = 'Verde Claro'
    }
}

// Adicionar Imagens da Chama, quando as tiver