// Definir Constantes
const divsT = 3.215     // Número de Divisões do Osciloscópio no eixo do tempo
const divsV = 2.04      // Número de Divisões do Osciloscópio no eixo dos Volts
const A0 = 1            // Intensidade do Assobio

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Definições do gráfico
const cor = 'rgb(160, 230, 200)'
const largura = 3
const larguraEixos = 2            // Largura dos eixos do Osciloscópio

// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL22 = {
    preparado: false,
    divCurva: '',
    processandoAnim: false,
    processandoSom: false,
}

let voltsDiv, voltsDivResp
let segundosDiv, segundosDivResp
let freqSinal, freqSinalResp
let amplitudeSinal, amplitudeSinalResp
let distMicrofone, distMicrofoneResp
let temperaturaAr, temperaturaArResp
let mangueira, mangueiraResp

let velocidadeDoSomResp
let intervaloTempoResp

let voltsDivNum = 1, segundosDivNum = 500e-6

let procedimento1, procedimento2
let procedimentoEscolhido = 1

let aContext

let canvasSim, ctx
function prepararResultados() {
    if (F11_AL22.preparado) {
        return
    }


    // Selecionar Sliders
    voltsDiv = document.getElementById('voltsDiv')
    segundosDiv = document.getElementById('segundosDiv')
    freqSinal = document.getElementById('freqSinal')
    amplitudeSinal = document.getElementById('amplitudeSinal')
    distMicrofone = document.getElementById('distMicrofone')
    temperaturaAr = document.getElementById('temperaturaAr')
    mangueira = document.getElementById('mangueira')

    // Selecionar os Spans com os Valores dos Sliders
    voltsDivResp = document.getElementById('voltsDivValue')
    segundosDivResp = document.getElementById('segundosDivValue')
    freqSinalResp = document.getElementById('freqSinalValue')
    amplitudeSinalResp = document.getElementById('amplitudeSinalValue')
    distMicrofoneResp = document.getElementById('distMicrofoneValue')
    temperaturaArResp = document.getElementById('temperaturaArValue')
    mangueiraResp = document.getElementById('mangueiraValue')
    velocidadeDoSomResp = document.getElementById('velocidadeDoSomValue')
    intervaloTempoResp = document.getElementById('intervaloTempoValue')

    // Selecionar a div que vai ter a Curva
    F11_AL22.divCurva = document.getElementById('curva-oscilos')

    // Selecionar os Butões que permitem escolher o Procedimento
    procedimento1 = document.getElementById('Procedimento1')
    procedimento2 = document.getElementById('Procedimento2')

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
        if (procedimentoEscolhido == 2) {
            desenharSom()
        }
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
        if (procedimentoEscolhido == 2) {
            desenharSom()
        }
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
    distMicrofone.oninput = () => {
        let distMicrofoneValue = distMicrofone.value / 10
    
        distMicrofoneResp.innerText = `${distMicrofoneValue.toFixed(2)}`
        desenharSom()
    }
    temperaturaAr.oninput = () => {
        let temperaturaArValue = temperaturaAr.value / 10
    
        temperaturaArResp.innerText = `${temperaturaArValue.toFixed(1)}`

        if (procedimentoEscolhido == 2) {
            desenharSom()
        }
        velocidadeDoSomResp.innerText = vSomTemp(temperaturaArValue).toFixed(1)
    }
    mangueira.oninput = () => {
        let mangueiraValue = mangueira.value / 1
    
        mangueiraResp.innerText = `${mangueiraValue.toFixed(0)}`
    }


    window.AudioContext = window.AudioContext || window.webkitAudioContext

    aContext = new AudioContext()
    
    // Selecionar o canvas
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

    F11_AL22.preparado = true
    fixDPR(false)
}

// Escolher o Procedimento a seguir
function procedimento(num) {
    if (F11_AL22.processandoAnim || F11_AL22.processandoSom) return
    if (num == 1) {
        procedimento1.className = 'escolha-atual'
        procedimento2.className = 'escolha'

        if (procedimentoEscolhido != 1) {
            F11_AL22.processandoAnim = true

            procedimentoEscolhido = 1
            mostrarExtra('Procedimento2-Div');
            window.setTimeout(mostrarExtra, mostrarExtraTempo, 'Procedimento1-Div')
            window.setTimeout(function() {
                F11_AL22.processandoAnim = false
            }, mostrarExtraTempo * 2)
            ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
        }
    } else {
        procedimento2.className = 'escolha-atual'
        procedimento1.className = 'escolha'

        if (procedimentoEscolhido != 2) {
            F11_AL22.processandoAnim = true
            
            procedimentoEscolhido = 2
            mostrarExtra('Procedimento1-Div');
            window.setTimeout(mostrarExtra, mostrarExtraTempo, 'Procedimento2-Div')
            window.setTimeout(function() {
                F11_AL22.processandoAnim = false
            }, mostrarExtraTempo * 2)
            desenharSom()
        }
    }
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

function somSinudoidal(sampleNumber, tom) {
    let sampleFreq = aContext.sampleRate / tom
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

// Ouvir o Assobio
function tocarSom() {
    let somArr = [],
    volume = A0 * 0.1,
    segundos = 0.1,
    tom = 1000

    for (let i = 0; i < aContext.sampleRate * segundos; i++) {
        somArr[i] = somSinudoidal(i, tom) * volume
    }

    criarSom(somArr)
}


// Velocidade de propagação do Som para Temperaturas próximas de 0ºC
function vSomTemp(T) {
    return 331.3 + 0.606 * T        // m/s
}

function pontos(A=0) {
    if (procedimentoEscolhido == 1) {
        // Declarar variáveis e valores iniciais
        let f = 1000
    
        if (A < 0) A = 0
    
        // Calcular Período e Frequência Angular
        let T = f**-1
        let fAng = 2 * Math.PI / T
    
        // Escolher o intervalo e o delta T
        let deltaT = T / 200
        let t = -divsT * segundosDivNum
    
        let v // Volts
    
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
    else if (procedimentoEscolhido == 2) {
        // Declarar variáveis e valores iniciais
        let f = freqSinal.value / 1
        let A = amplitudeSinal.value / 1000
        let d = distMicrofone.value / 1000
        let tAr = temperaturaAr.value / 1
    
        // Calcular Período e Frequência Angular
        let T = f**-1
        let fAng = 2 * Math.PI / T
    
        // Escolher o intervalo e o delta T
        let deltaT = T / 200
        let t = -divsT * segundosDivNum
    
        // Velocidade do Som
        let vSom = vSomTemp(tAr)
        // let intensidadeSom = 1 / d
    
        let v // Volts
    
        let microfoneDeltaT = d / vSom      // Tempo que o Sinal sonoro demora a chegar ao microfone
        let microfoneV                      // Intensidade do microfone
    
        let tArr = []
        let vArr = []
        let microVArr = []
        
        while (t < divsT * segundosDivNum) {
            v = A * Math.sin(fAng * t)
    
            microfoneV = A * Math.sin(fAng * (t + microfoneDeltaT))
    
            tArr.push(t)
            vArr.push(v)
            microVArr.push(microfoneV)
    
            t += deltaT
        }
    
        return [tArr, vArr, microVArr]
    }
}

let primeiroTempo, tMax, vSom
function desenharSom() {
    // Executar o procedimento certo
    if (procedimentoEscolhido == 1) {
        if (F11_AL22.processandoSom) return

        // Definir os valores para o Procedimento 1
        primeiroTempo = undefined
        vSom = vSomTemp(temperaturaAr.value / 10)
        tMax = mangueira.value / 1 / vSom
        tocarSom()

        F11_AL22.processandoSom = true
        requestAnimationFrame(desenharSom1)
    }
    else if (procedimentoEscolhido == 2) {
        desenharSom2()
    }
}

let segundoBip = false
function desenharSom1(tempo) {
    if (primeiroTempo === undefined) {
        primeiroTempo = tempo
        segundoBip = false
        requestAnimationFrame(desenharSom1)
        return
    }
    
    // Tempo passado desde que o bip foi emitido
    let tPassou = (tempo - primeiroTempo) / 1000

    // O som já percorreu a mangueira?
    if (tPassou > tMax && !segundoBip) {
        segundoBip = true
        tocarSom()
    }
    if (segundoBip) {
        tPassou -= tMax
    }

    // Velocidade do Som
    let r = (vSom * tPassou) / 100

    // Intensidade a variar com a distância percorrida pelo som (APROXIMAÇÃO)
    let A = A0 / (1 + 4 * Math.PI * r ** 2)

    if (A < 5e-03 * voltsDivNum) {
        A = 0
    }

    // Valores de t e de V
    let resultados = pontos(A)
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

    // O Segundo Bip já acabou -> Mostrar o Intervalo de tempo entre os bips
    if (A < 1e-04 && segundoBip) {
        F11_AL22.processandoSom = false
        intervaloTempoResp.innerText = `O intervalo de tempo entre os Sinais no Osciloscópio é: ${tMax.toFixed(3)}s`
        return
    }

    requestAnimationFrame(desenharSom1)
}

function desenharSom2() {
    // Valores de t e de V
    let resultados = pontos()
    let tArr = resultados[0]
    let vArr = resultados[1]
    let microVArr = resultados[2]

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

    microVArr = microVArr.map(v => (maxV / 2 - v) * vToPx + larguraEixos)

    t = tArr[0]
    v = microVArr[0]

    // Desenhar a onda
    ctx.beginPath()
    ctx.moveTo(t, v)
    ctx.lineTo(t, v)
    for (let i = 1; i < tArr.length; i++) {
        t = tArr[i]
        v = microVArr[i]
        ctx.lineTo(t, v)
    }
    ctx.stroke()
}


// Corrige o tamanho do Canvas e corrige o DPR
function fixDPR(ouvir=true) {
    // Usar variável global
    if (simulaFQmenu.aberto !== 'resultados.html') return

    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue('height').slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue('width').slice(0, -2)

    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPR
    canvasSim.height = altura_css * DPR

    if (ouvir) desenharSom()
}

window.onresize = fixDPR