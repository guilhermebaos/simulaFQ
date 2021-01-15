import Simula from '../JS/simula.js'
import graficos from '../JS/graficos.js'


// INPUTS

// Selecionar os Sliders
let massaPendulo = document.getElementById('massaPendulo')
let comprimentoFio = document.getElementById('comprimentoFio')
let aGravitica = document.getElementById('aGravitica')
let angMax = document.getElementById('angMax')
let tempoMax = document.getElementById('tempoMax')

// Selecionar os Spans com os valores dos Sliders
let massaPenduloResp = document.getElementById('massaPenduloValue')
let comprimentoFioResp = document.getElementById('comprimentoFioValue')
let aGraviticaResp = document.getElementById('aGraviticaValue')
let angMaxResp = document.getElementById('angMaxValue')
let tempoMaxResp = document.getElementById('tempoMaxValue')

// Atualizar os Sliders
massaPendulo.oninput = function atualizarmassaPendulo() {
    let massaPenduloValue = massaPendulo.value / 1000

    massaPenduloResp.innerText = `${massaPenduloValue.toFixed(3)}`
}
comprimentoFio.oninput = function atualizarcomprimentoFio() {
    let comprimentoFioValue = comprimentoFio.value / 100

    comprimentoFioResp.innerText = `${comprimentoFioValue.toFixed(2)}`
}
aGravitica.oninput = function atualizaraGravitica() {
    let aGraviticaValue = aGravitica.value / 100

    aGraviticaResp.innerText = `${aGraviticaValue.toFixed(2)}`
}
angMax.oninput = function atualizaraGravitica() {
    let angMaxValue = angMax.value / 10

    angMaxResp.innerText = `${angMaxValue.toFixed(1)}`
}
tempoMax.oninput = function atualizaraGravitica() {
    let tempoMaxValue = tempoMax.value / 1

    tempoMaxResp.innerText = `${tempoMaxValue.toFixed(0)}`
}

// Span que indica quando tempo falta para aparecerm os gráficos
let esperarSegundos = document.getElementById('esperar-segundos')


// Mostrar (ou esconder) os gráficos
function mostrarGraficos() {
    mostrarExtra('recolherDados')
    mostrarExtra('verGráficos')
}

// Selecionar as divs com os Gráficos
let divCurvaAng = document.getElementById('curvaAng')
let divCurvaPos = document.getElementById('curvaPos')
let divCurvaVel = document.getElementById('curvaVel')
let divCurvaAce = document.getElementById('curvaAce')
let divCurvaJer = document.getElementById('curvaJer')
let divCurvaEne = document.getElementById('curvaEne')

const DIVS_CURVAS = [
    divCurvaAng,
    divCurvaPos,
    divCurvaVel,
    divCurvaAce,
    divCurvaJer,
    divCurvaEne
]


// SIMULAÇÂO

// Selecionar o Canvas e o seu context
let canvasPendulo = document.getElementById('canvasPendulo')

let ctx = canvasPendulo.getContext('2d')




// Obter o DPI do ecrã
let DPI = window.devicePixelRatio


// Dimensões do Canvas
fixDPI()

function fixDPI() {
    // Altura do CSS
    let altura_css = +getComputedStyle(canvasPendulo).getPropertyValue("height").slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasPendulo).getPropertyValue("width").slice(0, -2)

    // Altera o tamanho do canvas
    canvasPendulo.setAttribute('width', largura_css * DPI)
    canvasPendulo.setAttribute('height', altura_css * DPI)
}


// Constantes para a Simulação
const RESOLUCAO = 100                 // Tamanho do deltaT em cada update
const UPDATES_POR_FRAME = 1           // Velocidade da Simulação

// Criar o Objeto Simula
let simula = new Simula(canvasPendulo, RESOLUCAO, UPDATES_POR_FRAME)


// Criar o loop da Simulação
let ultimoTempo, graficosVisiveis

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = tempo - ultimoTempo
    ultimoTempo = tempo
    
    for (let i = 0; i < UPDATES_POR_FRAME * RESOLUCAO; i++) {
        let dados = simula.update(deltaTempo)
        if (typeof dados === 'number') {
            let tempoFalta = Math.ceil(dados)
            if (tempoFalta >= 0) {
                esperarSegundos.innerText = tempoFalta
            }
        } else if (typeof dados === 'object') {
            mostrarGraficos()
            graficos(dados, DIVS_CURVAS)
            graficosVisiveis = true
        }
    }
    ctx.clearRect(0, 0, canvasPendulo.width, canvasPendulo.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}


// Botão de Reiniciar a Simulação
document.getElementById('reiniciar-Simulação').addEventListener('click', (() => {
    if (graficosVisiveis) {
        mostrarGraficos()
        graficosVisiveis = false
    }
    simula.reiniciar()
}))

// Botão de pausa
document.getElementById('pausa-Simulação').addEventListener('click', (() => {
    simula.pausa()
}))



window.onresize = simula.novoTamanho()


// Ajuda a evitar lag no carregamento da página
window.setTimeout(() => {
    requestAnimationFrame(loopSimula)
}, 200)
