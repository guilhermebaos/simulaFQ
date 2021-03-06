// Inicializar Variáveis Globais

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Constantes para a Simulação
const raioPontos = 3
const larguraSim = 100  // cm


// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL32 = {
    preparado: false,
    divCurva: '',
}

let linhas, linhasResp
let distAoAlvo, distAoAlvoResp

let distN1Resp
let lambdaResp

let corBtns, corEscolhida = 'red',
corEscolhidaPos = 0, corLambda = 633e-9

let canvasSim, ctx
function prepararResultados() {
    if (F11_AL32.preparado) {
        return
    }
    
    // Selecionar Sliders
    linhas = document.getElementById('linhas')
    distAoAlvo = document.getElementById('distAoAlvo')

    // Selecionar os Spans com os Valores dos Sliders
    linhasResp = document.getElementById('linhasValue')
    distAoAlvoResp = document.getElementById('distAoAlvoValue')

    // Selecionar os Spans com os Resultados da Tabela
    distN1Resp = document.getElementById('distN1Value')
    lambdaResp = document.getElementById('lambdaValue')

    // Selecionar a div que vai ter a Curva
    F11_AL32.divCurva = document.getElementById('curva-laser')

    // Selecionar os Butões que permitem escolher a cor do laser
    corBtns = document.getElementsByName('cor-laser')

    // Atualizar os Sliders
    linhas.oninput = () => {
        let linhasValue = linhas.value / 1
    
        linhasResp.innerText = `${linhasValue.toFixed(0)}`
        desenharLaser()
    }
    distAoAlvo.oninput = () => {
        let distAoAlvoValue = distAoAlvo.value / 10
    
        distAoAlvoResp.innerText = `${distAoAlvoValue.toFixed(1)}`
        desenharLaser()
    }
    
    // Selecionar o canvas
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)


    F11_AL32.preparado = true
    fixDPR()
}


// Escolhe a cor do laser e altera a aparência dos butões
function corLaser(num) {
    if (num != corEscolhidaPos) {
        corBtns[corEscolhidaPos].className = 'escolha'

        corEscolhidaPos = num
        corBtns[corEscolhidaPos].className = 'escolha-atual'

        if (num == 0) {corLambda = 633e-9; corEscolhida = 'red'}
        else if (num == 1) {corLambda = 514e-9; corEscolhida = 'green'}
        else if (num == 2) {corLambda = 488e-9; corEscolhida = 'blue'}

        desenharLaser()
    }

    // Atualizar os Resultados da Tabela
    lambdaArr = String(corLambda).split('e')
    lambdaResp.innerHTML = `${lambdaArr[0]} &times; 10<sup>${lambdaArr[1]}</sup>`
}


// Calcula o caminho tomado pelo laser
function pontos() {
    let d = linhas.value ** -1 * 1e-3
    let L = distAoAlvo.value / 1000

    // Cria o array com a posição horizontal dos pontos
    let xArr = []

    let a
    for (let n = 0; n <= 100; n++) {
        // Define a posição horizontal do máximos de ordem n
        a = Math.sqrt((L**2 * n**2 * corLambda**2)/(d**2 - n**2 * corLambda**2))
        
        if (n == 1) distN1Resp.innerText = (2 * a * 100).toFixed(1)

        xArr.push(a * 100)

        if (a > larguraSim / 100) break
    }
    
    return xArr
}

// Desenhar no canvas
function desenharLaser() {
    // Dimensões do Canvas
    let largura = canvasSim.width
    let altura = canvasSim.height
    
    // Obter e guardar os resultados
    let xArr = pontos()

    // Converter de cm para Pixeis
    let cmToPx = largura / larguraSim

    xArr = xArr.map(x => x * cmToPx)

    let x

    x = xArr[0]

    // Limpar a imagem anterior
    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)

    
    // Desenhar os Pontos do Alvo
    ctx.fillStyle = corEscolhida

    ctx.beginPath()
    ctx.arc(x + largura / 2, altura / 2, raioPontos, 0, Math.PI * 2)
    for (let i = 1; i < xArr.length; i++) {
        x = xArr[i]
        ctx.arc(x + largura / 2, altura / 2, raioPontos, 0, Math.PI * 2)
        ctx.arc(-x + largura / 2, altura / 2, raioPontos, 0, Math.PI * 2)
    }
    ctx.fill()

    // Desenhar a linha preta
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 4

    ctx.beginPath()
    ctx.moveTo(largura * 0.05, altura * 0.95)
    ctx.lineTo(largura * 0.15, altura * 0.95)
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