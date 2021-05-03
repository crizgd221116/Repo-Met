const readline = require("readline"),
    fs = require("fs"),
    NOMBRE_ARCHIVO = 'uploads/ejemplo.txt';

    let lector = readline.createInterface({
    input: fs.createReadStream(NOMBRE_ARCHIVO)
});

lector.on("line", linea => {
    console.log("Tenemos una línea:", linea);
});

