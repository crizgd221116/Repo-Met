const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    genero: { type: String, default: 'M' },
    titulo: { type: String, default: 'Ing' },
    ocupacion: { type: String, default: 'Por definir' },
    description: { type: String, default: 'Añadir desc' },
    verified: {
        type: Boolean,
        default: false
    },
    resetLink: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;