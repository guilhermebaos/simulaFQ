// Definir Constantes
const g = 9.80665   // Aceleração Gravitaconal


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL13 = {
    preparado: false,
    divCurva: ''
}

let massaCarrinho
let fAtrito

let massaCarrinhoResp
let aTravagemResp
let fAtritoTravagemResp


function prepararResultados() {
    if (F11_AL13.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaCarrinho = document.getElementById('massaCarrinho')
    fAtrito = document.getElementById('fAtrito')

    // Selecionar os Spans com os Valores dos Sliders
    massaCarrinhoResp = document.getElementById('massaCarrinhoValue')

    // Selecionar a div que vai ter a Curva
    F11_AL13.divCurva = document.getElementById('curva-v2x')

    // Selecionar os Spans com os Resultados da Tabela
    aTravagemResp = document.getElementById('aTravagemValue')
    fAtritoTravagemResp = document.getElementById('fAtritoTravagemValue')

    // Atualizar os Sliders
    massaCarrinho.oninput = function atualizarMassaCarrinho() {
        let massaCarrinhoValue = massaCarrinho.value / 1000
    
        massaCarrinhoResp.innerText = `${massaCarrinhoValue.toFixed(3)}`
    }

    F11_AL13.preparado = true
    curva()
}


// Traçar o gráfico v^2-x
function pontos() {
    // Declarar variáveis e valores iniciais
    let m = massaCarrinhoValue = massaCarrinho.value / 1000
    let fa = fAtrito.value / 10

    let P = m * g
    let a = fa / m

    let dx = 0
    let v2 = 0

    let des = [dx.toFixed(2)]
    let vel = [v2]

    aTravagemResp.innerText = `${a.toFixed(2)}`
    fAtritoTravagemResp.innerText = `${fa.toFixed(1)}`

    // Para cada deslocamento, calcular o v0^2 inicial
    while (true) {
        dx += 0.02

        v2 = 2 * a * dx

        des.push(dx.toFixed(2))
        vel.push(v2)

        if (dx > 1) {
            break
        }
    }
    return [des, vel]
}


// Mostrar o gráfico
function curva() {
    // Remover o Canvas antigo
    F11_AL13.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let dx = resultados[0]
    let v2 = resultados[1]

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F11_AL13.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: dx,
            datasets: [{
                data: v2,
                label: 'Deslocamento do Carrinho',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Deslocamento do Carrinho/ m',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Módulo do Quadrado da Velocidade/ m²/s²',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 35,
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

                        return 'Deslocamento: ' + tooltipItem.label + 'm'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Quadrado da Velocidade: ' + value + 'm²/s²'
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