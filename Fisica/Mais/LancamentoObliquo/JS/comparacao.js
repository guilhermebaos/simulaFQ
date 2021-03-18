export default class Comparacao {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Tamanhos para comparar, em metros
        this.tamanhos = {
            futebol: {x: 100, cor: 'rgb(0, 154, 23)', legenda: 'Campo de Futebol - 100m'},
            evereste: {x: 8848, cor: 'rgb(160, 82, 45)', legenda: 'Altura do Evereste - 8848m'},
            maratona: {x: 42195, cor: 'red', legenda: 'Maratona - 42195m'},
            dist: {x: 80000, cor: 'black', legenda: 'Distância do Porto a Viseu - 80km'}
        }

        // Posição dos traços de comparação, em função da sua largura
        this.posTamanhos = 0.5

        // Largura Tamanhos
        this.largura = 5
        
        this.reiniciar()
    }

    reiniciar() {
        this.lSim = this.simula.inputs.lSim
        this.paddingTamanhos = this.simula.esfera.raioPxMax + 2

        // Conversões
        this.pxToM = this.lSim / this.simula.largura
        this.mToPx = this.simula.largura / this.lSim


        for (let key in this.tamanhos) {
            this.tamanhos[key].xPx = this.tamanhos[key].x * this.mToPx
            this.tamanhos[key].yPx = this.simula.altura - this.tamanhos[key].x * this.mToPx * this.posTamanhos
        }
    }

    desenhar(ctx) {
        for (let key in this.tamanhos) {
            let objeto = this.tamanhos[key]
            if (objeto.yPx < 0) break

            ctx.font = `${objeto.xPx / 16}px Arial`
            ctx.fillStyle = objeto.cor
            ctx.fillText(objeto.legenda, this.paddingTamanhos, objeto.yPx - 2)
            ctx.fillRect(this.paddingTamanhos, objeto.yPx, objeto.xPx, this.largura)
        }
    }
}