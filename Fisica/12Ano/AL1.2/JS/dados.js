export default class Dados {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Contador, para apenas guardar uma parte dos dados, para evitar sobrecarregar os gráficos
        this.contador = 0
        this.ignorar = 4        // Apenas grava 1 valor em cada this.ignorar

        // Tempo atual
        this.tempo = 0

        // Objeto com os dados
        this.dadosObtidos = {
            tempo: [],
            forca: [],
            fa: [],
            vel: [],
            ace: []
        }
    }

    reiniciar() {
        // Apaga os dados gravados
        this.contador = 0
        this.tempo = 0

        for (let key in this.dadosObtidos) {
            this.dadosObtidos[key] = []
        }
    }

    update(deltaTempo) {
        // Gravar apenas uma parte dos dados, para evitar ficar com muitos pontos
        this.contador++

        if (this.contador % (this.ignorar * this.simula.resolucao) != 0) return false

        // Calcular e guardar os valores
        this.tempo += deltaTempo * this.ignorar * this.simula.resolucao
        
        this.dadosObtidos.tempo.push(this.tempo.toFixed(3))
        this.dadosObtidos.forca.push(this.simula.simObjetos[0].forca)
        this.dadosObtidos.fa.push(Math.abs(this.simula.simObjetos[0].fa))
        this.dadosObtidos.vel.push(this.simula.simObjetos[0].velocidade)
        this.dadosObtidos.ace.push(this.simula.simObjetos[0].aceleracao)

        return this.dadosObtidos
    }
}