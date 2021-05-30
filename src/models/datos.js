const mongoose = require('mongoose');
const { Schema } = mongoose
const dato = new mongoose.Schema({
    fecha: { type: String},
    valor: { type: String},
    codigoMagnitud:{type:String},
    estacion:{type:String},
    encabezado: {
        type: Schema.Types.ObjectId,
        ref: 'encabezado',
      }
    });

const datos = mongoose.model('datos', dato);

module.exports = datos