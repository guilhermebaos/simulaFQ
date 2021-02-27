import Montagem1 from '../JS/montagem1.js'
import Montagem2 from '../JS/montagem2.js'
import Dados from '../JS/dados.js'

const MONTAGENS = {
    M1: 0,
    M2: 1
}

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao, inputVariavel) {
        // Guardar o canvas
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.inputVariavel = inputVariavel

        // Montagem
        this.montagem = MONTAGENS.M1

        // Tamanho da Simulação
        this.novoTamanho()

        this.dados = new Dados(this)

        this.reiniciar(this.montagem)
    }

    // Reiniciar a Simulação
    reiniciar(montagemEscolhida) {
        this.montagem = montagemEscolhida

        this.inputs = this.juntarValores()

        delete this.simObjetos

        this.simObjetos = []
        if (this.montagem == MONTAGENS.M1) {
            this.simObjetos.push(new Montagem1(this))
        } else if (this.montagem == MONTAGENS.M2) {
            this.simObjetos.push(new Montagem2(this))
        }

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
            g: 9.81,                            // Aceleração Gravítica
            m: massaBloco.value / 1000,         // Massa do Bloco em kg
            mMax: massaBloco.max / 1000,        // Massa Máxima do Bloco
            A: areaContacto.value,              // Área de Contacto
            Amax: areaContacto.max,             // Área de Contacto Máximo
            cae: coefAtritoEstatico.value / 100,                    // Coeficiente de Atrito Estático
            cac: coefAtritoEstatico.value * coefAtritoCinetico.value / 10000    // Coeficiente de Atrito Cinético
        }
    }

    update(deltaTempo) {
        let dados = this.dados.update(deltaTempo)

        this.simObjetos.forEach((objeto) => objeto.update(deltaTempo))

        if (dados) {
            return this.dados.dadosObtidos
        } else {
            return false
        }
    }

    desenhar(ctx) {
        this.simObjetos.forEach((objeto) => objeto.desenhar(ctx))
    }
}