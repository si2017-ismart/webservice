
// Chargement des dépendances
// --------------------------------------------------------------
var mongoose     = require('mongoose');

// Initialisation du Schema de données
// --------------------------------------------------------------
var Schema       = mongoose.Schema;

// Schéma du model
// --------------------------------------------------------------

var BeaconSchema    = new Schema({
    id_beacon: {type: String},
    nom: {type: String, required: [true, 'Nom obligatoire']},
    portee: {type: Number},
    position: {
        x: {type: Number},
        y: {type: Number}
    },
    etablissement : {
        id: Schema.Types.ObjectId,
        nom: {type: String, required: [true, 'Nom de l\'Etablissement obligatoire']},
        mail: {type: String},
    },
    camera_url: {type: String}
});

BeaconSchema.index({ id_beacon: 1});
 

module.exports = mongoose.model('Beacon', BeaconSchema);