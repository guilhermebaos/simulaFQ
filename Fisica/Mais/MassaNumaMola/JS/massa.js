export default class Massa {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições da Massa
        this.larguraPx = 140
        this.alturaPx = 80
        this.cor = 'rgb(255, 130, 35)'

        // Cores dos vetores
        this.corVetores = {
            velocidade: 'rgb(145, 200, 20)',
            aceleracao: 'black'
        }

        // Escala do ecrã, em relação ao tamanho máximo da mola
        this.escala = 7
        
        // Tamanho dos vetores
        this.tamanhoVetor = 0.75

        this.reiniciar()
    }

    reiniciar(start=false) {
        this.start = start

        // Constantes
        this.m = this.simula.inputs.m
        this.mMax = this.simula.inputs.mMax
        this.k = this.simula.inputs.k
        this.l = this.simula.inputs.l
        this.xI = this.simula.inputs.xInicial
        this.xImax = this.simula.inputs.xInicialMax
        this.g = this.simula.inputs.g
        
        // Conversões
        this.hSim = this.xImax * this.escala

        this.pxToM = this.hSim / this.simula.altura
        this.mToPx = this.simula.altura / this.hSim

        this.lSim = this.simula.largura * this.pxToM

        // Dinâmica inicial da massa
        this.posicao = this.xI
        this.velocidade = 0
        this.fe = - this.k *(this.posicao - this.l)
        this.aceleracao = (this.g + this.fe) / this.m

        this.posicaoEquilibrio = this.xI + this.g / this.k

        this.alturaMinima = this.xI + (this.posicaoEquilibrio - this.xI) * 2
        this.altura = this.alturaMinima - this.posicao
        
        this.posicaoPx = this.posicao * this.mToPx
    }

    update(deltaTempo) {
        if (!this.start) return

        this.posicao += this.velocidade * deltaTempo + 0.5 * this.aceleracao * deltaTempo ** 2
        this.velocidade += -this.k * (this.posicao - this.posicaoEquilibrio) / this.m * deltaTempo
        // this.velocidade += this.aceleracao * deltaTempo

        this.fe = - this.k *(this.posicao - this.l)
        this.aceleracao = (this.g + this.fe) / this.m
        
        this.altura = this.alturaMinima - this.posicao
    }

    desenhar(ctx) {
        this.posicaoPx = this.posicao * this.mToPx

        ctx.fillStyle = this.cor
        ctx.fillRect(
            0.5 * (this.simula.largura - this.larguraPx),
            this.posicaoPx,
            this.larguraPx,
            this.alturaPx
            )
        
        this.posicaoVetores = {
            esquerda: 0.5 * this.simula.largura - this.larguraPx,
            direita: 0.5 * this.simula.largura + this.larguraPx
        }
        if (Math.abs(this.velocidade) > 1e-03) {
            this.velocidadePx = this.velocidade * this.mToPx * this.tamanhoVetor

            this.simula.desenharVetor(ctx, this.posicaoVetores.esquerda, this.posicaoPx, this.posicaoVetores.esquerda, this.posicaoPx + this.velocidadePx, this.corVetores.velocidade)
        }
        if (Math.abs(this.aceleracao) > 1e-03 && this.start) {
            this.aceleracaoPx = this.aceleracao * this.mToPx * this.tamanhoVetor

            this.simula.desenharVetor(ctx, this.posicaoVetores.direita, this.posicaoPx, this.posicaoVetores.direita, this.posicaoPx + this.aceleracaoPx, this.corVetores.aceleracao)
        }
    }
}