// Definir Constantes
const cac = 0.1 // Coeficiente de Atrito Cinético máximo entre o carrinho e o plano
const g = 9.81 // Aceleração Gravitaconal

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Constantes para a Simulação
const RESOLUCAO = 25                        // Tamanho do deltaT em cada update


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL11 = {
    preparado: false,
    divCurva: ''
}

let massaCarrinho, massaCarrinhoResp
let posCarrinho, posCarrinhoResp
let angPlanoInclinado, angPlanoInclinadoResp
let forcaAtrito, forcaAtritoResp
let larguraTira, larguraTiraResp

let tempoPassagemResp


let simula, ctx
function prepararResultados() {
    if (F10_AL11.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaCarrinho = document.getElementById('massaCarrinho')
    posCarrinho = document.getElementById('posCarrinho')
    angPlanoInclinado = document.getElementById('angPlanoInclinado')
    forcaAtrito = document.getElementById('forçaAtrito')
    larguraTira = document.getElementById('larguraTira')
    
    // Selecionar os Spans com os valores dos Sliders
    massaCarrinhoResp = document.getElementById('massaCarrinhoValue')
    posCarrinhoResp = document.getElementById('posCarrinhoValue')
    angPlanoInclinadoResp = document.getElementById('angPlanoInclinadoValue')
    forcaAtritoResp = document.getElementById('forcaAtritoValue')
    larguraTiraResp = document.getElementById('larguraTiraValue')
    tempoPassagemResp = document.getElementById('tempoPassagemValue')

    // Atualizar os Sliders
    massaCarrinho.oninput = () => {
        let massaCarrinhoValue = massaCarrinho.value / 1
    
        massaCarrinhoResp.innerText = `${massaCarrinhoValue.toFixed(0)}`

        atualizarAtritoMax()

        reiniciar()
    }
    posCarrinho.oninput = () => {
        let posCarrinhoValue = posCarrinho.value / 10
    
        posCarrinhoResp.innerText = `${posCarrinhoValue.toFixed(1)}`

        reiniciar()
    }
    angPlanoInclinado.oninput = () => {
        let angPlanoInclinadoValue = angPlanoInclinado.value / 10
    
        angPlanoInclinadoResp.innerText = `${angPlanoInclinadoValue.toFixed(1)}`

        atualizarAtritoMax()

        reiniciar()
    }
    larguraTira.oninput = () => {
        let larguraTiraValue = larguraTira.value / 10
    
        larguraTiraResp.innerText = `${larguraTiraValue.toFixed(1)}`

        reiniciar()
    }


    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

    // Criar o Objeto Simula
    simula = new window.Simula(canvasSim)

    F10_AL11.preparado = true
    loopSimula()
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

    canvasSim.style.height = altura_css + 'px'

    simula.novoTamanho()
}


// Limitar a Força de Atrito Máxima Sentida pelo Carrinho
function atualizarAtritoMax() {
    let m = massaCarrinho.value / 1000
    let theta = angPlanoInclinado.value / 10 * (Math.PI / 180) // Em radianos

    let Fnormal = m * g * Math.cos(theta) // A Força normal é igual à componente do peso perpendicular à superfície
    let FaMax = cac * Fnormal
    let FaMaxConvertido = Math.floor(FaMax * 1000)

    forcaAtrito.max = FaMaxConvertido
}


// Reiniciar a Simulação
function reiniciar(start=false) {
    simula.reiniciar(start)
}


// Criar o loop da Simulação
let ultimoTempo, graficos, resultadosSim

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        requestAnimationFrame(loopSimula)
        reiniciar()
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo
    
    for (let i = 0; i < RESOLUCAO; i++) {
        resultadosSim = simula.update(deltaTempo)
        if (resultadosSim){
            tempoPassagemResp.innerText = `${(resultadosSim * 1000).toFixed(2)}`
            forcaAtritoResp.innerText = `${(forcaAtrito.value / 1000).toFixed(3)}`
        }
    }

    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR