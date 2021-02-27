import Montagem from '../JS/montagem.js'
import Dados from '../JS/dados.js'


// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao, constantes) {
        // Guardar o canvas
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Constantes
        this.constantes = constantes

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs
        this.inputs = this.juntarValores()

        this.montagem = new Montagem(this)
        this.dados = new Dados(this)

        this.reiniciar()
    }

    // Reiniciar a Simulação
    reiniciar(start=false) {
        this.inputs = this.juntarValores()
        this.montagem.reiniciar(start)
        this.dados.reiniciar()
    }

    // Atualizar o tamanho do canvas
    novoTamanho() {
        this.largura = this.canvas.width
        this.altura = this.canvas.height
    }

    // Desenhar os vetores
    desenharVetor(x0, y0, xFinal, yFinal, cor){
        // Variáveis a usar ao criar a seta
        let largura = 4
        let compTopo = 10

        // O final da seta fica a (xFinal, yFinal)
        if (xFinal == x0) {
            xFinal += 0
        } else if (xFinal > x0) {
            xFinal += compTopo + 1
        } else {
            xFinal -= compTopo + 1
        }

        if (yFinal == y0) {
            yFinal += 0
        } else if (yFinal > y0) {
            yFinal += compTopo + 1
        } else {
            yFinal -= compTopo + 1
        }

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

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            m: massaCarrinho.value / 100,           // Massa do carrinho em kg
            mMax: massaCarrinho.max / 100,          // Massa Máxima do carrinho
            mSusp: massaCorpoSuspenso.value / 100,  // Massa do Corpo Suspenso
            mSuspMax: massaCorpoSuspenso.max / 100, // Massa Máx Corpo Suspenso
            hSusp: alturaCorpoSuspenso.value / 1,// Altura do Corpo Suspenso, cm
            hSuspMax: alturaCorpoSuspenso.max / 1,  // Altura Máx Corpo Suspenso
            fa: forcaAtrito.value / 10              // Força de Atrito em cN
        }
    }

    update(deltaTempo) {
        this.montagem.update(deltaTempo)

        let dados = this.dados.update(deltaTempo)

        if (dados) {
            return this.dados.dadosObtidos
        } else {
            return false
        }
    }

    desenhar(ctx) {
        this.montagem.desenhar(ctx)
    }
}