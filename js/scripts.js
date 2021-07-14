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

//myJS

//verifys if it is num
function isDigit(Elemento){
    var dig = true;
    for(var i =0; i< Elemento.length ; i++){
        var c = Elemento[i].substr(0,Elemento.length+1);
        if (!(c >= '0' && c <= '9')) {
            dig= false;
            return dig;
        }
    }
    return dig;
}


//seleciona a opcao selecionada em select
function missao_impossivel(elemento) {
    var elementoSeleccionado = elemento.options[elemento.selectedIndex];
    op = elementoSeleccionado.value;
}


//cria a pauta de som
function create_pauta(){
    //tabela de sons on
    var row = [];
    var col = [];
    for (var j = 1; j < 8 ; j++){
        var col = [];
        for(var i = 1; i < 18 ; i++){
            var on = document.getElementById("check_"+j+"-"+i);
            if(on.checked){
                col[i-1] = 1;
            }
            else{
                col[i-1] = 0;
            }
        }
        row[j-1] = col;
    }
    //lista de sons inseridos na opcao
    var list =[];
    for (var j = 1; j < 8 ; j++){
        var music  = document.getElementById("op-"+j);
        missao_impossivel(music);
        list[j-1] =  op;
    }


    //gets value and verifys if it is num
    var bpm_text = document.getElementById("bpm-value").value;
    var bpm = isDigit(bpm_text);
    //console.log("string =" + bpm_text);
    if(bpm){
        bpm = parseFloat(bpm_text);
    }
    else{
        alert("It must be number!");
        return;
    }
    //console.log("num =" + bpm_text);
    
    
    // criacao de json com informcaoes da pauta
    pauta = {
            "bpm": bpm,
            Excertos: [{
                            music:  list[0],
                            play: row[0],
                        }, 
                        {
                            music: list[1],
                            play: row[1],
                        },
                        {
                            music: list[2],
                            play: row[2],
                        },
                        {
                            music: list[3],
                            play: row[3],
                        },
                        {
                            music: list[4],
                            play: row[4],
                        },
                        {
                            music: list[5],
                            play: row[5],
                        },
                        {
                            music: list[6],
                            play: row[6],
                        }
                    ]
            }

            //funcao para enviar json
            sendpauta(pauta);
            
        
}

//send json pauta
function sendpauta(pauta) {
    var enviar = new FormData();
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "upload_pauta";

    // open a connection
    xhr.open("POST", url, true);

    // Converting JSON data to string
    var data = JSON.stringify(pauta);
    enviar.append("json_dados", data);


    // Sending data with the request
    xhr.send(enviar);
}

//receives file
function onChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        // The file's text will be printed here
        console.log(e.target.result);
    };
    reader.readAsText(file);
    sendFile(file);
}


//sends file
function sendFile(file) {
    var data = new FormData();
    //adds data to variabel
    data.append("myFile", file);
    var xhr = new XMLHttpRequest();
    //excuta funcao
    xhr.open("POST", "upload");
    xhr.upload.addEventListener("progress", updateProgress, false);
    //sends the data
    xhr.send(data);
}


//alertar que o update foi bem sucessido
function updateProgress(evt){
    if(evt.loaded == evt.total) alert("Well Sucessed!");
}


//produz som ao clicar em play botao
function play(song){
    var audio = new Audio(song);
    audio.play();
}






//--------------------------------1PAG-API------------------------------
function chamar_api_music() {
    var request = new XMLHttpRequest();
    //pede request metodo get
    request.open("GET", "sql?type=music_table", true);
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
            console.log("ERROR1");
        }
      }
    }
    request.send(null);
}


//--------------------------------2PAG-API------------------------------
function chamar_api_excertos() {
    var request = new XMLHttpRequest();
    //pede request metodo get
    request.open("GET", "sql?type=excertos_table", true);
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
            console.log("ERROR2");
        }
      }
    }
    request.send(null);
}


//--------------------------------3PAG-API------------------------------
function chamar_api_mix() {
    var request = new XMLHttpRequest();
    //pede request metodo get
    request.open("GET", "sql?type=excertos_table", true);
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
          make_mix(resposta);
        }
        else{
            console.log("ERROR3");
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


//votar para cima ou para baixo em music
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


//tabela de excertos
//criacao da tabela excertos
function make_excertos(json_dados) {
    html = `<tr>
                <th>Name</th>
                <th></th>
            </tr>`;

    for (var i = 0; i < json_dados.length; i++) {
      dados = json_dados[i];
      html = html + `<tr>
                        <td>`+dados.instrument +`</td>
                        <td><input type="submit" value="Play" onclick="play('musica/`+dados.name_file+`')" class="btn btn-secondary btn-lg text-uppercase"/></td>
                    </tr>`;
    }

    document.getElementById("table_excertos").innerHTML = html;
  }


//tabela de mix
//criacao das options do mix 
function make_mix(json_dados) {
    html = `<option value="" disabled selected>NO SOUND</option>`;

    for (var i = 0; i < json_dados.length; i++) {
        dados = json_dados[i];
        html = html + `<option value="`+dados.name_file+`">`+dados.name_file+`</option>`;
    }

    var mix = document.getElementsByClassName("options");
    for (var i = 0; i < mix.length; i++) {
        mix[i].innerHTML = html;
    }
}



//Executadas apos iniciar pags HTML
chamar_api_excertos()
chamar_api_music()
chamar_api_mix()