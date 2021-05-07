const metadata = new mongoose.Schema({
    metadata: { type: String},
    });

const metadatos = mongoose.model('metadatos', metadata);

module.exports = metadatos