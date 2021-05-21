const Encabezado = require("../models/encabezado");
const Datos = require("../models/datos");


class DataController {
    constructor() {
    }

    async GetDatos(cb){

        let idEncabezado = '60a296293fa7b2172ca9d2d7'
        const archivos = await Encabezado.find({ _id:idEncabezado  });
        // console.log('encabezado');
        // console.log(archivos);
        const registros = await Datos.find({ encabezado:idEncabezado  });
        // console.log('registros-----');
        // console.log(registros);
        cb(registros);
    }
}

module.exports = DataController;
