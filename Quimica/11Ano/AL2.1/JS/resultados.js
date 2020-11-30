// Definir constantes
const Kw = 1.00e-14


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let Q11_AL21 = {
    preparado: false,
    divCurva: ''
}

let curvaTitulante = 'HCl'

let TitulanteHCl, TitulanteNaOH
let TituladoHCl, TituladoNaOH

let ConcTitulante, ConcTitulado
let VolTitulante, VolTitulado

let ConcTitulanteResp, ConcTituladoResp
let VolTitulanteResp, VolTituladoResp


function prepararResultados() {
    if (Q11_AL21.preparado) {
        return
    }
    
    // Selecionar os butões
    TitulanteHCl = document.getElementById('TitulanteHCl')
    TitulanteNaOH = document.getElementById('TitulanteNaOH')

    TituladoHCl = document.getElementById('TituladoHCl')
    TituladoNaOH = document.getElementById('TituladoNaOH')

    // Selecionar Sliders
    ConcTitulante = document.getElementById('ConcTitulante')
    ConcTitulado = document.getElementById('ConcTitulado')

    VolTitulante = document.getElementById('VolTitulante')
    VolTitulado = document.getElementById('VolTitulado')

    // Selecionar os Spans com os Valores dos Sliders
    ConcTitulanteResp = document.getElementById('ConcTitulanteValue')
    ConcTituladoResp = document.getElementById('ConcTituladoValue')

    VolTitulanteResp = document.getElementById('VolTitulanteValue')
    VolTituladoResp = document.getElementById('VolTituladoValue')

    // Selecionar a div onde vai parar a curva
    Q11_AL21.divCurva = document.getElementById('curva-pH')
    
    // Atualizar os Sliders
    ConcTitulante.oninput = function atualizarConcTitulante() {
        let ConcTitulanteValue = ConcTitulante.value / 1000

        ConcTitulanteResp.innerText = `${ConcTitulanteValue.toFixed(3)}`
    }
    ConcTitulado.oninput = function atualizarConcTitulado() {
        let ConcTituladoValue = ConcTitulado.value / 1000

        ConcTituladoResp.innerText = `${ConcTituladoValue.toFixed(3)}`
    }

    VolTitulante.oninput = function atualizarVolTitulante() {
        let VolTitulanteValue = VolTitulante.value / 100

        VolTitulanteResp.innerText = `${VolTitulanteValue.toFixed(2)}`
    }
    VolTitulado.oninput = function atualizarVolTitulado() {
        let VolTituladoValue = VolTitulado.value / 1
        
        VolTituladoResp.innerText = `${VolTituladoValue.toFixed(2)}`
    }

    Q11_AL21.preparado = true
    curva()
}


// Definir o Titulante e o Titulado, mudando as suas classes para o representar visualmente
function Titulante(Tit) {
    curvaTitulante = Tit
    if (Tit == 'HCl') {
        TitulanteHCl.className = 'escolha-atual'
        TituladoNaOH.className = 'escolha-atual'

        TituladoHCl.className = 'escolha'
        TitulanteNaOH.className = 'escolha'
    } else if (Tit == 'NaOH') {
        TitulanteHCl.className = 'escolha'
        TituladoNaOH.className = 'escolha'

        TituladoHCl.className = 'escolha-atual'
        TitulanteNaOH.className = 'escolha-atual'
    }
}


// Obter os Valores de pH para os vários Volumes adicionados de Titulante
function pontos() {

    // Inicializar variáveis
    let nTitulante = 0
    let nTitulado = 0

    let CTitulante = ConcTitulante.value / 1000
    let CTitulado = ConcTitulado.value / 1000

    let nH3O = 0
    let nHO = 0

    let CH3O = 0
    let CHO = 0
    
    let volumeTitulante = 0
    let volumeTitulado = (VolTitulado.value * 1) / 1000

    let volumeAdicional = (VolTitulante.value / 100) / 1000
    let volumeTotal = (VolTitulado.value * 1) / 1000

    let pH = 0

    let xVolumes = []
    let ypH = []

    // Loop que calcula os pH
    while (true) {

        // Reiniciar os n's
        nH3O = 0
        nHO = 0

        nTitulante = volumeTitulante * CTitulante
        nTitulado = volumeTitulado * CTitulado
        if (curvaTitulante == 'HCl') {
            if (nTitulante > nTitulado) {           // Gastou o Titulado completamente
                nH3O = nTitulante - nTitulado       // O Titulante que sobra Ioniza-se completamente

            } else if (nTitulado > nTitulante) {    // Gastou o Titulante Todo 
                nHO = nTitulado - nTitulante        // O Titulado que sobra Ioniza-se completamente
        
            } else {
                nH3O = nHO = 0
            }
        } else if (curvaTitulante == 'NaOH') {
            if (nTitulante > nTitulado) {
                nHO = nTitulante - nTitulado

            } else if (nTitulado > nTitulante) {
                nH3O = nTitulado - nTitulante

            } else {
                nH3O = nHO = 0
            }
        }
        

        CH3O = nH3O / volumeTotal
        CHO = nHO / volumeTotal

        // Se as Concentrações do ião que existe em maior quantidade for muito pequena, a autoionização da água deixa de ser desprezável
        if (CH3O < Math.sqrt(Kw) && CH3O > 0) {
            CH3O = Math.sqrt(Kw)
        } else if (CHO < Math.sqrt(Kw) && CHO > 0) {
            CHO = Math.sqrt(Kw)
        }

        // Calcular o pH através do ião que existe em maior quantidade
        if (CH3O != 0) {
            pH = -Math.log10(CH3O)
        } else if (CHO != 0) {
            pOH = -Math.log10(CHO)
            pH = -Math.log10(Kw) - pOH
        } else {
            pH = 7
        }

        // Guardar os Valores
        xVolumes.push((volumeTitulante * 1000).toFixed(2))
        ypH.push(pH.toFixed(2))

        // Paramos quando o pH for menor que dois
        if (volumeTitulante >= 0.060) {
            break
        } else {
            volumeTotal += volumeAdicional
            volumeTitulante += volumeAdicional
        }
    }
    
    return [xVolumes, ypH]
}


// Recebe os valores do pH e traça a Curva de pH
function curva() {
    // Remover o Canvas antigo
    Q11_AL21.divCurva.innerHTML = ''

    // Variáveis da função
    let resultados = pontos()
    let xVolumes = resultados[0]
    let ypH = resultados[1]

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    Q11_AL21.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: xVolumes,
            datasets: [{
                data: ypH,
                label: 'pH da Mistura',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Volume de Titulante Adicionado/ ml',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'pH da Mistura',
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

                        return 'Volume de Titulante Adicionado: ' + tooltipItem.label + 'ml'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(2)
    
                        return 'pH da Mistura: ' + value
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