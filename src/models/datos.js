const dato = new mongoose.Schema({
    fecha: { type: Date},
    valor: { type: String},
    codigoEncabezado: { type: String },
    codigoMagnitud:{type:String}
    });

const datos = mongoose.model('datos', dato);

module.exports = datos