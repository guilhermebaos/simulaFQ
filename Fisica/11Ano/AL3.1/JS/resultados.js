// Definir Constantes
const nAr = 1.00

const nNuc = 1.60
const nRev = 1.40

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Constantes para a Simulação
const corLaser = 'red'
const larguraLaser = 3

// Centro Vertical de cada Simulação
const CENTRO = {
    fenom0: 0.7,
    fenom1: 0.5,
    fenom2: 0.5
}
const raioFenom1 = 0.4


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL31 = {
    preparado: false,
    divCurva: '',
    processandoAnim: false
}

let angIncide, angIncideResp
let angIncideRefra, angIncideRefraResp
let indiceRefra, indiceRefraResp
let angIncideRefleTot, angIncideRefleTotResp
let larguraFibra, larguraFibraResp

let angRefResp
let angCritResp
let nAcrResp

let fenomBtns, fenomEscolhido = 0

let canvasSim, ctx
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

    // Selecionar os Butões que permitem escolher o Procedimento
    fenomBtns = document.getElementsByName('Fenómenos')

    // Atualizar os Sliders
    angIncide.oninput = () => {
        let angIncideValue = angIncide.value / 10
    
        angIncideResp.innerText = `${angIncideValue.toFixed(1)}`
        desenharLaser()
    }
    angIncideRefra.oninput = () => {
        let angIncideRefraValue = angIncideRefra.value / 10

        if (angIncideRefraValue > 90) {
            angIncideRefraValue = 180 - angIncideRefraValue
        }
    
        angIncideRefraResp.innerText = `${angIncideRefraValue.toFixed(1)}`
        desenharLaser()
    }
    indiceRefra.oninput = () => {
        let indiceRefraValue = indiceRefra.value / 1
    
        if (indiceRefraValue <= 20) {
            indiceRefraResp.innerText = 'Baixo'
        } else if (indiceRefraValue >= 40) {
            indiceRefraResp.innerText = 'Alto'
        } else {
            indiceRefraResp.innerText = 'Intermédio'
        }
        desenharLaser()
    }
    angIncideRefleTot.oninput = () => {
        let angIncideRefleTotValue = angIncideRefleTot.value / 10
    
        angIncideRefleTotResp.innerText = `${angIncideRefleTotValue.toFixed(1)}`
        desenharLaser()
    }
    larguraFibra.oninput = () => {
        let larguraFibraValue = larguraFibra.value / 10
    
        larguraFibraResp.innerText = `${larguraFibraValue.toFixed(1)}`
        desenharLaser()
    }
    
    // Selecionar o canvas
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)


    F11_AL31.preparado = true
    fixDPR()
}


// Esolher o fenómeno a estudar
function fenomeno(num) {
    if (num == fenomEscolhido || F11_AL31.processandoAnim) return

    F11_AL31.processandoAnim = true

    fenomBtns[fenomEscolhido].className = 'escolha'
    fenomBtns[num].className = 'escolha-atual'

    // Esconder e mostrar o gráfico
    window.setTimeout(function() {
        desenharLaser()
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


// Converter entre Radianos e Graus
function radianos(graus) {return graus * (Math.PI / 180)}
function graus(radianos) {return radianos * (180 / Math.PI)}


// Calcula o caminho tomado pelo laser
function pontos() {
    let largura = canvasSim.width
    let altura = canvasSim.height

    let x, y

    let incI, decliveI, angR, decliveR, moverX, moverY

    let xArr = []
    let yArr = []
    switch (fenomEscolhido) {
        case 0:
            // Inclinação e Declive do feixe Incidente
            incI = radianos(angIncide.value / 10 + 90)
            decliveI = Math.tan(incI)
    
            // Inclinação e Declive do feixe Refletido
            angR = Math.PI - incI
            decliveR = Math.tan(angR)
    
            // Deslocar X, como se o referencial onde as retas vão ser traçadas tivesse origem no centro do canvas
            moverX = largura / 2
            moverY = altura * CENTRO.fenom0
    
            // Feixe Incidente
            x = -largura / 2
            xArr.push(x + moverX)
            yArr.push(-decliveI * x + moverY)
    
            // Ponto de Incidência
            x = 0
            xArr.push(x + moverX)
            yArr.push(moverY)
    
            // Feixe Refletido
            x = largura / 2
            xArr.push(x + moverX)
            yArr.push(-decliveR * x + moverY)
    
    
            return [xArr, yArr]
        case 1:
            // Inclinação e Declive do feixe incidente
            incI = radianos(angIncideRefra.value / 10 + 90)
            decliveI = Math.tan(incI)
    
            angI = radianos(angIncideRefra.value / 10)
            nAcr = 1.00 + indiceRefra.value / 100

            // Raio do Acrílico
            let raioA = altura * raioFenom1

            // Declive do feixe após sair do acrílico
            let decliveFinal, ySaida
    
            // Calcular o Declive do feixe refratado
            
            // Se o feixe incidir primeiro no ar
            if (graus(angI) <= 90) {
                let sinAngR = (nAr * Math.sin(angI)) / nAcr         // Lei de Snell-Descartes
                angR = Math.asin(sinAngR)                           // Ângulo de Refração
                decliveR = -Math.tan(Math.PI/2 - angR)              // Declive do feixe refratado
                
                angRefResp.innerText = graus(angR).toFixed(2)       // Mostrar o Valor do Ângulo de Refração

                decliveFinal = decliveI
                ySaida = -decliveR * Math.sqrt(raioA ** 2 / (1 + decliveR ** 2))
            } 
            
            // Se o feixe incidir primeiro no acrílico
            else {
                let sinAngR = (nAcr * Math.sin(Math.PI - angI)) / nAr   // Lei de Snell-Descartes
                if (sinAngR < 1) {
                    angR = Math.asin(sinAngR)                       // Ângulo de Refração
                    decliveR = Math.tan(Math.PI/2 - angR)           // Declive do feixe refratado
                } else {
                    angR = Math.PI - angI                           // Ângulo de Refração
                    decliveR = Math.tan(-Math.PI/2 + angR)          // Declive do feixe refratado
                }
                
                angRefResp.innerText = graus(angR).toFixed(2)       // Mostrar o Valor do Ângulo de Refração

                decliveFinal = decliveR
                ySaida = 0
            }
            nAcrResp.innerText = `${nAcr.toFixed(2)}`
            angCritResp.innerText = graus(Math.asin(nAr / nAcr)).toFixed(2)
    
            // Deslocar X, como se o referencial onde as retas vão ser traçadas tivesse origem no centro do canvas
            moverX = largura / 2
            moverY = altura * CENTRO.fenom1

            // Feixe Incidente
            x = -largura / 2
            xArr.push(x + moverX)
            yArr.push(-decliveI * x + moverY)
    
            // Ponto de Incidência
            x = 0
            xArr.push(x + moverX)
            yArr.push(moverY)
    
            // Feixe Refletido ou Refratado
            x = Math.sqrt(raioA ** 2 / (1 + decliveR ** 2))
            xArr.push(x + moverX)
            yArr.push(-decliveR * x + moverY)

            x = largura / 2
            xArr.push(x + moverX)
            yArr.push(-decliveFinal * x + moverY + ySaida)
    
            return [xArr, yArr]
        case 2:
            // Definições da Fibra Ótica
            let lFibra = larguraFibra.value / 1
            let fibraBaixo = lFibra
            let fibraTopo = -lFibra
            let distFibras = lFibra * 2
    
            // Inclinação e Declive do feixe incidente
            incI = radianos(angIncideRefleTot.value / 10 + 90)
            decliveI = Math.tan(incI)
    
            angR = Math.PI - incI
            decliveR = Math.tan(angR)

            // Próxima fibra que vai causar reflexão
            let proxFibra = fibraBaixo

            xArr.push(0)
            yArr.push(altura / 2)

            moverX = fibraBaixo / decliveR
            moverY = altura * CENTRO.fenom2

            xArr.push(moverX)
            yArr.push(proxFibra + moverY)
            proxFibra = fibraTopo

            let deltaMoverX = distFibras / decliveR
            while (moverX <= largura) {
                moverX += deltaMoverX

                xArr.push(moverX)
                yArr.push(proxFibra + moverY)
                if (proxFibra == fibraBaixo) {
                    proxFibra = fibraTopo
                }
                else {
                    proxFibra = fibraBaixo
                }
            }
    
            return [xArr, yArr, fibraBaixo + larguraLaser + moverY, fibraTopo - larguraLaser + moverY]
        default:
            break
    }
    return [0, 0]
}

// Desenhar no canvas
function desenharLaser() {
    // Dimensões do Canvas
    let largura = canvasSim.width
    let altura = canvasSim.height
    
    // Obter e guardar os resultados
    let resultados = pontos()
    let xArr = resultados[0]
    let yArr = resultados[1]
    let fB, fT
    if (resultados.length > 2) {
        fB = resultados[2]
        fT = resultados[3]
    }

    let x, y

    x = xArr[0]
    y = yArr[0]

    // Limpar a imagem anterior
    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)

    // Desenhar o background
    switch (fenomEscolhido) {
        case 0:
            // Desenhar o Metal
            ctx.fillStyle = 'gray'
            ctx.fillRect(0, altura * CENTRO.fenom0, largura, altura)

            // Desenhar o eixo que divide o metal
            ctx.strokeStyle = 'black'
            ctx.lineWidth = larguraLaser - 1
            ctx.beginPath()
            ctx.moveTo(largura / 2, altura)
            ctx.lineTo(largura / 2, 0)
            ctx.stroke()
            break
        case 1:
            let raioA = altura * raioFenom1

            // Desenhar o Acrílico
            ctx.fillStyle = 'lightgray'
            ctx.beginPath()
            ctx.arc(largura / 2, altura * CENTRO.fenom1, raioA, 0, Math.PI)
            ctx.fill()
            break
        case 2:
            ctx.strokeStyle = 'black'
            ctx.lineWidth = larguraLaser
            ctx.beginPath()
            ctx.moveTo(0, fB)
            ctx.lineTo(largura, fB)
            ctx.moveTo(0, fT)
            ctx.lineTo(largura, fT)
            ctx.stroke()
            break
        default:
            break
    }

    // Desenhar o Laser
    ctx.strokeStyle = corLaser
    ctx.lineWidth = larguraLaser

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    for (let i = 1; i < xArr.length; i++) {
        x = xArr[i]
        y = yArr[i]
        ctx.lineTo(x, y)
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

    desenharLaser()
}

window.onresize = fixDPR