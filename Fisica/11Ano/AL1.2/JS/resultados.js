// Definir Constantes
const g = 9.81      // Aceleração Gravitaconal
const CAM = 0.3     // Razão máxima entre a Resultante das Forças de Atrito e o Peso do Corpo Suspenso

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio
   
// Constantes a passar para a Simulação
const RESOLUCAO = 15   
const CONSTANTES = {
    g: g
}


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL12 = {
    preparado: false,
    divCurva: ''
}

let massaCarrinho, massaCarrinhoResp
let massaCorpoSuspenso, massaCorpoSuspensoResp
let alturaCorpoSuspenso, alturaCorpoSuspensoResp
let forcaAtrito, forcaAtritoResp

let aZona1Resp
let corpoAtingiuSoloTResp
let aZona2Resp

// Ligar ou desligar a aquisição de dados
let dadosBtn
let recolherDados = false

let canvasSim, ctx, simula
function prepararResultados() {
    if (F11_AL12.preparado) {
        return
    }

    // Selecionar Sliders
    massaCarrinho = document.getElementById('massaCarrinho')
    massaCorpoSuspenso = document.getElementById('massaCorpoSuspenso')
    alturaCorpoSuspenso = document.getElementById('alturaCorpoSuspenso')
    forcaAtrito = document.getElementById('forçaAtrito')

    // Selecionar os Spans com os Valores dos Sliders
    massaCarrinhoResp = document.getElementById('massaCarrinhoValue')
    massaCorpoSuspensoResp = document.getElementById('massaCorpoSuspensoValue')
    alturaCorpoSuspensoResp = document.getElementById('alturaCorpoSuspensoValue')
    forcaAtritoResp = document.getElementById('forçaAtritoValue')

    // Selecionar a div que vai ter a Curva
    F11_AL12.divCurva = document.getElementById('curva-vt')

    // Selecionar os Spans com os Resultados da Tabela
    aZona1Resp = document.getElementById('aZona1Value')
    corpoAtingiuSoloTResp = document.getElementById('corpoAtingiuSoloTValue')
    aZona2Resp = document.getElementById('aZona2Value')
    
    // Botão associado ao recolher dados
    dadosBtn = document.getElementById('interruptor')
    dadosBtn.estado = '0'

    dadosBtn.onclick = () => {
        if (dadosBtn.estado == '0') {
            dadosBtn.estado = '1'
            dadosBtn.innerText = 'Desligar'
            simula.dados.reiniciar()
            graficos = window.graficos(F11_AL12.divCurva)
            recolherDados = true
        } else {
            dadosBtn.estado = '0'
            dadosBtn.innerText = 'Ligar'
            recolherDados = false
        }
    }

    // Atualizar os Sliders
    massaCarrinho.oninput = () => {
        let massaCarrinhoValue = massaCarrinho.value / 100
    
        massaCarrinhoResp.innerText = `${massaCarrinhoValue.toFixed(2)}`

        atualizarAtritoMax()
        reiniciar()
    }
    massaCorpoSuspenso.oninput = () => {
        let massaCorpoSuspensoValue = massaCorpoSuspenso.value / 100
    
        massaCorpoSuspensoResp.innerText = `${massaCorpoSuspensoValue.toFixed(2)}`

        atualizarAtritoMax()
        reiniciar()
    }
    alturaCorpoSuspenso.oninput = () => {
        let alturaCorpoSuspensoValue = alturaCorpoSuspenso.value / 100
    
        alturaCorpoSuspensoResp.innerText = `${alturaCorpoSuspensoValue.toFixed(2)}`
        reiniciar()
    }
    forcaAtrito.oninput = () => {
        let forçaAtritoValue = forcaAtrito.value / 1000
    
        forcaAtritoResp.innerText = `${forçaAtritoValue.toFixed(3)}`
        reiniciar()
    }
    

    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

    // Criar o Objeto Simula
    simula = new window.Simula(canvasSim, RESOLUCAO, CONSTANTES)

    F11_AL12.preparado = true
    loopSimula()
    reiniciar()
}


// Limitar a Força de Atrito Máxima Sentida pelo Carrinho
function atualizarAtritoMax() {
    let mCS = massaCorpoSuspenso.value / 100

    // Limitar o Atrito para que a Força Resultante realize trabalho Positivo sobre o Carrinho (para isso, P >> Fa, caso contrário o Carrinho poderia ficar parado)
    let Fresultante = mCS * g               // Força Resultante do Sistema Ideal = Peso do Corpo Suspenso
    let FaMax = CAM * Fresultante           // A Força de Atrito não poderá ser maior do que CAM * o Peso do Corpo Suspenso

    let FaMaxConvertido = Math.floor(FaMax * 1000)

    if (forcaAtrito.value > FaMaxConvertido) {
        forcaAtritoResp.innerText = `${(FaMaxConvertido / 1000).toFixed(3)}`
    }

    forcaAtrito.max = FaMaxConvertido
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

    simula.novoTamanho()
}


// Reiniciar a Simulação
function reiniciar(start=false) {
    let m = massaCarrinho.value / 100
    let mSusp = massaCorpoSuspenso.value / 100
    let hSusp = alturaCorpoSuspenso.value / 100
    let fa = forcaAtrito.value / 1000

    let a1 = (mSusp * g - fa) / (m + mSusp)
    let t = (2 * hSusp / a1) ** 0.5
    let a2 = -fa / m

    aZona1Resp.innerText = `${a1.toFixed(2)}`
    corpoAtingiuSoloTResp.innerText = `${t.toFixed(2)}`
    aZona2Resp.innerText = `${a2.toFixed(2)}`

    if (start && recolherDados) graficos = window.graficos(F11_AL12.divCurva)

    simula.reiniciar(start)
}


// Criar o loop da Simulação
let ultimoTempo, graficos

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        if (!graficos) graficos = window.graficos(F11_AL12.divCurva)
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo
    
    let dados
    for (let i = 0; i < RESOLUCAO; i++) {
        dados = simula.update(deltaTempo)
    }
    if (dados && recolherDados) {
        window.atualizarGraficos(graficos, dados[0], dados.slice(1, dados.lenght))
    }

    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR