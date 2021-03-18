// Definir Constantes
const g = 9.80665   // Aceleração Gravitaconal

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio


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
let areaContacto
let coefAtritoEstatico, coefAtritoEstaticoResp
let coefAtritoCinetico, coefAtritoCineticoResp
let intForca, intForcaResp
let massaAreia, massaAreiaResp

let materialArray, materialEscolhidoPos = 0

let montagemBtns
let dadosBtn

// Variável para ver se a Simulação precisa de atualizar o bloco
let blocoAlterado = false

// Ligar ou desligar a aquisição de dados
let recolherDados = false

let simula, ctx
function prepararResultados() {
    if (F12_AL12.preparado) {
        return
    }

    // Selecionar Sliders
    massaBloco = document.getElementById('massaBloco')
    areaContacto = document.getElementById('areaContacto')
    coefAtritoEstatico = document.getElementById('coefAtritoEstatico')
    coefAtritoCinetico = document.getElementById('coefAtritoCinetico')
    intForca = document.getElementById('intForca')
    massaAreia = document.getElementById('massaAreia')

    // Selecionar os Spans com os Valores dos Sliders
    massaBlocoResp = document.getElementById('massaBlocoValue')
    intForcaResp = document.getElementById('intForcaValue')
    massaAreiaResp = document.getElementById('massaAreiaValue')

    // Selecionar os butões com os materiais
    materialArray = document.getElementsByName('material')

    // Selecionar os Spans com os Resultados da Tabela
    coefAtritoEstaticoResp = document.getElementById('coefAtritoEstaticoValue')
    coefAtritoCineticoResp = document.getElementById('coefAtritoCineticoValue')

    // Selecionar a div que vai ter a Curva
    F12_AL12.divCurva[0] = document.getElementById('curva-ft')
    F12_AL12.divCurva[1] = document.getElementById('curva-ct')

    // Selecionar os Butões que permitem escolher o Procedimento
    montagemBtns = document.getElementsByName('montagens')

    // Botão associado ao recolher dados
    dadosBtn = document.getElementById('interruptor')
    dadosBtn.estado = '0'

    dadosBtn.onclick = () => {
        if (dadosBtn.estado == '0') {
            dadosBtn.estado = '1'
            dadosBtn.innerText = 'Desligar'
            simula.dados.reiniciar()
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

        if (intForca.value != intForca.min || massaAreia.value != massaAreia.min) {
            reiniciar()
        } else blocoAlterado = true
    }
    areaContacto.oninput = () => {
        if (intForca.value != intForca.min || massaAreia.value != massaAreia.min) {
            reiniciar()
        } else blocoAlterado = true
    }
    coefAtritoEstatico.oninput = () => {
        if (intForca.value != intForca.min || massaAreia.value != massaAreia.min) {
            reiniciar()
        } else blocoAlterado = true
    }
    coefAtritoCinetico.oninput = () => {
        if (intForca.value != intForca.min || massaAreia.value != massaAreia.min) {
            reiniciar()
        } else blocoAlterado = true
    }

    intForca.oninput = () => {
        let intForcaValue = intForca.value / 100
    
        intForcaResp.innerText = `${intForcaValue.toFixed(2)}`

        if (blocoAlterado) novoBloco()
    }
    massaAreia.oninput = () => {
        let massaAreiaValue = massaAreia.value / 1
    
        massaAreiaResp.innerText = `${massaAreiaValue.toFixed(0)}`

        if (blocoAlterado) novoBloco()
    }
    

    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

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

    reiniciar()
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


// Altera os coeficientes
function escolherMaterial(pos) {
    materialArray[materialEscolhidoPos].className = 'escolha'
    materialArray[pos].className = 'escolha-atual'

    materialEscolhidoPos = pos

    if (materialEscolhidoPos == 0) {
        coefAtritoEstatico.value = 30
        coefAtritoCinetico.value = 23
    } else if (materialEscolhidoPos == 1) {
        coefAtritoEstatico.value = 25
        coefAtritoCinetico.value = 17
    } else if (materialEscolhidoPos == 2) {
        coefAtritoEstatico.value = 27
        coefAtritoCinetico.value = 22
    }
}


// Reiniciar a Simulação
function reiniciar() {
    intForca.value = intForca.min
    intForcaResp.innerText = `${Number(intForca.min).toFixed(2)}`

    massaAreia.value = massaAreia.min
    massaAreiaResp.innerText = `${Number(massaAreia.min).toFixed(0)}`

    // Reiniciar os gráficos
    graficos = window.graficos(F12_AL12.divCurva)

    simula.reiniciar(montagemEscolhida)

    let cae = coefAtritoEstatico.value / 100
    let cac = coefAtritoCinetico.value / 100 * cae

    coefAtritoEstaticoResp.innerText = cae.toFixed(2)
    coefAtritoCineticoResp.innerText = cac.toFixed(2)

    blocoAlterado = false
}


// Novo Bloco inesperado
function novoBloco() {
    reiniciar()

    if (F12_AL12.processandoAnim) return

    F12_AL12.processandoAnim = true

    mostrarExtra('Novo-Bloco')
    
    window.setTimeout(mostrarExtra, 5000, 'Novo-Bloco')
    window.setTimeout(() => {
        F12_AL12.processandoAnim = false
    }, mostrarExtraTempo + 5000)
}


// Criar o loop da Simulação
let ultimoTempo, graficos

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        if (!graficos) graficos = window.graficos(F12_AL12.divCurva)
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = (tempo - ultimoTempo) / 1000 / RESOLUCAO
    ultimoTempo = tempo
    
    let dados
    for (let i = 0; i < RESOLUCAO; i++) {
        dados = simula.update(deltaTempo)
        if (dados && recolherDados) {
            window.atualizarGraficos(graficos, dados[0], dados.slice(1, dados.lenght))
        }
    }

    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR