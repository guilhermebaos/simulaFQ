const unidadesDeExtensoPot = document.getElementsByName('unidadesDeExtensoPot')
const unidadesDeExtensoTempo = document.getElementsByName('unidadesDeExtensoTempo')
const unidadesParaExtensoPot = document.getElementsByName('unidadesParaExtensoPot')
const unidadesParaExtensoTempo = document.getElementsByName('unidadesParaExtensoTempo')

const razaoEnergia = document.getElementsByName('razaoEnergia')
const razaoPot = document.getElementsByName('razaoPot')
const razaoTempo = document.getElementsByName('razaoTempo')


let r, rInv
// Converter Energias
function energia(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        explicacao.forEach(e => e.style.display = 'none')

        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        let uDePot, uDeTempo, potDe, tempoDe, energiaDe
        let uDeDividido = uDe.split('W')
        if (uDeDividido.length == 2) {
            uDePot = uDeDividido[0] + 'W'
            uDeTempo = uDeDividido[1]

            potDe = new BigNumber(potencias[uDePot])
            tempoDe = new BigNumber(tempos[uDeTempo])

            textoArr(unidadesDeExtensoPot, potenciasNomes[uDePot])
            textoArr(unidadesDeExtensoTempo, temposNomes[uDeTempo])
        }

        let uParaPot, uParaTempo, potPara, tempoPara, energiaPara
        let uParaDividido = uPara.split('W')
        if (uParaDividido.length == 2) {
            uParaPot = uParaDividido[0] + 'W'
            uParaTempo = uParaDividido[1]

            potPara = new BigNumber(potencias[uParaPot])
            tempoPara = new BigNumber(tempos[uParaTempo])

            textoArr(unidadesParaExtensoPot, potenciasNomes[uParaPot])
            textoArr(unidadesParaExtensoTempo, temposNomes[uParaTempo])
        }

        if ((uDe == 'J' && uPara == 'Ws') || (uDe == 'Ws' && uPara == 'J')) {
            explicacao[4].style.display = 'block'
            
        } else if (potDe && potPara) {
            let rPot = potDe.dividedBy(potPara)
            let rTempo = tempoDe.dividedBy(tempoPara)

            textoArr(razaoPot, base10HTML(rPot))
            textoArr(razaoTempo, base10HTML(rTempo))

            explicacao[1].style.display = 'block'

        } else if (potDe) {
            energiaPara = new BigNumber(energias[uPara])

            potPara = new BigNumber(1)
            tempoPara = new BigNumber(1)
            energiaDe = new BigNumber(1)

            let rPot = potDe.dividedBy(potPara)
            let rTempo = tempoDe.dividedBy(tempoPara)
            let rEnergia = energiaDe.dividedBy(energiaPara)

            textoArr(razaoPot, base10HTML(rPot))
            textoArr(razaoTempo, base10HTML(rTempo))
            textoArr(razaoEnergia, base10HTML(rEnergia))

            explicacao[3].style.display = 'block'

        } else if (potPara) {
            energiaDe = new BigNumber(energias[uDe])

            potDe = new BigNumber(1)
            tempoDe = new BigNumber(1)
            energiaPara = new BigNumber(1)

            let rPot = potDe.dividedBy(potPara)
            let rTempo = tempoDe.dividedBy(tempoPara)
            let rEnergia = energiaDe.dividedBy(energiaPara)

            textoArr(razaoPot, base10HTML(rPot))
            textoArr(razaoTempo, base10HTML(rTempo))
            textoArr(razaoEnergia, base10HTML(rEnergia))

            explicacao[2].style.display = 'block'

        } else {
            explicacao[0].style.display = 'block'
        }


        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, energiasNomes[uDe])
        textoArr(unidadesParaExtenso, energiasNomes[uPara])

        // Escrever as razões
        let valorDe = new BigNumber(energias[uDe])
        let valorPara = new BigNumber(energias[uPara])

        r = valorDe.dividedBy(valorPara) * 1
        rInv = valorPara.dividedBy(valorDe) * 1

        textoArr(razao, base10HTML(r))
    }

    if (inverterConversao) {
        converterNum.value = expToDec(new BigNumber(converterResultado.value).times(rInv) * 1)
        return
    }
    converterResultado.value = expToDec(new BigNumber(converterNum.value).times(r) * 1)
}