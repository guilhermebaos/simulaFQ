import Simula from '../JS/simula.js'

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio


// INPUTS
let rapidez, rapidezResp
let distInicial, distInicialResp


// Selecionar os Sliders
rapidez = document.getElementById('rapidez')
distInicial = document.getElementById('distInicial')

// Selecionar os Spans com os valores dos Sliders
rapidezResp = document.getElementById('rapidezValue')
distInicialResp = document.getElementById('distInicialValue')

// Atualizar os Sliders
rapidez.oninput = () => {
    let rapidezValue = rapidez.value / 1

    rapidezResp.innerText = `${rapidezValue.toFixed(1)}`
}
distInicial.oninput = () => {
    let distInicialValue = distInicial.value / 1

    distInicialResp.innerText = `${distInicialValue.toFixed(1)}`
}


// SIMULAÇÂO

// Selecionar o Canvas e o seu context
const canvasSimSnail = document.getElementById('canvasSimBot')
const canvasSimQuadrado = document.getElementById('canvasSimTop')

const ctxSnail = canvasSimSnail.getContext('2d')
const ctxQuadrado = canvasSimQuadrado.getContext('2d')

ctxSnail.scale(DPR, DPR)
ctxQuadrado.scale(DPR, DPR)



// Dimensões do Canvas
fixDPR()

function fixDPR() {
    for(let i = 0; i < 2; i++) {
        let canvasSim = [canvasSimSnail, canvasSimQuadrado][i]
    
        // Altura do CSS
        let altura_css = +getComputedStyle(canvasSim).getPropertyValue("height").slice(0, -2)
        // Larura do CSS
        let largura_css = +getComputedStyle(canvasSim).getPropertyValue("width").slice(0, -2)
    
        // Altera o tamanho do canvas
        canvasSim.width = largura_css * DPR
        canvasSim.height = altura_css * DPR
    }
}


// Constantes para a Simulação
const RESOLUCAO = 100                 // Tamanho do deltaT em cada update

// Criar o Objeto Simula
const simula = new Simula(canvasSimSnail, canvasSimQuadrado, RESOLUCAO)

// Cronómetro
let cronometroHtml = document.getElementById("tempo")
let cronometro = 0

// Criar o loop da Simulação
let ultimoTempo

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo

    if (!simula.stop) {
        cronometro += deltaTempo
        cronometroHtml.innerText = (cronometro * RESOLUCAO).toFixed(2)
    }
    
    for (let i = 0; i < RESOLUCAO; i++) {
        simula.update(deltaTempo)
    }
    simula.desenhar(ctxSnail, ctxQuadrado)

    requestAnimationFrame(loopSimula)
}


// Botão de Reiniciar a Simulação
let started = 0
let btnReiniciar = document.getElementById('reiniciar-Simulação')
btnReiniciar.addEventListener('click', (() => {
    if (!started) {
        requestAnimationFrame(loopSimula)
    }

    ctxSnail.clearRect(0, 0, canvasSimSnail.width, canvasSimSnail.height)
    ctxQuadrado.clearRect(0, 0, canvasSimQuadrado.width, canvasSimQuadrado.height)
    simula.reiniciar()

    cronometro = 0
    btnReiniciar.innerText = 'Reiniciar a Simulação'
}))


window.onresize = fixDPR

// Ajuda a evitar lag no carregamento da página
fixDPR()
window.setTimeout(() => {
    simula.reiniciar()
}, 200)