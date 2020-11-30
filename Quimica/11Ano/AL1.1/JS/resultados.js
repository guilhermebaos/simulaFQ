// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q11_AL11 = {
    preparado: false,
}

let massaProdutoMax

let massaReagente1
let volumeReagente2
let massaProduto

let massaReagente1Resp
let volumeReagente2Resp
let massaProdutoResp

let nC7H6O3Resp
let nC4H6O3Resp
let nC9H8O4Resp
let reagenteLimitanteResp
let rendimentoResp


function prepararResultados() {
    if (Q11_AL11.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaReagente1 = document.getElementById('massaReagente1')
    volumeReagente2 = document.getElementById('volumeReagente2')
    massaProduto = document.getElementById('massaProduto')
    
    // Selecionar os Spans com os Valores dos Sliders
    massaReagente1Resp = document.getElementById('massaReagente1Value')
    volumeReagente2Resp = document.getElementById('volumeReagente2Value')
    massaProdutoResp = document.getElementById('massaProdutoValue')

    // Selecionar os Spans com os Resultados da Tabela
    nC7H6O3Resp = document.getElementById('nC7H6O3Value')
    nC4H6O3Resp = document.getElementById('nC4H6O3Value')
    nC9H8O4Resp = document.getElementById('nC9H8O4Value')
    reagenteLimitanteResp = document.getElementById('reagenteLimitanteValue')
    rendimentoResp = document.getElementById('rendimentoValue')
    
    // Atualizar os Sliders
    massaReagente1.oninput = function atualizarMassaReagente1() {
        let massaReagente1Value = massaReagente1.value / 100
    
        massaReagente1Resp.innerText = `${massaReagente1Value.toFixed(2)}`

        calcularMassaProdutoMax()
    }
    volumeReagente2.oninput = function atualizarVolumeReagente2() {
        let volumeReagente2Value = volumeReagente2.value / 100
    
        volumeReagente2Resp.innerText = `${volumeReagente2Value.toFixed(2)}`
        
        calcularMassaProdutoMax()
    }
    massaProduto.oninput = function atualizarMassaProduto() {
        let massaProdutoValue = massaProduto.value / 100
    
        massaProdutoResp.innerText = `${massaProdutoValue.toFixed(2)}`
    }

    Q11_AL11.preparado = true
    curva()
}


// Calcula e devolve a Quantidade de Reagente Limitante 
function calcularQuantidadeLimitante() {
    let massaReagente1Value = massaReagente1.value / 100
    let volumeReagente2Value = volumeReagente2.value / 100

    // Calcular as quantidades químicas dos Reagentes (ver Teoria para ver as constantes)
    let nC7H6O3 = massaReagente1Value / 138.13
    let nC4H6O3 = (1.08 * volumeReagente2Value) / 102.10

    let nLimitante = nC7H6O3 < nC4H6O3 ? nC7H6O3 : nC4H6O3

    return nLimitante
}



// Calcula a Massa de Produto que obteriamos com Rendimeto 99%
function calcularMassaProdutoMax() {
    let nLimitante = calcularQuantidadeLimitante()

    let mProdutoMax = 180.17 * nLimitante * 0.99
    let massaProdutoValue = massaProduto.value / 100

    // Limita o Slider do Produto Obtido
    if (massaProdutoValue > mProdutoMax) {
        massaProduto.value = Math.floor(mProdutoMax * 100)

        mProduto = massaProduto.value / 100
        massaProdutoResp.innerHTML = `${mProduto.toFixed(2)}`
    }
    massaProduto.max = Math.floor(mProdutoMax * 100)
}


// Calcula Rendimento e o Reagente Limitante e mostra os Resultados na Tabela
function curva() {
    let massaReagente1Value = massaReagente1.value / 100
    let volumeReagente2Value = volumeReagente2.value / 100
    let massaProdutoValue = massaProduto.value / 100

    // Calcular as quantidades químicas (ver Teoria para ver as constantes)
    let nC7H6O3 = massaReagente1Value / 138.13
    let nC4H6O3 = (1.08 * volumeReagente2Value) / 102.10
    let nC9H8O4 = massaProdutoValue / 180.17
    
    let nLimitante = nC7H6O3 < nC4H6O3 ? nC7H6O3 : nC4H6O3

    // Registar os Valores Teórico e Obtidos do Produto
    let nProdutoTeo = nLimitante
    let nProdutoObt = nC9H8O4

    let rendimento = nProdutoObt / nProdutoTeo * 100

    nC7H6O3Resp.innerText = `${nC7H6O3.toFixed(5)}`
    nC4H6O3Resp.innerText = `${nC4H6O3.toFixed(5)}`
    nC9H8O4Resp.innerText = `${nC9H8O4.toFixed(5)}`
    
    reagenteLimitanteResp.innerText = nC7H6O3 < nC4H6O3 ? 'Ácido Salicílico' : 'Anidrido Etanoico'
    rendimentoResp.innerText = `${rendimento.toFixed(1)}`
}