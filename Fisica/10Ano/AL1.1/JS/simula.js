import Montagem from '../JS/montagem.js'

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao) {
        // Guardar o canvas
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        this.reiniciar()

        // Tamanho da Simulação
        this.novoTamanho()
    }

    // Reiniciar a Simulação
    reiniciar() {
        this.inputs = this.juntarValores()

        this.montagem = new Montagem(this)
    }

    // Atualizar o tamanho do canvas
    novoTamanho() {
        if (this.largura == this.canvas.width) return

        this.largura = this.canvas.width
        this.altura = this.canvas.height

        this.reiniciar()
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            g: 9.81,                            // Aceleração Gravítica
            m: massaCarrinho.value / 1000,      // Massa do Carrinho
            mMax: massaCarrinho.max / 1000,
            d: posCarrinho.value / 10,          // Posição do Carrinho na Rampa em cm
            dMax: posCarrinho.max / 10,          // Tamanho da Rampa em cm
            a: angPlanoInclinado.value / 10 * (Math.PI / 180),         // Inclinação em Radianos
            fa: forcaAtrito.value / 1000,   // Força de Atrito
            l: larguraTira.value / 10,      // Largura da tira em cm
        }
    }

    update(deltaTempo) {
        deltaTempo /= 1000
        deltaTempo /= this.resolucao

        return this.montagem.update(deltaTempo)
    }

    desenhar(ctx) {
        this.montagem.desenhar(ctx)
    }
}