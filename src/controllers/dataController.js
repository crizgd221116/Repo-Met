const Encabezado = require("../models/encabezado");
const Datos = require("../models/datos");


class DataController {
    constructor() {
    }

    async GetDatos(idEncabezado,cb){
        const archivos = await Encabezado.find({ _id:idEncabezado  });
        await Datos.find({ encabezado:idEncabezado  }).populate('encabezado').then(data=>{
            let result = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const dato ={

                    codigoEstacion: element.encabezado.codigoEstacion,
                    estacion: element.estacion,
                    fecha: element.fecha,
                    anio: element.fecha.split("/")[0],
                    mes: element.fecha.split("/")[1],
                    dia: element.fecha.split("/")[2],
                    valor: element.valor,
                    magnitudArchivo: element.encabezado.magnitud
                }
                result.push(dato);
            }
        cb(result);
        });
    }
}

module.exports = DataController;
