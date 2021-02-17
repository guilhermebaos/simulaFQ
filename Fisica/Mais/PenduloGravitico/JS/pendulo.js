export default class Pendulo {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições da Bola
        this.raio = 16
        this.cor = 'red'

        // Escala (agora, de metros para cm)
        this.escala = 100

        // Ponto de fixação do fio
        this.fioPos = {x: this.simula.largura / (2 * this.escala), y: 0}

        
        this.reiniciar()
    }

    reiniciar() {
        // Constantes
        this.massa = this.simula.inputs.massa
        this.g = this.simula.inputs.g
        this.comp = this.simula.inputs.comp

        // Ângulos
        this.ang = this.simula.inputs.ang
        this.angSin = Math.sin(this.ang)
        this.angCos = Math.cos(this.ang)

        // Posição da Bola
        this.posicao = {
            x: this.fioPos.x + this.angSin * this.comp,
            y: this.fioPos.y + this.angCos * this.comp
        }

        this.velocidade = {x: 0, y: 0, abs: 0}
    }

    update(deltaTempo) {
        // Módulo das forças a atuar na bola
        this.peso = this.massa * this.g
        this.tensao = this.angCos * this.peso + this.massa * (this.velocidade.abs ** 2) / this.comp

        // Força Resultante
        this.resultante = {
            x: this.angSin * this.tensao,
            y: this.peso - this.angCos * this.tensao
        }
        
        // Aceleração da Bola
        this.aceleracao = {
            x: this.resultante.x / this.massa,
            y: this.resultante.y / this.massa
        }

        this.aceleracao.abs = (this.aceleracao.x ** 2 + this.aceleracao.y ** 2) ** 0.5


        // Posição da Bola
        this.posicao.x += this.velocidade.x * deltaTempo + 0.5 * this.aceleracao.x * deltaTempo ** 2
        this.posicao.y += this.velocidade.y * deltaTempo + 0.5 * this.aceleracao.y * deltaTempo ** 2


        // Velocidade da Bola
        this.velocidade.x += this.aceleracao.x * deltaTempo
        this.velocidade.y += this.aceleracao.y * deltaTempo

        this.velocidade.abs = (this.velocidade.x ** 2 + this.velocidade.y ** 2) ** 0.5
        

        // Novo Ângulo
        let vetor1 = {x: 0, y: 1, abs: 1}
        let vetor2 = {
            x: this.posicao.x - this.fioPos.x,
            y: this.posicao.y - this.fioPos.y
        }
        vetor2.abs = (vetor2.x ** 2 + vetor2.y ** 2) ** 0.5

        this.angCos = (vetor1.y * vetor2.y) / (vetor1.abs * vetor2.abs)
        
        if (this.posicao.x > this.fioPos.x) {
            this.ang = - Math.acos(this.angCos)
        } else {
            this.ang = Math.acos(this.angCos)
        }
        this.angSin = Math.sin(this.ang)
    }

    desenhar(ctx) {
        // Desenhar o Fio
        ctx.beginPath()
        ctx.moveTo(this.fioPos.x * this.escala, this.fioPos.y * this.escala)
        ctx.lineTo(this.posicao.x * this.escala, this.posicao.y * this.escala)
        ctx.stroke()

        // Desenhar o Círculo no Ponto indicado pela posição
        ctx.fillStyle = this.cor
        ctx.beginPath()
        ctx.arc(
            this.posicao.x * this.escala,
            this.posicao.y * this.escala,
            this.raio * 2,
            0,
            2 * Math.PI
        )
        ctx.fill()
    }
}