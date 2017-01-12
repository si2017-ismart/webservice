
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
    satisfaction: {type: Number},
    user: {
        sexe: {type: String},
        type: {type: String}
    },
    tokenUsed: {type: String},
    beacon: {
        id: {type: String},
        nom: {type: String},
        position: {
            x: {type: Number},
            y: {type: Number}
        }
    } 
}, {strict : false});

InterventionSchema.index({date: 1, tokenUsed: 1});

module.exports = mongoose.model('Intervention', InterventionSchema);