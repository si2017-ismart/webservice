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
var Beacon = 		require('../../app/Model/Beacon');
var Etablissement = require('../../app/Model/Etablissement');

// Chargement du Model
// --------------------------------------------------------------
var HelpSession = require('../../app/Tools/Session');



router.get('/', function(req, res)
{
	Beacon.find({}, {"id_beacon": 1, "_id": 0}, function(err, result)
	{
		if(err)
		{
			retour = {error: err};
            res.status(400).json(retour);
            return;
		}
		else
		{
        	res.json(result);
		}
	});
});

/**
 *	@brief 		Récupère un Beacon via son Id
 *	@param 		id : ObjectId de l'utilisateur
 **/
router.get('/existId/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty();
	var retour = {};


	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Beacon.findOne({'id_beacon': req.params.id}, {id_beacon: 1, etablissement:1}, function(err, beacon)
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
        		retour = {success: true, data: beacon};
        		res.json(retour);
        	}
        	else
        	{
        		retour = {success: false};
        		res.status(400).json(retour); 
        	}
        	
        }
	});
});

router.get('/byEtablissement/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty().isMongoId();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Beacon.find({"etablissement.id": req.params.id}, {id_beacon: 1, _id: 0}, function(err, result)
	{
		if(err)
		{
			retour = {'error': err};
			res.status(400).json(retour);
			return;
		}
		else
		{
			res.json(retour);
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

	var beacon = Beacon.findOne({'id_beacon': req.params.id}).exec();
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


router.post('/add', function(req, res)
{
	req.checkBody('id_etablissement', 'Id Etablissement invalide').notEmpty().isMongoId();
	req.checkBody('id', 'Id Beacon invalide').notEmpty();
	req.checkBody('nom', 'Nom Beacon invalide').notEmpty();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({"_id": req.body.id_etablissement}, function(err, result)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			beacon = new Beacon({
				id_beacon: req.body.id,
				nom: req.body.nom,
				etablissement: {
					nom: result.nom,
					id: result.id,
					mail: result.mail
				}
			});

			beacon.save(function(err, result)
			{
				if(err)
				{
					res.status(400).json({error: err});
				}
				else
				{
					res.json("Beacon créé");
				}
			});
		}
	});
});


// Je cherche les intervenants de l'organisation du token

// Je les previens du besoin d'aide

module.exports = router;