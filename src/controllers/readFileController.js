const FileModel = require("../models/fileModel");
const readline = require('readline');
const fs = require('fs');
//Delimitadores
const CODIGO_FIN_DELIMITADOR = 'CODIGO';
const CODIGO_INICIO_DELIMITADOR = ':';
class ReadFileController {
    constructor() {
    }


    ReadTxtFile(req, cb) {
        let result = new FileModel();
        this.ReadContentTxtFile(req, file => {
            result = file;
            // console.log(result);
            cb(result);
        })
    }

    ReadContentTxtFile(req, process) {
        let file = new FileModel();
        fs.readFile(`${req.file.path}`, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // console.log(typeof (data));
                let lector = readline.createInterface({
                    input: fs.createReadStream(`${req.file.path}`)
                });

                let i = 0;
                const registros = [];
                lector.on("line", linea => {

                    //magnitud
                    if (i == 2) {
                        const index = linea.indexOf(")", 0);
                        file.magnitud = linea.substring(0, index + 1);
                        // console.log(file.magnitud);
                    }

                    //nombre estacion
                    if (i == 6) {
                        const startIndex = linea.indexOf(CODIGO_INICIO_DELIMITADOR, 0);
                        const endIndex = linea.indexOf(CODIGO_FIN_DELIMITADOR, 0);
                        file.nombreEstaciones = linea.substring(startIndex + 1, endIndex).trim();
                        // console.log(file.nombreEstaciones);
                        // console.log(startIndex);
                        // console.log(endIndex);
                    }
                    //Lectura de registros
                    if (i >= 11) {
                        const fila = linea.split(/\s+/);
                        const fechaFila = fila[0] + "/" + fila[1].padStart(2, '0');
                        // console.log(fechaFila);
                        for (let index = 2; index < fila.length; index++) {
                            const dia = "" + (index-1);
                            const arreglo = {
                                fecha: fechaFila + "/" + dia.padStart(2, '0'),
                                pertenece: file.nombreEstaciones,
                                valor: fila[index],
                            };
                            registros.push(arreglo);
                        }

                    }

                    // const magnitud = linea.trim().split("\t");
                    // console.log(magnitud[0])
                    i++;
                });


                lector.on('close', function () {
                    file.lecturas = registros;
                    file.fechaInicio = registros[0].fecha;
                    file.fechafin = registros[registros.length - 1].fecha;
                    console.log(file.fechaInicio)
                    process(file)
                });
            }
        });
    }
}

module.exports = ReadFileController;