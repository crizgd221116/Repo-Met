class FileModel {

    constructor(userId, nombreEstaciones, fechaInicio, fechafin, path, magnitud,
        numeroRegistros,descripcion,tituloArchivo,origen,numEstaciones,codigoEstacion,lecturas) {
        this.userId = userId;
        this.nombreEstaciones = nombreEstaciones;
        this.fechaInicio = fechaInicio;
        this.fechafin = fechafin;
        this.path = path;
        this.magnitud = magnitud;
        this.numeroRegistros = numeroRegistros;
        this.descripcion = descripcion;
        this.tituloArchivo = tituloArchivo;
        this.origen = origen;
        this.numEstaciones = numEstaciones;
        this.codigoEstacion = codigoEstacion;
        this.lecturas = lecturas;

    }
    // var userFile = require('./user.js');
}
module.exports = FileModel;