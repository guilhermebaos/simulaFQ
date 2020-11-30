// Definir Constantes
const COF = 0.1 // Coeficiente de Fricção entre o carrinho e o plano
const g = 9.80665 // Aceleração Gravitaconal


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL11 = {
    preparado: false,
    divCurva: ''
}

let massaCarrinho
let angPlanoInclinado
let forçaAtrito

let massaCarrinhoResp
let angPlanoInclinadoResp
let forçaAtritoResp


function prepararResultados() {
    if (F10_AL11.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaCarrinho = document.getElementById('massaCarrinho')
    angPlanoInclinado = document.getElementById('angPlanoInclinado')
    forçaAtrito = document.getElementById('forçaAtrito')
    
    // Selecionar os Spans com os Valores dos Sliders
    massaCarrinhoResp = document.getElementById('massaCarrinhoValue')
    angPlanoInclinadoResp = document.getElementById('angPlanoInclinadoValue')
    forçaAtritoResp = document.getElementById('forçaAtritoValue')
    
    // Selecionar a div onde vai parar a curva
    F10_AL11.divCurva = document.getElementById('curva-Ec')

    // Atualizar os Sliders
    massaCarrinho.oninput = function atualizarMassaCarrinho() {
        let massaCarrinhoValue = massaCarrinho.value * 10
    
        massaCarrinhoResp.innerText = `${massaCarrinhoValue.toFixed(0)}`

        atualizarAtritoMax()
    }
    angPlanoInclinado.oninput = function atualizarAngPlanoInclinado() {
        let angPlanoInclinadoValue = angPlanoInclinado.value / 10
    
        angPlanoInclinadoResp.innerText = `${angPlanoInclinadoValue.toFixed(1)}`

        atualizarAtritoMax()
    }
    forçaAtrito.oninput = function atualizarForçaAtrito() {
        let forçaAtritoValue = forçaAtrito.value / 1000
    
        forçaAtritoResp.innerText = `${forçaAtritoValue.toFixed(3)}`
    }

    F10_AL11.preparado = true
    curva()
}


// Limitar a Força de Atrito Máxima Sentida pelo Carrinho
function atualizarAtritoMax() {
    let m = massaCarrinho.value / 100
    let theta = angPlanoInclinado.value / 10 * (Math.PI / 180) // Em radianos

    let Fnormal = m * g * Math.cos(theta) // A Força normal é igual à componente do peso perpendicular à superfície
    let FaMax = COF * Fnormal
    let FaMaxConvertido = Math.floor(FaMax * 1000)

    if (forçaAtrito.value > FaMaxConvertido) {
        forçaAtritoResp.innerText = `${(FaMaxConvertido / 1000).toFixed(3)}`
    }

    forçaAtrito.max = FaMaxConvertido
}


// Obter os Valores da Ec para várias distâncias percorridas
function pontos() {

    // Inicializar variáveis
    let m = massaCarrinho.value / 100
    let theta = angPlanoInclinado.value / 10 * (Math.PI / 180) // Em radianos
    let Fa = forçaAtrito.value / 1000

    let declive = m * g * Math.sin(theta) - Fa

    let Ec = 0

    let xd = []
    let yEc = []

    // Calcular a Ec para d de 0 a 1 metros
    for (let d = 0; d <= 1.01; d += 0.01) {
        Ec = declive * d

        xd.push(Math.round(d * 100))
        yEc.push(Ec.toFixed(4))
    }

    return [xd, yEc]
}


// Traçar o gráfico Ec = f(d)
function curva() {
    // Remover o Canvas antigo
    F10_AL11.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let xd = resultados[0]
    let yEc = resultados[1]

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F10_AL11.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: xd,
            datasets: [{
                data: yEc,
                label: 'Energia Cinética do Carrinho',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Distância Percorrida/ cm',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Energia Cinética do Carrinho/ J',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 7,
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

                        return 'Distância Percorrida: ' + tooltipItem.label + 'cm'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Energia Cinética: ' + value + 'J'
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

// Ideia: Permitir variar o COF máximo