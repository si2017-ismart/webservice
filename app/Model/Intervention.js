
// app/model/users.js

// Chargement des dépendances
// --------------------------------------------------------------
var mongoose     = require('mongoose');

// Initialisation du Schema de données
// --------------------------------------------------------------
var Schema       = mongoose.Schema;

var InterventionSchema   = new Schema({
    date: {type: Date},
    duree: {type: Number},
    intervenant: {
        id: Schema.Types.ObjectId,
        nom: {type: String},
        prenom : {type: String}
    },
    etablissement: {
        id: {type: String},
        nom: {type: String}
    },
    satisfaction: {type: Boolean},
    user: {
        sexe: {type: String},
        type: {type: String}
    }
}, {strict : false});

InterventionSchema.index({date: 1});

module.exports = mongoose.model('Intervention', InterventionSchema);