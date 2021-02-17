// Definir Constantes
const g = 9.81   // Aceleração Gravitaconal

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio


// Constantes para a Simulação
const RESOLUCAO = 15                        // Tamanho do deltaT em cada update


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL12 = {
    preparado: false,
    divCurva: ''
}

let massaBola, massaBolaResp
let raioBola, raioBolaResp
let alturaInicial, alturaInicialResp
let elasticidade

let alturasTabela

let razaoResp
let EmDissipadaResp

let canvasBola, ctx, simula


function prepararResultados() {
    if (F10_AL12.preparado) {
        return
    }

    // Selecionar Sliders
    massaBola = document.getElementById('massaBola')   
    raioBola = document.getElementById('raioBola') 
    alturaInicial = document.getElementById('alturaInicial')
    elasticidade = document.getElementById('elasticidade')

    // Selecionar os Spans com os Valores dos Sliders
    massaBolaResp = document.getElementById('massaBolaValue')
    raioBolaResp = document.getElementById('raioBolaValue')
    alturaInicialResp = document.getElementById('alturaInicialValue')

    // Selecionar os Spans com os Resultados da Tabela
    razaoResp = document.getElementById('razaoValue')
    EmDissipadaResp = document.getElementById('EmDissipadaValue')

    // Selecionar a div onde vai parar a curva
    F10_AL12.divCurva = document.getElementById('curva-xt')

    // Selecionar a Tabela com os Resultados
    alturasTabela = document.getElementById('alturasTabela')

    // Atualizar os Sliders
    massaBola.oninput = () => {
        let massaBolaValue = massaBola.value / 1
    
        massaBolaResp.innerText = `${massaBolaValue.toFixed(0)}`
    }
    raioBola.oninput = () => {
        let raioBolaValue = raioBola.value / 10
    
        raioBolaResp.innerText = `${raioBolaValue.toFixed(1)}`
    }
    alturaInicial.oninput = () => {
        let alturaInicialValue = alturaInicial.value / 1
    
        alturaInicialResp.innerText = `${alturaInicialValue.toFixed(0)}`
    }


    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasBola = document.getElementById('canvasBola')

    ctx = canvasBola.getContext('2d')

    ctx.scale(DPR, DPR)

    // Criar o Objeto Simula
    simula = new window.Simula(canvasBola, RESOLUCAO, alturaInicial.max)

    F10_AL12.preparado = true
    loopSimula()
}


// Corrige o tamanho do Canvas e corrige o DPR
function fixDPR() {
    // Usar variável global
    if (simulaFQmenu.aberto !== 'resultados.html') return

    // Altura do CSS
    let altura_css = +getComputedStyle(canvasCurva).getPropertyValue('height').slice(0, -2) - 70
    // Larura do CSS
    let largura_css = +getComputedStyle(canvasBola).getPropertyValue('width').slice(0, -2)

    // Altera o tamanho do canvas
    canvasBola.width = largura_css * DPR
    canvasBola.height = altura_css * DPR

    simula.novoTamanho()
}


// Calcula os Resultados que aparecem na Tabela, a Razão e a Em dissipada
function valoresTabela(alturas) {
    let hQ = []
    let hR = []
    let pos = 0
    for (pos = 0; pos < alturas.length - 1; pos++) {
        hQ.push((alturas[pos] * 100).toFixed(1))
        hR.push((alturas[pos+1] * 100).toFixed(1))
    }

    let nColunas = alturasTabela.children[0].childElementCount
    for (pos = 1; pos < nColunas; pos++) {
        alturasTabela.deleteRow(1)
    }
    
    // Altera o número de linhas da tabela, para que tenha todas as alturas de Queda e Ressalto
    let coluna
    let pontos = []
    for (pos = 0; pos < hQ.length; pos++) {
        coluna = alturasTabela.insertRow(pos + 1)

        coluna.innerHTML = `
        <td>${hQ[pos]}cm</td>
        <td class='fim-tabela'>${hR[pos]}cm</td>`

        pontos.push([Number(hQ[pos]), Number(hR[pos])])
    }

    let declive
    if (pontos.length > 1) {
        let retaMelhorAjuste = regression.linear(pontos)
        declive = retaMelhorAjuste.equation[0]
    } else if (pontos.length == 1) {
        declive = pontos[0][1] / pontos[0][0]
    } else {
        declive = 0
    }
    
    razaoResp.innerText = `${declive.toFixed(2)}`
    EmDissipadaResp.innerText = `${((1 - declive) * 100).toFixed(0)}%`
}


// Reiniciar a Simulação
function reiniciar() {
    simula.reiniciar()
    grafico = curva()
}


let canvasCurva

// Mostra os Valores Relacionados com a Queda da Esfera
function curva() {
    // Remover o Canvas antigo
    F10_AL12.divCurva.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F10_AL12.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: 'Altura da Bola',
                borderColor: 'blue',
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
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo/ s',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Altura da Bola/ cm',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 500,
                        min: 0
                    } 
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        let tooltipItem = tooltipItems[0]

                        return 'Tempo: ' + tooltipItem.label + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(1)
    
                        return 'Posição: ' + value + 'cm'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })

    return graCurva
}


// Atualiza o gráfico
atualizarCurva = (grafico, label, data) => {
    grafico.data.labels.push(label)
    grafico.data.datasets[0].data.push(data)

    grafico.update()
}


// Criar o loop da Simulação
let ultimoTempo, grafico

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        if (!grafico) grafico = curva()
        fixDPR()
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = tempo - ultimoTempo
    ultimoTempo = tempo
    
    let dados
    for (let i = 0; i < RESOLUCAO; i++) {
        dados = simula.update(deltaTempo)
    }
    if (dados) {
        valoresTabela(dados.hQeR)
        atualizarCurva(grafico, dados.tempo, dados.posY)
    }

    ctx.clearRect(0, 0, canvasBola.width, canvasBola.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR
