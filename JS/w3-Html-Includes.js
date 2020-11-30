// Retirado de: https://www.w3schools.com/howto/howto_html_include.asp

function incluirHTML() {
  let z, i, elmnt, file, xhttp;

  // Faz loop por todos os elementos da página, procurando um que tenha um atributo específico
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("incluir");

    // Se encontra, faz um HTTP request, com o nome do ficheiro igual ao valor do atributo
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Erro 404.";}
          
          // Remove o Atributo, chamando a função outra vez
          elmnt.removeAttribute("incluir");
          incluirHTML();
        }
      }

      // Envia o ficheiro e acaba o processo
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}
