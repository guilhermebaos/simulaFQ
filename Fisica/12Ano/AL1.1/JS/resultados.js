// Definir Constantes
const g = 9.80665   // Aceleração Gravitaconal

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Constantes para a Simulação
const RESOLUCAO = 25                        // Tamanho do deltaT em cada update


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F12_AL11 = {
    preparado: false
}

let dEsfera, dEsferaResp
let hInicial, hInicialResp
let hLanc, hLancResp

let tempoPassagemResp, alcanceResp

let simula, ctx
function prepararResultados() {
    if (F12_AL11.preparado) {
        return
    }

    // Selecionar Sliders
    dEsfera = document.getElementById('dEsfera')
    hInicial = document.getElementById('hInicial')
    hLanc = document.getElementById('hLanc')

    // Selecionar os Spans com os Valores dos Sliders
    dEsferaResp = document.getElementById('dEsferaValue')
    hInicialResp = document.getElementById('hInicialValue')
    hLancResp = document.getElementById('hLancValue')

    // Selecionar os Spans com os Resultados da Tabela
    tempoPassagemResp = document.getElementById('tempoPassagemValue')
    alcanceResp = document.getElementById('alcanceValue')

    // Atualizar os Sliders
    dEsfera.oninput = () => {
        let dEsferaValue = dEsfera.value / 10

        dEsferaResp.innerText = `${dEsferaValue.toFixed(1)}`

        reiniciar()
    }
    hInicial.oninput = () => {
        let hInicialValue = hInicial.value / 100
    
        hInicialResp.innerText = `${hInicialValue.toFixed(2)}`

        reiniciar()
    }
    hLanc.oninput = () => {
        let hLancValue = hLanc.value / 100
    
        hLancResp.innerText = `${hLancValue.toFixed(2)}`

        reiniciar()
    }


    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

    // Criar o Objeto Simula
    simula = new window.Simula(canvasSim)

    F12_AL11.preparado = true
    loopSimula()
}


// Corrige o tamanho do Canvas e corrige o DPR
function fixDPR() {
    // Usar variável global
    if (simulaFQmenu.aberto !== 'resultados.html') return

    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue('height').slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue('width').slice(0, -2)
    
    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPR
    canvasSim.height = altura_css * DPR

    canvasSim.style.height = altura_css + 'px'

    simula.novoTamanho()
}


// Reiniciar a Simulação
function reiniciar(start=false) {
    simula.reiniciar(start)
}


// Criar o loop da Simulação
let ultimoTempo, graficos, resultadosSim

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        requestAnimationFrame(loopSimula)
        reiniciar()
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo
    
    for (let i = 0; i < RESOLUCAO; i++) {
        resultadosSim = simula.update(deltaTempo)
        if (resultadosSim){
            if (resultadosSim[0]) {
                tempoPassagemResp.innerText = (dEsfera.value / 10 / resultadosSim[0] * 1000).toFixed(2)
            }
            else if (resultadosSim[1]) {
                alcanceResp.innerText = (resultadosSim[1] / 100).toFixed(2)
            }
        }
    }

    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR