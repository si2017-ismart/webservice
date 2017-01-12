var express = require('express')
  , router = express.Router();

  // Chargement des dépendances
// --------------------------------------------------------------
var mongoose     	= require('mongoose');
var async 			= require("async");

//var apicache = require('apicache').options({ debug: true }).middleware;


// Connexion vers la base
// --------------------------------------------------------------
var connection = require('../../db_mongo.js');

// Chargement du Model
// --------------------------------------------------------------
var Intervention = require('../../app/Model/Intervention');
var Etablissement = require('../../app/Model/Etablissement');



router.get('/', function(req, res)
{
	var promise = Intervention.find({});
	promise.then(function(interventions)
	{
		res.json(interventions);
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
});

router.get('/getByDate/:date', function(req, res)
{
	var promise = Intervention.find({date: req.params.date});
	promise.then(function(interventions)
	{
		res.json(interventions);
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
});

router.get('/getByEtablissement/:id', function(req, res)
{
	var promise = Intervention.find({"etablissement.id": req.params.id});
	promise.then(function(interventions)
	{
		res.json(interventions);
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
});

router.get('/getByEtablissementByDate/:id/:date', function(req, res)
{
	var promise = Intervention.find({"etablissement.id": req.params.id, date: req.params.date});
	promise.then(function(interventions)
	{
		res.json(interventions);
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
});

router.post('/add', function(req, res)
{
	req.checkBody('token', 'Token invalide').notEmpty();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var fin = new Date();


	promise = Etablissement.findOne({"sessions.id": req.body.token}, {"sessions.$": 1, "nom": 1}).exec();
	promise.then(function(session)
	{
		var duree = (fin-new Date(session.sessions[0].date));
		// Création du log grace aux informations de session
		intervention = new Intervention({
			date: session.sessions[0].date,
			duree: (fin-session.sessions[0].date),
			intervenant: {
				id: session.sessions[0].intervenant.id,
				nom: session.sessions[0].intervenant.nom,
				prenom: session.sessions[0].intervenant.prenom
			},
			etablissement: {
				id: session._id,
				nom: session.nom
			},
			user: {
				sexe: session.sessions[0].user.sexe,
				type: session.sessions[0].user.type
			},
			tokenUsed: req.body.token,
			beacon: {
				id: session.sessions[0].beacon.id,
				nom: session.sessions[0].beacon.nom,
				position: {
					x: session.sessions[0].beacon.position.x,
					y: session.sessions[0].beacon.position.y
				}
			},
			satisfaction: 5
		});

		return intervention.save();
	})
	.then(function(update)
	{
		res.json("Intervention logged");
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
});

router.post('/satisfaction', function(req, res)
{
	req.checkBody('token', 'Token invalide').notEmpty();
	req.checkBody('satisfaction', 'Satisfaction invalide').notEmpty().isInt();



	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var token = req.body.token.trim();

	var promise = Intervention.update({tokenUsed: token}, {"$set": {satisfaction: req.body.satisfaction}}).exec();
	promise.then(function(update)
	{
		console.log(update);
		res.json('Satisfaction saved');
	})
	.catch(function(err)
	{
		res.status(400).json(err);
	});
})



module.exports = router;
