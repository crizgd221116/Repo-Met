const estacion = new mongoose.Schema({
    estacion: { type: String},
    latitud: { type: String,default:"REMMAQ"},
    longitud: { type: String},
    elevacion: { type: String},
    institucion:{type: String}
    });

const estaciones = mongoose.model('encabezado', estacion);

module.exports = estaciones;