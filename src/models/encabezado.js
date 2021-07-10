const mongoose = require('mongoose');
const { Schema } = mongoose
//------------ Files Remmaq Schema ------------//
const EncabezadoSchema = new mongoose.Schema({
    tituloArchivo: { type: String, uppercase: true },
    origen: { type: String, index: true },
    magnitud: { type: String },
    description: { type: String, default: 'Sin descripcion' },
    nombreestaciones: { type: String, index: true },
    date: { type: Date, default: Date.now },
    fechainicio: { type: String },
    fechafin: { type: String },
    path: { type: String },
    user: { type: String },
    metadatos: {
        type: Schema.Types.ObjectId,
        ref: 'metadatos',
    }
});

const Encabezado = mongoose.model('encabezado', EncabezadoSchema);

module.exports = Encabezado;