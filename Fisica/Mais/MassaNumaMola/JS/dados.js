export default class Dados {
    constructor(simula) {
        // Simulação
        this.simula = simula

        // Contador, para apenas guardar uma parte dos dados, para evitar sobrecarregar os gráficos
        this.contador = -1
        this.contadorMax = 2e05
        this.ignorarMin = 1
        this.ignorar = this.ignorarMin

        // this.frames = velocidadeSim.value / 1
        this.frames = 1

        // Tempo atual
        this.tempo = 0

        // Selecionar a esfera
        this.massa = this.simula.massa
    }

    reiniciar() {
        // Apaga os dados gravados
        this.contador = -1
        this.tempo = 0
        this.ignorar = this.ignorarMin + Math.ceil(this.frames)
    }

    update(deltaTempo) {
        // Gravar apenas uma parte dos dados, para evitar ficar com muitos pontos
        this.contador++

        if ((this.contador % (this.ignorar * this.simula.resolucao) != 0) || 
        this.contador > this.contadorMax) return false

        // Objeto com os dados
        this.dadosObtidos = []
        
        // Tempo da Simulação
        this.dadosObtidos.push(this.tempo.toFixed(3))

        // Energias Cinética, Potencial e Mecânica
        let Ec = 0.5 * this.massa.m * (this.massa.velocidade ** 2)
        let Epg = this.massa.m * this.massa.g * this.massa.altura
        this.dadosObtidos.push(Ec)
        this.dadosObtidos.push(Epg)
        this.dadosObtidos.push(Ec + Epg)

        // Posição
        this.dadosObtidos.push(this.massa.posicao)

        // Velocidade
        this.dadosObtidos.push(this.massa.velocidade)
        
        // Aceleração
        this.dadosObtidos.push(this.massa.aceleracao)

        // Jerk
        this.dadosObtidos.push((this.massa.aceleracao - this.ultimaAceleracao) / (deltaTempo * 1000))
        this.ultimaAceleracao = this.massa.aceleracao
        
        // Calcular e guardar os valores
        this.tempo += deltaTempo * this.ignorar * this.simula.resolucao

        return this.dadosObtidos
    }
}