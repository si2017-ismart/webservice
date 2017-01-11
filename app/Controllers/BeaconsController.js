var express = require('express')
  , router = express.Router();

  // Chargement des dépendances
// --------------------------------------------------------------
var mongoose     	= require('mongoose');
var async 			= require("async");

var apicache = require('apicache').options({ debug: true }).middleware;


// Connexion vers la base
// --------------------------------------------------------------
var connection = require('../../db_mongo.js');

// Chargement du Model
// --------------------------------------------------------------
var Beacon = require('../../app/Model/Beacon');

// Chargement du Model
// --------------------------------------------------------------
var HelpSession = require('../../app/Tools/Session');


/**
 *	@brief 		Récupère un Beacon via son Id
 *	@param 		id : ObjectId de l'utilisateur
 **/
router.get('/existId/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty().isMongoId();
	var retour = {};


	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Beacon.findOne({'_id': req.params.id}, function(err, beacon)
	{
		if (err)
        {
        	retour = {error: err};
            res.status(400).json(retour);
            return;
        }
        else
        {
        	if(beacon)
        	{
        		retour = true;
        		res.json(retour);
        	}
        	else
        	{
        		retour = false;
        		res.status(400).json(retour); 
        	}
        	
        }
	});
});


// Appeler de l'aide
router.get('/needHelp/:id/:name/:sex/:profil', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty().isMongoId();
	req.checkParams('name', 'Invalid name').notEmpty().isAlpha();
	req.checkParams('sex', 'Invalid sex').notEmpty().isAlpha();
	req.checkParams('profil', 'Invalid profil').notEmpty().isAlpha();
	var retour = {};


	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var beacon = Beacon.findOne({'_id': req.params.id}).exec();
	beacon.then(function(result)
	{
    	if(!result)
    	{
    		retour = {error: "Unknown"};
    		res.status(400).json(retour);
    		return;
    	}

    	var session = new Session();
    	session.create(result.id, result.nom, result.position, result.etablissement_id, name, sex);

    	// Recherche des intervenants
    	Etablissement.find({"_id": result.etablissement_id}, function(err, result) {
    		if(err)
    		{

    		}
    		else
    		{
    			console.log("recherche des intervenants");
    		}
    	});
	})
	
	
});



// Je cherche les intervenants de l'organisation du token

// Je les previens du besoin d'aide

module.exports = router;