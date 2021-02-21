import Montagem from '../JS/montagem.js'

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao) {
        // Guardar o canvas
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Tamanho da Simulação
        this.novoTamanho()
        
        this.reiniciar()
    }

    // Reiniciar a Simulação
    reiniciar() {
        this.inputs = this.juntarValores()

        if (this.montagem) this.montagem.reiniciar()
        else this.montagem = new Montagem(this)
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
            g: 9.81,                    // Aceleração Gravítica
            d: dEsfera.value,           // Diâmetro da esfera, em mm
            dMax: dEsfera.max,
            hi: hInicial.value / 100,   // Altura inicial, em metros
            hl: hLanc.value / 100,      // Altura de lançamento, em metros
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