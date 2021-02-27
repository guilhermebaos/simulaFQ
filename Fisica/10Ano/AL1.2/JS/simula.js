import Bola from '../JS/bola.js'
import Dados from '../JS/dados.js'

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao, hiMax) {
        // Guardar o canvas
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao
        
        // Alturas Iniciais Mínima e Máxima
        this.hiMax = hiMax

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Objetos da Simulação
        this.bola = new Bola(this)

        this.dados = new Dados(this)

        this.reiniciar()
    }

    // Reiniciar a Simulação
    reiniciar(start=false) {
        // Simulação já acabou
        this.acabou = false

        // Começar a Simulação
        this.start = start

        this.novoTamanho()
        this.inputs = this.juntarValores()
        
        this.bola.reiniciar()
        this.dados.reiniciar()
    }

    // Atualizar o tamanho do canvas
    novoTamanho() {
        this.largura = this.canvas.width
        this.altura = this.canvas.height

        if (this.bola) {
            this.bola.novoTamanho()
        }
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            r: raioBola.value / 10,
            rMax: raioBola.max / 10,
            hi: alturaInicial.value / 100,          // Altura Inicial em Metros
            hf : 0.03,                              // Altura 'Final'
            e: (elasticidade.value / 100) ** 0.5,   // Elasticidade em %
            g: 9.81                                 // Aceleração Gravítica
        }
    }

    update(deltaTempo) {
        if (this.acabou || !this.start) return

        let dados = this.dados.update(deltaTempo)

        this.bola.update(deltaTempo)

        if (dados) {
            return this.dados.dadosObtidos
        } else {
            return false
        }
    }

    desenhar(ctx) {
        this.bola.desenhar(ctx)
    }
}