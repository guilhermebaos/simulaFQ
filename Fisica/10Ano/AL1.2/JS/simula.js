import Bola from '../JS/bola.js'
import Dados from '../JS/dados.js'

// Classe que vai executar a Simulação
window.Simula = class Simula {
    constructor(canvas, resolucao, hiMax) {
        // Guardar o canvas
        this.canvas = canvas
        
        // Alturas Iniciais Mínima e Máxima
        this.hiMax = hiMax

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Objetos da Simulação
        this.bola = new Bola(this)

        this.simObjetos = [
            this.bola
        ]

        this.dados = new Dados(this)

        this.reiniciar()
    }

    // Reiniciar a Simulação
    reiniciar() {
        // Simulação já acabou
        this.acabou = false

        this.novoTamanho()
        this.inputs = this.juntarValores()
        this.simObjetos.forEach((objeto) => objeto.reiniciar())
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
        if (this.acabou) return

        deltaTempo /= 1000
        deltaTempo /= this.resolucao

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