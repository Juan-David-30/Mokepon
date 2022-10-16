//Importando Mokepones 
import {mokepones} from './mokepones.mjs';
/*
-- Definiendo variables y constantes globales
*/
//Variable que contiene id del jugador dada por el servidor 
let idjugador; 
//Variables de vida de los personajes
let vidaMascota;
let vidaEnemigo; 
//Id de las mascotas
let mascotaEnemigo;
let idMascota; 
//Variables globales de mascota 
let mascota; 
let mascotaEnemiga; 
//Variable de velocidades para movimiento
let velocidadx = 0; 
let velocidady = 0;
//Variable que contiene mokepones enemigos en el mapa
let jugadoresenemigos; 
//Intervalo del mapa
let mapaInterval; 
//Id del combate en curso
let combateEnCurso; 
let playertype; 
//Atrapando mapa
const sectVerMapa = document.getElementById('verMapa');
const mapa = document.getElementById('mapa');
const lienzo = mapa.getContext('2d');
if(window.innerWidth < 769){
    mapa.width = window.innerWidth-20;
    mapa.height = mapa.width *2/3;
    mokepones.forEach((mokepon)=>{
        mokepon.alto = mokepon.alto/2;
        mokepon.ancho = mokepon.ancho/2;
    });
}
//Background mapa
let escenario = new Image();
escenario.src = 'Styles/Assets/mokemap.webp';
//Variables globales de secciones 
const opcionesMascotas = document.getElementById('mascotasseleccionables'); 
const sectElegir = document.getElementById('selectMascota');
const sectAtaque = document.getElementById('selectAtaque'); 
const sectReiniciar = document.getElementById('jugar');
const sectataques = document.getElementById('ataques');
let btnsataque; 
//Añadiendo mokepones para seleccionar 
mokepones.forEach((mokepon, id)=>{
    opcionesMascotas.innerHTML+='<div><input name="mascota" type="radio" value="'+id+'" id="'+mokepon.nombre+'"/><label for="'+mokepon.nombre+'"> '+mokepon.nombre+' <img src="'+mokepon.foto+'" alt="'+mokepon.nombre+'"></label></div>'
});
//Atrapando selects de mascotas 
const radios = document.getElementsByName('mascota');
/*
-- Añadiendo eventos a elementos principales 
*/
//Añadiendo evento a elemento de seleccionar mascota 
document.getElementById('btnselect').addEventListener('click', seleccionarmascota);
//Añadiendo botón de reiniciar juego 
document.getElementById('jugardenuevo').addEventListener('click', iniciarJuego);
//Conectandose al backend 
unirse()
//Función para iniciar juego
function iniciarJuego(){
    //Alternativa : 
    /*document.getElementById('jugardenuevo').addEventListener('click', ()=>{
        location.reload();
    });*/
    //Limpiando sección de mensajes
    document.getElementById('resultados').innerHTML = '<div id="AtaquesPlayer"></div><div id="Resultado" class="MensajeResul"></div><div id="AtaquesEnemy"></div>';
    //limpiando historial
    historialenemigo = [];
    historialjugador = [];
    //borrando mascotas 
    mascota = null; 
    mascotaEnemiga = null; 
    //Limpiando botones de ataques
    sectataques.innerHTML = '<h2>Elige tu ataque</h2>';
    //Limpiando seleccion de mascotas 
    document.getElementById('nomMascotaEn').innerText = 'mascota';
    document.getElementById('nomMascota').innerText = 'mascota';
    //Limpiando seleccion de radios
    for(let i=0; i<radios.length; i++){
        radios[i].checked = false; 
    }
    //Escondiendo secciones inicio 
    sectElegir.hidden = false; 
    sectAtaque.hidden = true; 
    sectReiniciar.hidden = true; 
    sectVerMapa.style.display = 'none'; 
    let botones = document.getElementsByClassName('btnsmv');
    for(let i=0; i<botones.length; i++){
        botones[i].addEventListener('mouseup', stopmv);
    }
    for(let i =0; i<mokepones.length; i++){
        mokepones[i].x = mokepones[i].startx; 
        mokepones[i].y = mokepones[i].starty; 
    }
}
//Función para unirse al juego online y adquirir un id 
async function unirse(){
    let res = await fetch('http://127.0.0.1:8080/unirse');
    if(res.ok){
        idjugador = await res.text();
        console.log(idjugador);
    }
}
//Función para conseguir aleatoriedad
function numeroAleatorio(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
//Función para validar la selección de mascota
function seleccionarmascota(){
    for(let i=0; i < radios.length ; i++){
        if(radios[i].checked){
            return mascotaSeleccionada(radios[i].value);
        }
    }
}
//Función añadir mascota seleccionada al DOM 
function mascotaSeleccionada(id){
    //Ocultando y mostrando secciones necesarias
    sectVerMapa.style.display = 'flex'; 
    sectElegir.hidden = true;
    //Extrayendo variables globales del personaje 
    vidaMascota = mokepones[id].vida;
    idMascota = id; 
    mascota = mokepones[id];
    mascota.x = mapa.width*.6;
    mascota.y = mapa.height*.6;
    //Dibujando mapa con canvas 
    dibujarMapa(id);
    //Añadiendo funcionalidad a los botones de canvas
    document.getElementById('arriba').addEventListener('mousedown', mvarriba);
    document.getElementById('izquierda').addEventListener('mousedown', mvizquierda);
    document.getElementById('abajo').addEventListener('mousedown', mvabajo);
    document.getElementById('derecha').addEventListener('mousedown', mvderecha);
    document.getElementById('combate').addEventListener('click', revisarcolision);
    window.addEventListener('keydown', teclapresionada);
    window.addEventListener('keyup', stopmv);
    //Enviando mascota al backend 
    enviarMascota(id);
}
//Función para enviar selección de mokepon al backend
function enviarMascota(idmascota){
    fetch(`http://127.0.0.1:8080/mokepon/${idjugador}`,{
        //Indicamos el método
        method: 'post',
        //Enviamos metadados para indicar que el contenido es un JSON 
        headers: {
            "Content-Type": "application/json"
        },
        //En el body enviamos los datos que quermos enviar 
        body: JSON.stringify({
            mokepon: idmascota
        })
    });
}
//Dibujando mapa con canvas 
function dibujarMapa(){
    mapaInterval = setInterval(()=>{
    //validando que no haya iniciado algun combate 
    iniciarCombate();
    //Actualizando posición de personajes
    if(velocidadx != 0){
        mascota.x = mascota.x + velocidadx;
    }
    if(velocidady != 0){
    mascota.y = mascota.y + velocidady;
    } 
    //Validaciones de posición
    if(mascota.y < 0){
        mascota.y = 0;
    };
    if(mascota.y+mascota.alto > mapa.height){
        mascota.y = mapa.height-mascota.alto;
    };
    if(mascota.x < 0){
        mascota.x = 0;
    };
    if(mascota.x+mascota.ancho > mapa.width){
        mascota.x = mapa.width-mascota.ancho; 
    };
    //Enviando posición al servidor y consiguiendo la de los enemigos
    enviarposicion();
    //limpiando mapa 
    lienzo.clearRect(0,0,mapa.clientWidth, mapa.height);
    //Añadiendo background
    lienzo.drawImage(escenario,0,0,mapa.clientWidth, mapa.height);
    //Dibujando mascotas enemigas 
    if(jugadoresenemigos != null){
        jugadoresenemigos.forEach(jugador=>{
            if(jugador.mokepon !== null){
                lienzo.drawImage(jugador.mokepon, jugador.x, jugador.y, jugador.width, jugador.height);
            }
        });
    }
    //dibujando mascota seleccionada en canvas 
    lienzo.drawImage(mascota.mapaFoto, mascota.x, mascota.y, mascota.ancho,mascota.alto);}, 20);
}
//Funciones mover mascota en canvas 
function teclapresionada(e){
    switch(e.key){
        case "ArrowUp":
            mvarriba();
            break;
        case "ArrowDown":
            mvabajo();
            break;
        case "ArrowLeft":
            mvizquierda();
            break; 
        case "ArrowRight":
            mvderecha();
            break; 
        case "Enter":
            revisarcolision();
            break; 
    }
}
function mvarriba(){
    velocidady = velocidady-5;
}
function mvabajo(){
    velocidady = velocidady+5;
}
function mvderecha(){
    velocidadx = velocidadx+5;
}
function mvizquierda(){
    velocidadx = velocidadx-5;
}
function stopmv(){
    velocidadx = 0;
    velocidady = 0;
}
function revisarcolision(){
    let combate = null ; 
    jugadoresenemigos.forEach( jugador =>{
        if(!(jugador.x > mascota.x+mascota.ancho 
            || jugador.x+jugador.width < mascota.x 
            || jugador.y > mascota.y+mascota.alto 
            || jugador.y+jugador.height < mascota.y)){
            //Añadiendo información a stats 
            mascotaEnemigo = jugador.idmokepon; 
            combate = jugador; 
            return añadirStats(idMascota, mascotaEnemigo);
        }
    });
    if(combate != null){
        iniciarCombate(combate.id); 
    }
}
//Función para iniciar combate online
function iniciarCombate(id = null){
    if(id !=null){
        fetch(`http://127.0.0.1:8080/combate/${idjugador}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        }).then(repuesta=>{
            repuesta.json().then(res=>{
                combateEnCurso = res.id; 
                playertype = 'j1';
            })
        })
    }else{
        fetch(`http://127.0.0.1:8080/combate/${idjugador}`).then(res =>{
            res.json()
                .then(rival=>{
                    if(rival.rival != null){
                        mascotaEnemigo = rival.rival.mokepon; 
                        combateEnCurso = rival.id; 
                        playertype = 'j2';
                        return añadirStats(idMascota, rival.rival.mokepon);
                    }
                })
        })
    }
}
//Funcion para enviar posición al servidor y traer enemigos
async function enviarposicion(){
    let res = await fetch(`http://127.0.0.1:8080/mokepon/${idjugador}/position`, {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify({
            x: mascota.x,
            y: mascota.y
        })
    });
    let respuesta = await res.json();
    let enemigos = respuesta.enemigos;
    if(enemigos[0]){
        var lastarray = enemigos.map(enemigo=>{
            if(enemigo.mokepon !== null){
                let mokepon = mokepones[enemigo.mokepon];

                return {
                    mokepon: mokepon.mapaFoto || "", 
                    x: enemigo.x, 
                    y: enemigo.y, 
                    width: mokepon.ancho, 
                    height: mokepon.alto,
                    idmokepon: enemigo.mokepon,
                    id: enemigo.id
                };
            }else{
                return {
                    mokepon: null, 
                    x: null, 
                    y: null, 
                    width: null, 
                    height: null,
                    idmokepon: enemigo.mokepon,
                    id: enemigo.id
                };
            }
    });}
    jugadoresenemigos = lastarray; 
}
//Función para añadir stats de mascota seleccionada 
function añadirStats(id, idEnemigo){
    //Deteniendo el intervalo del mapa 
    clearInterval(mapaInterval);
    //Volviendo visible sección
    sectAtaque.hidden = false;
    sectVerMapa.style.display = 'none';
    //Colocando información de mascota en stats 
    const nomMascota = document.getElementById('nomMascota');
    const imgMascota = document.getElementById('imgMascota');
    imgMascota.src = mokepones[id].foto;
    nomMascota.innerHTML = mokepones[id].nombre; 
    sectataques.innerHTML = ""; 
    //Añadiendo ataques
    mokepones[id].ataques.forEach( atac =>{
        sectataques.innerHTML += `<button class="btn-ataque" id="${atac.id}">${atac.nombre}</button>`
    });
    //Atrapando botones de ataque 
    btnsataque = document.getElementsByClassName('btn-ataque');
    //Añadiendo Función a botones de ataque 
    for(let i=0; i < btnsataque.length ; i++){
        btnsataque[i].addEventListener('click', ataque);
        btnsataque[i].disabled = false; 
    }
    //Añadiendo stats enemigo
    document.getElementById('nomMascotaEn').innerHTML = mokepones[idEnemigo].nombre; 
    const imgMascotaEnemigo = document.getElementById('imgMascotaEn');
    imgMascotaEnemigo.src = mokepones[idEnemigo].foto;
    vidaEnemigo= mokepones[idEnemigo].vida; 
    mascotaEnemiga = mokepones[idEnemigo];
    ActualizandoVidas();
}
//Variables de ataques 
let ataquejugador;
let ataqueenemigo; 
//Variables de historial
let historialjugador = []; 
let historialenemigo = []; 
//Función para hacer ataque 
function ataque(boton){
    ataquejugador = boton.target.id; 
    historialjugador.push(boton.target.id);
    boton.target.disabled = true; 

    ataques(); 
    //ataquedelenemigo();
}
//Intervalo busqueda de ataques
let buscarAtaques; 
//Funcion para enviar ataques al servidor y pedir los del enemigo
function ataques(){
    fetch(`http://127.0.0.1:8080/enCombate/${idjugador}/${playertype}/${combateEnCurso}`,{
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: historialjugador
        })
    }).then(respuesta=>{
        respuesta.json().then(content=>{
            historialenemigo = content.enemigo;
        });
    });
    if(historialenemigo[historialjugador.length-1]){
        ataqueenemigo = historialenemigo[historialjugador.length-1];
        resultadoCombate(); 
    }else{
        for(let i=0; i<btnsataque.length; i++){
            btnsataque[i].style.display = 'none';
        }
        addMessage(ataquejugador, "Esperando...", "---");
        document.getElementById('AtaquesPlayer').className = 'empate';
        document.getElementById('AtaquesEnemy').className = 'empate';
        buscarAtaques = setInterval(()=>{
            fetch(`http://127.0.0.1:8080/enCombate/${idjugador}/${playertype}/${combateEnCurso}`,).then(respuesta=>{
        respuesta.json().then(content =>{
            historialenemigo = content.enemigo;
        });
        if(historialenemigo[historialjugador.length-1]){
            for(let i=0; i<btnsataque.length; i++){
                btnsataque[i].style.display = 'inline';
            }
            ataqueenemigo = historialenemigo[historialjugador.length-1]; 
            resultadoCombate();
            clearInterval(buscarAtaques); 
        }
    });
        }, 100); 
    }
}
//Función para el ataque del enemigo 
function ataquedelenemigo(){
    let ataque = numeroAleatorio(0,mokepones[mascotaEnemigo].ataques.length-1);
    let repetido = false; 
    historialenemigo.forEach(historial=>{
        if(ataque == historial){
            repetido = true; 
        }
    });
    if(repetido == true){
        return ataquedelenemigo();
    }
    ataqueenemigo = mokepones[mascotaEnemigo].ataques[ataque].id;
    historialenemigo.push(ataque);
    resultadoCombate();
}
//Función que agrega los resultados del combate
function resultadoCombate(){
    let resultado;
    if(ataqueenemigo == ataquejugador){
        resultado = 'EMPATE';
    }else if(ataquejugador == 'Fuego' && ataqueenemigo == 'Tierra' || ataquejugador == 'Agua' && ataqueenemigo == 'Fuego' || ataquejugador == 'Tierra' && ataqueenemigo == 'Agua'){
        vidaEnemigo--; 
        resultado = 'VICTORIA';
    }else{
        vidaMascota--;
        resultado = 'DERROTA';
    }
    addMessage(ataquejugador, ataqueenemigo, resultado);
    ActualizandoVidas();
}
//Actualizando vidas mascotas
function ActualizandoVidas(){
    let vidasPlayer ='Vidas:'; 
    for(let i=1; i<= vidaMascota; i++){
        vidasPlayer += '<img src="Styles/Assets/heart.png" alt="Vidas mascota" style="    width:45px;">';
    }
    let vidasEnemy ='Vidas:'; 
    for(let i=1; i<= vidaEnemigo; i++){
        vidasEnemy += '<img src="Styles/Assets/heart.png" alt="Vidas enemigo" style="    width: 45px;">';
    }
    if(vidaMascota <= 0){
        vidasPlayer += '---'
        GameOver('<strong>Has perdido el combate :C </strong>');
    }else if(vidaEnemigo <= 0){
        vidasEnemy += '---'
        GameOver('<strong>HAS GANADO EL COMBATE!!!</strong> ');
    }
    if(historialjugador.length >= 5 || historialenemigo.length >= 5){
        if(vidaMascota > vidaEnemigo){
            GameOver('<strong>HAS GANADO EL COMBATE!!!</strong> ');
        }else if(vidaMascota < vidaEnemigo){
            GameOver('<strong>Has perdido el combate :C </strong>');
        }else{
            GameOver('<strong>¡HA HABIDO UN EMPATE!</strong> ');
        }
    }
    document.getElementById('vidas').innerHTML= vidasPlayer;
    document.getElementById('vidasEnemigo').innerHTML = vidasEnemy;

}
//Función para añadir mensajes
function addMessage(jugador, enemigo, resultado){
    //Atrapando cuadros de resultados 
    const cuadroMensaje = document.getElementById('AtaquesPlayer');
    const cuadroMensajeResul = document.getElementById('Resultado');
    const cuadroMensajeEnemigo = document.getElementById('AtaquesEnemy');
    //Añadiendo mensajes a cuadros de resultados 
    cuadroMensaje.innerText = jugador; 
    cuadroMensajeEnemigo.innerText = enemigo; 
    cuadroMensajeResul.innerText = resultado; 
    //Añadiendo estilos al cuadro de resultados
    if(resultado == 'VICTORIA'){
        cuadroMensaje.className = 'ganador';
        cuadroMensajeEnemigo.className = 'perdedor';
    }else if(resultado == 'DERROTA'){
        cuadroMensaje.className = 'perdedor';
        cuadroMensajeEnemigo.className = 'ganador';
    }else if(resultado == 'EMPATE'){
        cuadroMensaje.className = 'empate';
        cuadroMensajeEnemigo.className = 'empate';
    }
}
//Función de finalizar juego
function GameOver(mensaje){
    document.getElementById('resultadoFinal').innerHTML = mensaje;
    //Consiguiendo botones de ataque
    const btnsataque = document.getElementsByClassName('btn-ataque');
    //Deshabilitando botones de ataque 
    for(let i=0; i < btnsataque.length ; i++){
        btnsataque[i].disabled = true;
    }
    sectReiniciar.hidden = false; 
    setTimeout(()=>{fetch(`http://127.0.0.1:8080/TerminarCombate/${combateEnCurso}`);}, 300);
}
//Ejecutando inicio de juego
document.addEventListener('DOMContentLoaded', iniciarJuego);