function aleatorio(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function eleccion(jugada){
    switch(jugada){
        case 1: 
            return 'piedra';
        case 2:
            return 'papel';
        case 3: 
            return 'tijera';
        default:
            return 'PERDER';
    }
}

function jugar(){
    let racha = 0;
    let rachapc = 0;
    while(racha < 3 && rachapc < 3){
        let pc = aleatorio(1,3);
        let jugador = Number(prompt("elije 1 para piedra, 2 para papel y 3 para tijera"));
            alert("Has elegido "+eleccion(jugador));
            alert("El pc ha elegido "+eleccion(pc));
        if(pc == jugador){
            alert("ha habido un empate");
        }else if(jugador == 1 && pc == 3 || jugador == 2 && pc == 1 || jugador ==3 && pc == 2){
            racha++;
            alert("has ganado");
        }else{
            rachapc++;
            alert("has perdido");
        }
        alert("El marcador va: jugador: "+racha+" PC: "+rachapc);
    }
    if(racha>rachapc){
        alert("Has ganado con un marcador de "+racha+" a "+rachapc);
    }else{
        alert("Has perdido con un marcador de "+racha+" a "+rachapc);
    }    
}

const boton = document.getElementById('jugar');
document.addEventListener('load', jugar);
boton.addEventListener('click', jugar);