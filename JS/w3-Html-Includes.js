// Código do Statcounter https://statcounter.com/
var sc_project=12454038, sc_invisible=1, sc_security="b1e05410", sc_https=1 

// Funcionalidade da navbar
var navbarDropdown
function dropdown(delay=0) {
    if (!navbarDropdown) {
        navbarDropdown = document.getElementById('dropdown-items')
        navbarDropdown.isOpen = false
    }

    window.setTimeout(() => {
      if (navbarDropdown.isOpen) {
          navbarDropdown.style.display = 'none'
          navbarDropdown.isOpen = false
      } else {
          navbarDropdown.style.display = 'block'
          navbarDropdown.isOpen = true
      }
    }, delay)
}



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
