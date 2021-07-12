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

function path(file_name){
    const path = require(file_name);
    return path;
}


function makerow(){//creates a new Row
    //val intrument
    var inst=document.getElementById("Instrument").value;
    var path_file = document.getElementById("file").value;//.files[0].name
    console.log(path_file);
    var table=document.getElementsByTagName('table')[0];
    //adiciona uma nova row 
    var newRow = table.insertRow(1);
    //adiciona uma nova cellss
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    //cria uma tag input
    var btn = document.createElement("input");
    btn.value = "Play";
    btn.type = "submit";
    btn.className="btn btn-secondary btn-lg text-uppercase";
    btn.onclick=function(){
        console.log(path_file);
        path_file = path_file.replace("\\", "/");
        console.log(path_file);
        play(path_file);};
    //conexao dos tags
    cell1.innerHTML= inst;
    cell2.appendChild(btn);
}
//produz som ao clicar em play botao
function play(song){
    console.log(song);
    var audio = new Audio(song);
    audio.play();
}



//--------------------------------1PAG------------------------------
//chamar DATABASE
function chamar_api_music() {
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
          make_music(resposta);
        }
        else{
            console.log("ERROR");
        }
      }
    }
    request.send(null);
  }


//tabela de music
//criacao da tabela musicas 
function make_music(json_dados) {
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
    document.getElementById("table_music").innerHTML = html;
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


chamar_api_music()
//--------------------------------2PAG------------------------------
//chamar DATABASE
function chamar_api_excertos() {
    var request = new XMLHttpRequest();
    //pede request metodo get
    request.open("GET", "list?type=music_excertos", true);
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
          make_excertos(resposta);
        }
        else{
            console.log("ERROR");
        }
      }
    }
    request.send(null);
  }


//tabela de music
//criacao da tabela musicas 
function make_excertos(json_dados) {
    html = `<tr>
                <th>instrument</th>
                <th></th>
            </tr>`;
    for (var i = 0; i < json_dados.length; i++) {
      dados = json_dados[i];
      html = html + `<tr>
                        <td>`+dados.instrument +`</td>
                        <td><input type="submit" value="Play" onclick="play('`+dados.name_file+`')" class="btn btn-secondary btn-lg text-uppercase"/></td>
                    </tr>`;
    }
    document.getElementById("table_excertos").innerHTML = html;
  }

chamar_api_excertos()