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
//produz som ao clicar em play botao
function play(song){
    var audio = new Audio(song);
    audio.play();
}



//--------------------------------1PAG------------------------------
//chamar DATABASE
function chamar_api() {
    var request = new XMLHttpRequest();
    //pede request metodo get
    request.open("GET", "list?type=music_table", true);
    //verifica mudancas de estado
    request.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
    //verifica estado done
    if(request.readyState === XMLHttpRequest.DONE) {
        var status = request.status;
        //verifica estado done
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          //jsoon para js
          resposta = JSON.parse(request.responseText);
          make(resposta);
        }
        else{
            console.log("ERROR");
        }
      }
    }
    request.send(null);
  }


//tabela de music --------------------------------1PAG------------------------------
//criacao da tabela musicas 
function make(json_dados) {
    html = `<tr>
                <th>#</th>
                <th>Artist</th>
                <th>Music</th>
                <th></th>
                <th></th>
            </tr>`;
    for (var i = 0; i < json_dados.length; i++) {
      dados = json_dados[i];
      html = html + `<tr>
                        <td id="`+dados.id+`">`+ dados.votes + `</td>
                        <td>`+ dados.artist + `</td>
                        <td>` + dados.music  + `</td>
                        <td>
                            <input type="submit" value="Play" onclick="play('musica/`+dados.music+`.wav')" class="btn btn-secondary btn-lg text-uppercase"/>
                        </td>
                        <td>
                            <input type="submit" value="ᐁ" name="`+ dados.votes + `"onclick="votos('`+dados.id+`', -1)" class="btn btn-secondary btn-lg text-uppercase rounded-circle"/> 
                            <input type="submit" value="ᐃ" name="`+ dados.votes + `"onclick="votos('`+dados.id+`', 1)" class="btn btn-secondary btn-lg text-uppercase rounded-circle"/>
                       </td>
                    </tr>`;
    }
    document.getElementById("table_votes").innerHTML = html;
  }

//votar para cima ou para baixo
function votos (Elemento, cho){
    var request = new XMLHttpRequest();
    cho = parseFloat(cho);
    request.open("PUT", "vote?id="+Elemento+"&votes="+cho, true);
    //Send the proper header information along with the request
    request.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById(Elemento).innerHTML = request.responseText;
        }
    }
    request.send(null);
}

chamar_api()