// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL31 = {
    preparado: false,
    divCurvaIU: '',
    divCurvaPU: ''
}


function prepararResultados() {
    if (F10_AL31.preparado) {
        return
    }

    // Selecionar as divs que vão ter as Curva
    F10_AL31.divCurvaIU = document.getElementById('curva-painel-I=f(U)')
    F10_AL31.divCurvaPU = document.getElementById('curva-painel-P=f(U)')

    // Verificar que as divs já estão carregadas
    F10_AL31.divCurvaIU.innerText

    F10_AL31.preparado = true
    curva()
}


// Traçar o gráfico v^2-x
function pontos() {
    // Diferença de potencial em V, Corrent em mA
    let U = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.20, 1.25, 1.30, 1.35, 1.40, 1.45, 1.50, 1.55, 1.60, 1.65, 1.70, 1.75, 1.80, 1.85, 1.90, 1.95, 2.00]
    let I = [6.06, 6.05, 6.04, 6.06, 6.07, 6.05, 5.99, 5.96, 5.94, 5.95, 5.95, 5.93, 5.95, 5.96, 5.95, 5.90, 5.88, 5.87, 5.88, 5.88, 5.84, 5.85, 5.85, 5.88, 5.86, 5.85, 5.76, 5.73, 5.65, 5.59, 5.48, 5.40, 5.26, 5.07, 4.84, 4.49, 4.01, 3.33, 2.47, 1.66]
    let P = []
    for (let index in U) {
        U[index] = U[index].toFixed(2)  // Fazer toFixed para que nas labels dos gráficos apareças com duas casas decimais
        I[index] = I[index].toFixed(2)
        P.push(U[index] * I[index])
    }

    return [U, I, P]
}


// Mostrar o gráfico
function curva() {
    // Remover o Canvas antigo
    F10_AL31.divCurvaIU.innerHTML = ''
    F10_AL31.divCurvaPU.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let U = resultados[0]
    let I = resultados[1]
    let P = resultados[2]

    // Criar o canvas onde vai estar a curva
    canvasCurvaIU = document.createElement('canvas')
    canvasCurvaIU.setAttribute('id', 'canvasCurva')
    F10_AL31.divCurvaIU.appendChild(canvasCurvaIU)

    canvasCurvaPU = document.createElement('canvas')
    canvasCurvaPU.setAttribute('id', 'canvasCurva')
    F10_AL31.divCurvaPU.appendChild(canvasCurvaPU)

    let graCurvaIU = new Chart(canvasCurvaIU, {
        type: 'line',
        data: {
            labels: U,
            datasets: [{
                data: I,
                label: 'Corrente/ mA',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Diferença de Potencial/ V',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Corrente/ mA',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
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

                        return 'Diferença de Potencial: ' + tooltipItem.label + 'V'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Corrente: ' + value + 'A'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })
    let graCurvaPU = new Chart(canvasCurvaPU, {
        type: 'line',
        data: {
            labels: U,
            datasets: [{
                data: P,
                label: 'Potência/ mW',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Diferença de Potencial/ V',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Potência Útil/ mW',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
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

                        return 'Diferença de Potencial: ' + tooltipItem.label + 'V'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Potência: ' + value + 'W'
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