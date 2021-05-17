const FileModel = require("../models/fileModel");
const readline = require('readline');
const fs = require('fs');

const Encabezado = require("../models/encabezado");
const Datos = require("../models/datos");
//Delimitadores
const CODIGO_FIN_DELIMITADOR = 'CODIGO';
const CODIGO_INICIO_DELIMITADOR = ':';
class ReadFileController {
    constructor() {
    }


    ReadTxtFile(filePath, cb) {
        let result = new FileModel();
        this.ReadContentTxtFile(filePath, file => {
            result = file;
            // console.log(result);
            cb(result);
        })
    }

    ReadContentTxtFile(filePath, process) {
        let file = new FileModel();
        fs.readFile(`${filePath}`, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // console.log(typeof (data));
                let lector = readline.createInterface({
                    input: fs.createReadStream(`${filePath}`)
                });

                let i = 0;
                const registros = [];
                lector.on("line", linea => {

                    //magnitud
                    if (i == 2) {
                        const index = linea.indexOf(")", 0);
                        file.magnitud = linea.substring(0, index + 1);
                    }

                    //nombre estacion
                    if (i == 6) {
                        const startIndex = linea.indexOf(CODIGO_INICIO_DELIMITADOR, 0);
                        const endIndex = linea.indexOf(CODIGO_FIN_DELIMITADOR, 0);
                        file.nombreEstaciones = linea.substring(startIndex + 1, endIndex).trim();
                    }

                    //Lectura de registros
                    if (i >= 11) {
                        const fila = linea.split(/\s+/);
                        const fechaFila = fila[0] + "/" + fila[1].padStart(2, '0');
                        for (let index = 2; index < fila.length; index++) {
                            const dia = "" + (index - 1);
                            const arreglo = {
                                fecha: fechaFila + "/" + dia.padStart(2, '0'),
                                pertenece: file.nombreEstaciones,
                                valor: fila[index],
                            };
                            registros.push(arreglo);
                        }

                    }
                    i++;
                });


                lector.on('close', function () {
                    file.lecturas = registros;
                    file.fechaInicio = registros[0].fecha;
                    file.fechafin = registros[registros.length - 1].fecha;
                    file.path = filePath;
                    console.log(file.fechaInicio)
                    process(file)
                });
            }
        });
    }

    async SaveFile(file) {
        // const { tituloArchivo, origen, magnitud, description } = req.body;

        let encabezado = new Encabezado();
        encabezado.tituloArchivo = file.tituloArchivo;
        encabezado.origen = file.origen;
        encabezado.magnitud = file.magnitud;
        encabezado.description = file.description;
        

        encabezado.user = file.userId;
        encabezado.tituloArchivo = file.tituloArchivo;
        encabezado.nombreestaciones = file.nombreEstaciones;
        encabezado.fechainicio = file.fechaInicio;
        encabezado.fechafin = file.fechafin;
        encabezado.path = file.path;
        await encabezado.save(function (error, room) {
            console.log(room.id);
            const data = [];
            for (let j = 0; j < file.lecturas.length; j++) {
                if (!isNaN(file.lecturas[j].valor)) {
                    const dato = {
                        encabezado: room.id,
                        fecha: file.lecturas[j].fecha,
                        pertenece: file.lecturas[j].pertenece,
                        valor: file.lecturas[j].valor,
                    };
                    data.push(dato);
                }
            }

            Datos.insertMany(data).then(function () {
                console.log("Data inserted")  // Success
            }).catch(function (error) {
                console.log(error)      // Failure
            });
        });
    }
}

module.exports = ReadFileController;