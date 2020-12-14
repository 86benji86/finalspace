const URLCHAR = "https://finalspaceapi.com/api/v0/character/?limit=9";
const URLQUOTES = "https://finalspaceapi.com/api/v0/quote";
const URLLOCATION = "https://finalspaceapi.com/api/v0/location";
let characters = [];
let quotes = [];
let locations = [];

// Trae personajes de la API, funcion asincronica, solo avanza a la siguiente linea cuando resuelve la promesa,
// fetch hace peticion http, await porque es asincronica la funcion. GET es el metodo por defecto de fetch
// Una vez que tiene la respuesta (en formato stringify), lo convierte a json con los personajes
const getEntry = async (url) => {
    try {
    
    const response = await fetch(url); 
    
    const entry = await response.json();
    return entry;
    } catch (error) { // Si falla cualquier linea, error a consola
        console.error(error);
    }
};

// Crea la columna (estructura minima), previa destructuracion del objeto character y la monta en el nodo html
const createNode = ({id, img_url, name, status, alias}) => {
    let quotes = getQuote(name);
    const node = `
        <div class="col-md-4 col-12" id="${id}">
            <div class="card mt-2 ml-1 mr-1">
            <img src="${img_url}" class="img-round-small"/>
            <div class="card-body">
            <button onClick="delChar(${id})" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Estado: ${status}</p>
                    <p class="card-text">Alias: ${alias.length === 0 ? "No tiene" : alias[Math.round(Math.floor(Math.random()*alias.length))]}</p>
                    <p class="card-text">Random quote: "${quotes.quote}"</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById("apiResponse").insertAdjacentHTML("beforeend", node);
};

// Itera los nodos y llama a createNode
const iterateNodes = (node = characters) => node.map((nodo) => createNode(nodo));

const getQuote = (name) => {
    let quotesFrom = quotes.filter((quote) => quote.by === name);
    return quotesFrom[[Math.round(Math.floor(Math.random()*quotesFrom.length))]];
}

// Cuando se remueven todos los personajes, muestra mensaje y deshabilita la busqueda
const showMessage = () => {
    document.querySelector("#sinpersonajes").innerHTML = "No hay personajes para mostrar";
    document.querySelector("#buscar").disabled = true;
};

// Remueve personaje de la lista de personajes (del dom y del array). Como le pasa el id como parametro, filtra -no borra- todos los personajes cuya id sea distinta de la pasada
const delChar = (id) => {
    document.getElementById(id).remove();
    characters = characters.filter(character => character.id != id);
    characters.length === 0 ? showMessage() : null;
};

// Busca un personaje
const findChar = () =>{
    const {value: name} = document.querySelector("#buscar");
    const foundCharacter = characters.find((character) => character.name.toLowerCase() === name.toLowerCase());
    foundCharacter !== undefined ? console.log(foundCharacter) : console.log("no se encuentra");
    
};

const start = async () => {
    document.getElementById("find").addEventListener("click", findChar);
    document.getElementById("buscar").addEventListener("keyup", function(event) {
        if (event.code === "Enter") {
            findChar();
        }
    });
    characters = await getEntry(URLCHAR);
    quotes = await getEntry(URLQUOTES);
    // Recorre el objeto y crea de a un nodo por recorrida del mismo
    iterateNodes(characters);
};


// La funcion que dispara el resto
window.onload = start();