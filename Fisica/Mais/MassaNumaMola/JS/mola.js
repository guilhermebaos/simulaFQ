export default class Mola {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Massa
        this.massa = this.simula.massa

        // Definições da Mola
        this.x0 = this.simula.largura / 2
        this.y0 = 0
        this.xFinal = this.simula.largura / 2
        this.yFinal = this.massa.posicao
        this.espirais = 5
        this.largura = 50
        this.offset = 10
        this.cor1 = 'rgb(0, 120, 255)'
        this.cor2 = 'rgb(10, 100, 230)'
        this.larguraLinha = 6
    }

    desenhar(ctx) {
        this.yFinal = this.massa.posicaoPx

        this.simula.desenharMola(
            ctx,
            this.x0, this.y0,
            this.xFinal, this.yFinal,
            this.espirais, this.largura, this.offset,
            this.cor1, this.cor2,
            this.larguraLinha
        )
    }
}