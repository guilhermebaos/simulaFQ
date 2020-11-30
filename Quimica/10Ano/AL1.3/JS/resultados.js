// Inicializar Variáveis Globais
let densidadeH2O = 0.9999749 // Densidade da água a 4ºC, g/cm^3

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL13 = {
    preparado: false,
}

let metalArray
let metalEscolhidoPos = 0

let massaEsfera
let massaPic

let massaEsferaResp
let massaPicResp

let massaAResp
let massaBResp
let massaCResp

let dRelativaResp
let erroRelativoResp
let c



function prepararResultados() {
    if (Q10_AL13.preparado) {
        return
    }

    // Selecionar Sliders
    massaEsfera = document.getElementById('massaEsfera')
    massaPic = document.getElementById('massaPic')
    
    // Selecionar os Spans com os Valores dos Sliders
    massaEsferaResp = document.getElementById('massaEsferaValue')
    massaPicResp = document.getElementById('massaPicValue')

    // Selecionar os Butões
    metalArray = document.getElementsByName('metalPicnometria')

    // Selecionar os Spans com os Resultados da Tabela
    massaAResp = document.getElementById('massaAValue')
    massaBResp = document.getElementById('massaBValue')
    massaCResp = document.getElementById('massaCValue')

    dRelativaResp = document.getElementById('dRelativaValue')
    erroRelativoResp = document.getElementById('erroRelativoValue')
    dTabeladoResp = document.getElementById('dTabeladoValue')
    
    // Atualizar os Sliders
    massaEsfera.oninput = function atualizarMassaEsfera() {
        let massaEsferaValue = massaEsfera.value / 10
    
        massaEsferaResp.innerText = `${massaEsferaValue.toFixed(1)}`
    }
    massaPic.oninput = function atualizarMassaPic() {
        let massaPicValue = massaPic.value / 10
    
        massaPicResp.innerText = `${massaPicValue.toFixed(1)}`
    }

    Q10_AL13.preparado = true
    curva()
}


// Altera o Metal escolhido, bem como a aparência dos butões
function escolherMetal(pos) {

    metalArray[metalEscolhidoPos].className = 'escolha'
    metalArray[pos].className = 'escolha-atual'

    metalEscolhidoPos = pos
}


// Mostra os Resultados na Tabela
function curva() {
    let mMetal = massaEsfera.value / 10
    let mPicno = massaPic.value / 10

    let mA = mMetal.toFixed(1)
    let mB = (mMetal + mPicno).toFixed(1)

    massaAResp.innerText = mA
    massaBResp.innerText = mB

    
    let dTabelado
    if (metalEscolhidoPos == 0) {
        dTabelado = 2.70
    } else if (metalEscolhidoPos == 1) {
        dTabelado = 11.35
    } else if (metalEscolhidoPos == 2) {
        dTabelado = 8.96
    } else if (metalEscolhidoPos == 3) {
        dTabelado = 7.87
    } else if (metalEscolhidoPos == 4) {
        dTabelado = 8.90
    } else if (metalEscolhidoPos == 5) {
        dTabelado = 19.32
    }
    let VMetal = mMetal / dTabelado
    let mAgua = densidadeH2O * VMetal
    let mC = (mPicno + mMetal - mAgua).toFixed(1)

    massaCResp.innerText = mC
    let dObtido = (mA / (mB - mC)).toFixed(2)

    dRelativaResp.innerText = dObtido
    erroRelativoResp.innerText = (Math.abs(dObtido - dTabelado) / dTabelado * 100).toFixed(2)
    dTabeladoResp.innerText = dTabelado.toFixed(2)
}