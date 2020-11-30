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

    F10_AL31.preparado = true
    curva()
}


// Traçar o gráfico v^2-x
function pontos() {
    let U = [0.261, 0.423, 0.581, 0.733, 0.848, 0.965, 1.02, 1.071, 1.135, 1.197, 1.223, 1.257, 1.276, 1.307, 1.326, 1.364, 1.392, 1.439, 1.473, 1.502, 1.526]
    let I = [21.3, 21.2, 21, 20.5, 20.2, 19.4, 18.9, 18.3, 17.3, 16.2, 15.6, 14.8, 14.2, 13.3, 12.6, 11.2, 10.1, 7.8, 5.9, 4.1, 2.5]
    let P = [5.6, 9, 12.2, 15, 17.1, 18.7, 19.3, 19.6, 19.6, 19.4, 19.1, 18.6, 18.1, 17.4, 16.7, 15.3, 14.1, 11.2, 8.7, 6.2, 3.8]

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