const URLCHAR = "https://finalspaceapi.com/api/v0/character/?limit=9";
let characters = [];

// Trae personajes de la API, funcion asincronica, solo avanza a la siguiente linea cuando resuelve la promesa,
// fetch hace peticion http, await porque es asincronica la funcion. GET es el metodo por defecto de fetch
// Una vez que tiene la respuesta (en formato stringify), lo convierte a json con los personajes
const getCharacters = async (url = URLCHAR) => {
    try {
    
    const response = await fetch(url); 
    
    const characters = await response.json();
    return characters;
    } catch (error) { // Si falla cualquier linea, error a consola
        console.error(error);
    }
};

// Crea la columna (estructura minima), previa destructuracion del objeto character y la monta en el nodo html
const createNode = ({id, img_url, name, status, alias}) => {
    const node = `
        <div class="col-md-4 col-12" id="${id}">
            <div class="card mt-2 ml-1 mr-1">
                <img src="${img_url}" class="img-round-small"/>
                <div class="card-body ">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Estado: ${status}</p>
                    <p class="card-text">Alias: ${alias.length === 0 ? "No tiene" : alias[Math.round(Math.floor(Math.random()*alias.length))]}</p>
                    <button onClick="delChar(${id})" class="btn btn-danger">Remover</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("apiResponse").insertAdjacentHTML("beforeend", node);
};

// Itera los nodos y llama a createNode
const iterateNodes = (node = characters) => node.map((nodo) => createNode(nodo));

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
    characters = await getCharacters();
    // Recorre el objeto y crea de a un nodo por recorrida del mismo
    iterateNodes(characters);    
};


// La funcion que dispara el resto
window.onload = start();