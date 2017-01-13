
// Chargement des dépendances
// --------------------------------------------------------------
var mongoose     = require('mongoose');

// Initialisation du Schema de données
// --------------------------------------------------------------
var Schema       = mongoose.Schema;

var EtablissementSchema = new Schema({
	nom:  					{type: String, required: [true, 'Nom obligatoire']},
	adresse: 				{type: String},
	pays: 					{type: String},
	ville: 					{type: String},
	zip: 					{type: String},
	mail: 					{type: String, required: [true, 'Mail obligatoire']},
	tel: 					{type: String},
	administrateur: 		{
		identifiant: 		{type: String},
		password: 			{type: String}
	},
	intervenants: [
		Schema({
			nom: 			{type: String, required: [true, 'Nom de l\'intervenant requis']},
			prenom: 		{type: String, required: [true, 'Prenom de l\'intervenant requis']},
			identifiant: 	{type: String, required: [true, 'Identifiant de l\'intervenant requis']},
			password: 		{type: String, required: [true, 'Mot de passe de l\'intervenant obligatoire']},
			disponibilite: 	{type: Boolean}
		})
	],
	sessions: [
		Schema({
			id: 			{type: String},
			beacon: {
				id: 		{type: String, required: [true, 'Identifiant du beacon obligatoire']},
				nom: 		{type: String},
				position: {
					x: 		{type: Number},
					y: 		{type: Number}
				}
			},
			user: {
				nom:  		{type: String},
				sexe: 		{type: String},
				type: 		{type: String},
			},
			intervenant: {
				id: 		{type: Schema.Types.ObjectId},
				nom: 		{type: String},
				prenom: 	{type: String}
			},
			date: 			{type: Date},
			prise: 			{type: Boolean}
		}, {_id: false})
	]
}, {strict : false});
 

module.exports = mongoose.model('Etablissement', EtablissementSchema);