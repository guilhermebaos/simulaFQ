export default class Bola {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições da Bola
        this.raio = 30
        this.cor = 'rgb(255, 130, 35)'

        // Escala (agora, de cm para metros)
        this.escala = 100

        // Ponto de fixação do fio
        this.fioPos = {x: this.simula.largura / (2 * this.escala), y: 0}
        
        this.reiniciar()
    }

    // Reiniciar a Bola
    reiniciar() {
        // Constantes
        this.hi = this.simula.inputs.hi
        this.e = this.simula.inputs.e
        this.g = this.simula.inputs.g

        // Posição Inicial da Bola
        this.posicao = {
            x: this.simula.largura / (2 * this.escala),
            altura: this.hi
        }

        this.velocidade = {x: 0, y: 0, abs: 0}
        this.aceleracao = {x: 0, y: -this.g, abs: this.g}
    }

    // Novo tamanho do Canvas
    novoTamanho() {
        // Posição Inicial da Bola
        this.posicao.x = this.simula.largura / (2 * this.escala)
    }

    update(deltaTempo) {
        // Colisão com o chão
        if (this.posicao.altura < 0 && this.velocidade.y < 0) {
            this.velocidade.y *= -this.e
        }
        
        // Posição da Bola
        this.posicao.altura += this.velocidade.y * deltaTempo + 0.5 * this.aceleracao.y * deltaTempo ** 2


        // Velocidade da Bola
        this.velocidade.y += this.aceleracao.y * deltaTempo

        this.velocidade.abs = (this.velocidade.x ** 2 + this.velocidade.y ** 2) ** 0.5
    }

    desenhar(ctx) {
        // Fazer a altura em proporção ao tamanho do Canvas
        this.alturaCanvas = (this.posicao.altura * this.escala) * this.simula.altura / this.simula.hiMax

        // Desenhar o Círculo no Ponto indicado pela posição
        ctx.fillStyle = this.cor
        ctx.beginPath()
        ctx.arc(
            this.posicao.x * this.escala,
            this.simula.altura - this.alturaCanvas - this.raio,
            this.raio,
            0,
            2 * Math.PI
        )
        ctx.fill()
    }
}