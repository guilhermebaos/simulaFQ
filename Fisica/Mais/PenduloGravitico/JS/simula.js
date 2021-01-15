import Pendulo from '../JS/pendulo.js'
import Dados from '../JS/dados.js'

const ESTADOS = {
    EM_PROGRESSO: 0,
    PAUSA: 1
}

// Classe que vai executar a Simulação
export default class Simula {
    constructor(canvas, resolucao, updates_por_frame) {
        this.canvas = canvas

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao
        this.updates_por_frame = updates_por_frame

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Estado da Simulação
        this.estado = ESTADOS.EM_PROGRESSO

        // Objetos da Simulação
        this.pendulo = new Pendulo(this)

        this.simObjetos = [
            this.pendulo
        ]

        this.dados = new Dados(this)
    }

    reiniciar() {
        this.inputs = this.juntarValores()
        this.pendulo.reiniciar()
        this.dados.reiniciar()
    }

    novoTamanho() {
        this.largura = this.canvas.width
        this.altura = this.canvas.height
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            massa: massaPendulo.value / 1000,           // Massa em kg
            comp: comprimentoFio.value / 100,           // Comprimento em cm
            g: aGravitica.value / 100,                  // g em m/s^2
            ang: - angMax.value / 10 * (Math.PI / 180),   // Ângulo em Radianos
            tempoMax: tempoMax.value / 1
        }
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

        deltaTempo /= 1000
        deltaTempo /= this.resolucao

        this.simObjetos.forEach((objeto) => objeto.update(deltaTempo))

        if (this.dados.update(deltaTempo)) {
            return this.dados.dadosObtidos
        } else {
            return this.dados.tempoFinal - this.dados.tempo
        }
    }

    desenhar(ctx) {
        this.simObjetos.forEach((objeto) => objeto.desenhar(ctx))

        if (this.estado == ESTADOS.PAUSA) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
            ctx.fillRect(0, 0, this.largura, this.altura)
        }
    }
}