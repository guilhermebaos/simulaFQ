export default class Esfera {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições da Bola
        this.raioPxMax = 20
        this.cor = 'rgb(255, 130, 35)'

        // Cores dos vetores
        this.corVetores = {
            velocidade: 'rgb(145, 200, 20)',
        }
        
        // Tamanho dos vetores
        this.tamanhoVetor = 0.1
        
        this.reiniciar()
    }

    reiniciar(start=false) {
        this.start = start

        // Constantes
        this.m = this.simula.inputs.m
        this.mMax = this.simula.inputs.mMax
        this.v = this.simula.inputs.v
        this.a = this.simula.inputs.a
        this.h = this.simula.inputs.h
        this.lSim = this.simula.inputs.lSim
        this.g = this.simula.inputs.g

        // Conversões
        this.pxToM = this.lSim / this.simula.largura
        this.mToPx = this.simula.largura / this.lSim

        this.hSim = this.simula.altura * this.pxToM

        // Raio da Bola
        this.raioPx = this.raioPxMax * (this.m / this.mMax) ** (1/3)
        this.raio = this.raioPx * this.pxToM

        // Posição da Bola
        this.posicao = {x: this.raio, y: this.hSim - this.h - this.raio}

        this.altura = this.h

        this.velocidade = {x: this.v * Math.cos(this.a), y: -this.v * Math.sin(this.a)}
        this.velocidade.abs = (this.velocidade.x ** 2 + this.velocidade.y ** 2)**0.5

        this.aceleracao = {x: 0, y: this.g}
    }

    update(deltaTempo) {
        if (!this.start) return

        this.posicao.x += this.velocidade.x * deltaTempo
        this.posicao.y += this.velocidade.y * deltaTempo + 0.5 * this.aceleracao.y * deltaTempo ** 2

        this.velocidade.y += this.aceleracao.y * deltaTempo
        this.velocidade.abs = (this.velocidade.x ** 2 + this.velocidade.y ** 2)**0.5

        this.altura = this.hSim - this.posicao.y - this.raio

        if (this.altura < 0) {
            this.posicao.y = this.hSim - this.raio
            this.velocidade.abs = 0
            this.start = false
            this.simula.start = false
        }
    }

    desenhar(ctx) {
        this.posicaoPx = {
            x: this.posicao.x * this.mToPx,
            y: this.posicao.y * this.mToPx
        }
        ctx.fillStyle = this.cor
        ctx.beginPath()
        ctx.arc(this.posicaoPx.x, this.posicaoPx.y, this.raioPx, 0, 2 * Math.PI)
        ctx.fill()

        if (this.velocidade.abs > 1e-03) {
            this.velocidadePx = {
                x: this.velocidade.x * this.mToPx * this.tamanhoVetor,
                y: this.velocidade.y * this.mToPx * this.tamanhoVetor
            }
            this.simula.desenharVetor(ctx, this.posicaoPx.x, this.posicaoPx.y - 3 * this.raioPx, this.posicaoPx.x + this.velocidadePx.x, this.posicaoPx.y - 3 * this.raioPx + this.velocidadePx.y, this.corVetores.velocidade)
        }
    }
}