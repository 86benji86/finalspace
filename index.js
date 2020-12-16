const URLCHAR = "https://finalspaceapi.com/api/v0/character/";
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
const createNodeCharacter = ({id, img_url, name, status, alias, abilities}) => {
    const node = `
        <div class="col-md-4 col-12" id="${id}">
            <div class="card mt-2 ml-1 mr-1">
            <img src="${img_url}" class="img-round-small"/>
            <div class="card-body">
            <button onClick="delChar(${id})" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Status: ${status}</p>
                    <p class="card-text">Alias: ${alias.length === 0 ? "Unknown" : alias[Math.round(Math.floor(Math.random()*alias.length))]}</p>
                    <p class="card-text">Abilities: ${abilities.length === 0 ? "Unknown" : abilities.join(" - ")}</p>
                    <p class="card-text">Random quote: "${getQuote(name) === undefined ? "-" : getQuote(name).quote}"</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById("apiResponse").insertAdjacentHTML("beforeend", node);
};

const createNodeLocation = ({id, img_url, name, type, inhabitants}) => {
    const node = `
        <div class="col-md-4 col-12" id="${id}">
            <div class="card mt-2 ml-1 mr-1">
            <img src="${img_url}" class="img-round-small"/>
            <div class="card-body">
            <button onClick="delChar(${id})" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Type: ${type}</p>
                    <p class="card-text">Inhabitants: ${inhabitants.join(" - ")}</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById("apiResponse").insertAdjacentHTML("beforeend", node);
};

const createNodeQuotes = ({id, by, quote}) => {
    const node = `
        <div class="col-md-4 col-12" id="${id}">
            <blockquote class="blockquote text-center">
                <p class="mb-0">${quote}</p>
                <footer class="blockquote-footer">${by}</footer>
            </blockquote>
        </div>
        `;
    document.getElementById("apiResponse").insertAdjacentHTML("beforeend", node);
};

// Itera los nodos y llama a createNode
const iterateNodesCharacter = (node = character) => {
    clearNodes();
    node.map((nodo) => createNodeCharacter(nodo));
    document.querySelector("#buscar").disabled = false;
    document.getElementById("buscar").addEventListener("keyup", findChar);
};

const iterateNodesLocation = (node = location) => {
    clearNodes();
    node.map((nodo) => createNodeLocation(nodo));
};

const iterateNodesQuotes = (node = episode) => {
    clearNodes();
    node.map((nodo) => createNodeQuotes(nodo));
};

const getQuote = (name) => {
    let quotesFrom = quotes.filter((quote) => quote.by === name);
    return quotesFrom[[Math.round(Math.floor(Math.random()*quotesFrom.length))]];
}

// Cuando se remueven todos los personajes, muestra mensaje y deshabilita la busqueda
const showMessage = () => {
    document.querySelector("#sincontenido").innerHTML = "No hay contenido para mostrar";
    document.querySelector("#buscar").disabled = true;
};

// Remueve personaje de la lista de personajes (del dom y del array). Como le pasa el id como parametro, filtra -no borra- todos los personajes cuya id sea distinta de la pasada
const delChar = (id) => {
    document.getElementById(id).remove();
    characters = characters.filter(character => character.id != id);
    characters.length === 0 ? showMessage() : null;
};

const clearNodes = () => {
    let node = document.getElementById("apiResponse");
    node.innerHTML = "";
};


// Busca un personaje
const findChar = () => {
    const searchBar = document.getElementById("buscar")
    searchBar.addEventListener("keyup", (e) => {
        const searchString = e.target.value;
        const filteredElements = characters.filter(character =>             character.name.toLowerCase().includes(searchString.toLowerCase()));
        iterateNodesCharacter(filteredElements);
    });
}

const start = async () => {
    characters = await getEntry(URLCHAR);
    quotes = await getEntry(URLQUOTES);
    locations = await getEntry(URLLOCATION);
    document.querySelector("#buscar").disabled = true;
    // document.getElementById("find").addEventListener("click", findChar);
    document.getElementById("characters").addEventListener("click", event =>
    iterateNodesCharacter(characters));
    document.getElementById("quotes").addEventListener("click", event =>
    iterateNodesQuotes(quotes));
    document.getElementById("locations").addEventListener("click", event =>
    iterateNodesLocation(locations));
}

// La funcion que dispara el resto
window.onload = start();