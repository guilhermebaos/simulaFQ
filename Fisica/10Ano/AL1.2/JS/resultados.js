// Definir Constantes
const g = 9.80665   // Aceleração Gravitaconal


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F10_AL12 = {
    preparado: false,
    divCurva: ''
}

let massaBola
let raioBola
let alturaInicial
let elasticidade

let massaBolaResp
let raioBolaResp
let alturaInicialResp

let alturasTabela

let razaoResp
let EmDissipadaResp


function prepararResultados() {
    if (F10_AL12.preparado) {
        return
    }
    

    // Selecionar Sliders
    massaBola = document.getElementById('massaBola')   
    raioBola = document.getElementById('raioBola') 
    alturaInicial = document.getElementById('alturaInicial')
    elasticidade = document.getElementById('elasticidade')

    // Selecionar os Spans com os Valores dos Sliders
    massaBolaResp = document.getElementById('massaBolaValue')
    raioBolaResp = document.getElementById('raioBolaValue')
    alturaInicialResp = document.getElementById('alturaInicialValue')

    // Selecionar os Spans com os Resultados da Tabela
    razaoResp = document.getElementById('razaoValue')
    EmDissipadaResp = document.getElementById('EmDissipadaValue')

    // Selecionar a div onde vai parar a curva
    F10_AL12.divCurva = document.getElementById('curva-xt')

    // Selecionar a Tabela com os Resultados
    alturasTabela = document.getElementById('alturasTabela')

    // Atualizar os Sliders
    massaBola.oninput = function atualizarMassaBola() {
        let massaBolaValue = massaBola.value / 1000
    
        massaBolaResp.innerText = `${massaBolaValue.toFixed(3)}`
    }
    raioBola.oninput = function atualizarRaioBola() {
        let raioBolaValue = raioBola.value / 10
    
        raioBolaResp.innerText = `${raioBolaValue.toFixed(1)}`
    }
    alturaInicial.oninput = function atualizarAlturaInicial() {
        let alturaInicialValue = alturaInicial.value / 1
    
        alturaInicialResp.innerText = `${alturaInicialValue.toFixed(0)}`
    }

    F10_AL12.preparado = true
    curva()
}


// Lei v(t)
function leiVelocidade(v0, a0, tempo) {
    return v0 + a0 * tempo
}


// Lei x(t)
function leiPosicao(x0, v0, a0, tempo){
    return x0 + v0 * tempo + 0.5 * a0 * (tempo ** 2)
}


// Calcula os Resultados que aparecem na Tabela, a Razão e a Em dissipada
function valoresTabela(alturas) {
    let hQ = []
    let hR = []
    let pos = 0
    for (pos = 0; pos < alturas.length - 1; pos++) {
        hQ.push((alturas[pos] * 100).toFixed(1))
        hR.push((alturas[pos+1] * 100).toFixed(1))
    }

    let nColunas = alturasTabela.children[0].childElementCount
    for (pos = 1; pos < nColunas; pos++) {
        alturasTabela.deleteRow(1)
    }
    
    // Altera o número de linhas da tabela, para que tenha todas as alturas de Queda e Ressalto
    let coluna
    let pontos = []
    for (pos = 0; pos < hQ.length; pos++) {
        coluna = alturasTabela.insertRow(pos + 1)

        coluna.innerHTML = `
        <td>${hQ[pos]}cm</td>
        <td class='fim-tabela'>${hR[pos]}cm</td>`

        pontos.push([Number(hQ[pos]), Number(hR[pos])])
    }
    
    let retaMelhorAjuste = regression.linear(pontos);
    let declive = retaMelhorAjuste.equation[0];
    
    razaoResp.innerText = `${declive.toFixed(2)}`
    EmDissipadaResp.innerText = `${((1 - declive) * 100).toFixed(0)}%`
}


// Calcular os Pontos do Gráfico h(t)
function pontos() {
    // Declarar variáveis e valores iniciais
    let hf = 0.05
    let hi = alturaInicial.value / 100
    let e = (elasticidade.value / 100) ** 0.5

    let t = 0
    let x = hi
    let v = 0
    let a = -g

    let tim = [t]
    let pos = [x * 100]
    let hQeR = []

    let deltaT = Math.ceil(hi) * Math.ceil((1 + e)**2) / 1000 - 0.001

    let hMax = hi

    while (true) {
        t += deltaT                         // Instante de tempo a que correspondem os valores calculados

        x = leiPosicao(x, v, a, deltaT)     // Calcular o Xf de acrdo com o Xf e Vf do instante anterior
        v = leiVelocidade(v, a, deltaT)     // Calcular o Vf de acordo com o Vf do instante anterior

        if (x > hMax) {
            hMax = x
        } else if (x <= 0) {
            x = 0                           // Quando está no Solo, a posição é 0
            v *= -e                         // Inverte a velocidade e diminui o seu módulo
            hQeR.push(hMax)                 // Guardar as alturas de Queda e de Ressalto
            if (hMax < hf ||hQeR.length >= 25) {
                break
            } else {
                hMax = 0
            }
        } 

        // Guardar os valores
        tim.push(t.toFixed(3))
        pos.push(x * 100)
    }
    valoresTabela(hQeR)
    return [tim, pos]
}



// Mostra os Valores Relacionados com a Queda da Esfera
function curva() {
    // Remover o Canvas antigo
    F10_AL12.divCurva.innerHTML = ''

    // Obter e guardar os resultados
    let resultados = pontos()
    let t = resultados[0]
    let x = resultados[1]

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F10_AL12.divCurva.appendChild(canvasCurva)

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: t,
            datasets: [{
                data: x,
                label: 'Altura da Bola',
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
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
                        labelString: 'Altura da Bola/ cm',
                        fontColor: 'black',
                        fontSize: 13,
                        fontFamily: '"Arial", "sans-serif"'
                    },
                    ticks: {
                        max: 300,
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

                        return 'Tempo: ' + tooltipItem.label + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(1)
    
                        return 'Posição: ' + value + 'cm'
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