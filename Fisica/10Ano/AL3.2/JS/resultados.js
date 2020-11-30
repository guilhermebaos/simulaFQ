// Definir Constantes

// As capacidades térmicas mássicas estão em J/Kg/ºC
const cAluminio = 897 
const cCobre = 385 
const cAco = 490
const cZinco = 388
const cFerro = 449
const cPrata = 235
const cMetais = [cAluminio, cCobre, cAco, cZinco, cFerro, cPrata]

// Retirado de: https://www.engineeringtoolbox.com/specific-heat-capacity-d_391.html


// As condutividades térmicas estão expressas em W/m/ºC
const kAr = 0.026 


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL32 = {
    preparado: false,
    divCurva: ''
}

let massaBloco
let potResist
let intervaloMedidas

let massaBlocoResp
let potResistResp
let intervaloMedidasResp

let decliveResp
let capacidadeResp

let metalArray
let metalEscolhidoPos = 0

function prepararResultados() {
    if (F10_AL32.preparado) {
        return
    }
    
    // Selecionar Sliders
    massaBloco = document.getElementById('massaBloco')
    potResist = document.getElementById('potResist')
    intervaloMedidas = document.getElementById('intervaloMedidas')

    // Selecionar os Spans com os Valores dos Sliders
    massaBlocoResp = document.getElementById('massaBlocoValue')
    potResistResp = document.getElementById('potResistValue')
    intervaloMedidasResp = document.getElementById('intervaloMedidasValue')

    // Selecionar os Butões
    metalArray = document.getElementsByName('metalBloco')

    // Selecionar os spans com os Resultados da Tabela
    decliveResp = document.getElementById('decliveValue')
    capacidadeResp = document.getElementById('capacidadeValue')
    
    // Selecionar a div onde vai parar a curva
    F10_AL32.divCurva = document.getElementById('curva-CTM')

    // Atualizar os Sliders
    massaBloco.oninput = function atualizarMassaBloco() {
        let massaBlocoValue = massaBloco.value / 1000
    
        massaBlocoResp.innerText = `${massaBlocoValue.toFixed(3)}`
    }
    potResist.oninput = function atualizarPotResist() {
        let potResistValue = potResist.value / 1
    
        potResistResp.innerText = `${potResistValue.toFixed(0)}`
    }
    intervaloMedidas.oninput = function atualizarIntervaloMedidas() {
        let intervaloMedidasValue = intervaloMedidas.value / 1
    
        intervaloMedidasResp.innerText = `${intervaloMedidasValue.toFixed(0)}`
    }

    F10_AL32.preparado = true
    curva()
}


// Altera o Metal escolhido, bem como a aparência dos butões
function escolherMetal(pos) {

    metalArray[metalEscolhidoPos].className = 'escolha'
    metalArray[pos].className = 'escolha-atual'

    metalEscolhidoPos = pos
}


// Calcular os Pontos do Gráfico 
function pontos() {
    // Definir os valores para a simulação
    let c = cMetais[metalEscolhidoPos]
    let m = massaBloco.value / 1000
    let P = potResist.value / 1
    let intervalo = intervaloMedidas.value / 1

    let t = 0
    let deltaT = 0
    let E

    let energias = [0]
    let varTemp = [0]
    while (true) {
        t += intervalo
        E = t * P
        deltaT = (1/(m * c)) * E

        if (deltaT >= 20) {
            break
        }

        energias.push(E)
        varTemp.push(deltaT)
    }
    decliveResp.innerText = (1/(m * c)).toFixed(5)
    capacidadeResp.innerText = c

    return [energias, varTemp]
}



// Mostra o Gráfico relacionado com o bloco calorimétrico
function curva() {
    // Remover o Canvas antigo
    F10_AL32.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let E = resultados[0]
    let dT = resultados[1]
    let maxi = Math.max(dT[dT.length-1], 25)

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F10_AL32.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: E,
            datasets: [{
                data: dT,
                label: 'Variação da Temperatura',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Energia forncida/ J',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Variação da Temperatura/ ºC',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: maxi,
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

                        return 'Energia forncida: ' + tooltipItem.label + 'J'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Variação da Temperatura: ' + value + 'ºC'
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


// Ideia: Permitir dissipação de energia