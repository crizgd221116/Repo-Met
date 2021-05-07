const institucion = new mongoose.Schema({
    institucion: { type: String},
    });

const instituciones = mongoose.model('institucion', institucion);

module.exports = instituciones