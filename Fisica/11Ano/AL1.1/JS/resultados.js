// Definir Constantes
const PI = Math.PI
const g = 9.80665   // Aceleração Gravitaconal
const densidadeAr = 1.225 // kg/m^3
const CRar = 0.5    // Coeficiente de Resistência do ar para uma esfera, aproximado para Reynolds entre 2*10^3 e 2*10^5
                    // Razões para a aproximação ser razoável -> https://www.grc.nasa.gov/www/K-12/airplane/dragsphere.html e https://aerotoolbox.com/reynolds-number-calculator/


// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL11 = {
    preparado: false,
    resultados: [],
    divCurva_xt: '',
    divCurva_vt: '',
    divCurva_at: '',
    divCurva_jt: '',
}

let areaEsfera = PI * 0.02 ** 2    // m^2
let calcularRAr = true

let btnCalcularRAr
let btnDesprezarRAr

let massaEsfera
let raioEsfera
let distCelulas

let massaEsferaResp
let raioEsferaResp
let distCelulasResp

let deltaT_celula2Resp
let deltaT_quedaResp
let velocidadeCelula2Resp
let gravidadeExperimentalResp
let erroGravidadeExperimentalResp


function prepararResultados() {
    if (F11_AL11.preparado) {
        return
    }
    
    // Selecionar os Butões
    btnCalcularRAr = document.getElementById('calcularRAr')
    btnDesprezarRAr = document.getElementById('desprezarRAr')

    // Selecionar Sliders
    massaEsfera = document.getElementById('massaEsfera')   
    raioEsfera = document.getElementById('raioEsfera') 
    distCelulas = document.getElementById('distCelulas')

    // Selecionar os Spans com os Valores dos Sliders
    massaEsferaResp = document.getElementById('massaEsferaValue')
    raioEsferaResp = document.getElementById('raioEsferaValue')
    distCelulasResp = document.getElementById('distCelulasValue')

    // Selecionar as Curvas com os Gráficos
    F11_AL11.divCurva_xt = document.getElementById('curva-xt')
    F11_AL11.divCurva_vt = document.getElementById('curva-vt')
    F11_AL11.divCurva_at = document.getElementById('curva-at')
    F11_AL11.divCurva_jt = document.getElementById('curva-jt')

    // Selecionar os Spans com os Resultados da Tabela
    deltaT_celula2Resp = document.getElementById('deltaT-celula2')
    deltaT_quedaResp = document.getElementById('deltaT-queda')
    velocidadeCelula2Resp = document.getElementById('velocidade-celula2')
    gravidadeExperimentalResp = document.getElementById('gravidade-experimental')
    erroGravidadeExperimentalResp = document.getElementById('erro-gravidade-experimental')

    // Atualizar os Sliders
    massaEsfera.oninput = function atualizarMassaEsfera() {
        let massaEsferaValue = massaEsfera.value / 1
    
        massaEsferaResp.innerText = `${massaEsferaValue.toFixed(0)}`
    }
    raioEsfera.oninput = function atualizarRaioEsfera() {
        let raioEsferaValue = raioEsfera.value / 10
    
        raioEsferaResp.innerText = `${raioEsferaValue.toFixed(1)}`
    }
    distCelulas.oninput = function atualizarDistCelulas() {
        let distCelulasValue = distCelulas.value / 1
    
        distCelulasResp.innerText = `${distCelulasValue.toFixed(0)}`
    }

    F11_AL11.preparado = true
    curva()
}


// Selecionar se vamos calcular ou não a Resistência do Ar
function mudarCalcularRAr(paraCalcular) {
    calcularRAr = paraCalcular
    if (paraCalcular) {
        btnCalcularRAr.className = 'escolha-atual'
        btnDesprezarRAr.className = 'escolha'
    } else {
        btnCalcularRAr.className = 'escolha'
        btnDesprezarRAr.className = 'escolha-atual'
    }
}


// Calcular a Área de Superfície da Esfera
function calcularAreaEsfera() {
    raio = raioEsfera.value / 1000  // m
    areaEsfera = PI * raio ** 2     // m^2
}


// Função para calcular a Intensidade da Resistência do Ar
function intensidadeResistAr(velocidade) {
    return 0.5 * densidadeAr * CRar * areaEsfera * velocidade ** 2
}


// Lei v(t)
function leiVelocidade(v0, a0, tempo) {
    return v0 + a0 * tempo
}


// Lei x(t)
function leiPosicao(x0, v0, a0, tempo){
    return x0 + v0 * tempo + 0.5 * a0 * (tempo ** 2)
}


// Calcular os Pontos dos vários gráficos, xt, vt, at e jt
function pontos() {
    // Declarar variáveis e valores iniciais
    let m = massaEsfera.value / 1000
    let h = distCelulas.value / 100

    let t = 0
    let x = 0
    let v = 0
    let a = g
    let j = 0

    let tim = [t]
    let pos = [x]
    let vel = [v]
    let acc = [a]
    let jer = [j]
    let deltaT = 0.001

    let P = m * g
    let Rar
    let Fr

    while (true) {
        t += deltaT                         // Instante de tempo a que correspondem os valores calculados
        if (calcularRAr) {
            Rar = intensidadeResistAr(v)    // Calcular a Resistência do Ar de acordo com o Vf do intervalo anteriormente calculado
        } else {
            Rar = 0
        }
        Fr = P - Rar                        // Calcular o módulo da resultante de forças
        a = Fr / m                          // Calcular o módulo da aceleração
        x = leiPosicao(x, v, a, deltaT)     // Calcular o Xf de acrdo com o Xf e Vf do instante anterior e a aceleração deste
        v = leiVelocidade(v, a, deltaT)     // Calcular o Vf de acordo com o Vf do instante anterior e a aceleração deste
        j = (a - acc[acc.length - 1]) / (t - tim[tim.length - 1])   // Calcular o J usando (y2 - y1) / (x2 - x1), para dois pontos consecutivos

        if (x >= h) {
            break
        }

        // Guardar os valores
        tim.push(t.toFixed(3))
        pos.push(x)
        vel.push(v)
        acc.push(a)
        jer.push(j)
    }
    return [tim, pos, vel, acc, jer]
}


// Calcula os Valores Relacionados com a Queda da Esfera e mostra da Tabela
function curva() {
    // Guardar os Resultados para os Gráficos Extra
    F11_AL11.resultados = pontos()

    // Extrair os Resultados
    let resultados = F11_AL11.resultados

    let tim = resultados[0]
    let t_f = Number(tim[tim.length - 1]) * 1000

    let vel = resultados[2]
    let v_f = vel[vel.length - 1]

    let acc = resultados[3]
    let a_f = acc[acc.length - 1]

    let d = 2 * raioEsfera.value / 1000 // m

    // Fórmula Quadrática com a lei x(t) para determinar o delta t de passagem, com RAr suposta constante
    let deltaT_celula2Value = (-1 * v_f + (v_f ** 2 + 2 * a_f * d) ** 0.5) / a_f * 1000 // ms
    let vm = d / deltaT_celula2Value * 1000
    let gExperimental = vm / t_f * 1000

    let errogExperimental = (gExperimental - g) / g * 100

    deltaT_celula2Resp.innerText = `${deltaT_celula2Value.toFixed(2)}`
    deltaT_quedaResp.innerText = `${t_f.toFixed(1)}`
    velocidadeCelula2Resp.innerText = `${vm.toFixed(3)}`
    gravidadeExperimentalResp.innerText = `${gExperimental.toFixed(2)}`
    erroGravidadeExperimentalResp.innerText = `${errogExperimental.toFixed(1)}`


    curvaExtra()
}


// Fazer os gráficos Extra e mostrar nas divs-Extra
function curvaExtra() {
    // Remover os Canvas antigos
    F11_AL11.divCurva_xt.innerHTML = ''

    F11_AL11.divCurva_vt.innerHTML = ''

    F11_AL11.divCurva_at.innerHTML = ''

    F11_AL11.divCurva_jt.innerHTML = ''

    // Variáveis das funções
    let resultados = F11_AL11.resultados
    let tim = resultados[0]
    let pos = resultados[1]
    let vel = resultados[2]
    let acc = resultados[3]
    let jer = resultados[4]

    // Criar os canvas onde vão estar as curvas
    canvasCurva_xt = document.createElement('canvas')
    canvasCurva_xt.setAttribute('id', 'canvasCurva-xt')
    F11_AL11.divCurva_xt.appendChild(canvasCurva_xt)

    canvasCurva_vt = document.createElement('canvas')
    canvasCurva_vt.setAttribute('id', 'canvasCurva-vt')
    F11_AL11.divCurva_vt.appendChild(canvasCurva_vt)
    
    canvasCurva_at = document.createElement('canvas')
    canvasCurva_at.setAttribute('id', 'canvasCurva-at')
    F11_AL11.divCurva_at.appendChild(canvasCurva_at)
    
    canvasCurva_jt = document.createElement('canvas')
    canvasCurva_jt.setAttribute('id', 'canvasCurva-jt')
    F11_AL11.divCurva_jt.appendChild(canvasCurva_jt)
    
    // Criar os Chart Object
    let graCurva_xt = new Chart(canvasCurva_xt, {
        type: 'line',
        data: {
            labels: tim,
            datasets: [{
                data: pos,
                label: 'Posição da Esfera/ m',
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
                        labelString: 'Componente Escalar da posição da Esfera/ m',
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

                        return 'Tempo: ' + Number(tooltipItem.label).toFixed(3) + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Posição: ' + value + 'm'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })
    let graCurva_vt = new Chart(canvasCurva_vt, {
        type: 'line',
        data: {
            labels: tim,
            datasets: [{
                data: vel,
                label: 'Componente Escalar da Velocidade da Esfera/ m/s',
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
                        labelString: 'Componente Escalar da Velocidade da Esfera/ m/s',
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

                        return 'Tempo: ' + Number(tooltipItem.label).toFixed(3) + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Velocidade: ' + value + 'm/s'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })
    let graCurva_at = new Chart(canvasCurva_at, {
        type: 'line',
        data: {
            labels: tim,
            datasets: [{
                data: acc,
                label: 'Componente Escalar da Aceleração da Esfera/ m/s/s',
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
                        labelString: 'Componente Escalar da Aceleração da Esfera/ m/s/s',
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

                        return 'Tempo: ' + Number(tooltipItem.label).toFixed(3) + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Aceleração: ' + value + 'm/s/s'
                    }
                },
                custom: function(tooltip) {
                    if (!tooltip) return
                    tooltip.displayColors = false
                },
            }
        },
    })
    let graCurva_jt = new Chart(canvasCurva_jt, {
        type: 'line',
        data: {
            labels: tim,
            datasets: [{
                data: jer,
                label: 'Componente Escalar do Jerk da Esfera/ m/s/s/s',
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
                        labelString: 'Componente Escalar do Jerk da Esfera/ m/s/s/s',
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

                        return 'Tempo: ' + Number(tooltipItem.label).toFixed(3) + 's'
                    },
                    label: function(tooltipItem, data) {
                        let value = Number(tooltipItem.value).toFixed(3)
    
                        return 'Jerk: ' + value + 'm/s/s/s'
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