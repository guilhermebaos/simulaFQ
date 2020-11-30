// Definir constantes
// Solubilidades retiradas de: https://en.wikipedia.org/wiki/Solubility_table
// Densidade da água para conversão de g/100ml para g/100g retiradas de: https://www.engineeringtoolbox.com/water-density-specific-weight-d_595.html

const T = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
let NaCl = [35.65, 35.72, 35.89, 36.09, 36.37, 36.69, 37.04, 37.46, 37.93, 38.47, 38.99]
let KNO3 = [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110.0, 138, 169, 202, 246]
let KCl = [28, 31.2, 34.2, 37.2, 40.1, 42.6, 45.8, 48.5, 51.3, 53.9, 56.3]

/* Alguns dos sais não tinham Solubilidades tabeladas para todos os T,
os valores em falta foram acrescentados por média aritmética dos valores mais
próximos, para que a linha do gráfico ficasse mais suave */
let KBr = [53.6, 59.5, 65.3, 70.7, 75.4, 80.45, 85.5, 90.2, 94.9, 99.2, 104]

const DensidadeAgua = [0.9998495, 0.9997000, 0.9982067, 0.9956488, 0.9922152, 0.98804, 0.98320, 0.97776, 0.97179, 0.96531, 0.95635]


// Converter as unidades
for (pos in DensidadeAgua) {
    let d = DensidadeAgua[pos]
    let f = d**-1
    let m = NaCl[pos]
    NaCl[pos] = m * f

    m = KNO3[pos]
    KNO3[pos] = m * f
    
    m = KCl[pos]
    KCl[pos] = m * f
    
    m = KBr[pos]
    KBr[pos] = m * f
}

const salSolubilidadeArr = [NaCl, KNO3, KCl, KBr]


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q11_AL23 = {
    preparado: false,
    divCurva: ''
}

let salArray
let salEscolhidoPos = 0

let energiaResp
let massaResp


function prepararResultados() {
    if (Q11_AL23.preparado) {
        return
    }

    // Selecionar os Butões
    salArray = document.getElementsByName('salSolubilidade')

    // Selecionar os Parágrafos com os Resultados
    energiaResp = document.getElementById('energiaValue')
    massaResp = document.getElementById('massaValue')

    // Selecionar a div onde vai parar a curva
    Q11_AL23.divCurva = document.getElementById('curva-Solubilidade')

    if (Q11_AL23.divCurva == null) throw TypeError

    Q11_AL23.preparado = true
    curva()
}


// Altera o Sal escolhido, bem como a aparência dos butões
function escolherSal(pos) {

    if (salEscolhidoPos != 4) { 
        salArray[salEscolhidoPos].className = 'escolha'
    }
    if (pos != 4) {
        salArray[pos].className = 'escolha-atual'
    }

    salEscolhidoPos = pos

    curva()
}


// Recebe os valores do pH e traça a Curva de pH
function curva() {
    // Remover o Canvas antigo
    Q11_AL23.divCurva.innerHTML = ''

    // Variáveis da função
    let S
    if (salEscolhidoPos != 4) {
        S = salSolubilidadeArr[salEscolhidoPos]
    }

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    Q11_AL23.divCurva.appendChild(canvasCurva)

    if (salEscolhidoPos != 4) {
        // Criar o Chart Object
        let graCurva = new Chart(canvasCurva, {
            type: 'line',
            data: {
                labels: T,
                datasets: [{
                    data: S,
                    label: 'Solubilidade do Sal',
                    borderColor: 'blue',
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperatura da Solução/ ºC',
                            fontColor: 'black',
                            fontSize: 13,
                            fontFamily: '"Arial", "sans-serif"'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Solubilidade do Sal/ g soluto/100g água',
                            fontColor: 'black',
                            fontSize: 13,
                            fontFamily: '"Arial", "sans-serif"'
                        },
                        ticks: {
                            max: 250,
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

                            return 'Temperatura da Solução: ' + tooltipItem.label + 'ºC'
                        },
                        label: function(tooltipItem, data) {
                            let value = Number(tooltipItem.value).toFixed(2)
        
                            return 'Solubilidade do Sal: ' + value + 'g'
                        }
                    },
                    custom: function(tooltip) {
                        if (!tooltip) return
                        tooltip.displayColors = false
                    },
                }
            },
        })
    } else {
        // Criar o Chart Object
        let graCurva = new Chart(canvasCurva, {
            type: 'line',
            data: {
                labels: T,
                datasets: [{
                    data: salSolubilidadeArr[0],
                    label: 'NaCl ',
                    borderColor: 'purple',
                    fill: false
                },{
                    data: salSolubilidadeArr[1],
                    label: 'KNO3 ',
                    borderColor: 'red',
                    fill: false
                },{
                    data: salSolubilidadeArr[2],
                    label: 'KCl ',
                    borderColor: 'green',
                    fill: false
                },{
                    data: salSolubilidadeArr[3],
                    label: 'KBr ',
                    borderColor: 'orange',
                    fill: false
                },]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperatura da Solução/ ºC',
                            fontColor: 'black',
                            fontSize: 13,
                            fontFamily: '"Arial", "sans-serif"'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Solubilidade do Sal/ g soluto/100g água',
                            fontColor: 'black',
                            fontSize: 13,
                            fontFamily: '"Arial", "sans-serif"'
                        },
                        ticks: {
                            max: 250,
                            min: 0
                        }
                    }]
                },
                legend: {
                    display: true,
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data) {
                            let tooltipItem = tooltipItems[0]

                            return 'Temperatura da Solução: ' + tooltipItem.label + 'ºC'
                        },
                        label: function(tooltipItem, data) {
                            let value = Number(tooltipItem.value).toFixed(2)
        
                            return 'Solubilidade do Sal: ' + value + 'g'
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
    resultadosExtra()
}


function resultadosExtra() {
    // Balanço energético da Reação
    if ([1, 2, 3].includes(salEscolhidoPos)) {
        energiaResp.innerText = 'A dissociação é endotérmica, visto ser favorecida por um aumento da temperatura.' 
    } else if (salEscolhidoPos == 0){
        energiaResp.innerText = 'A dissociação é aproximadamente atérmica, visto não ser nem favorecida nem desfavorecida por um aumento da temperatura.'
    }

    // Resposta ao Exercício Sugerido
    if (salEscolhidoPos != 4) {
        let m = salSolubilidadeArr[salEscolhidoPos][2] * 10
        let nomeSal
        switch (salEscolhidoPos) {
            case 0:
                nomeSal = 'Cloreto de Sódio'
                break
            case 0:
                nomeSal = 'Nitrato de Potássio'
                break
            case 0:
                nomeSal = 'Cloreto de Potássio'
                break
            case 0:
                nomeSal = 'Brometo de Potássio'
                break
            default:
                break
        }


        massaResp.innerText = `Num kilograma de água, a 20ºC, conseguimos dissolver até ${m.toFixed(1)}g de ${nomeSal}.`
    }
}