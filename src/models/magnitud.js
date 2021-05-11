const magnitud = new mongoose.Schema({
    nombre_magnitud: { type: String },
});

const magnitudes = mongoose.model('magnitud', magnitud);

module.exports = magnitudes