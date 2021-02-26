// Definir Constantes
const PI = Math.PI
const g = 9.81      // Aceleração Gravitaconal
const densidadeAr = 1.225 // kg/m^3
const CRar = 0.5    // Coeficiente de Resistência do ar para uma esfera, aproximado para Reynolds entre 2*10^3 e 2*10^5
                    // Razões para a aproximação ser razoável -> https://www.grc.nasa.gov/www/K-12/airplane/dragsphere.html e https://aerotoolbox.com/reynolds-number-calculator/
                    
// Constantes a passar para a Simulação
const CONSTANTES = {
    g: g,
    densidadeAr: densidadeAr,
    CRar: CRar
}

// Obter o DPR do ecrã
const DPR = window.devicePixelRatio

// Tamanho do deltaT em cada update (maior resolução, menor deltaT)
const RESOLUCAO = 50


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

let calcularRAr = true

let btnCalcularRAr, btnDesprezarRAr

let massaEsfera, massaEsferaResp
let raioEsfera, raioEsferaResp
let distCelulas, distCelulasResp

let deltaT_celula2Resp, deltaT_quedaResp
let gravidadeExperimentalResp, erroGravidadeExperimentalResp

let canvasSim, ctx, simula

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
    gravidadeExperimentalResp = document.getElementById('gravidade-experimental')
    erroGravidadeExperimentalResp = document.getElementById('erro-gravidade-experimental')

    // Atualizar os Sliders
    massaEsfera.oninput = () => {
        let massaEsferaValue = massaEsfera.value / 1
    
        massaEsferaResp.innerText = `${massaEsferaValue.toFixed(0)}`
        
        reiniciar()
    }
    raioEsfera.oninput = () => {
        let raioEsferaValue = raioEsfera.value / 10
    
        raioEsferaResp.innerText = `${raioEsferaValue.toFixed(1)}`
        
        reiniciar()
    }
    distCelulas.oninput = () => {
        let distCelulasValue = distCelulas.value / 1
    
        distCelulasResp.innerText = `${distCelulasValue.toFixed(0)}`
        
        reiniciar()
    }


    // SIMULAÇÂO
    
    // Selecionar o Canvas e o seu context
    canvasSim = document.getElementById('canvasSim')

    ctx = canvasSim.getContext('2d')

    ctx.scale(DPR, DPR)

    // Criar o Objeto Simula
    simula = new window.Simula(canvasSim, RESOLUCAO, CONSTANTES)

    F11_AL11.preparado = true
    loopSimula()
}


// Corrige o tamanho do Canvas e corrige o DPR
function fixDPR() {
    let minAltura = 225

    // Usar variável global
    if (simulaFQmenu.aberto !== 'resultados.html') return

    // Altura do CSS
    let altura_css = +getComputedStyle(canvasSim).getPropertyValue('height').slice(0, -2)
    if (altura_css < minAltura) altura_css = minAltura

    // Larura do CSS
    let largura_css = +getComputedStyle(canvasSim).getPropertyValue('width').slice(0, -2)

    // Altera o tamanho do canvas
    canvasSim.width = largura_css * DPR
    canvasSim.height = altura_css * DPR

    simula.novoTamanho()
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
    simula.calcularRar = paraCalcular
    reiniciar()
}

let dT2, dTq

// Reiniciar a Simulação
function reiniciar(start=false) {
    dT2 = undefined
    dTq = undefined

    simula.reiniciar(start)
}


// Criar o loop da Simulação
let ultimoTempo

function loopSimula(tempo) {
    if (ultimoTempo === undefined) {
        ultimoTempo = tempo
        fixDPR()
        requestAnimationFrame(loopSimula)
        return
    }

    let deltaTempo = tempo - ultimoTempo
    ultimoTempo = tempo
    
    let dados
    for (let i = 0; i < RESOLUCAO; i++) {
        dados = simula.update(deltaTempo)
        if (dados) {
            if (dados[0]) dT2 = (dados[0] * 1000).toFixed(2)
            if (dados[1]) dTq = (dados[1] * 1000).toFixed(1)

            if (dT2 && dTq) {
                deltaT_celula2Resp.innerText = `${dT2}`
                deltaT_quedaResp.innerText = `${dTq}`
    
                let gExperimental = (raioEsfera.value / 1000 * 2 / (dT2 / 1000)) / (dTq / 1000)
            
                let errogExperimental = Math.abs(gExperimental - g) / g * 100
            
                gravidadeExperimentalResp.innerText = `${gExperimental.toFixed(2)}`
                erroGravidadeExperimentalResp.innerText = `${errogExperimental.toFixed(1)}`
            }
        }
    }

    ctx.clearRect(0, 0, canvasSim.width, canvasSim.height)
    simula.desenhar(ctx)

    requestAnimationFrame(loopSimula)
}

window.onresize = fixDPR