//Creando clase
class Mokepon{
    constructor (nombre, vida){
        this.nombre = nombre; 
        this.foto = "Styles/Assets/mokepons_mokepon_"+nombre+"_attack.webp"; 
        this.vida = vida; 
        this.ataques = []; 
    }
}
//Creando mokepones
let Hipodoge = new Mokepon('Hipodoge', 3);
let Capipepo = new Mokepon('Capipepo', 3);
let Ratigueya = new Mokepon('Ratigueya', 3);
//Añadiendo ataques
Hipodoge.ataques.push(
    {
        nombre: "💧",
        id: "Agua"
    },
    {
        nombre: "💧",
        id: "Agua"
    },
    {
        nombre: "💧",
        id: "Agua"
    },
    {
        nombre: "🔥",
        id: "Fuego"
    },
    {
        nombre: "💎",
        id: "Tierra"
    }
);
Capipepo.ataques.push(
    {
        nombre: "💎",
        id: "Tierra"
    },
    {
        nombre: "💎",
        id: "Tierra"
    },
    {
        nombre: "💎",
        id: "Tierra"
    },
    {
        nombre: "🔥",
        id: "Fuego"
    },
    {
        nombre: "💧",
        id: "Agua"
    }
);
Ratigueya.ataques.push(
    {
        nombre: "🔥",
        id: "Fuego"
    },
    {
        nombre: "🔥",
        id: "Fuego"
    },
    {
        nombre: "🔥",
        id: "Fuego"
    },
    {
        nombre: "💎",
        id: "Tierra"
    },
    {
        nombre: "💧",
        id: "Agua"
    }
);
//Exportando los mokepones 
let mokepones = [];
mokepones.push(Hipodoge, Capipepo, Ratigueya);
export {mokepones};