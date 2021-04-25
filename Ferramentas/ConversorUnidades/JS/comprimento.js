let r, rInv
// Converter Comprimentos
function comprimento(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, comprimentosNomes[uDe])
        textoArr(unidadesParaExtenso, comprimentosNomes[uPara])

        // Escrever as razões
        let valorDe = new BigNumber(comprimentos[uDe])
        let valorPara = new BigNumber(comprimentos[uPara])

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