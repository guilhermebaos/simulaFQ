import Snail from './snail.js'
import Quadrado from './quadrado.js'

// Classe que vai executar a Simulação
export default class Simula {
    constructor(canvasSnail, canvasQuadrado, resolucao) {
        this.canvasSnail = canvasSnail
        this.canvasQuadrado = canvasQuadrado

        // Resolução (Tamanho do deltaT) e Updates por Frame
        this.resolucao = resolucao

        // Tamanho da Simulação
        this.novoTamanho()

        // Inputs usados para a Simulação
        this.inputs = this.juntarValores()

        // Parâmetros dos Caracóis
        this.cores = ['red', 'rgb(10, 100, 230)', 'rgb(145, 200, 20)', 'black']
        this.start = {
            x: (this.largura - this.inputs.d) / 2,
            y: 10
        }
        
        // Criar os Caracóis
        this.reiniciar()
    }

    reiniciar() {
        this.inputs = this.juntarValores()

        // Calcular as coordenadas dos caracóis
        this.coords = [
            [this.start.x, this.start.y],
            [this.start.x + this.inputs.d, this.start.y],
            [this.start.x + this.inputs.d, this.start.y + this.inputs.d],
            [this.start.x, this.start.y + this.inputs.d]
        ]

        // Criar os caracóis, tal que tenham como alvo o caracol seguinte
        this.snails = []
        for(let n = 0; n < 4; n++) {
            let target = n > 0 ? this.snails[n - 1] : undefined
        
            this.snails.push(new Snail(
                this.coords[n][0],
                this.coords[n][1],
                this.inputs.v,
                target,
                this.cores[n]))
        }
        this.snails[0].alvo = this.snails[3]

        // Quadrado que une os caracóis
        this.oQuadrado = new Quadrado(this.snails, 'rgb(255, 130, 35)')
        
        this.novoTamanho()
    }

    novoTamanho() {
        this.largura = this.canvasSnail.width
        this.altura = this.canvasSnail.height
    }

    // Juntar os valores para serem usados pela Simulação
    juntarValores() {
        return {
            v: rapidez.value / 1,           // Módulo da velocidade dos caracóis
            d: distInicial.value / 1,       // Distância entre os caracóis
            desenharQuadrado: desenharQuadrado.checked,         // Desenhar o Quadrado
            apagarQuadrado: apagarQuadrado.checked            // Apagar Quadrado
        }
    }

    update(deltaTempo) {
        // Parar se os caracóis estiverem muito próximos uns dos outros
        let mySnail = this.snails[0]
        if (mySnail.direction) if (mySnail.direction.x ** 2 + mySnail.direction.y ** 2 < 1) {
            this.inputs.desenharQuadrado = false
            return
        }

        for(let i in this.snails) {
            this.snails[i].update(deltaTempo)
        }
    }

    desenhar(ctxSnail, ctxQuadrado) {
        for(let i in this.snails) {
            this.snails[i].draw(ctxSnail)
        }
        
        if (this.inputs.desenharQuadrado) {
            if (this.inputs.apagarQuadrado) {
                ctxQuadrado.clearRect(0, 0, this.canvasQuadrado.width, this.canvasQuadrado.height)
            }
            this.oQuadrado.draw(ctxQuadrado)
        }
    }
}