// Definir Constantes
const varEntalpiaFusaoGelo = 333.55e03   // J/kg
const cAgua = 4.18e03   // J/kg/ºC


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL33 = {
    preparado: false,
    processandoAnim: false
}

let massaQuente
let tempQuente
let massaFria
let tempFria
let massaGelo

let massaQuenteResp
let tempQuenteResp
let massaFriaResp
let tempFriaResp
let massaGeloResp
let tempFinalResp

let varEntalpiaGeloResp

let escolhasMistura
let misturaEscolhida = 0


function prepararResultados() {
    if (F10_AL33.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaQuente = document.getElementById('massaQuente')
    tempQuente = document.getElementById('tempQuente')
    massaFria = document.getElementById('massaFria')
    tempFria = document.getElementById('tempFria')
    massaGelo = document.getElementById('massaGelo')

    // Selecionar os Spans com os Valores dos Sliders
    massaQuenteResp = document.getElementById('massaQuenteValue')
    tempQuenteResp = document.getElementById('tempQuenteValue')
    massaFriaResp = document.getElementById('massaFriaValue')
    tempFriaResp = document.getElementById('tempFriaValue')
    massaGeloResp = document.getElementById('massaGeloValue')

    // Selecionar os Butões
    escolhasMistura = document.getElementsByName('escolhaMistura')


    // Selecionar os spans com os Resultados da Tabela
    tempFinalResp = document.getElementById('tempFinalValue')

    // Variação de Entalpia do Gelo
    varEntalpiaGeloResp = document.getElementById('varEntalpiaGelo')

    // Atualizar os Sliders
    massaQuente.oninput = function atualizarMassaQuente() {
        let massaQuenteValue = massaQuente.value / 10
    
        massaQuenteResp.innerText = `${massaQuenteValue.toFixed(1)}`
    }
    tempQuente.oninput = function atualizarTempQuente() {
        let tempQuenteValue = tempQuente.value / 10
    
        tempQuenteResp.innerText = `${tempQuenteValue.toFixed(1)}`
    }
    massaFria.oninput = function atualizarMassaFria() {
        let massaFriaValue = massaFria.value / 10
    
        massaFriaResp.innerText = `${massaFriaValue.toFixed(1)}`
    }
    tempFria.oninput = function atualizarTempFria() {
        let tempFriaValue = tempFria.value / 10
    
        tempFriaResp.innerText = `${tempFriaValue.toFixed(1)}`
    }
    massaGelo.oninput = function atualizarMassaGelo() {
        let massaGeloValue = massaGelo.value / 10
    
        massaGeloResp.innerText = `${massaGeloValue.toFixed(1)}`
    }

    F10_AL33.preparado = true
    curva()
}


// Selecionar o que vai ser misturado e alterar a aparência dos Butões
function escolherMistura(num) {
    if (num != misturaEscolhida) {
        if (F10_AL33.processandoAnim) return
        F10_AL33.processandoAnim = true
        // Desselecionar escolha anterior
        mostrarExtra(`mistura${misturaEscolhida}`)
        escolhasMistura[misturaEscolhida].className = 'escolha'

        // Selecinar Nova Escolha
        misturaEscolhida = num
        window.setTimeout(mostrarExtra, mostrarExtraTempo, `mistura${misturaEscolhida}`)
        window.setTimeout(function() {
            F10_AL33.processandoAnim = false
        }, mostrarExtraTempo * 2)
        escolhasMistura[misturaEscolhida].className = 'escolha-atual'
    }
}



// Calcula e mostra os Resultados da Tabela
function curva() {
    let mQuente = massaQuente.value / 10
    let tQuente = tempQuente.value / 10
    
    if (misturaEscolhida == 0) {
        mFria = massaFria.value / 10
        tFria = tempFria.value / 10

        let tf = (mQuente * tQuente + mFria * tFria) / (mQuente + mFria)
        tempFinalResp.innerText = tf.toFixed(2)

        varEntalpiaGelo.innerText = ''
    } else {
        let mGelo = massaGelo.value / 10

        let tf = (varEntalpiaFusaoGelo * mGelo - cAgua * mQuente * tQuente) / (-cAgua * mGelo - cAgua * mQuente)
        tempFinalResp.innerText = tf.toFixed(2)

        varEntalpiaGeloResp.innerText = `A Variação de Entalpia Mássica de Fusão do Gelo é de ${varEntalpiaFusaoGelo/1000}kJ/kg`
    }
}


// Ideia: Permitir dissipação de energia, aleatória ou não,
//        ou absorção pelo Gobelé