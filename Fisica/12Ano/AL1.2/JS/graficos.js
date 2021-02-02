// GRÁFICOS
window.graficos = (dados, divsCurvas) => {
    let divCurvaForcas = divsCurvas[0]
    let divCurvaCinetica = divsCurvas[1]

    let tempo = dados.tempo


    // GRÁFICO DA FORÇA

    // Remover o Canvas antigo
    divCurvaForcas.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    let canvasCurvaForca = document.createElement('canvas')
    canvasCurvaForca.setAttribute('id', 'canvasCurvaForca')
    divCurvaForcas.appendChild(canvasCurvaForca)

    // Criar o Chart Object
    let graCurvaForca = new Chart(canvasCurvaForca, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.forca,
                label: 'Força Aplicada',
                borderColor: 'rgb(0, 120, 255)',
                fill: false
            },{
                data: dados.fa,
                label: 'Força de Atrito',
                borderColor: 'black',
                fill: false
            }]
        },
        options: {
            events: [''],   // Temporário - BUG https://github.com/chartjs/Chart.js/issues/3753
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
                        labelString: 'Intensidade/ N',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 25,
                        min: 0
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        let tooltipItem = tooltipItems[0]

                        return 'Tempo: ' + tooltipItem.label + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Intensidade: ' + value + 'N'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DA CINEMÁTICA

    // Remover o Canvas antigo
    divCurvaCinetica.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    let canvasCurvaCinetica = document.createElement('canvas')
    canvasCurvaCinetica.setAttribute('id', 'canvasCurvaCinetica')
    divCurvaCinetica.appendChild(canvasCurvaCinetica)

    // Criar o Chart Object
    let graCurvaCin = new Chart(canvasCurvaCinetica, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.vel,
                label: 'Componente Escalar da Velocidade',
                borderColor: 'rgb(145, 200, 20)',
                fill: false,
                yAxisID: 'V'
            },{
                data: dados.ace,
                label: 'Componente Escalar da Aceleração',
                borderColor: 'rgb(250, 70, 10)',
                fill: false,
                yAxisID: 'A'
            }]
        },
        options: {
            events: [''],   // Temporário - BUG https://github.com/chartjs/Chart.js/issues/3753
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
                    id: 'V',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Velocidade/ m/s',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 120,
                        min: -40
                    }
                },{
                    id: 'A',
                    position: 'right',
                    scaleLabel: {
                        display: true,
                        labelString: 'Aceleração/ m/s²',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 60,
                        min: -20
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        let tooltipItem = tooltipItems[0]

                        return 'Tempo: ' + tooltipItem.label + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        if (tooltipItem.datasetIndex == 0) {
                            return 'Velocidade: ' + value + 'm/s'
                        } else {
                            return 'Aceleração: ' + value + 'm/s²'
                        }
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })

    return [graCurvaForca, graCurvaCin]
}