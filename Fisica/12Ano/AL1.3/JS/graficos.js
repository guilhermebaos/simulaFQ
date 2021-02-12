// GRÁFICOS
window.graficos = (divCurva) => {
    let divCurvaCinetica = divCurva


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
            labels: [],
            datasets: [{
                data: [],
                label: 'Componente Escalar da Velocidade',
                borderColor: 'rgb(145, 200, 20)',
                fill: false,
                yAxisID: 'V'
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
                    id: 'V',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Velocidade/ cm/s',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 600,
                        min: -600
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
                        let value = Number(tooltipItem.value).toFixed(2)
    
                        return 'Velocidade: ' + value + 'cm/s'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })

    return [graCurvaCin]
}


// Atualizar os gráficos
window.atualizarGraficos = (graficos, label, data) => {
    graficos.forEach((grafico) => {
        grafico.data.labels.push(label)
        grafico.data.datasets.forEach((dataset) => {
            let d = data.shift()
            dataset.data.push(d)
        })
        grafico.update()
    })
}