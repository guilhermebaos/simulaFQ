// GRÁFICOS
export default function graficos(dados, divsCurvas) {
    let divCurvaAng = divsCurvas[0]
    let divCurvaPos = divsCurvas[1]
    let divCurvaVel = divsCurvas[2]
    let divCurvaAce = divsCurvas[3]
    let divCurvaJer = divsCurvas[4]
    let divCurvaEne = divsCurvas[5]

    let tempo = dados.tempo


    // GRÁFICO DO ÂNGULO

    // Remover o Canvas antigo
    divCurvaAng.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    let canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaAng')
    divCurvaAng.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.ang,
                label: 'Ângulo com a Vertical',
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
                        labelString: 'Ângulo com a Vertical/ º',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 90,
                        min: -90
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
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Ângulo: ' + value + 'º'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DA ENERGIA

    // Remover o Canvas antigo
    divCurvaEne.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaEne')
    divCurvaEne.appendChild(canvasCurva)

    // Criar o Chart Object
    graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.ec,
                label: 'Energia Cinética',
                borderColor: 'red',
                fill: false
            },{
                data: dados.epg,
                label: 'Energia Potencial Gravítica',
                borderColor: 'green',
                fill: false
            },{
                data: dados.em,
                label: 'Energia Mecânica',
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
                        labelString: 'Energia/ J',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
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
                        
                        // Label variável
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + value + 'J'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DA POSIÇÃO

    // Remover o Canvas antigo
    divCurvaPos.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaPos')
    divCurvaPos.appendChild(canvasCurva)

    // Criar o Chart Object
    graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.posX,
                label: 'Posição no eixo dos X',
                borderColor: 'red',
                fill: false
            },{
                data: dados.posY,
                label: 'Posição no eixo dos Y',
                borderColor: 'green',
                fill: false
            },{
                data: dados.pos,
                label: 'Módulo da Posição',
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
                        labelString: 'Posição/ cm',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
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
                        
                        // Label variável
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + value + 'm'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DA VELOCIDADE

    // Remover o Canvas antigo
    divCurvaVel.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaVel')
    divCurvaVel.appendChild(canvasCurva)

    // Criar o Chart Object
    graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.velX,
                label: 'Velocidade no eixo dos X',
                borderColor: 'red',
                fill: false
            },{
                data: dados.velY,
                label: 'Velocidade no eixo dos Y',
                borderColor: 'green',
                fill: false
            },{
                data: dados.vel,
                label: 'Módulo da Velocidade',
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
                        labelString: 'Velocidade/ m/s',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
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
                        
                        // Label variável
                        return  data.datasets[tooltipItem.datasetIndex].label + ': ' + value + 'm/s'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DA ACELERAÇÃO

    // Remover o Canvas antigo
    divCurvaAce.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaAce')
    divCurvaAce.appendChild(canvasCurva)

    // Criar o Chart Object
    graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.aceX,
                label: 'Aceleração no eixo dos X',
                borderColor: 'red',
                fill: false
            },{
                data: dados.aceY,
                label: 'Aceleração no eixo dos Y',
                borderColor: 'green',
                fill: false
            },{
                data: dados.ace,
                label: 'Módulo da Aceleração',
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
                        labelString: 'Aceleração/ m/s²',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
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
                        
                        // Label variável
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + value + 'm/s²'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })


    // GRÁFICO DO JERK

    // Remover o Canvas antigo
    divCurvaJer.innerHTML = ''

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurvaJer')
    divCurvaJer.appendChild(canvasCurva)

    // Criar o Chart Object
    graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [{
                data: dados.jer,
                label: 'Componente escalar do Jerk',
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
                        labelString: 'Jerk/ m/s³',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
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
                        
                        // Label variável
                        return 'Jerk: ' + value + 'm/s³'
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