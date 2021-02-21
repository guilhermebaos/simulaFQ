// Montagem única
export default class Montagem {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Várias escalas da Simulação
        this.escala = 100                   // De metros para cm

        // Definições da Rampa
        this.rampa = {
            largura: 10,
            fim: 0.9,                   // Posição x do início da rampa
            desfazamento: 0.1,
            cor: 'rgb(10, 100, 230)',   // em função do tamanho do canvas
        }

        // Definições do Carrinho
        this.carrinho = {
            largura: 100,
            altura: 50,
            cor: 'rgb(255, 130, 35)',

            // Em função da largura do Carrinho
            raioRodas: 0.12,
            distRodas: 0.3,
            corRodas: 'black',
        }

        // Definições da Tira opaca
        this.tira = {
            altura: 0.60,
            cor: 'grey'
        }

        // Definições do laser
        this.laser = {
            raio: 2,
            cor: 'red'
        }

        // Parede no fim da rampa
        this.parede = {
            largura: 20,
            altura: 2,
            cor: 'black'
        }

        // Início do eixo Ox, em função da largura do carrinho
        this.OxCm = 0.75
        
        this.reiniciar()
    }

    // Reiniciar a Simulação
    reiniciar() {
        // Já devolveu a velocidade de passagem pela célula?
        this.devolveu = false

        // Altura Real da Simulação, em cm
        this.hSimCm = this.simula.inputs.dMax * 0.65

        // Conversões de Unidades
        this.cmToPx = this.simula.altura / this.hSimCm
        this.pxToCm = this.hSimCm / this.simula.altura

        // Inputs
        this.g = this.simula.inputs.g * this.escala
        this.m = this.simula.inputs.m
        this.mMax = this.simula.inputs.mMax
        this.d = this.simula.inputs.d
        this.dMax = this.simula.inputs.dMax
        this.a = this.simula.inputs.a
        this.fa = this.simula.inputs.fa * this.escala
        this.l = this.simula.inputs.l

        // Razões trignométricas do ângulo
        this.aTrig = {
            sin: Math.sin(this.a),
            cos: Math.cos(this.a),
            tan: Math.tan(this.a),
        }


        // Rampa
        this.rampa.desfazamento *= this.simula.largura, // Ajusta a rampa ao ecrã
        this.rampa.fimPx = {
            x: this.rampa.fim * this.simula.largura + this.rampa.desfazamento * this.aTrig.cos,
            xReal: this.rampa.fim * this.simula.largura,
            y: this.simula.altura + this.rampa.desfazamento * this.aTrig.sin
        }
        this.rampa.inicioPx = {
            x: - this.rampa.desfazamento * this.aTrig.cos,
            y: this.simula.altura - this.aTrig.tan * this.simula.largura * this.rampa.fim - this.rampa.desfazamento * this.aTrig.sin,
        }

        // Carrinho
        this.carrinho.largura *= (this.m / this.mMax) ** (1/3)
        this.carrinho.altura *= (this.m / this.mMax) ** (1/3)

        this.carrinho.larguraCm = this.carrinho.largura * this.pxToCm
        
        this.carrinho.delta = {
            x: this.carrinho.largura * this.aTrig.cos,
            y: this.carrinho.largura * this.aTrig.sin
        }

        this.carrinho.raioRodas *= this.carrinho.largura
        this.carrinho.distRodas *= this.carrinho.largura

        // Origem do eixo Ox
        this.OxCm *= this.carrinho.larguraCm + this.parede.largura * this.pxToCm 
        this.OxPx = this.OxCm * this.cmToPx
        
        // Deslocamento perpendicular (à rampa) do carrinho
        this.carrinho.dp = {
            x: +this.aTrig.sin * (this.carrinho.altura / 2 + this.rampa.largura / 2 + this.carrinho.raioRodas),
            y: -this.aTrig.cos * (this.carrinho.altura / 2 + this.rampa.largura / 2 + this.carrinho.raioRodas)
        }

        // Tira opaca
        this.tira.largura = this.l * this.cmToPx
        this.tira.altura *= this.carrinho.altura
        this.tira.delta = {
            x: this.tira.altura * this.aTrig.sin,
            y: -this.tira.altura * this.aTrig.cos
        }

        // Laser
        this.laser.x = this.rampa.fimPx.xReal - this.OxPx * this.aTrig.cos + this.carrinho.dp.x + this.aTrig.sin * (this.carrinho.altura / 2 + this.tira.altura / 2)
        this.laser.y = this.simula.altura - this.OxPx * this.aTrig.sin + this.carrinho.dp.y - this.aTrig.cos * (this.carrinho.altura / 2 + this.tira.altura / 2)

        // Parede
        this.parede.larguraCm = this.parede.largura * this.pxToCm
        this.parede.altura *= this.carrinho.altura
        this.parede.x = this.rampa.fimPx.xReal + this.aTrig.sin * (this.rampa.largura / 2)
        this.parede.y = this.simula.altura - this.aTrig.cos * (this.rampa.largura / 2)
        this.parede.delta = {
            x: this.parede.altura * this.aTrig.sin,
            y: -this.parede.altura * this.aTrig.cos
        }

        // Cinética
        this.posicao = this.d + this.OxCm
        this.velocidade = 0
        this.aceleracao = -this.g * this.aTrig.sin + this.fa / this.m

        this.posicaoMin = this.carrinho.larguraCm / 2 + this.parede.larguraCm / 2
    }

    update(deltaTempo) {
        if (this.posicao <= this.posicaoMin) {
            this.posicao = this.posicaoMin
        } else {
            this.posicao += this.velocidade * deltaTempo + 0.5 * this.aceleracao * deltaTempo ** 2
            this.velocidade += this.aceleracao * deltaTempo

            if (this.posicao <= this.OxCm && !this.devolveu) {
                this.devolveu = true
                return Math.abs(this.velocidade)
            }
        }
    }

    desenhar(ctx) {
        // Plano Inclinado
        ctx.lineWidth = this.rampa.largura
        ctx.strokeStyle = this.rampa.cor
        ctx.beginPath()
        ctx.moveTo(this.rampa.inicioPx.x, this.rampa.inicioPx.y)
        ctx.lineTo(this.rampa.fimPx.x, this.rampa.fimPx.y)
        ctx.stroke()

        // Posição do carrinho
        this.posicaoPx = this.posicao * this.cmToPx + this.carrinho.largura / 2
        this.carrinho.x = this.rampa.fimPx.xReal - this.posicaoPx * this.aTrig.cos + this.carrinho.dp.x
        this.carrinho.y = this.simula.altura - this.posicaoPx * this.aTrig.sin + this.carrinho.dp.y

        this.carrinho.maxX = this.carrinho.x + this.carrinho.diagonal * this.aTrig.cos
        this.carrinho.maxY = this.carrinho.y + this.carrinho.diagonal * this.aTrig.sin

        // Desenhar o Carrinho no local indicado pela posição
        ctx.lineWidth = this.carrinho.altura
        ctx.strokeStyle = this.carrinho.cor
        ctx.beginPath()
        ctx.moveTo(this.carrinho.x, this.carrinho.y)
        ctx.lineTo(this.carrinho.x + this.carrinho.delta.x, this.carrinho.y + this.carrinho.delta.y)
        ctx.stroke()

        // Ajustar as coordenadas para o centro do carrinho
        this.posicaoPx -= this.carrinho.largura / 2
        this.carrinho.x = this.rampa.fimPx.xReal - this.posicaoPx * this.aTrig.cos + this.carrinho.dp.x
        this.carrinho.y = this.simula.altura - this.posicaoPx * this.aTrig.sin + this.carrinho.dp.y

        // Desenhar as rodas do carrinho
        ctx.fillStyle = this.carrinho.corRodas
        ctx.beginPath()
        ctx.arc(
            this.carrinho.x - this.aTrig.cos * this.carrinho.distRodas - this.aTrig.sin * this.carrinho.altura / 2,
            this.carrinho.y - this.aTrig.sin * this.carrinho.distRodas + this.aTrig.cos * this.carrinho.altura / 2,
            this.carrinho.raioRodas, 0, 2 * Math.PI
        )
        
        ctx.arc(
            this.carrinho.x + this.aTrig.cos * this.carrinho.distRodas - this.aTrig.sin * this.carrinho.altura / 2,
            this.carrinho.y + this.aTrig.sin * this.carrinho.distRodas + this.aTrig.cos * this.carrinho.altura / 2,
            this.carrinho.raioRodas, 0, 2 * Math.PI
        )
        ctx.fill()

        // Ajustar as coordenadas para o centro topo do carrinho
        this.carrinho.x += this.aTrig.sin * this.carrinho.altura / 2
        this.carrinho.y += -this.aTrig.cos * this.carrinho.altura / 2

        // Desenhar a tira opaca
        ctx.lineWidth = this.tira.largura
        ctx.strokeStyle = this.tira.cor
        ctx.beginPath()
        ctx.moveTo(this.carrinho.x, this.carrinho.y)
        ctx.lineTo(this.carrinho.x + this.tira.delta.x, this.carrinho.y + this.tira.delta.y)
        ctx.stroke()


        // Desenhar o laser
        ctx.fillStyle = this.laser.cor
        ctx.beginPath()
        ctx.arc(this.laser.x, this.laser.y, this.laser.raio, 0, 2 * Math.PI)
        ctx.fill()

        // Desenhar a parede
        ctx.lineWidth = this.parede.largura
        ctx.strokeStyle = this.parede.cor
        ctx.beginPath()
        ctx.moveTo(this.parede.x, this.parede.y)
        ctx.lineTo(this.parede.x + this.parede.delta.x, this.parede.y + this.parede.delta.y)
        ctx.stroke()

        /*

        // Desenhar o Vetor Velocidade do Carrinho
        if (this.velocidade != 0) {
            let posVetor = 0.8

            this.simula.desenharVetor(xCarrinho, yCarrinho * posVetor, xCarrinho + this.velocidade * this.tamanhoVetor, yCarrinho * posVetor, this.corVetores.velocidade)
        }
        */
    }
}