const magnitud = new mongoose.Schema({
    magnitud: { type: String},
    });

const magnitudes = mongoose.model('magnitud', magnitud);

module.exports = magnitudes