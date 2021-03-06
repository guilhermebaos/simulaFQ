// Definir Constantes
const divsT = 3.215     // Número de Divisões do Osciloscópio no eixo do tempo
const divsV = 2.04      // Número de Divisões do Osciloscópio no eixo dos Volts

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Definições do gráfico
const cor = 'rgb(160, 230, 200)'
const largura = 3
const larguraEixos = 2            // Largura dos eixos do Osciloscópio

// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL21 = {
    preparado: false,
}

let voltsDiv, voltsDivResp
let segundosDiv, segundosDivResp
let freqSinal, freqSinalResp
let amplitudeSinal, amplitudeSinalResp

let voltsDivNum = 1, segundosDivNum = 500e-6

let aContext

let canvasSim, ctx
function prepararResultados() {
    if (F11_AL21.preparado) {
        return
    }


    // Selecionar Sliders
    voltsDiv = document.getElementById('voltsDiv')
    segundosDiv = document.getElementById('segundosDiv')
    freqSinal = document.getElementById('freqSinal')
    amplitudeSinal = document.getElementById('amplitudeSinal')

    // Selecionar os Spans com os Valores dos Sliders
    voltsDivResp = document.getElementById('voltsDivValue')
    segundosDivResp = document.getElementById('segundosDivValue')
    freqSinalResp = document.getElementById('freqSinalValue')
    amplitudeSinalResp = document.getElementById('amplitudeSinalValue')

    // Atualizar os Sliders
    voltsDiv.oninput = () => {
        let voltsDivValue = voltsDiv.value / 1

        let resp
        switch (voltsDivValue) {
            case 1:
                resp = '50mV'
                voltsDivNum = 0.05
                break
            case 2:
                resp = '100mV'
                voltsDivNum = 0.1
                break
            case 3:
                resp = '500mV'
                voltsDivNum = 0.5
                break
            case 4:
                resp = '1V'
                voltsDivNum = 1
                break
            case 5:
                resp = '5V'
                voltsDivNum = 5
                break
            case 6:
                resp = '10V'
                voltsDivNum = 10
                break
            default:
                break
        }
    
        voltsDivResp.innerText = resp
        desenharSom()
    }
    segundosDiv.oninput = () => {
        let segundosDivValue = segundosDiv.value / 1

        let resp
        switch (segundosDivValue) {
            case 1:
                resp = '50&micro;s'
                segundosDivNum = 50e-6
                break
            case 2:
                resp = '100&micro;s'
                segundosDivNum = 100e-6
                break
            case 3:
                resp = '200&micro;s'
                segundosDivNum = 200e-6
                break
            case 4:
                resp = '500&micro;s'
                segundosDivNum = 500e-6
                break
            case 5:
                resp = '1ms'
                segundosDivNum = 1000e-6
                break
            case 6:
                resp = '2ms'
                segundosDivNum = 2000e-6
                break
            default:
                break
        }
    
        segundosDivResp.innerHTML = resp
        desenharSom()
    }
    freqSinal.oninput = () => {
        let freqSinalValue = freqSinal.value / 1
    
        freqSinalResp.innerText = `${freqSinalValue.toFixed(1)}`
        desenharSom()
    }
    amplitudeSinal.oninput = () => {
        let amplitudeSinalValue = amplitudeSinal.value / 1000
    
        amplitudeSinalResp.innerText = `${amplitudeSinalValue.toFixed(3)}`
        desenharSom()
    }

    // Selecionar o Contexto áudio do browser
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    aContext = new AudioContext();

    // Selecionar o canvas
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)
    
    F11_AL21.preparado = true
    fixDPR()
}


// Inspirado por: https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser
function criarSom(arr) {
    let buf = new Float32Array(arr.length)
    for (let i = 0; i < arr.length; i++) {buf[i] = arr[i]}
    let buffer = aContext.createBuffer(1, buf.length, aContext.sampleRate)
    try {
        buffer.copyToChannel(buf, 0)
    } catch (erro) {
        let bufferAtual = buffer.getChannelData(0)
        for (let i = 0; i < arr.length; i++) {bufferAtual[i] = arr[i]}
        console.log(`Erro no Safari: ${erro}`)
        console.log('Usando método getChannelData()')
    }
    let fonte = aContext.createBufferSource()
    fonte.buffer = buffer
    fonte.connect(aContext.destination)
    fonte.start(0)
}

function somSinudoidal(sampleFreq, sampleNumber) {
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

// Toca o som com a frequência e amplitude desejadas
function tocarSom() {
    let somArr = [],
    volume = amplitudeSinal.value / 1000 * 0.1,
    segundos = 1,
    tom = freqSinal.value / 1

    let sampleFreq = aContext.sampleRate / tom
    for (let i = 0; i < aContext.sampleRate * segundos; i++) {
        somArr[i] = somSinudoidal(sampleFreq, i) * volume
    }

    criarSom(somArr)
}


// Traçar o gráfico correspondente ao Sinal do Gerador de Sinais
function pontos() {
    // tocarSom() -> Ouvir todos os Sons

    // Declarar variáveis e valores iniciais
    let f = freqSinalValue = freqSinal.value / 1
    let A = amplitudeSinalValue = amplitudeSinal.value / 1000

    // Calcular Período e Frequência Angular
    let T = f**-1
    let fAng = 2 * Math.PI / T

    // Escolher o intervalo e o delta T
    let deltaT = T / 200
    let t = -divsT * segundosDivNum

    let v

    // Arrays com os valores do t e V
    let tArr = []
    let vArr = []
    while (t < divsT * segundosDivNum) {
        v = A * Math.sin(fAng * t)

        tArr.push(t)
        vArr.push(v)

        t += deltaT
    }
    
    return [tArr, vArr]
}

// Desenhar a onda Sinusoidal que representa o Som criado
function desenharSom() {
    // Valores de t e de V
    let resultados = pontos()
    let tArr = resultados[0]
    let vArr = resultados[1]

    // Valores máximos para o t e para o V
    let maxT = divsT * 2 * segundosDivNum
    let maxV = divsV * 2 * voltsDivNum

    // Converções das coordenadas para Pixeis
    let tToPx = canvasSim.width / maxT
    let vToPx = canvasSim.height / maxV

    // Converter cada valor para pixeis
    tArr = tArr.map(t => (t + maxT / 2) * tToPx)
    vArr = vArr.map(v => (maxV / 2 - v) * vToPx + larguraEixos)

    let t, v

    t = tArr[0]
    v = vArr[0]

    // Limpar a imagem anterior
    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)

    // Desenhar a onda
    ctx.strokeStyle = cor
    ctx.lineWidth = largura

    ctx.beginPath()
    ctx.moveTo(t, v)
    ctx.lineTo(t, v)
    for (let i = 1; i < tArr.length; i++) {
        t = tArr[i]
        v = vArr[i]
        ctx.lineTo(t, v)
    }
    ctx.stroke()
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

    desenharSom()
}

window.onresize = fixDPR

// Ideia: Permitir Input do Microfone