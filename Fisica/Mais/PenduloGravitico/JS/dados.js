export default class Dados {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Contador, para apenas guardar uma parte dos dados, para evitar sobrecarregar os gráficos
        this.contador = 0
        this.ignorar = 1 + Math.floor(this.simula.inputs.tempoMax / 10)        // Apenas grava 1 valor em cada this.ignorar

        // Tempo atual
        this.tempo = 0

        // Tempo até o qual vamos gravar dados, em s
        this.tempoFinal = this.simula.inputs.tempoMax

        // Objeto com os dados
        this.dadosObtidos = {
            tempo: [],
            ang: [],
            pos: [],
            posY: [],
            posX: [],
            vel: [],
            velX: [],
            velY: [],
            ace: [],
            aceX: [],
            aceY: [],
            jer: [],
            ec: [],
            epg: [],
            em: []
        }
        this.dadosEntregues = false
    }

    reiniciar() {
        // Apaga os dados gravados
        this.contador = 0
        this.tempo = 0

        // Atualizar o tempo até o qual vamos gravar dados, em s
        this.tempoFinal = this.simula.inputs.tempoMax

        for (let key in this.dadosObtidos) {
            this.dadosObtidos[key] = []
        }

        this.dadosEntregues = false
    }

    update(deltaTempo) {

        // Já entregou os dados
        if (this.dadosEntregues) return false

        // Já gravou dados suficientes
        if (this.tempo > this.tempoFinal) {
            this.dadosEntregues = true
            return true
        }

        // Gravar apenas uma parte dos dados, para evitar ficar com muitos pontos
        this.contador++

        if (this.contador % (this.ignorar * this.simula.resolucao) != 0) return false

        // Calcular e guardar os valores
        this.tempo += deltaTempo * (this.ignorar * this.simula.resolucao) / this.simula.updates_por_frame

        this.dadosObtidos.tempo.push((this.tempo).toFixed(3))

        this.dadosObtidos.ang.push(this.simula.pendulo.ang * (180 / Math.PI))

        this.dadosObtidos.pos.push(((this.simula.pendulo.posicao.x - this.simula.pendulo.fioPos.x) ** 2 + (this.simula.altura - this.simula.pendulo.posicao.y) ** 2) ** 0.5)
        this.dadosObtidos.posX.push(this.simula.pendulo.posicao.x - this.simula.pendulo.fioPos.x)
        this.dadosObtidos.posY.push(this.simula.altura - this.simula.pendulo.posicao.y)

        this.dadosObtidos.vel.push(this.simula.pendulo.velocidade.abs)
        this.dadosObtidos.velX.push(this.simula.pendulo.velocidade.x)
        this.dadosObtidos.velY.push(this.simula.pendulo.velocidade.y)

        this.dadosObtidos.ace.push(this.simula.pendulo.aceleracao.abs)
        this.dadosObtidos.aceX.push(this.simula.pendulo.aceleracao.x)
        this.dadosObtidos.aceY.push(this.simula.pendulo.aceleracao.y)

        let aceLen = this.dadosObtidos.ace.length
        this.dadosObtidos.jer.push(
            (this.dadosObtidos.ace[aceLen - 1] - this.dadosObtidos.ace[aceLen - 2]) / deltaTempo / 1000
        )

        let tempEc = 0.5 * this.simula.pendulo.massa * this.simula.pendulo.velocidade.abs ** 2
        let tempEpg = this.simula.pendulo.massa * this.simula.pendulo.g * (this.simula.pendulo.comp - this.simula.pendulo.posicao.y)
        this.dadosObtidos.ec.push(tempEc)
        this.dadosObtidos.epg.push(tempEpg)
        this.dadosObtidos.em.push(tempEc + tempEpg)

        return false
    }
}