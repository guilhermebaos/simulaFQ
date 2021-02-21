// Montagem única
export default class Montagem {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Altura Real da Simulação, em cm
        this.hSimCm = 350

        // Escala da Simulação
        this.escala = 100                   // De metros para cm

        // Definições da mesa
        this.mesa = {
            larguraCm: 10,
            perna1: 0.15,           // Posição das pernas 1 e 2, em relação ao
            perna2: 0.85,           // comprimento da mesa
            cor: 'gray'
        }

        // Definições da Rampa
        this.rampa = {
            largura: 2,
            cor: 'rgb(10, 100, 230)',
        }

        // Feixe laser da célula fotoelétrica
        this.laser = {
            raio: 2,
            cor: 'red'
        }

        // Definições da caixa de areia
        this.caixa = {
            larguraBordaCm: 10,
            corBorda: 'black',
            alturaAreiaCm: 10,
            corAreia: 'rgb(247, 229, 167)'
        }
        
        // Definições do Bloco
        this.esfera = {
            cor: 'rgb(255, 130, 35)'
        }
        
        this.reiniciar()
    }

    // Reiniciar a Bola
    reiniciar() {
        // Conversões de Unidades
        this.cmToPx = this.simula.altura / this.hSimCm
        this.pxToCm = this.hSimCm / this.simula.altura

        
        // Mesa
        this.mesa.largura = this.mesa.larguraCm * this.cmToPx
        
        // Rampa
        this.rampa.fim = this.simula.largura / 3,
        this.rampa.fimCm = this.rampa.fim * this.pxToCm,
        this.rampa.raio = this.simula.largura / 3,
        this.rampa.raioCm = this.rampa.raio * this.pxToCm,

        // Esfera
        this.esfera.raio = 10 * (this.simula.inputs.d / this.simula.inputs.dMax / 2) ** (1/3)
        this.esfera.raioCm = this.esfera.raio * this.pxToCm

        // Caixa
        this.caixa.larguraBorda = this.caixa.larguraBordaCm * this.cmToPx
        this.caixa.alturaAreia = this.caixa.alturaAreiaCm * this.cmToPx
        this.caixa.alturaBorda = this.simula.altura - 40

        // Inputs
        this.g = this.simula.inputs.g * this.escala
        this.hi = this.simula.inputs.hi * this.escala
        this.hl = this.simula.inputs.hl * this.escala

        // Ajustar as alturas com base no nível de areia da caixa
        this.hi += this.caixa.alturaAreiaCm + this.caixa.larguraBordaCm / 2
        this.hl += this.caixa.alturaAreiaCm + this.caixa.larguraBordaCm / 2

        // Calcular a altura da bola na rampa
        this.hiRampa = this.hi - this.hl

        // Quando é que a bola bate na areia
        this.yMaxEsfera = this.hSimCm - this.caixa.larguraBordaCm / 2 - this.caixa.alturaAreiaCm - this.mesa.larguraCm

        // Definições do desenho
        this.alturaMesa = (this.hSimCm - this.hl) / this.hSimCm * this.simula.altura
        this.alturaMesaCm = this.alturaMesa * this.pxToCm

        // Cinética
        this.posicao = {
            x: this.rampa.fimCm,
            y: this.alturaMesaCm - this.mesa.larguraCm,
            rampa: Math.asin((this.rampa.raioCm - this.hiRampa) / this.rampa.raioCm) * this.rampa.raioCm,
            rampaMax: Math.PI * this.rampa.raioCm  / 2
        }
        this.velocidade = {x: 0, y: 0, rampa: 0}
        this.aceleracao = {x: 0, y: this.g, rampa: 0}


        // .rampa refere-se ao eixo tangencial à rampa em cada ponto
    }

    update(deltaTempo) {
        // Cinética enquanto a bola está na rampa
        if (this.posicao.rampa < this.posicao.rampaMax) {
            // Ângulo já percorrido da rampa
            this.posicao.ang = this.posicao.rampa / this.rampa.raioCm
    
            this.aceleracao.rampa = Math.cos(this.posicao.ang) * this.g
    
            this.posicao.rampa += this.velocidade.rampa * deltaTempo + 0.5 * this.aceleracao.rampa * deltaTempo ** 2
    
            this.velocidade.rampa += this.aceleracao.rampa * deltaTempo
        }

        // Atingiu o chão
        else if (this.posicao.y >= this.yMaxEsfera) {
            this.posicao.y = this.yMaxEsfera
            return [undefined, this.posicao.x - this.rampa.fimCm]
        }
         
        // Cinética quando a bola está em lançamento horizontal
        else {
            this.posicao.x += this.velocidade.x * deltaTempo
            this.posicao.y += this.velocidade.y * deltaTempo

            this.velocidade.x = this.velocidade.rampa
            this.velocidade.y += this.aceleracao.y * deltaTempo

            return [this.velocidade.rampa, undefined]
        }
    }

    desenhar(ctx) {
        // Desenhar a mesa
        ctx.lineWidth = this.mesa.largura
        ctx.strokeStyle = this.mesa.cor
        ctx.beginPath()
        ctx.moveTo(-10, this.alturaMesa)
        ctx.lineTo(this.rampa.fim, this.alturaMesa)
        ctx.moveTo(this.rampa.fim * this.mesa.perna1, this.alturaMesa)
        ctx.lineTo(this.rampa.fim * this.mesa.perna1, this.simula.altura)
        ctx.moveTo(this.rampa.fim * this.mesa.perna2, this.alturaMesa)
        ctx.lineTo(this.rampa.fim * this.mesa.perna2, this.simula.altura)
        ctx.stroke()

        // Desenhar a rampa
        let centroRampa = {
            x: this.rampa.raio,
            y: this.alturaMesa - this.rampa.fim - this.mesa.largura / 2
        }

        ctx.lineWidth = this.rampa.largura
        ctx.strokeStyle = this.rampa.cor
        ctx.beginPath()
        ctx.arc(
            centroRampa.x,
            centroRampa.y,
            this.rampa.raio, 0.5 * Math.PI, Math.PI
        )
        ctx.stroke()

        // Desenhar o feixe laser da célula fotoelétrica
        ctx.fillStyle = this.laser.cor
        ctx.beginPath()
        ctx.arc(this.rampa.fim, this.alturaMesa - this.mesa.largura / 2 - this.esfera.raio, this.laser.raio, 0, 2 * Math.PI)
        ctx.fill()

        // Desenhar a caixa
        let xCaixa = {
            i: this.rampa.fim - this.caixa.larguraBorda / 2,
            f: this.simula.largura - this.caixa.larguraBorda / 2
        }

        ctx.lineWidth = this.caixa.larguraBorda
        ctx.strokeStyle = this.caixa.corBorda
        ctx.beginPath()
        ctx.moveTo(xCaixa.i, this.caixa.alturaBorda)
        ctx.lineTo(xCaixa.i, this.simula.altura)
        ctx.lineTo(xCaixa.f, this.simula.altura)
        ctx.lineTo(xCaixa.f, this.caixa.alturaBorda)
        ctx.stroke()

        // Desenhar a areia
        ctx.fillStyle = this.caixa.corAreia
        ctx.fillRect(
            xCaixa.i + this.caixa.larguraBorda / 2,
            this.simula.altura - this.caixa.larguraBorda / 2 - this.caixa.alturaAreia - this.mesa.largura,
            xCaixa.f - xCaixa.i - this.caixa.larguraBorda,
            this.caixa.alturaAreia + this.mesa.largura
        )

        // Desenhar a esfera
        
        // Desenhar a esfera quando está na rampa
        ctx.fillStyle = this.esfera.cor
        ctx.beginPath()
        if (this.posicao.rampa < this.posicao.rampaMax) {
            ctx.arc(
                centroRampa.x - Math.cos(this.posicao.ang) * this.rampa.raio + this.esfera.raio - 1,
                centroRampa.y + Math.sin(this.posicao.ang) * this.rampa.raio - this.esfera.raio + 1,
                this.esfera.raio, 0, 2 * Math.PI
            )
        }

        // Desenhar a esfera quando está em lançamento horizontal
        else {
            ctx.arc(
                this.posicao.x * this.cmToPx + this.esfera.raio,
                this.posicao.y * this.cmToPx,
                this.esfera.raio, 0, 2 * Math.PI
            )
        }
        ctx.fill()
    }
}