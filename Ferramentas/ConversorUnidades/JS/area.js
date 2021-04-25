const razaoComprimento = document.getElementsByName('razaoComprimento')

let r, rInv
// Converter Áreas
function area(novasUnidades=false, inverterConversao=false) {
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
        
        // Escrever quadrad@, dependendo se é feminino ou masculino
        let letra = uDe == 'in' ? 'a' :  'o'
        textoArr(unidadesDeGenero, letra)
        
        letra = uPara == 'in' ? 'a' :  'o'
        textoArr(unidadesParaGenero, letra)

        // Escrever as razões
        let valorDe = new BigNumber(comprimentos[uDe])
        let valorPara = new BigNumber(comprimentos[uPara])

        r = valorDe.dividedBy(valorPara)
        rInv = valorPara.dividedBy(valorDe)

        textoArr(razaoComprimento, base10HTML(r))

        r = r.times(r)
        rInv = rInv.times(rInv)

        textoArr(razao, base10HTML(r))
    }

    if (inverterConversao) {
        converterNum.value = expToDec(new BigNumber(converterResultado.value).times(rInv) * 1)
        return
    }
    converterResultado.value = expToDec(new BigNumber(converterNum.value).times(r) * 1)
}