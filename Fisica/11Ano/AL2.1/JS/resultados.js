// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL21 = {
    preparado: false,
    divCurva: ''
}

let voltsDiv
let segundosDiv
let freqSinal
let amplitudeSinal

let voltsDivResp
let segundosDivResp
let freqSinalResp
let amplitudeSinalResp

let voltsDivNum = 1
segundosDivNum = 500e-6

let aContext


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

    // Selecionar a div que vai ter a Curva
    F11_AL21.divCurva = document.getElementById('curva-oscilos')

    // Atualizar os Sliders
    voltsDiv.oninput = function atualizarVoltsDiv() {
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
        curva()
    }
    segundosDiv.oninput = function atualizarSegundosDiv() {
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
        curva()
    }
    freqSinal.oninput = function atualizarFreqSinal() {
        let freqSinalValue = freqSinal.value / 1
    
        freqSinalResp.innerText = `${freqSinalValue.toFixed(1)}`
        curva()
    }
    amplitudeSinal.oninput = function atualizarAmplitudeSinal() {
        let amplitudeSinalValue = amplitudeSinal.value / 1000
    
        amplitudeSinalResp.innerText = `${amplitudeSinalValue.toFixed(3)}`
        curva()
    }


    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    aContext = new AudioContext();
    
    F11_AL21.preparado = true
    curva()
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

function tocarSom() {
    let somArr = [],
    volume = amplitudeSinal.value / 1000 * 0.1,
    segundos = 1,
    tom = freqSinal.value / 1

    for (let i = 0; i < aContext.sampleRate * segundos; i++) {
        somArr[i] = somSinudoidal(i, tom) * volume
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
    let deltaT = Math.min(segundosDivNum / 30, T / 10) / 2
    let t = -3.22 * segundosDivNum

    // Ideia: Fazer Desfazamentos

    let v

    let tArr = []
    let vArr = []
    while (t < 3.22 * segundosDivNum) {
        v = A * Math.sin(fAng * t) / voltsDivNum

        tArr.push((t*1000).toFixed(3))
        vArr.push(v)

        t += deltaT
    }
    return [tArr, vArr]
}


// Mostrar o gráfico
function curva() {
    // Remover o Canvas antigo
    F11_AL21.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let t = resultados[0]
    let v = resultados[1]

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F11_AL21.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: t,
            datasets: [{
                data: v,
                label: 'Tensão',
                borderColor: 'rgb(160, 230, 200)',
                fill: false
            }]
        },
        options: {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 1,
                    hoverRadius: 4
                }
            },
            scales: {
                xAxes: [{
                    display: false,
                    labelString: '',
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        max: 2.04,
                        min: -2.04
                    }
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false
            }
        },
    })
}

// Ideia: Permitir Input do Microfone