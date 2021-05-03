const mongoose = require('mongoose');

//------------ Files Remmaq Schema ------------//
const FileRemmaqSchema = new mongoose.Schema({
    tituloArchivo: { type: String},
    origen: { type: String,default:"REMMAQ"},
    magnitud: { type: String},
    description: { type: String,default:'Sin descripcion'},
    nombreestaciones:{type: String},
    date:{type:Date,default:Date.now},
    fechainicio:{type:String},
    fechafin:{type:String},
    path:{type: String},
    user:{type: String}
    });

const FileRemmaq = mongoose.model('encabezado', FileRemmaqSchema);

module.exports = FileRemmaq;