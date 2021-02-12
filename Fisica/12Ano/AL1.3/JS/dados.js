export default class Dados {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Contador, para apenas guardar uma parte dos dados, para evitar sobrecarregar os gráficos
        this.contador = 0
        this.ignorar = 4        // Apenas grava 1 valor em cada this.ignorar

        // Tempo atual
        this.tempo = 0
    }

    reiniciar() {
        // Apaga os dados gravados
        this.contador = 0
        this.tempo = 0
    }

    update(deltaTempo) {
        // Gravar apenas uma parte dos dados, para evitar ficar com muitos pontos
        this.contador++

        if (this.contador % (this.ignorar * this.simula.resolucao) != 0) return false

        // Objeto com os dados
        this.dadosObtidos = []

        // Calcular e guardar os valores
        this.tempo += deltaTempo * this.ignorar * this.simula.resolucao
        
        this.dadosObtidos.push(this.tempo.toFixed(3))
        this.dadosObtidos.push(this.simula.simObjetos[0].velocidade)

        return this.dadosObtidos
    }
}