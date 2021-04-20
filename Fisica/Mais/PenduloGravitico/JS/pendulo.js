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
        this.reto = Math.PI / 2

        // Posição da Bola
        this.posicao = {
            x: this.fioPos.x + this.angSin * this.comp,
            y: this.fioPos.y + this.angCos * this.comp
        }

        this.velocidade = {angular: 0, x: 0, y: 0, abs: 0}
        this.aceleracao = {angular: 0, angularTemp: 0, x: 0, y: 0, abs: 0, temp:{}}

        // Peso
        this.peso = this.massa * this.g

        // Momento de Inércia
        this.inercia = this.massa * this.comp ** 2
    }

    // Passei para as grandezas angulares, pois dava resultados mais precisos em ângulos grandes, em vez de calcular as componentes em Ox e em Oy de todas as forças, com a ajuda de https://www.burakkanber.com/blog/physics-in-javascript-rigid-bodies-part-1-pendulum-clock/
    update(deltaTempo) {
        // Novo Ângulo
        this.ang += this.velocidade.angular * deltaTempo + 0.5 * this.aceleracao.angular * (deltaTempo ** 2)
        
        // Fazer cache dos valores Trignométricos
        this.angSin = Math.sin(this.ang)
        this.angCos = Math.cos(this.ang)
        this.angCosCalc = Math.cos(this.ang + this.reto)

        // Módulo da tensão a atuar na bola
        this.forcaCentripta = this.angCosCalc * this.peso * this.comp

        // Aceleração Nova
        this.aceleracao.angularTemp = this.forcaCentripta / this.inercia

        // Velocidade Angular, calculada com a média da aceleração atual e anterior
        this.velocidade.angular += (this.aceleracao.angular + this.aceleracao.angularTemp) / 2 * deltaTempo

        // Atualizar a aceleração
        this.aceleracao.angular = this.aceleracao.angularTemp

        // Posição da Bola
        this.posicao.x = this.fioPos.x + this.angSin * this.comp
        this.posicao.y = this.fioPos.y + this.angCos * this.comp


        // Calcular outros valores
        this.tensao = this.angCos * this.peso + this.massa * (this.velocidade.abs ** 2) / this.comp

        // Força Resultante
        this.resultante = {
            x: this.angSin * this.tensao,
            y: this.peso - this.angCos * this.tensao
        }
        
        // Aceleração atual da Bola
        this.aceleracao.temp = {
            x: this.resultante.x / this.massa,
            y: this.resultante.y / this.massa
        }

        // Velocidade da Bola, calculada com a média da aceleração atual e da última aceleração
        this.velocidade.x += (this.aceleracao.x + this.aceleracao.temp.x) / 2 * deltaTempo
        this.velocidade.y += (this.aceleracao.y + this.aceleracao.temp.y) / 2 * deltaTempo

        this.velocidade.abs = (this.velocidade.x ** 2 + this.velocidade.y ** 2) ** 0.5

        // Atualizar a aceleração
        this.aceleracao.x = this.aceleracao.temp.x
        this.aceleracao.y = this.aceleracao.temp.y

        this.aceleracao.abs = (this.aceleracao.x ** 2 + this.aceleracao.y ** 2) ** 0.5
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