import Simula from '../JS/simula.js'
import {criarGraficos, atualizarGraficos} from '../JS/graficos.js'

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio


// INPUTS

// Selecionar os Sliders
let valorMassa = document.getElementById('valorMassa')
let constanteElastica = document.getElementById('constanteElastica')
let comprimentoMola = document.getElementById('comprimentoMola')
let posInicial = document.getElementById('posInicial')
let aGravitica = document.getElementById('aGravitica')

// Selecionar os Spans com os valores dos Sliders
let valorMassaResp = document.getElementById('valorMassaValue')
let constanteElasticaResp = document.getElementById('constanteElasticaValue')
let comprimentoMolaResp = document.getElementById('comprimentoMolaValue')
let posInicialResp = document.getElementById('posInicialValue')
let aGraviticaResp = document.getElementById('aGraviticaValue')

// Atualizar os Sliders
valorMassa.oninput = function atualizarvalorMassa() {
    let valorMassaValue = valorMassa.value / 1000

    valorMassaResp.innerText = `${valorMassaValue.toFixed(3)}`
}
constanteElastica.oninput = function atualizarcomprimentoMola() {
    let constanteElasticaValue = constanteElastica.value / 100

    constanteElasticaResp.innerText = `${constanteElasticaValue.toFixed(2)}`
}
comprimentoMola.oninput = function atualizarcomprimentoMola() {
    let comprimentoMolaValue = comprimentoMola.value / 100

    comprimentoMolaResp.innerText = `${comprimentoMolaValue.toFixed(2)}`
}
posInicial.oninput = function atualizaraGravitica() {
    let posInicialValue = posInicial.value / 100

    posInicialResp.innerText = `${posInicialValue.toFixed(2)}`
}
aGravitica.oninput = function atualizaraGravitica() {
    let aGraviticaValue = aGravitica.value / 100

    aGraviticaResp.innerText = `${aGraviticaValue.toFixed(2)}`
}

// Selecionar as divs com os Gráficos
let divCurvaEne = document.getElementById('curvaEne')
let divCurvaPos = document.getElementById('curvaPos')
let divCurvaVel = document.getElementById('curvaVel')
let divCurvaAce = document.getElementById('curvaAce')
let divCurvaJer = document.getElementById('curvaJer')

const DIVS_CURVAS = [
    divCurvaEne,
    divCurvaPos,
    divCurvaVel,
    divCurvaAce,
    divCurvaJer
]


// SIMULAÇÂO

// Selecionar o Canvas e o seu context
let canvasSim = document.getElementById('canvasSim')

let ctx = canvasSim.getContext('2d')

ctx.scale(DPR, DPR)



// Dimensões do Canvas
fixDPR()

function fixDPR() {
    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue("height").slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue("width").slice(0, -2)

    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPR
    canvasSim.height = altura_css * DPR
}


// Constantes para a Simulação
const RESOLUCAO = 100                 // Tamanho do deltaT em cada update
const UPDATES_POR_FRAME = 1           // Velocidade da Simulação

// Criar o Objeto Simula
let simula = new Simula(canvasSim, RESOLUCAO, UPDATES_POR_FRAME)


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
    
    // UNCOMMENT PARA ALTERAR A VELOCIDADE DA SIMULAÇÃO
    // for (let frames = 0; frames < velocidadeSim.value / 1; frames++) {}
    for (let i = 0; i < RESOLUCAO; i++) {
        dados = simula.update(deltaTempo)
        if (dados) {
            atualizarGraficos(graficos, dados[0], dados.slice(1, dados.lenght))
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
let btnReiniciar = document.getElementById('reiniciar-Simulação')
btnReiniciar.addEventListener('click', (() => {
    reiniciar(true)
    btnReiniciar.innerText = 'Reiniciar a Simulação'
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