const razaoComprimento = document.getElementsByName('razaoComprimento')

const supCubico = document.getElementsByName('supCubico')

let r, rInv
// Converter Áreas
function volume(novasUnidades=false, inverterConversao=false) {
    if (novasUnidades) {
        explicacao.forEach(e => e.style.display = 'none')

        // Obter as Unidades
        let uDe = converterDe.value
        let uPara = converterPara.value

        // Mostrar a explicação certa
        let haLitros = uDe in volumes || uPara in volumes
        if (haLitros) {
            explicacao[0].style.display = 'block'
        } else {
            explicacao[1].style.display = 'block'
        }

        // Mostrar ou não o <sup>3</sup>
        if (uDe in volumes) {
            supCubico[0].innerText = ''
        } else {
            supCubico[0].innerText = '3'
        }
        if (uPara in volumes) {
            supCubico[1].innerText = ''
        } else {
            supCubico[1].innerText = '3'
        }

        // Escrever o símbolo das unidades
        textoArr(unidadesDe, uDe)
        textoArr(unidadesPara, uPara)
        
        // Escrever o nome das unidades por extenso
        textoArr(unidadesDeExtenso, comprimentosNomes[uDe] || volumesNomes[uDe])
        textoArr(unidadesParaExtenso, comprimentosNomes[uPara] || volumesNomes[uPara])
        
        // Escrever cúbico@, dependendo se é feminino ou masculino
        let letra = uDe == 'in' ? 'a' :  'o'
        textoArr(unidadesDeGenero, letra)
        
        letra = uPara == 'in' ? 'a' :  'o'
        textoArr(unidadesParaGenero, letra)

        // Escrever as razões
        let valorDe, valorPara
        if (haLitros) {
            uDe in volumes ? valorDe = new BigNumber(volumes[uDe]) : valorDe = new BigNumber(comprimentos[uDe]).exponentiatedBy(3)
            uPara in volumes ? valorPara = new BigNumber(volumes[uPara]) : valorPara = new BigNumber(comprimentos[uPara]).exponentiatedBy(3)

            r = valorDe.dividedBy(valorPara)
            rInv = valorPara.dividedBy(valorDe)
        } else {
            valorDe = new BigNumber(comprimentos[uDe])
            valorPara = new BigNumber(comprimentos[uPara])
    
            r = valorDe.dividedBy(valorPara)
            rInv = valorPara.dividedBy(valorDe)
    
            textoArr(razaoComprimento, base10HTML(r))
    
            r = r.exponentiatedBy(3)
            rInv = rInv.exponentiatedBy(3)
        }
        textoArr(razao, base10HTML(r))
    }

    if (inverterConversao) {
        converterNum.value = expToDec(new BigNumber(converterResultado.value).times(rInv) * 1)
        return
    }
    converterResultado.value = expToDec(new BigNumber(converterNum.value).times(r) * 1)
}