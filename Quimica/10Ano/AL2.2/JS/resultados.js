// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL22 = {
    preparado: false,
}

let solutoArray
let solEscolhidoPos = 0

let volumeSolu
let concSolu

let volumeSoluResp
let concSoluResp

let solutoEscolhidoResp
let solutoMolarResp

let quantidadeSolutoResp
let massaSolutoResp

let mMolar = 58.44
let Vsol = 0.250


function prepararResultados() {
    if (Q10_AL22.preparado) {
        return
    }

    // Selecionar os Butões
    solutoArray = document.getElementsByName('soluto')

    // Selecionar Sliders
    volumeSolu = document.getElementById('volumeSolu') 
    concSolu = document.getElementById('concSolu') 
    
    // Selecionar os Spans com os Valores dos Sliders
    volumeSoluResp = document.getElementById('volumeSoluValue')
    concSoluResp = document.getElementById('concSoluValue')

    // Selecionar os Spans com os Resultados da Tabela
    quantidadeSolutoResp = document.getElementById('quantidadeSolutoValue')
    massaSolutoResp = document.getElementById('massaSolutoValue')

    // Selecionar os Spans de Resposta
    solutoEscolhidoResp = document.getElementById('solutoEscolhidoValue')
    solutoMolarResp = document.getElementById('massaMolarValue')


    // Atualizar os Sliders
    concSolu.oninput = function atualizarConcSolu() {
        let concSoluValue = concSolu.value / 1000
    
        concSoluResp.innerText = `${concSoluValue.toFixed(3)}`
    }
    volumeSolu.oninput = function atualizarVolumeSolu() {
        let volumeSoluValue = volumeSolu.value / 1

        let resp
        switch (volumeSoluValue) {
            case 1:
                resp = '100'
                Vsol = 0.100
                break
            case 2:
                resp = '250'
                Vsol = 0.250
                break
            case 3:
                resp = '500'
                Vsol = 0.500
                break
            case 4:
                resp = '1000'
                Vsol = 1
                break
            default:
                break
        }
    
        volumeSoluResp.innerText = resp
    }

    Q10_AL22.preparado = true
    curva()
}


// Altera o Soluto escolhido, bem como a aparência dos butões
function escolherSoluto(pos) {

    solutoArray[solEscolhidoPos].className = 'escolha'
    solutoArray[pos].className = 'escolha-atual'

    solEscolhidoPos = pos

    if (pos == 0) {
        solutoEscolhidoResp.innerText = 'Cloreto de Sódio (Sal de Cozinha)'
        mMolar = 58.44
    } else if (pos == 1) {
        solutoEscolhidoResp.innerText = 'Dicromato de Potássio'
        mMolar = 214.2
    } else if (pos == 2) {
        solutoEscolhidoResp.innerHTML = 'Sulfato de Cobre (<span class="serif100">II</span>) penta-hidratado'
        mMolar = 249.71
    } else if (pos == 3) {
        solutoEscolhidoResp.innerText = 'Sacarose (Açúcar de Cozinha)'
        mMolar = 343.34
    }
}


// Mostrar o Resultado
function curva() {
    let M = mMolar
    let C = concSolu.value / 1000
    let V = Vsol

    solutoMolarResp.innerText = mMolar.toFixed(2)

    let n = (C * V * 1000).toFixed(2)
    let m = (n * M / 1000).toFixed(3)

    quantidadeSolutoResp.innerText = n
    massaSolutoResp.innerText = m
}