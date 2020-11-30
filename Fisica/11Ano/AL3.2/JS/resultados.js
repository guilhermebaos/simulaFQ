// Definir Constantes

// Inicializar Variáveis Globais

// Usar um Objeto para proteger as variáveis com nomes comuns
let F11_AL31 = {
    preparado: false,
    divCurva: '',
}

let linhas
let distAoAlvo

let linhasResp
let distAoAlvoResp
let distN1Resp
let lambdaResp

let corBtns
let corEscolhida = 'red'
let corEscolhidaPos = 0
let corLambda = 633e-9


function prepararResultados() {
    if (F11_AL31.preparado) {
        return
    }
    
    // Selecionar Sliders
    linhas = document.getElementById('linhas')
    distAoAlvo = document.getElementById('distAoAlvo')

    // Selecionar os Spans com os Valores dos Sliders
    linhasResp = document.getElementById('linhasValue')
    distAoAlvoResp = document.getElementById('distAoAlvoValue')

    // Selecionar os Spans com os Resultados da Tabela
    distN1Resp = document.getElementById('distN1Value')
    lambdaResp = document.getElementById('lambdaValue')

    // Selecionar a div que vai ter a Curva
    F11_AL31.divCurva = document.getElementById('curva-laser')

    // Selecionar os Butões que permitem escolher a cor do laser
    corBtns = document.getElementsByName('cor-laser')

    // Atualizar os Sliders
    linhas.oninput = function atualizarLinhas() {
        let linhasValue = linhas.value / 1
    
        linhasResp.innerText = `${linhasValue.toFixed(0)}`
        curva()
    }
    distAoAlvo.oninput = function atualizarDistAoAlvo() {
        let distAoAlvoValue = distAoAlvo.value / 10
    
        distAoAlvoResp.innerText = `${distAoAlvoValue.toFixed(1)}`
        curva()
    }
    

    F11_AL31.preparado = true
    curva()
}


// Escolhe a cor do laser e altera a aparência dos butões
function corLaser(num) {
    if (num != corEscolhidaPos) {
        corBtns[corEscolhidaPos].className = 'escolha'

        corEscolhidaPos = num
        corBtns[corEscolhidaPos].className = 'escolha-atual'

        if (num == 0) {corLambda = 633e-9; corEscolhida = 'red'}
        else if (num == 1) {corLambda = 514e-9; corEscolhida = 'green'}
        else if (num == 2) {corLambda = 488e-9; corEscolhida = 'blue'}

        curva()
    }
}


// Calcula o caminho tomado pelo laser
function pontos() {
    let d = linhas.value ** -1 * 1e-3
    let L = distAoAlvo.value / 1000

    // Cria os arrays com os valores
    let xArr = []
    let yArr = []
    for (let x = -1; x <= 1; x += 0.001) {
        xArr.push(x.toFixed(3))
        yArr.push(null)
    }
    let a, pos
    for (let n = 0; n <= 100; n++) {
        // Define a posição horizontal do máximos de ordem n
        a = Math.sqrt((L**2 * n**2 * corLambda**2)/(d**2 - n**2 * corLambda**2)).toFixed(3)
        
        if (n == 1) distN1Resp.innerText = (2 * a * 100).toFixed(1)

        // Coloca y = 1 nos máximos de ordem n, cuja posição horizontal será a e -a
        pos = xArr.findIndex(element => element == a)
        yArr[pos] = 1

        pos = xArr.findIndex(element => element == -a)
        yArr[pos] = 1

        if (a > 1) break
    }

    escala = []
    for (let p = 0; p <= 20; p++) {
        escala.push(null)
    }
    for (p = 0; p <= 100; p++) {
        escala.push(0.1)
    }

    return [xArr, yArr, escala]
}


// Calcula e mostra os Resultados da Tabela
function curva() {
    // Atualizar os Resultados da Tabela
    lambdaArr = String(corLambda).split('e')
    lambdaResp.innerHTML = `${lambdaArr[0]} &times; 10<sup>${lambdaArr[1]}</sup>`

    // Remover o Canvas antigo
    F11_AL31.divCurva.innerHTML = ''

    // Criar o canvas onde vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    F11_AL31.divCurva.appendChild(canvasCurva)

    // Obter e guardar os resultados
    let resultados = pontos()
    let x = resultados[0]
    let y = resultados[1]
    let e = resultados[2]

    // Criar o Chart Object
    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: x,
            datasets: [{
                data: y,
                label: 'Laser',
                borderColor: corEscolhida,
                fill: false
            },
            {
                data: e,
                label: 'Escala',
                borderColor: 'black',
                backgroundColor: 'black',
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
            elements: {
                point: {
                    radius: 4,
                    hitRadius: 1,
                    hoverRadius: 4,
                    backgroundColor: corEscolhida
                }
            },
            scales: {
                xAxes: [{
                    display: false,
                    labelString: '',
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        max: 2,
                        min: 0
                    }
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false
            }
        },
    })
}

// Ideia: Ângulo Crítico na Refração
