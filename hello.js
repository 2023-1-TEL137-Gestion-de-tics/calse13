const fs = require("fs");

let archivo = fs.readFileSync("texto.txt");

console.log(archivo.toString());
console.log("Fin de programa");

