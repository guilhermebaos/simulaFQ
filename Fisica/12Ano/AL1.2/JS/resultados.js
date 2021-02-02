// Definir Constantes
const g = 9.80665   // Aceleração Gravitaconal


// Constantes para a Simulação
const RESOLUCAO = 15                        // Tamanho do deltaT em cada update


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F12_AL12 = {
    preparado: false,
    divCurva: [],
    processandoAnim: false
}

let massaBloco, massaBlocoResp
let coefAtritoEstatico, coefAtritoEstaticoResp
let coefAtritoCinetico, coefAtritoCineticoResp
let intForca, intForcaResp
let massaAreia, massaAreiaResp

let montagemBtns
let dadosBtn

// Ligar ou desligar a aquisição de dados
let recolherDados = false

function prepararResultados() {
    if (F12_AL12.preparado) {
        return
    }

    // Selecionar Sliders
    massaBloco = document.getElementById('massaBloco')
    coefAtritoEstatico = document.getElementById('coefAtritoEstatico')
    coefAtritoCinetico = document.getElementById('coefAtritoCinetico')
    intForca = document.getElementById('intForca')
    massaAreia = document.getElementById('massaAreia')

    // Selecionar os Spans com os Valores dos Sliders
    massaBlocoResp = document.getElementById('massaBlocoValue')
    intForcaResp = document.getElementById('intForcaValue')
    massaAreiaResp = document.getElementById('massaAreiaValue')

    // Selecionar os Spans com os Resultados da Tabela
    coefAtritoEstaticoResp = document.getElementById('coefAtritoEstaticoValue')
    coefAtritoCineticoResp = document.getElementById('coefAtritoCineticoValue')

    // Selecionar a div que vai ter a Curva
    F12_AL12.divCurva.push(document.getElementById('curva-ft'))
    F12_AL12.divCurva.push(document.getElementById('curva-ct'))

    // Selecionar os Butões que permitem escolher o Procedimento
    montagemBtns = document.getElementsByName('montagens')

    // Butão associado ao recolher dados
    dadosBtn = document.getElementById('interruptor')
    dadosBtn.estado = '0'

    dadosBtn.onclick = () => {
        if (dadosBtn.estado == '0') {
            dadosBtn.estado = '1'
            dadosBtn.innerText = 'Desligar'
            this.simula.dados.reiniciar()
            graficos = window.graficos(F12_AL12.divCurva)
            recolherDados = true
        } else {
            dadosBtn.estado = '0'
            dadosBtn.innerText = 'Ligar'
            recolherDados = false
        }
    }

    // Atualizar os Sliders
    massaBloco.oninput = () => {
        let massaBlocoValue = massaBloco.value / 1
    
        massaBlocoResp.innerText = `${massaBlocoValue.toFixed(0)}`
    }
    intForca.oninput = () => {
        let intForcaValue = intForca.value / 100
    
        intForcaResp.innerText = `${intForcaValue.toFixed(2)}`
    }
    massaAreia.oninput = () => {
        let massaAreiaValue = massaAreia.value / 1
    
        massaAreiaResp.innerText = `${massaAreiaValue.toFixed(0)}`
    }
    

    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    // Criar o Objeto Simula
    simula = new window.Simula(canvasSim, RESOLUCAO, {
        intForca: intForca,
        massaAreia: massaAreia
    })

    F12_AL12.preparado = true
    loopSimula()
}

let montagemEscolhida = 0

// Esolher a montagem a estudar
function montagem(num) {
    if (num == montagemEscolhida) return
    else {
        if (F12_AL12.processandoAnim) return
        F12_AL12.processandoAnim = true

        montagemBtns[montagemEscolhida].className = 'escolha'
        montagemBtns[num].className = 'escolha-atual'

        // Esconder e mostrar a opção selecionada
        mostrarExtra(`Montagem${montagemEscolhida}`)
        window.setTimeout(mostrarExtra, mostrarExtraTempo, `Montagem${num}`)
        window.setTimeout(function() {
            F12_AL12.processandoAnim = false
        }, mostrarExtraTempo * 2)

        montagemEscolhida = num
    }

    simula.reiniciar(montagemEscolhida)
}


// Corrige o tamanho do Canvas e corrige o DPI
function fixDPI() {
    // Usar variável global
    if (simulaFQmenu.aberto !== 'resultados.html') return

    // Obter o DPI do ecrã
    let DPI = window.devicePixelRatio

    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue('height').slice(0, -2)
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue('width').slice(0, -2)

    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPI
    canvasSim.height = altura_css * DPI

    simula.novoTamanho()
}


// Reiniciar a Simulação
function reiniciar() {
    simula.reiniciar(montagemEscolhida)

    let cae = coefAtritoEstatico.value / 100
    let cac = coefAtritoCinetico.value / 100 * cae

    coefAtritoEstaticoResp.innerText = cae.toFixed(2)
    coefAtritoCineticoResp.innerText = cac.toFixed(2)
}


// Criar o loop da Simulação
let ultimoTempo, graficos

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPI()
        if (!graficos) graficos = window.graficos(F12_AL12.divCurva)
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = tempo - ultimoTempo
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

window.onresize = fixDPI