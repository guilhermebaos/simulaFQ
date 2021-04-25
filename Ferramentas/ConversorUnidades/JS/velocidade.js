const unidadesDeExtensoComp = document.getElementsByName('unidadesDeExtensoComp')
const unidadesDeExtensoTemp = document.getElementsByName('unidadesDeExtensoTemp')
const unidadesParaExtensoComp = document.getElementsByName('unidadesParaExtensoComp')
const unidadesParaExtensoTemp = document.getElementsByName('unidadesParaExtensoTemp')

const razaoComp = document.getElementsByName('razaoComp')
const razaoTemp = document.getElementsByName('razaoTemp')

let r, rInv
// Converter velocidades
function velocidade(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, velocidadesNomes[uDe])
        textoArr(unidadesParaExtenso, velocidadesNomes[uPara])


        // Escrever as sub-etapas
        let uDeComp = uDe.split('/')[0], uDeTemp = uDe.split('/')[1]
        let uParaComp = uPara.split('/')[0], uParaTemp = uPara.split('/')[1]

        // Comprimento
        textoArr(unidadesDeExtensoComp, comprimentosNomes[uDeComp])
        textoArr(unidadesParaExtensoComp, comprimentosNomes[uParaComp])

        let rComp = new BigNumber(comprimentos[uDeComp]).div(new BigNumber(comprimentos[uParaComp]))
        textoArr(razaoComp, base10HTML(rComp))
        
        // Tempo
        textoArr(unidadesDeExtensoTemp, temposNomes[uDeTemp])
        textoArr(unidadesParaExtensoTemp, temposNomes[uParaTemp])

        let rTemp = new BigNumber(tempos[uParaTemp]).div(new BigNumber(tempos[uDeTemp])) // A razão do tempo é invertida porque é tempo^-1
        textoArr(razaoTemp, base10HTML(rTemp))


        // Escrever as razões
        let valorDe = new BigNumber(velocidades[uDe])
        let valorPara = new BigNumber(velocidades[uPara])

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