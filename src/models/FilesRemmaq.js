const mongoose = require('mongoose');

//------------ Files Remmaq Schema ------------//
const FileRemmaqSchema = new mongoose.Schema({
    tituloArchivo: { type: String},
    origen: { type: String,default: 'REMMAQ'},
    magnitud: { type: String},
    description: { type: String,default:'Sin descripcion'},
    nombreestaciones:{type: String},
    date:{type:Date,default:Date.now},
    user:{type: String}
    });

const FileRemmaq = mongoose.model('FileRemmaq', FileRemmaqSchema);

module.exports = FileRemmaq;