// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q12_AL1 = {
    preparado: false,
}

let massaProdutoMax

let massaInicial
let purezaCobre
let rendimento

let massaInicialResp
let purezaCobreResp
let rendimentoResp

let massaFinalResp

function prepararResultados() {
    if (Q12_AL1.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaInicial = document.getElementById('massaInicial')
    purezaCobre = document.getElementById('purezaCobre')
    rendimento = document.getElementById('rendimento')
    
    // Selecionar os Spans com os Valores dos Sliders
    massaInicialResp = document.getElementById('massaInicialValue')
    purezaCobreResp = document.getElementById('purezaCobreValue')
    rendimentoResp = document.getElementById('rendimentoValue')

    // Massa Final do Cobre
    massaFinalResp = document.getElementById('massaFinal')
    
    // Atualizar os Sliders
    massaInicial.oninput = function atualizarmassaInicial() {
        let massaInicialValue = massaInicial.value / 100
    
        massaInicialResp.innerText = `${massaInicialValue.toFixed(2)}`

        calcularMassaProdutoMax()
    }
    purezaCobre.oninput = function atualizarpurezaCobre() {
        let purezaCobreValue = purezaCobre.value / 10
    
        purezaCobreResp.innerText = `${purezaCobreValue.toFixed(1)}`
        
        calcularMassaProdutoMax()
    }

    Q12_AL1.preparado = true
    curva()
}


// Calcula Rendimento e o Reagente Limitante e mostra os Resultados na Tabela
function curva() {
    // Valores escolhidos pelo utilizador
    let mi = massaInicial.value / 100
    let gp = purezaCobre.value / 1000
    let ren = rendimento.value / 1000

    let mf = mi * gp * ren

    massaFinalResp.innerText = `${mf.toFixed(3)}`
    rendimentoResp.innerText = `${(ren * 100).toFixed(1)}`
}