export default class Bola {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições da Bola
        this.bola = {
            cor: 'rgb(255, 130, 35)'
        }

        // Lasers
        this.lasers = {
            largura: 2,
            cor:'red'
        }

        // Escala (agora, de cm para metros)
        this.escala = 100
        
        this.reiniciar()
    }

    // Reiniciar a Bola
    reiniciar(start=false) {
        this.hSimCm = this.simula.inputs.hSimCm

        // Conversões de Unidades
        this.cmToPx = this.simula.altura / this.hSimCm
        this.pxToCm = this.hSimCm / this.simula.altura


        // Inputs
        this.m = this.simula.inputs.m
        this.r = this.simula.inputs.r
        this.rMax = this.simula.inputs.rMax
        this.d = this.simula.inputs.d
        
        // Constantes
        this.g = this.simula.constantes.g
        this.densidadeAr = this.simula.constantes.densidadeAr
        this.CRar = this.simula.constantes.CRar

        // Bola
        this.bola.raio = this.r * this.cmToPx
        this.bola.area = Math.PI * (this.r / 100) ** 2

        // Lasers
        this.lasers.pos1cm = this.rMax * 2
        this.lasers.pos2cm = this.lasers.pos1cm + this.d

        this.lasers.pos1 = this.lasers.pos1cm * this.cmToPx
        this.lasers.pos2 = this.lasers.pos2cm * this.cmToPx 

        // Forças
        this.peso = this.g * this.m
        this.Rar = 0
        this.fr = this.peso

        // Cinética
        this.posicao = {
            x: this.simula.largura / 2,
            y: this.rMax * 2 - this.r
        }
        this.velocidade = 0
        this.aceleracao = (this.fr / this.m) * this.escala

        this.tempo = 0

        // Largar a bola
        this.start = start

        // Tempo no qual a bola começou a intersetar o feixe inferior
        this.inicioDeltaT2 = undefined

        // Os valores já foram devolvidos
        this.devolvidos = false
    }

    update(deltaTempo) {
        if (!this.start) return

        if (this.simula.calcularRar) {
            this.Rar = 0.5 * this.densidadeAr * this.CRar * this.bola.area * (this.velocidade / 100) ** 2
        } else {
            this.Rar = 0
        }
        
        this.fr = this.peso - this.Rar

        this.aceleracao = (this.fr / this.m) * this.escala

        this.posicao.y += this.velocidade * deltaTempo + 0.5 * this.aceleracao * deltaTempo ** 2

        this.velocidade += this.aceleracao * deltaTempo

        this.tempo += deltaTempo

        if (this.posicao.y + this.r >= this.lasers.pos2cm && !this.devolvidos) {
            this.devolvidos = true
            this.inicioDeltaT2 = this.tempo
            return [undefined, this.tempo]
        }
        if  (this.posicao.y - this.r >= this.lasers.pos2cm && this.inicioDeltaT2) {
            this.deltaT2 = this.tempo - this.inicioDeltaT2
            this.inicioDeltaT2 = undefined
            return [this.deltaT2, undefined]
        }
    }

    desenhar(ctx) {
        // Desenhar os lasers
        ctx.fillStyle = this.lasers.cor
        ctx.fillRect(0, this.lasers.pos1, this.simula.largura, this.lasers.largura)
        ctx.fillRect(0, this.lasers.pos2, this.simula.largura, this.lasers.largura)

        // Desenhar a Esfera
        ctx.fillStyle = this.bola.cor
        ctx.beginPath()
        ctx.arc(
            this.posicao.x,
            this.posicao.y * this.cmToPx,
            this.bola.raio,
            0, 2 * Math.PI
        )
        ctx.fill()
    }
}