const mongoose = require('mongoose');

//------------ Files Remmaq Schema ------------//
const FileRemmaqSchema = new mongoose.Schema({
    titu: { type: String},
    origen: { type: String},
    magnitud: { type: String},
    description: { type: String},
    date:{type:Date,default:Date.now}
    });

const FileRemmaq = mongoose.model('FileRemmaq', FileRemmaqSchema);

module.exports = FileRemmaq;