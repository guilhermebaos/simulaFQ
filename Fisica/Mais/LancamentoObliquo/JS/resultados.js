import Simula from '../JS/simula.js'
import {criarGraficos, atualizarGraficos} from '../JS/graficos.js'


// Obter o DPR do ecrã
const DPR = window.devicePixelRatio


// INPUTS

// Selecionar os Sliders
let massaEsfera = document.getElementById('massaEsfera')
let massaEsferaResp = document.getElementById('massaEsferaValue')

let velInicial = document.getElementById('velInicial')
let velInicialResp = document.getElementById('velInicialValue')

let angLanc = document.getElementById('angLanc')
let angLancResp = document.getElementById('angLancValue')

let hLanc = document.getElementById('hLanc')
let hLancResp = document.getElementById('hLancValue')

let larguraSim = document.getElementById('larguraSim')
let larguraSimResp = document.getElementById('larguraSimValue')

let aGrav = document.getElementById('aGrav')
let aGravResp = document.getElementById('aGravValue')

let velocidadeSim = document.getElementById('velocidadeSim')
let velocidadeSimResp = document.getElementById('velocidadeSimValue')


// Atualizar os Sliders
massaEsfera.oninput = () => {
    let massaEsferaValue = massaEsfera.value / 1000

    massaEsferaResp.innerText = `${massaEsferaValue.toFixed(3)}`
    reiniciar()
}
velInicial.oninput = () => {
    let velInicialValue = velInicial.value / 10

    velInicialResp.innerText = `${velInicialValue.toFixed(1)}`
    reiniciar()
}
angLanc.oninput = () => {
    let angLancValue = angLanc.value / 10

    angLancResp.innerText = `${angLancValue.toFixed(1)}`
    reiniciar()
}
hLanc.oninput = () => {
    let hLancValue = hLanc.value / 10

    hLancResp.innerText = `${hLancValue.toFixed(1)}`
    reiniciar()
}
larguraSim.oninput = () => {
    let larguraSimValue = larguraSim.value / 1

    larguraSimResp.innerText = `${larguraSimValue.toFixed(0)}`
    reiniciar()
}
aGrav.oninput = () => {
    let aGravValue = aGrav.value / 100

    aGravResp.innerText = `${aGravValue.toFixed(2)}`
    reiniciar()
}
velocidadeSim.oninput = () => {
    let velocidadeSimValue = velocidadeSim.value / 1

    velocidadeSimResp.innerText = `${velocidadeSimValue.toFixed(1)}`
    simula.dados.frames = velocidadeSimValue
}


// Selecionar as divs com os Gráficos
let divCurvaAng = document.getElementById('curvaAng')
let divCurvaPos = document.getElementById('curvaPos')
let divCurvaVel = document.getElementById('curvaVel')
let divCurvaEne = document.getElementById('curvaEne')
let divCurvaAce = document.getElementById('curvaAce')

const DIVS_CURVAS = [
    divCurvaAng,
    divCurvaEne,
    divCurvaPos,
    divCurvaVel,
    divCurvaAce
]


// SIMULAÇÂO

// Selecionar o Canvas e o seu context
let canvasSim = document.getElementById('canvasSim')

let ctx = canvasSim.getContext('2d')

ctx.scale(DPR, DPR)


// Constantes para a Simulação
const RESOLUCAO = 15                 // Tamanho do deltaT em cada update

// Criar o Objeto Simula
let simula = new Simula(canvasSim, RESOLUCAO)



// Corrige o tamanho do Canvas e corrige o DPR
function fixDPR() {
    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue('height').slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue('width').slice(0, -2)

    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPR
    canvasSim.height = altura_css * DPR

    reiniciar()
}


// Criar o loop da Simulação
let ultimoTempo, graficos

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        if (!graficos) graficos = criarGraficos(DIVS_CURVAS)
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo

    
    let dados
    for (let frames = 0; frames < velocidadeSim.value / 1; frames++) {
        for (let i = 0; i < RESOLUCAO; i++) {
            dados = simula.update(deltaTempo)
            if (dados) {
                atualizarGraficos(graficos, dados[0], dados.slice(1, dados.lenght))
            }
        }
    }
    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}


// Reiniciar a Simulação
function reiniciar(start=false) {
    simula.reiniciar(start)
    graficos = criarGraficos(DIVS_CURVAS)
}


// Botão de Reiniciar a Simulação
document.getElementById('reiniciar-Simulação').addEventListener('click', (() => {
    reiniciar(true)
}))

// Botão de pausa
document.getElementById('pausa-Simulação').addEventListener('click', (() => {
    simula.pausa()
}))



window.onresize = fixDPR

// Ajuda a evitar lag no carregamento da página
fixDPR()
window.setTimeout(() => {
    reiniciar()
    requestAnimationFrame(loopSimula)
}, 200)
