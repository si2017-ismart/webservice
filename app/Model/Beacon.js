// app/model/users.js

// Chargement des dépendances
// --------------------------------------------------------------
var mongoose     = require('mongoose');

// Initialisation du Schema de données
// --------------------------------------------------------------
var Schema       = mongoose.Schema;

// Schéma du model
// --------------------------------------------------------------

var BeaconSchema    = new Schema({
    nom: {type: String, required: [true, 'Nom obligatoire']},
    portee: {type: Number},
    position: {
        x: {type: Number, required: [true, 'Latitude obligatoire']},
        y: {type: Number, required: [true, 'Latitude obligatoire']}
    },
    etablissement : {
        id: Schema.Types.ObjectId,
        nom: {type: String, required: [true, 'Nom de l\'Etablissement obligatoire']},
        adresse: {type: String},
        mail: {type: String},
        tel: {type: String}
    }
});

//BeaconSchema.index({ etablissement.id: 1});
 

module.exports = mongoose.model('Beacon', BeaconSchema);