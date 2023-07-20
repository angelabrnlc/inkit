/*
 La función alterna la clase en el elemento con el id "myTopnav" para que sea adapte de forma responsive al tamaño de la ventana del navegador
 */

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
