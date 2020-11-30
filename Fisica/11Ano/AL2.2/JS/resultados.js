// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL22 = {
    preparado: false,
    divCurva: '',
    processandoAnim: false
}

let voltsDiv
let segundosDiv
let freqSinal
let amplitudeSinal
let distMicrofone
let temperaturaAr
let mangueira

let voltsDivResp
let segundosDivResp
let freqSinalResp
let amplitudeSinalResp
let distMicrofoneResp
let temperaturaArResp
let mangueiraResp
let velocidadeDoSomResp
let intervaloTempoResp

let voltsDivNum = 1
segundosDivNum = 500e-6

let procedimento1
let procedimento2
let procedimentoEscolhido = 1


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
        if (procedimentoEscolhido == 2) {
            curva()
        }
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
        if (procedimentoEscolhido == 2) {
            curva()
        }
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
    distMicrofone.oninput = function atualizarDistMicrofone() {
        let distMicrofoneValue = distMicrofone.value / 10
    
        distMicrofoneResp.innerText = `${distMicrofoneValue.toFixed(2)}`
        curva()
    }
    temperaturaAr.oninput = function atualizarTemperaturaAr() {
        let temperaturaArValue = temperaturaAr.value / 10
    
        temperaturaArResp.innerText = `${temperaturaArValue.toFixed(1)}`

        if (procedimentoEscolhido == 2) {
            curva()
        }
        velocidadeDoSomResp.innerText = vSomTemp(temperaturaArValue).toFixed(1)
    }
    mangueira.oninput = function atualizarMangueira() {
        let mangueiraValue = mangueira.value / 1
    
        mangueiraResp.innerText = `${mangueiraValue.toFixed(0)}`
    }


    window.AudioContext = window.AudioContext || window.webkitAudioContext

    aContext = new AudioContext()

    F11_AL22.preparado = true
    limparOsci()
}


// Escolher o Procedimento a seguir
function procedimento(num) {
    if (num == 1) {
        procedimento1.className = 'escolha-atual'
        procedimento2.className = 'escolha'

        if (procedimentoEscolhido != 1) {
            if (F11_AL22.processandoAnim) return
            F11_AL22.processandoAnim = true

            procedimentoEscolhido = 1
            mostrarExtra('Procedimento2-Div');
            window.setTimeout(mostrarExtra, mostrarExtraTempo, 'Procedimento1-Div')
            window.setTimeout(function() {
                F11_AL22.processandoAnim = false
            }, mostrarExtraTempo * 2)
            limparOsci()
        }
    } else {
        procedimento2.className = 'escolha-atual'
        procedimento1.className = 'escolha'

        if (procedimentoEscolhido != 2) {
            if (F11_AL22.processandoAnim) return
            F11_AL22.processandoAnim = true
            
            procedimentoEscolhido = 2
            mostrarExtra('Procedimento1-Div');
            window.setTimeout(mostrarExtra, mostrarExtraTempo, 'Procedimento2-Div')
            window.setTimeout(function() {
                F11_AL22.processandoAnim = false
            }, mostrarExtraTempo * 2)
            curva()
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

function tocarSom() {
    let somArr = [],
    volume = amplitudeSinal.value / 1000 * 0.1,
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


// Traçar o gráfico correspondente ao Sinal do Gerador de Sinais e do Microfone
function pontos1(A) {
    // Declarar variáveis e valores iniciais
    let f = 1000

    if (A < 0) A = 0

    // Calcular Período e Frequência Angular
    let T = f**-1
    let fAng = 2 * Math.PI / T

    // Escolher o intervalo e o delta T
    let deltaT = Math.min(segundosDivNum / 30, T / 10) / 2
    let t = -3.22 * segundosDivNum

    let v // Volts

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


// Traçar o gráfico correspondente ao Sinal do Gerador de Sinais e do Microfone
function pontos2() {
    // Declarar variáveis e valores iniciais
    let f = freqSinal.value / 1
    let A = amplitudeSinal.value / 1000
    let d = distMicrofone.value / 1000
    let tAr = temperaturaAr.value / 1

    // Calcular Período e Frequência Angular
    let T = f**-1
    let fAng = 2 * Math.PI / T

    // Escolher o intervalo e o delta T
    let deltaT = Math.min(segundosDivNum / 30, T / 10) / 2
    let t = -3.22 * segundosDivNum

    // Velocidade do Som
    let vSom = vSomTemp(tAr)
    // let intensidadeSom = 1 / d

    let v // Volts

    let microfoneDeltaT = d / vSom      // Tempo que o Sinal sonoro demora a chegar ao microfone
    let microfoneV                      // Intensidade do microfone

    let tArr = []
    let vArr = []
    let microVArr = []
    while (t < 3.22 * segundosDivNum) {
        v = A * Math.sin(fAng * t) / voltsDivNum

        microfoneV = A * Math.sin(fAng * (t + microfoneDeltaT)) / voltsDivNum

        tArr.push((t*1000).toFixed(3))
        vArr.push(v)
        microVArr.push(microfoneV)

        t += deltaT
    }
    return [tArr, vArr, microVArr]
}


// Criar e 'limpar' o ecrã do Osciloscópio
function limparOsci() {
    // Remover o Canvas antigo
    F11_AL22.divCurva.innerHTML = ''

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F11_AL22.divCurva.appendChild(canvasCurva)
        
    // Obter e guardar os resultados (Vazio)
    let resultados = pontos1(-1)
    let t = resultados[0]
    let v = resultados[1]


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


// Mostrar o gráfico
async function curva() {
    if (procedimentoEscolhido == 1) {
        tocarSom()

        // Velocidade do Som
        let tAr = temperaturaAr.value / 10
        let vSom = vSomTemp(tAr)
        
        // Quando se ouve o som outra vez
        let tf = (mangueira.value / 1) / vSom

        // Tempo inical e time-step
        let tPassou = 0
        let deltaT = 0.005

        while (tPassou < tf) {
            // Remover o Canvas antigo
            F11_AL22.divCurva.innerHTML = ''
        
            // Criar o canvas onde vai estar a curva
            canvasCurva = document.createElement('canvas')
            canvasCurva.setAttribute('id', 'canvasCurva')
            F11_AL22.divCurva.appendChild(canvasCurva)
        
            // Obter e guardar os resultados
            let resultados = pontos1(-400 * ((tPassou - 0.05)**2) + 1)
            let t = resultados[0]
            let v = resultados[1]
        
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

            await new Promise(r => setTimeout(r, deltaT*1000))

            tPassou += deltaT 
        }

        tPassou = 0

        while (tPassou < 0.21) {
            // Remover o Canvas antigo
            F11_AL22.divCurva.innerHTML = ''
        
            // Criar o canvas onde vai estar a curva
            canvasCurva = document.createElement('canvas')
            canvasCurva.setAttribute('id', 'canvasCurva')
            F11_AL22.divCurva.appendChild(canvasCurva)
        
            // Obter e guardar os resultados
            let resultados = pontos1(-400 * ((tPassou - 0.05)**2) + 1)
            let t = resultados[0]
            let v = resultados[1]
        
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

            await new Promise(r => setTimeout(r, deltaT*1000));

            tPassou += deltaT 
        }

        intervaloTempoResp.innerText = `O intervalo de tempo entre os Sinais no Osciloscópio é: ${tf.toFixed(3)}s`

    } else if (procedimentoEscolhido == 2) {
        // Remover o Canvas antigo
        F11_AL22.divCurva.innerHTML = ''
    
        // Criar o canvas onde vai estar a curva
        canvasCurva = document.createElement('canvas')
        canvasCurva.setAttribute('id', 'canvasCurva')
        F11_AL22.divCurva.appendChild(canvasCurva)

        // Obter e guardar os resultados
        let resultados = pontos2()
        let t = resultados[0]
        let v = resultados[1]
        let microV = resultados[2]

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
                },
                {
                    data: microV,
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
}