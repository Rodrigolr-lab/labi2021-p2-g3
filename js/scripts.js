/*!
* Start Bootstrap - Agency v7.0.5 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

//my JS

function votosup (Elemento){
    Elemento = Elemento.toString(2)
    var x = document.getElementById( Elemento ).innerText;
    x = parseFloat(x);
    //console.log(x);
    x++;
    document.getElementById( Elemento ).innerHTML=x;
}

function votosdown (Elemento){

    var x = document.getElementById( Elemento ).innerText;
    x = parseFloat(x);
    //console.log(x);
    if(x>0)
        x--;
    document.getElementById( Elemento ).innerHTML=x;
}

function makerow(){//creates a new Row
    var inst=document.getElementById("Instrument").value;
    var exc=document.getElementById("Excerto").value;
    var table=document.getElementsByTagName('table')[0];
    //adiciona uma nova row 
    var newRow = table.insertRow(1);
    //adiciona uma nova cellss
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    //cria uma tag form
    var forms = document.createElement("form");
    forms.action = "music";
    forms.method = "POST";
    //cria uma tag input
    var btn = document.createElement("input");
    btn.value = "Play";
    btn.type = "submit";
    btn.className="btn btn-secondary btn-lg text-uppercase";
    //conexao dos tags
    cell1.innerHTML= inst;
    cell2.innerHTML= exc;
    forms.appendChild(btn);
    cell3.appendChild(forms);
}
function play(song){
    var audio = new Audio(song);
    audio.play();
}
