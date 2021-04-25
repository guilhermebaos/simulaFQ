let r, rInv
// Converter Amplitudes
function amplitude(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        explicacao.forEach(e => e.style.display = 'none')

        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        if (uDe == '°' && uPara == 'rad') {
            explicacao[2].style.display = 'block'
        } else if (uDe == 'rad' && uPara == '°') {
            explicacao[1].style.display = 'block'
        } else {
            explicacao[0].style.display = 'block'
        }

        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, amplitudesNomes[uDe])
        textoArr(unidadesParaExtenso, amplitudesNomes[uPara])

        // Escrever as razões
        let valorDe = new BigNumber(amplitudes[uDe])
        let valorPara = new BigNumber(amplitudes[uPara])

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