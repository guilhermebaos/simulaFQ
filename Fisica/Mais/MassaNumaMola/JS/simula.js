import Dados from '../JS/dados.js'
import Massa from '../JS/massa.js'
import Mola from '../JS/mola.js'

const ESTADOS = {
    EM_PROGRESSO: 0,
    PAUSA: 1
}

// Classe que vai executar a Simulação
export default class Simula {
    constructor(canvas, resolucao) {
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Estado da Simulação
        this.estado = ESTADOS.EM_PROGRESSO

        // Objetos da Simulação
        this.massa = new Massa(this)

        this.mola = new Mola(this)

        this.dados = new Dados(this)
    }

    reiniciar(start=false) {
        this.start = start
        this.inputs = this.juntarValores()

        this.massa.reiniciar(start)
        this.dados.reiniciar()
        
        this.novoTamanho()
    }

    novoTamanho() {
        this.largura = this.canvas.width
        this.altura = this.canvas.height
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            m: valorMassa.value / 1000,         // Massa em kg
            mMax: valorMassa.max / 1000,        // Massa máxima
            k: constanteElastica.value / 100,   // Const Elástica da Mola em N/m
            l: comprimentoMola.value / 100,     // Comprimento da Mola em m    
            xInicial: posInicial.value / 100,   // Possição Inicial em m
            xInicialMax: posInicial.max / 100,  // Possição Inicial Max em m 
            g: aGravitica.value / 100           // Aceleração Grav. em m/s^2
        }
    }

    // Desenhar os vetores
    desenharVetor(ctx, x0, y0, xFinal, yFinal, cor){
        // Variáveis a usar ao criar a seta
        let largura = 4
        let compTopo = 10

        let angle = Math.atan2(yFinal - y0, xFinal - x0)

        // Corpo da Seta
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(xFinal, yFinal)
        ctx.strokeStyle = cor
        ctx.lineWidth = largura
        ctx.stroke()
        
        // Desenhar um dos traços da cabeça da seta
        ctx.beginPath()
        ctx.moveTo(xFinal, yFinal)
        ctx.lineTo(xFinal - compTopo * Math.cos(angle - Math.PI/7), yFinal - compTopo * Math.sin(angle - Math.PI/7))
        
        // Desenhar o outro traço
        ctx.lineTo(xFinal - compTopo * Math.cos(angle + Math.PI/7), yFinal - compTopo * Math.sin(angle + Math.PI/7))
        
        // Caminho de uma ponta para o centro e de novo para a outra ponta da cabeça da seta
        ctx.lineTo(xFinal, yFinal)
        ctx.lineTo(xFinal - compTopo * Math.cos(angle - Math.PI/7), yFinal - compTopo * Math.sin(angle - Math.PI/7))

        // Desenhar os caminhos traçados acima
        ctx.strokeStyle = cor
        ctx.lineWidth = largura
        ctx.stroke()
        ctx.fillStyle = cor
        ctx.fill()
    }

    // Adaptado de StackOverflow: https://stackoverflow.com/questions/41613191/how-to-draw-a-curved-spring-in-a-html5-canvas
    desenharMola(ctx, x0, y0, xFinal, yFinal, espirais, largura, offset, cor1, cor2, larguraLinha){
        let x = xFinal - x0,
            y = yFinal - y0,
            dist = Math.sqrt(x * x + y * y)
        
        let nx = x / dist,
            ny = y / dist
        ctx.strokeStyle = cor1
        ctx.lineWidth = larguraLinha
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(x0,y0)
        x0 += nx * offset
        y0 += ny * offset
        xFinal -= nx * offset
        yFinal -= ny * offset
        x = xFinal - x0
        y = yFinal - y0
        let step = 1 / espirais

        // Para cada espiral
        for (let i = 0; i <= 1-step; i += step) {
            for (let j = 0; j < 1; j += 0.05) {
                let xx = x0 + x * (i + j * step),
                    yy = y0 + y * (i + j * step)
                xx -= Math.sin(j * Math.PI * 2) * ny * largura
                yy += Math.sin(j * Math.PI * 2) * nx * largura
                ctx.lineTo(xx,yy)
            }
        }

        ctx.lineTo(xFinal, yFinal)
        ctx.lineTo(xFinal + nx * offset, yFinal + ny * offset)
        ctx.stroke()
        ctx.strokeStyle = cor2
        ctx.lineWidth = larguraLinha - 4
        step = 1 / espirais

        ctx.beginPath()
        ctx.moveTo(x0 - nx * offset, y0 - ny * offset)
        ctx.lineTo(x0, y0)
        ctx.moveTo(xFinal, yFinal)
        ctx.lineTo(xFinal + nx * offset, yFinal + ny * offset)

        // Para cada espiral
        for (let i = 0; i <= 1-step; i += step) {
            for (let j = 0.25; j <= 0.76; j += 0.05) {
                let xx = x0 + x * (i + j * step),
                    yy = y0 + y * (i + j * step)
                xx -= Math.sin(j * Math.PI * 2) * ny * largura
                yy += Math.sin(j * Math.PI * 2) * nx * largura
                if (j === 0.25) {
                    ctx.moveTo(xx,yy)
                
                } else {
                    ctx.lineTo(xx,yy)
                }
            }
        }
        ctx.stroke();
    }

    pausa() {
        if (this.estado == ESTADOS.PAUSA) {
            this.estado = ESTADOS.EM_PROGRESSO
        } else {
            this.estado = ESTADOS.PAUSA
        }
    }

    update(deltaTempo) {
        if (this.estado !== ESTADOS.EM_PROGRESSO) return

        this.massa.update(deltaTempo)

        if (this.start) {
            return this.dados.update(deltaTempo)
        }
    }

    desenhar(ctx) {
        this.massa.desenhar(ctx)
        this.mola.desenhar(ctx)

        if (this.estado == ESTADOS.PAUSA) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
            ctx.fillRect(0, 0, this.largura, this.altura)
        }
    }
}