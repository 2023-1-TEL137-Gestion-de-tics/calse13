const fs = require("fs");

fs.readFile("texto.txt", function (err, archivo) {
    if(err) throw err;

    console.log(archivo.toString());
});

console.log("Fin de programa");