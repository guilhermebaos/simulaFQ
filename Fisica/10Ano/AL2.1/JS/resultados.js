// Definir Constantes


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL21 = {
    preparado: false,
    divCurva: ''
}

let forçaEletromotriz
let resistInterna

let forçaEletromotrizResp
let resistInternaResp


function prepararResultados() {
    if (F10_AL21.preparado) {
        return
    }
    
    // Selecionar Sliders
    forçaEletromotriz = document.getElementById('forçaEletromotriz')
    resistInterna = document.getElementById('resistInterna')

    // Selecionar os Spans com os Valores dos Sliders
    forçaEletromotrizResp = document.getElementById('forçaEletromotrizValue')
    resistInternaResp = document.getElementById('resistInternaValue')
    
    // Selecionar a div onde vai parar a curva
    F10_AL21.divCurva = document.getElementById('curva-Pilha')

    // Atualizar os Sliders
    forçaEletromotriz.oninput = function atualizarForçaEletromotriz() {
        let forçaEletromotrizValue = forçaEletromotriz.value / 10
    
        forçaEletromotrizResp.innerText = `${forçaEletromotrizValue.toFixed(1)}`
    }
    resistInterna.oninput = function atualizarResistInterna() {
        let resistInternaValue = resistInterna.value / 100
    
        resistInternaResp.innerText = `${resistInternaValue.toFixed(2)}`
    }

    F10_AL21.preparado = true
    curva()
}


// Calcular os Pontos do Gráfico U = f(I)
function pontos() {
    // Declarar variáveis e valores iniciais
    let fe = forçaEletromotriz.value / 10
    let r = resistInterna.value / 100

    let U, R
    let I = 0
    let Imax = fe / r

    let ddp = [fe]
    let cor = [I.toFixed(3)]

    while (true) {
        I += 0.05

        R = fe / I - r
        U = R * I

        if (I > Imax || I > 50) {
            if (I > 15) {
                break
            }
            cor.push(I.toFixed(3))
        } else {
            cor.push(I.toFixed(3))
            ddp.push(U)
        }
    }
    return [cor, ddp]
}



// Mostra os Valores Relacionados com a Queda da Esfera
function curva() {
    // Remover o Canvas antigo
    F10_AL21.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let I = resultados[0]
    let U = resultados[1]

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F10_AL21.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: I,
            datasets: [{
                data: U,
                label: 'Diferença de Potencial',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Corrente/ A',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Diferença de Potencial/ V',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 10,
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

                        return 'Corrente: ' + tooltipItem.label + 'A'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(1)
    
                        return 'Diferença de Potencial: ' + value + 'V'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })
}

// Permitir o uso de Pilhas Usadas