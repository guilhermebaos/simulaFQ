export default class Dados {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Contador, para apenas guardar uma parte dos dados, para evitar sobrecarregar os gráficos
        this.contador = 0
        this.ignorar = Math.ceil(this.simula.inputs.hi)        // Apenas grava 1 valor em cada this.ignorar

        // Tempo atual
        this.tempo = 0

        // Objeto com os dados
        this.dadosObtidos = {
            tempo: [],
            posY: [],
            hQeR: [],
            hMax: 0
        }
        this.colisaoPossivel = true
    }

    reiniciar() {
        // Apaga os dados gravados
        this.contador = 0
        this.tempo = 0

        for (let key in this.dadosObtidos) {
            this.dadosObtidos[key] = []
        }
        this.dadosObtidos.hMax = 0
        this.colisaoPossivel = true
    }

    update(deltaTempo) {
        // Gravar apenas uma parte dos dados, para evitar ficar com muitos pontos
        this.contador++

        if (this.contador % (this.ignorar * this.simula.resolucao) != 0) return false

        // Calcular e guardar os valores
        this.tempo += deltaTempo * this.ignorar * this.simula.resolucao

        this.dadosObtidos.tempo.push((this.tempo).toFixed(3))
        
        let h = this.simula.bola.posicao.altura
        if (this.simula.bola.velocidade.y > 0) this.colisaoPossivel = true
        if (h > this.dadosObtidos.hMax) {
            this.dadosObtidos.hMax = h
        } else if (this.colisaoPossivel && this.simula.bola.velocidade.y > 0) {
            this.dadosObtidos.hQeR.push(this.dadosObtidos.hMax)
            this.colisaoPossivel = false
            if (this.dadosObtidos.hMax < this.simula.inputs.hf) {
                this.simula.acabou = true
            }
            this.dadosObtidos.hMax = 0
        } else {
            this.simula.acabou = this.simula.bola.velocidade.abs < 0.1 && h < this.simula.inputs.hf
        }

        this.dadosObtidos.posY.push(h * 100)

        return this.dadosObtidos
    }
}