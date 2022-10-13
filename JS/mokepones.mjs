//Creando clase
class Mokepon{
    constructor (nombre, vida){
        this.nombre = nombre; 
        this.foto = "Styles/Assets/mokepons_mokepon_"+nombre+"_attack.webp"; 
        this.vida = vida; 
        this.ataques = []; 
        this.x = 20;
        this.y = 30;
        this.alto = 150;
        this.ancho = 150; 
        this.mapaFoto = new Image();
        this.mapaFoto.src = this.foto; 
    }
}
//Creando mokepones
let Hipodoge = new Mokepon('Hipodoge', 3);
let Capipepo = new Mokepon('Capipepo', 3);
let Ratigueya = new Mokepon('Ratigueya', 3);
//Añadiendo ataques
Hipodoge.ataques.push(
    {
        nombre: "Agua 💧",
        id: "Agua"
    },
    {
        nombre: "Agua 💧",
        id: "Agua"
    },
    {
        nombre: "Agua 💧",
        id: "Agua"
    },
    {
        nombre: "Fuego 🔥",
        id: "Fuego"
    },
    {
        nombre: "Tierra 💎",
        id: "Tierra"
    }
);
Capipepo.ataques.push(
    {
        nombre: "Tierra 💎",
        id: "Tierra"
    },
    {
        nombre: "Tierra 💎",
        id: "Tierra"
    },
    {
        nombre: "Tierra 💎",
        id: "Tierra"
    },
    {
        nombre: "Fuego 🔥",
        id: "Fuego"
    },
    {
        nombre: "Agua 💧",
        id: "Agua"
    }
);
Ratigueya.ataques.push(
    {
        nombre: "Fuego 🔥",
        id: "Fuego"
    },
    {
        nombre: "Fuego 🔥",
        id: "Fuego"
    },
    {
        nombre: "Fuego 🔥",
        id: "Fuego"
    },
    {
        nombre: "Tierra 💎",
        id: "Tierra"
    },
    {
        nombre: "Agua 💧",
        id: "Agua"
    }
);
//Exportando los mokepones 
let mokepones = [];
mokepones.push(Hipodoge, Capipepo, Ratigueya);
export {mokepones};