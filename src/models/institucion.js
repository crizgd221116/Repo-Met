const institucion = new mongoose.Schema({
    nombre_institución: { type: String },
});

const instituciones = mongoose.model('institucion', institucion);

module.exports = instituciones