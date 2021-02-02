// Montagem 2
export default class Montagem2 {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Definições do Bloco
        this.bloco = {
            posXi: 10,
            largura: 150 * (this.simula.inputs.m / this.simula.inputs.mMax) ** (1/3),
            altura: 75 * (this.simula.inputs.m / this.simula.inputs.mMax) ** (1/3),
            cor: 'rgb(255, 130, 35)'
        }

        // Definições do Plano Horizontal
        this.plano = {
            posY: this.simula.altura * 0.75,
            altura: 20,
            largura: 0.85,              // Em proporção à largura do canvas
            cor: 'rgb(10, 100, 230)'
        }

        // Definições da Roldana
        this.roldana = {
            raio: 15,
            cor: 'black'
        }

        // Definições do Fio
        this.fio = {
            largura: 2,
            comprimento: 50,
            cor: 'black'
        }

        // Deginições do Recipiente
        this.recipiente = {
            largura: 50,
            altura: 90,
            larguraBorder: 4,
            corBorder: 'black',
            corBackground: 'rgba(0, 0, 0, 0.05)',
            corAreia: 'yellow',
            areiaMax: this.simula.inputVariavel.massaAreia.max / 1000
        }

        // Cores dos vetores
        this.corVetores = {
            forca: 'rgb(0, 120, 255)',
            fa: 'black',
            velocidade: 'rgb(145, 200, 20)',
            aceleracao: 'rgb(250, 70, 10)',
        }

        // Multiplicador do tamanho dos vetores
        this.tamanhoVetor = 10

        // Zoom Out
        this.zoomOut = 1
        
        this.reiniciar()
    }

    // Reiniciar a Bola
    reiniciar() {
        // Inputs
        this.g = this.simula.inputs.g
        this.m = this.simula.inputs.m
        this.cae = this.simula.inputs.cae
        this.cac = this.simula.inputs.cac

        // Valores Constantes
        this.normal = this.m * this.g
        this.faemax = this.normal * this.cae
        this.fac = this.normal * this.cac

        this.xFimPlano = this.simula.largura * this.plano.largura

        // Cinemática inicial
        this.posicao = this.bloco.posXi
        this.velocidade = 0
        this.aceleracao = 0
    }

    update(deltaTempo) {
        // Massa Areia
        this.massaAreia = this.simula.inputVariavel.massaAreia.value / 1000

        // A Velocidade e a Aceleração não podem ser negativas
        if (this.velocidade < 0) {
            this.velocidade = 0
        }
        if (this.aceleracao < 0) {
            this.aceleracao = 0
        }

        // Determinar a Força de Atrito
        if (this.velocidade > 0) {
            this.fa = - this.fac
            this.aceleracao = (this.massaAreia * this.g + this.fa) / (this.m + this.massaAreia)
        } else if (this.massaAreia <= this.cae * this.m) {
            this.fa = -this.massaAreia * this.g
            this.aceleracao = 0
        } else {
            this.fa = - this.faemax
            this.aceleracao = (this.massaAreia * this.g + this.fa) / (this.m + this.massaAreia)
        }

        this.fr = this.m * this.aceleracao
        this.forca = this.fr - this.fa

        this.posicao += this.velocidade * deltaTempo + 0.5 * this.aceleracao * deltaTempo ** 2

        this.velocidade += this.aceleracao * deltaTempo

        // O Bloco colide com a roldana
        if (this.posicao + this.bloco.largura >= this.xFimPlano) {
            this.velocidade = 0
            this.aceleracao = 0
        }
    }

    desenhar(ctx) {
        // Desenhar o plano
        ctx.fillStyle = this.plano.cor
        ctx.fillRect(0, this.simula.altura - this.plano.posY, this.simula.largura * 0.85, this.plano.altura)

        // Desenhar o Bloco no local indicado pela posição
        let xBloco = this.posicao / this.zoomOut
        let yBloco = this.simula.altura - this.plano.posY - this.bloco.altura

        ctx.fillStyle = this.bloco.cor
        ctx.fillRect(xBloco, yBloco, this.bloco.largura, this.bloco.altura)

        // Valores para o resto do Canvas
        xBloco += this.bloco.largura / 2
        yBloco += this.bloco.altura / 2

        let xRoldana = this.xFimPlano + this.roldana.raio
        let yRoldana = yBloco + this.roldana.raio

        // Desenhar a Roldana
        ctx.fillStyle = this.roldana.cor
        ctx.beginPath()
        ctx.arc(xRoldana, yRoldana, this.roldana.raio, 0, 2 * Math.PI)
        ctx.fill()

        // Desenhar o Fio
        let xFimFio = xRoldana + this.roldana.raio
        let yFimFio = yBloco + this.fio.comprimento + this.posicao

        ctx.strokeStyle = this.fio.cor
        ctx.lineWidth = this.fio.largura
        ctx.beginPath()
        ctx.moveTo(xBloco, yBloco)
        ctx.lineTo(xRoldana, yBloco)
        ctx.arc(xRoldana, yRoldana, this.roldana.raio, -0.5 * Math.PI, 0)
        ctx.moveTo(this.xFimPlano + 2 * this.roldana.raio, yRoldana)
        ctx.lineTo(xFimFio, yFimFio)
        ctx.stroke()

        // Desenhar o Recipiente
        let x0Recipiente = xFimFio - this.recipiente.largura / 2 - this.recipiente.larguraBorder
        let yFimRecipiente = yFimFio + this.recipiente.altura

        ctx.strokeStyle = this.recipiente.corBorder
        ctx.lineWidth = this.recipiente.larguraBorder
        ctx.beginPath()
        ctx.moveTo(x0Recipiente, yFimFio)
        ctx.lineTo(x0Recipiente, yFimRecipiente)
        ctx.lineTo(xFimFio + this.recipiente.largura / 2 + this.recipiente.larguraBorder, yFimRecipiente)
        ctx.lineTo(xFimFio + this.recipiente.largura / 2 + this.recipiente.larguraBorder, yFimFio)
        ctx.stroke()
        
        ctx.fillStyle = this.recipiente.corBackground
        ctx.fillRect(x0Recipiente - 1, yFimFio, this.recipiente.largura + this.recipiente.larguraBorder * 2 + 1, this.recipiente.altura)
        
        // Areia no Recipiente
        ctx.fillStyle = this.recipiente.corAreia
        ctx.fillRect(x0Recipiente + this.recipiente.larguraBorder / 2, yFimRecipiente - this.recipiente.altura * (this.massaAreia / this.recipiente.areiaMax) - this.recipiente.larguraBorder / 2, this.recipiente.largura + this.recipiente.larguraBorder, this.recipiente.altura * (this.massaAreia / this.recipiente.areiaMax))



        // Desenhar os vetores Força, Fa e Aceleração

        if (this.forca != 0) {
            this.simula.desenharVetor(xBloco, yBloco, xBloco + this.forca * this.tamanhoVetor, yBloco, this.corVetores.forca)
        }
        if (this.fa != 0) {
            this.simula.desenharVetor(xBloco, yBloco, xBloco + this.fa * this.tamanhoVetor, yBloco, this.corVetores.fa)
        }
        if (this.velocidade != 0) {
            let posVetor = 0.8

            this.simula.desenharVetor(xBloco, yBloco * posVetor, xBloco + this.velocidade * this.tamanhoVetor, yBloco * posVetor, this.corVetores.velocidade)
        }
        if (this.aceleracao != 0) {
            let posVetor = 0.8

            this.simula.desenharVetor(xBloco, yBloco * posVetor, xBloco + this.aceleracao * this.tamanhoVetor, yBloco * posVetor, this.corVetores.aceleracao)
        }
    }
}