//Importando Mokepones 
import {mokepones} from './mokepones.mjs';
/*
-- Definiendo variables y constantes globales
*/
//Variables de vida de los personajes
let vidaMascota;
let vidaEnemigo; 
//Variables globales de secciones 
const opcionesMascotas = document.getElementById('mascotasseleccionables'); 
const sectElegir = document.getElementById('selectMascota');
const sectAtaque = document.getElementById('selectAtaque'); 
const sectReiniciar = document.getElementById('jugar');
//Añadiendo mokepones para seleccionar 
mokepones.forEach(mokepon=>{
    opcionesMascotas.innerHTML+='<div><input name="mascota" type="radio" value="'+mokepon.nombre+'" id="'+mokepon.nombre+'"/><label for="'+mokepon.nombre+'"> '+mokepon.nombre+' <img src="'+mokepon.foto+'" alt="'+mokepon.nombre+'"></label></div>'
});
//Atrapando selects de mascotas 
const radios = document.getElementsByName('mascota');
//Atrapando botones de ataque 
const btnsataque = document.getElementsByClassName('btn-ataque');
/*
-- Añadiendo eventos a elementos principales 
*/
//Añadiendo evento a elemento de seleccionar mascota 
document.getElementById('btnselect').addEventListener('click', seleccionarmascota);
//Añadiendo botón de reiniciar juego 
document.getElementById('jugardenuevo').addEventListener('click', iniciarJuego);
//Función para iniciar juego
function iniciarJuego(){
    //Reiniciando vidas
    vidaMascota = 3;
    vidaEnemigo = 3;
    ActualizandoVidas();
    //Añadiendo Función a botones de ataque 
    for(let i=0; i < btnsataque.length ; i++){
        btnsataque[i].addEventListener('click', ataque);
        btnsataque[i].disabled = false; 
    }
    //Alternativa : 
    /*document.getElementById('jugardenuevo').addEventListener('click', ()=>{
        location.reload();
    });*/
    //Limpiando sección de mensajes
    document.getElementById('resultados').innerHTML = '<div id="AtaquesPlayer"></div><div id="Resultado" class="MensajeResul"></div><div id="AtaquesEnemy"></div>';
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
    alert('No se ha seleccionado ninguna mascota');
}
//Función añadir mascota seleccionada al DOM 
function mascotaSeleccionada(nombre){
    const nomMascota = document.getElementById('nomMascota');
    const imgMascota = document.getElementById('imgMascota');
    imgMascota.src = 'Styles/Assets/mokepons_mokepon_'+nombre+'_attack.webp';
    nomMascota.innerHTML = nombre; 
    sectAtaque.hidden = false; 
    sectElegir.hidden = true; 
    EnemigoAleatorio();
}
//Función para conseguir número aleatorio
function EnemigoAleatorio(){
    let mascotaEnemigo = numeroAleatorio(1,3);
    switch(mascotaEnemigo){
        case 1:
            mascotaEnemigo = 'Hipodoge';
            break; 
        case 2: 
            mascotaEnemigo = 'Capipepo';
            break;
        default:
            mascotaEnemigo = 'Ratigueya';
            break;
    }
    document.getElementById('nomMascotaEn').innerHTML = mascotaEnemigo; 
    const imgMascota = document.getElementById('imgMascotaEn');
    imgMascota.src = 'Styles/Assets/mokepons_mokepon_'+mascotaEnemigo+'_attack.webp';
}
//Variables de ataques 
let ataquejugador;
let ataqueenemigo; 
//Función para hacer ataque 
function ataque(tipo){
    ataquejugador = tipo.target.id; 
    ataquedelenemigo();
}
//Función para el ataque del enemigo 
function ataquedelenemigo(){
    let ataque = numeroAleatorio(1,3)
    switch(ataque){
        case 1: 
            ataqueenemigo = 'Fuego';
            break; 
        case 2:
            ataqueenemigo = 'Agua';
            break; 
        default: 
            ataqueenemigo = 'Tierra'
            break; 
    }
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
}
//Ejecutando inicio de juego
document.addEventListener('DOMContentLoaded', iniciarJuego);