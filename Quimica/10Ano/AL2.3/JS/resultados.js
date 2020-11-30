// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q10_AL23 = {
    preparado: false,
}

let concInicial
let concDiluida
let volumeSolu

let concInicialResp
let concDiluidaResp
let volumeSoluResp
let fatorResp
let volumeInicialResp

let Vsol = 250


function prepararResultados() {
    if (Q10_AL23.preparado) {
        return
    }

    // Selecionar Sliders
    concInicial = document.getElementById('concInicial')
    concDiluida = document.getElementById('concDiluida')
    volumeSolu = document.getElementById('volumeSolu') 
    
    // Selecionar os Spans com os Valores dos Sliders
    concInicialResp = document.getElementById('concInicialValue')
    concDiluidaResp = document.getElementById('concDiluidaValue')
    volumeSoluResp = document.getElementById('volumeSoluValue')

    // Selecionar os Spans com os Resultados da Tabela
    fatorResp = document.getElementById('fatorValue')
    volumeInicialResp = document.getElementById('volumeInicialValue')


    // Atualizar os Sliders
    concInicial.oninput = function atualizarConcInicial() {
        let concInicialValue = concInicial.value / 1000
    
        concInicialResp.innerText = `${concInicialValue.toFixed(3)}`

        maxConcDiluida(concInicialValue)
    }
    concDiluida.oninput = function atualizarConcDiluida() {
        let concDiluidaValue = concDiluida.value / 100000
        
        if (concDiluidaValue < 0.001) {
            concDiluidaResp.innerHTML = `${(concDiluidaValue*10000).toFixed(1)} &times; 10<sup>-4</sup> `
        } else {
            concDiluidaResp.innerText = `${concDiluidaValue.toFixed(3)}`
        }
    }
    volumeSolu.oninput = function atualizarVolumeSolu() {
        let volumeSoluValue = volumeSolu.value / 1

        let resp
        switch (volumeSoluValue) {
            case 1:
                resp = '100'
                Vsol = 100
                break
            case 2:
                resp = '250'
                Vsol = 250
                break
            case 3:
                resp = '500'
                Vsol = 500
                break
            case 4:
                resp = '1000'
                Vsol = 1000
                break
            default:
                break
        }
    
        volumeSoluResp.innerText = resp
    }

    Q10_AL23.preparado = true
    curva()
}


function maxConcDiluida(Ci) {
    let Cd = concDiluida.value / 100000

    Cmax = Math.floor(Ci / 2 * 100000)
    concDiluida.max = Cmax
    Cmax /= 100000

    if (Cd > Cmax) {
        if (Cmax < 0.001) {
            concDiluidaResp.innerHTML = `${(Cmax*10000).toFixed(1)} &times; 10<sup>-4</sup> `
        } else {
            concDiluidaResp.innerText = `${Cmax.toFixed(3)}`
        }
    }
}


// Mostrar o Resultado
function curva() {
    let Ci = concInicial.value / 1000
    let Cd = concDiluida.value / 100000

    if (Cd >= 0.001) {
        Cd = Cd.toFixed(3)
    }

    let f = Ci / Cd
    let Vi = Vsol / f

    fatorResp.innerText = `${f.toFixed(2)}`
    if (Vi < 10) {
        volumeInicialResp.innerText = `${Vi.toFixed(2)}`
    } else volumeInicialResp.innerText = `${Vi.toFixed(1)}`
}