const unidadesDeExtensoEne = document.getElementsByName('unidadesDeExtensoEne')
const unidadesDeExtensoTempo = document.getElementsByName('unidadesDeExtensoTempo')
const unidadesParaExtensoEne = document.getElementsByName('unidadesParaExtensoEne')
const unidadesParaExtensoTempo = document.getElementsByName('unidadesParaExtensoTempo')

const razaoPotencia = document.getElementsByName('razaoPotencia')
const razaoEne = document.getElementsByName('razaoEne')
const razaoTempo = document.getElementsByName('razaoTempo')


let r, rInv
// Converter Energias
function potencia(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        explicacao.forEach(e => e.style.display = 'none')

        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        // Escolher a Explicação a mostrar
        let uDeEne, uDeTempo, eneDe, tempoDe, potenciaDe
        let uDeDividido = uDe.split('/')
        if (uDeDividido.length == 2) {
            uDeEne = uDeDividido[0]
            uDeTempo = uDeDividido[1]

            eneDe = new BigNumber(energias[uDeEne])
            tempoDe = new BigNumber(tempos[uDeTempo])

            textoArr(unidadesDeExtensoEne, energiasNomes[uDeEne])
            textoArr(unidadesDeExtensoTempo, temposNomes[uDeTempo])
        }

        let uParaEne, uParaTempo, enePara, tempoPara, potenciaPara
        let uParaDividido = uPara.split('/')
        if (uParaDividido.length == 2) {
            uParaEne = uParaDividido[0]
            uParaTempo = uParaDividido[1]

            enePara = new BigNumber(energias[uParaEne])
            tempoPara = new BigNumber(tempos[uParaTempo])

            textoArr(unidadesParaExtensoEne, energiasNomes[uParaEne])
            textoArr(unidadesParaExtensoTempo, temposNomes[uParaTempo])
        }

        if ((uDe == 'W' && uPara == 'J/s') || (uDe == 'J/s' && uPara == 'W')) {
            explicacao[4].style.display = 'block'

        } else if(eneDe && enePara) {
            let rEne = eneDe.dividedBy(enePara)
            let rTempo = tempoDe.dividedBy(tempoPara) ** -1

            textoArr(razaoEne, base10HTML(rEne))
            textoArr(razaoTempo, base10HTML(rTempo))

            explicacao[1].style.display = 'block'

        } else if (eneDe) {
            potenciaPara = new BigNumber(potencias[uPara])

            enePara = new BigNumber(1)
            tempoPara = new BigNumber(1)
            potenciaDe = new BigNumber(1)

            let rEne = eneDe.dividedBy(enePara)
            let rTempo = tempoDe.dividedBy(tempoPara) ** -1
            let rPotencia = potenciaDe.dividedBy(potenciaPara)

            textoArr(razaoEne, base10HTML(rEne))
            textoArr(razaoTempo, base10HTML(rTempo))
            textoArr(razaoPotencia, base10HTML(rPotencia))

            explicacao[3].style.display = 'block'
        } else if (enePara) {
            potenciaDe = new BigNumber(potencias[uDe])

            eneDe = new BigNumber(1)
            tempoDe = new BigNumber(1)
            potenciaPara = new BigNumber(1)

            let rEne = eneDe.dividedBy(enePara)
            let rTempo = tempoDe.dividedBy(tempoPara) ** -1
            let rPotencia = potenciaDe.dividedBy(potenciaPara)

            textoArr(razaoEne, base10HTML(rEne))
            textoArr(razaoTempo, base10HTML(rTempo))
            textoArr(razaoPotencia, base10HTML(rPotencia))

            explicacao[2].style.display = 'block'

        } else {
            explicacao[0].style.display = 'block'
        }


        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, potenciasNomes[uDe])
        textoArr(unidadesParaExtenso, potenciasNomes[uPara])

        // Escrever as razões
        let valorDe = new BigNumber(potencias[uDe])
        let valorPara = new BigNumber(potencias[uPara])

        r = valorDe.dividedBy(valorPara)
        rInv = valorPara.dividedBy(valorDe)

        textoArr(razao, base10HTML(r))
    }

    if (inverterConversao) {
        converterNum.value = expToDec(new BigNumber(converterResultado.value).times(rInv) * 1)
        return
    }
    converterResultado.value = expToDec(new BigNumber(converterNum.value).times(r) * 1)
}