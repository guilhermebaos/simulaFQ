// Definir Constantes
const nAr = 1.00

const nNuc = 1.60
const nRev = 1.40


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL31 = {
    preparado: false,
    divCurva: '',
    processandoAnim: false
}

let angIncide
let angIncideRefra
let indiceRefra
let angIncideRefleTot
let larguraFibra

let angIncideResp
let angIncideRefraResp
let indiceRefraResp
let angIncideRefleTotResp
let larguraFibraResp

let angRefResp
let angCritResp
let nAcrResp

let fenomBtns
let fenomEscolhido = 0


function prepararResultados() {
    if (F11_AL31.preparado) {
        return
    }
    
    // Selecionar Sliders
    angIncide = document.getElementById('angIncide')
    angIncideRefra = document.getElementById('angIncideRefra')
    indiceRefra = document.getElementById('indiceRefra')
    angIncideRefleTot = document.getElementById('angIncideRefleTot')
    larguraFibra = document.getElementById('larguraFibra')

    // Selecionar os Spans com os Valores dos Sliders
    angIncideResp = document.getElementById('angIncideValue')
    angIncideRefraResp = document.getElementById('angIncideRefraValue')
    indiceRefraResp = document.getElementById('indiceRefraValue')
    angIncideRefleTotResp = document.getElementById('angIncideRefleTotValue')
    larguraFibraResp = document.getElementById('larguraFibraValue')

    // Selecionar os Spans com os Resultados da Tabela
    angRefResp = document.getElementById('angRefValue')
    angCritResp = document.getElementById('angCritValue')
    nAcrResp = document.getElementById('nAcrValue')

    // Selecionar a div que vai ter a Curva
    F11_AL31.divCurva = document.getElementById('curva-laser')

    // Selecionar os Butões que permitem escolher o Procedimento
    fenomBtns = document.getElementsByName('Fenómenos')

    // Atualizar os Sliders
    angIncide.oninput = function atualizarAngIncide() {
        let angIncideValue = angIncide.value / 10
    
        angIncideResp.innerText = `${angIncideValue.toFixed(1)}`
        curva()
    }
    angIncideRefra.oninput = function atualizarAngIncideRefra() {
        let angIncideRefraValue = angIncideRefra.value / 10

        if (angIncideRefraValue > 90) {
            angIncideRefraValue = 180 - angIncideRefraValue
        }
    
        angIncideRefraResp.innerText = `${angIncideRefraValue.toFixed(1)}`
        curva()
    }
    indiceRefra.oninput = function atualizarIndiceRefra() {
        let indiceRefraValue = indiceRefra.value / 1
    
        if (indiceRefraValue <= 20) {
            indiceRefraResp.innerText = 'Baixo'
        } else if (indiceRefraValue >= 40) {
            indiceRefraResp.innerText = 'Alto'
        } else {
            indiceRefraResp.innerText = 'Intermédio'
        }
        curva()
    }
    angIncideRefleTot.oninput = function atualizarAngIncideRefleTot() {
        let angIncideRefleTotValue = angIncideRefleTot.value / 10
    
        angIncideRefleTotResp.innerText = `${angIncideRefleTotValue.toFixed(1)}`
        curva()
    }
    larguraFibra.oninput = function atualizarLarguraFibra() {
        let larguraFibraValue = larguraFibra.value / 1
    
        larguraFibraResp.innerText = `${larguraFibraValue.toFixed(0)}`
        curva()
    }

    F11_AL31.preparado = true
    curva()
}


// Esolher o fenómeno a estudar
function fenomeno(num) {
    if (num == fenomEscolhido) return
    else {
        if (F11_AL31.processandoAnim) return
        F11_AL31.processandoAnim = true

        fenomBtns[fenomEscolhido].className = 'escolha'
        fenomBtns[num].className = 'escolha-atual'

        // Esconder e mostrar o gráfico
        mostrarExtra('graf-anim')
        window.setTimeout(function() {
            mostrarExtra('graf-anim')
            prepCurva()
            curva()
        }, mostrarExtraTempo)

        // Esconder e mostrar a opção selecionada
        mostrarExtra(`Fenómeno${fenomEscolhido}`)
        window.setTimeout(mostrarExtra, mostrarExtraTempo, `Fenómeno${num}`)
        window.setTimeout(function() {
            F11_AL31.processandoAnim = false
        }, mostrarExtraTempo * 2)

        // Mostrar a Tabela das Respostas
        if (num == 1 || fenomEscolhido == 1) {
            mostrarExtra('respostas')
        }

        fenomEscolhido = num
    }
}


// Mudar a background-image do gráfico
function prepCurva() {
    if (fenomEscolhido == 0) {
        F11_AL31.divCurva.style.backgroundImage = 'url("Imagens/Metal-background.png")'
    } else if (fenomEscolhido == 1) {
        F11_AL31.divCurva.style.backgroundImage = 'url("Imagens/Acrilico-background.png")'
    } else if (fenomEscolhido == 2) {
        F11_AL31.divCurva.style.backgroundImage = ''
    }
}


// Converter entre Radianos e Graus
function radianos(graus) {return graus * (Math.PI / 180)}
function graus(radianos) {return radianos * (180 / Math.PI)}


// Calcula o caminho tomado pelo laser
function pontos() {
    let x = -20
    let y

    let xArr = []
    let yArr = []
    if (fenomEscolhido == 0) {
        // Inclinação e Declive do feixe incidente
        let incI = radianos(angIncide.value / 10 + 90)
        let decliveI = Math.tan(incI)

        let angR = Math.PI - incI
        let decliveR = Math.tan(angR)
        while (x <= 20.1) {
            if (x < 0) {
                y = decliveI * x
            } else {
                y = decliveR * x
            }
            x += 0.1

            xArr.push(x)
            yArr.push(y)
        }
        return [xArr, yArr]

    } else if (fenomEscolhido == 1) {
        // Inclinação e Declive do feixe incidente
        let incI = radianos(angIncideRefra.value / 10 + 90)
        let decliveI = Math.tan(incI)

        let angI = radianos(angIncideRefra.value / 10)
        let nAcr = 1.00 + indiceRefra.value / 100

        // Calcular o Declive do feixe refratado
        let decliveR
        let angR
        if (graus(angI) <= 90) {
            let sinAngR = (nAr * Math.sin(angI)) / nAcr         // Lei de Snell-Descartes
            angR = Math.asin(sinAngR)                           // Ângulo de Refração
            decliveR = -Math.tan(Math.PI/2 - angR)              // Declive do feixe refratado
            
            angRefResp.innerText = graus(angR).toFixed(2)       // Mostrar o Valor do Ângulo de Refração
        } else {
            let sinAngR = (nAcr * Math.sin(Math.PI - angI)) / nAr   // Lei de Snell-Descartes
            if (sinAngR < 1) {
                angR = Math.asin(sinAngR)                       // Ângulo de Refração
                decliveR = Math.tan(Math.PI/2 - angR)           // Declive do feixe refratado
            } else {
                angR = Math.PI - angI                           // Ângulo de Refração
                decliveR = Math.tan(-Math.PI/2 + angR)          // Declive do feixe refratado
            }
            
            angRefResp.innerText = graus(angR).toFixed(2)       // Mostrar o Valor do Ângulo de Refração
        }
        angCritResp.innerText = graus(Math.asin(nAr / nAcr)).toFixed(2)

        // Calucular os pontos do gráfico y = f(x) para o feixe
        while (x <= 20.1) {
            if (x < 0) {
                y = decliveI * x
            } else {
                y = decliveR * x
            }
            x += 0.1

            xArr.push(x)
            yArr.push(y)
        }
        return [xArr, yArr]

    } else if (fenomEscolhido == 2) {
        let lFibra = larguraFibra.value / 1
        let fibraBaixo = -lFibra / 2
        let fibraTopo = lFibra / 2

        let fBaixoArr = []
        let fTopoArr = []

        // Inclinação e Declive do feixe incidente
        let incI = radianos(angIncideRefleTot.value / 10 + 90)
        let decliveI = Math.tan(incI)

        let angR = Math.PI - incI
        let decliveR = Math.tan(angR)

        let decliveAtual = decliveI // Determinar o declive do feixe - Se é o mesmo da incidência ou se é da reflexão
        let xSec = 0                // x usado para calcular o y de cada parte das sucessivas reflexões do feixe

        let xInicial = 0
        let xStep = 0.05
        while (x <= 20 + xStep) {
            y = xSec * decliveAtual

            if (y < fibraBaixo) {
                if (xInicial == 0) {
                    xInicial = xSec
                }
                decliveAtual = decliveR
                xSec = -xInicial
            } else if (y > fibraTopo) {
                decliveAtual = decliveI
                xSec = -xInicial
            }
            x += xStep
            xSec += xStep

            xArr.push(x)
            yArr.push(y)

            fBaixoArr.push(fibraBaixo * 1.02)
            fTopoArr.push(fibraTopo * 1.02)
        }
        return [xArr, yArr, fBaixoArr, fTopoArr]
    }
}


// Calcula e mostra os Resultados da Tabela
function curva() {
    // Remover o Canvas antigo
    F11_AL31.divCurva.innerHTML = ''

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F11_AL31.divCurva.appendChild(canvasCurva)

    if (fenomEscolhido == 0) {
        // Obter e guardar os resultados
        let resultados = pontos()
        let x = resultados[0]
        let y = resultados[1]

        // Criar o Chart Object
        let graCurva = new Chart(canvasCurva, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    label: 'Laser',
                    borderColor: 'rgb(255, 0, 0)',
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
                            max: 14,
                            min: -6.15
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
    } else if (fenomEscolhido == 1) {
        // Atualizar Resutlados na Tabela
        nAcrResp.innerText = (1.00 + indiceRefra.value / 100).toFixed(2)

        // Obter e guardar os resultados
        let resultados = pontos()
        let x = resultados[0]
        let y = resultados[1]

        // Criar o Chart Object
        let graCurva = new Chart(canvasCurva, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    label: 'Laser',
                    borderColor: 'rgb(255, 0, 0)',
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
                            max: 10,
                            min: -10
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
    } else if (fenomEscolhido == 2) {
        // Obter e guardar os resultados
        let resultados = pontos()
        let x = resultados[0]
        let y = resultados[1]
        let fB = resultados[2]
        let fT = resultados[3]

        // Criar o Chart Object
        let graCurva = new Chart(canvasCurva, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    label: 'Laser',
                    borderColor: 'rgb(255, 0, 0)',
                    fill: false
                },
                {
                    data: fB,
                    label: 'Fibra Ótica Baixo',
                    borderColor: 'rgb(0, 0, 0)',
                    fill: false
                },
                {
                    data: fT,
                    label: 'Fibra Ótica Topo',
                    borderColor: 'rgb(0, 0, 0)',
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
                            max: 10,
                            min: -10
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

// Ideia: Ângulo Crítico na Refração
