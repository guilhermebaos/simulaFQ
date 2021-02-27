import Bola from '../JS/bola.js'

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, constantes) {
        // Guardar o canvas
        this.canvas = canvas

        // Constantes
        this.constantes = constantes

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Objetos da Simulação
        this.bola = new Bola(this)

        // Calcular a Resistência do Ar
        this.calcularRar = true

        // Tamanho da Simulação
        this.novoTamanho()
    }

    // Reiniciar a Simulação
    reiniciar(start=false) {
        this.inputs = this.juntarValores()
        this.bola.reiniciar(start)
    }

    // Atualizar o tamanho do canvas
    novoTamanho() {
        this.largura = this.canvas.width
        this.altura = this.canvas.height

        this.reiniciar()
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            m: massaEsfera.value / 1000,    // Massa da bola, kg
            r: raioEsfera.value / 10,       // Raio da Esfera, cm
            rMax: raioEsfera.max / 10,      // Raio Máximo da Esfera, cm
            d: distCelulas.value / 1,       // Distância entre as Células
            hSimCm: (distCelulas.max / 1 + raioEsfera.max / 10) * 1.1, // Altura da Simulação
        }
    }

    update(deltaTempo) {
        return this.bola.update(deltaTempo)
    }

    desenhar(ctx) {
        this.bola.desenhar(ctx)
    }
}