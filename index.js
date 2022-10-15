//Requerimos express
const express = require("express"); 
//Requerimos libreria para librarnos de problemas de CORS
const cors = require('cors');
//Creamos la app ejecutando express
const app = express();
//Hacemos que express use cors
app.use(cors());
//Confuguramos express para que pueda recibir peticiones con JSON
app.use(express.json());
//Clase de jugadores y lista de jugadores 
const jugadores = [];
const combates = []; 
class Jugador{
    constructor(id){
        this.id = id; 
        this.mokepon = null; 
    }
    addmokepon(idmokepon){
        this.mokepon = idmokepon; 
    }
    posicion(x,y){
        this.x = x;
        this.y = y;
    }
}
class Mokepon{
    constructor(id){
        this.id = id; 
    }
}
class Combate {
    constructor(j1, j2){
        this.j1 = j1;
        this.j2 = j2;
    }
}
//Definimos peticiones y como responder a ellas 
app.get('/unirse', (req, res)=>{
    const id = `${Math.random()*1000000000000000}`;
    const jugador = new Jugador(id);
    jugadores.push(jugador);
    //Esta sería la manera de solucionar problemas tipo cors sin la librería
    //res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(id);
});
//Los dos puntos de la URL son para indicar que es una variable que recibiremos desde ahí 
app.post('/mokepon/:jugadorId', (req, res)=>{
    //Con el objeto request podemos acceder a los parametros y desde ahí a la variable previamente definida
    const jugadorId = req.params.jugadorId || "";
    //Extraigo las variables del body  a través del objeto request 
    const idmokepon = req.body.mokepon || "";

    const mokepon = new Mokepon(idmokepon);

    let idjugador = findplayer(jugadorId);

    jugadores[idjugador].addmokepon(idmokepon); 
    //Haciendo que la consola logee las variables para verficar que todo este correcto 
    console.log(jugadores);
    //Una vez ya extragimos de la URL la variable, podemos utilizarla sin problema 
    console.log(jugadorId);
    //Para finalizar la respuesta
    res.end();
});
//Atrapa las coordenadas del jugador 
app.post('/mokepon/:idjugador/position', (req, res)=>{
    const jugadorId = req.params.idjugador; 
    let jugador = findplayer(jugadorId);
    jugadores[jugador].posicion(req.body.x, req.body.y);
    let enemigos = jugadores.filter(jugador=>jugador.id!==jugadorId);
    res.send({
        enemigos
    });     
});
app.post('/combate/:idjugador', (req, res)=>{
    const j1 = req.params.idjugador;
    const j2 = req.body.id; 
    const combate = new Combate(j1,j2);
    combates.push(combate); 
    console.log(combates); 
    res.end(); 
});
app.get('/combate/:idjugador', (req, res)=>{
    const j2 = req.params.idjugador; 
    const combateEnCurso = combates.filter(combate => combate.j2 == j2); 
    if(combateEnCurso[0]){
        let id = findplayer(combateEnCurso[0].j1)
        return res.send({
            rival:jugadores[id]
        })
    }else{
        res.send({
            rival: null
        })
    }

}); 
//Funcion encontrar jugador; 
function findplayer(jugadorId){
    return jugadores.findIndex(jugador =>jugador.id === jugadorId); 
}
//Iniciando listener del servidor y definiendo constantes de dicho servidor 
const puerto = 8080;
const hostname = '127.0.0.1';
app.listen(puerto, hostname, ()=>{
    console.log('El servidor ya inició');
});