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


var crypto = require('crypto');


/**
 * Récupération de tous les beacons
 * @return  JSON : Liste des beacons
 */
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
 *	@param 		id : Id du beacon
 *	@return 	JSON : beacon ou false
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

	Beacon.findOne({'id_beacon': req.params.id}, {id_beacon: 1, etablissement:1, "_id": 0}, function(err, beacon)
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

/**
 * Récupération des beacons d'un établissement
 * @param  	id : ID de l'établissement
 * @return 	JSON : Liste des beacons ou err
 */
router.get('/getByEtablissement/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty().isMongoId();

  var retour = {};
	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Beacon.find({"etablissement.id": req.params.id}, function(err, result)
	{
		if(err)
		{
			retour = {'error': err};
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
 * Démarre une session d'aide pour l'utilisateur
 * @param  	id : ID du beacon
 * @param  	name : Nom de la personne
 * @param 	sex : Sexe de la personne
 * @profil 	profil: type de handicap
 * @return  JSON : ID de la session
 */
router.get('/needHelp/:profil/:name/:sex/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty();
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

    	var date = new Date();
    	alea = Math.floor((Math.random() * 1000000) + 1)
    	var rdm = date+alea+result.id;
    	var myId = crypto.createHmac('sha256', rdm)
                     .update('PiouPiouPiou')
                     .digest('hex')
    	;
    	var session = {
      	"id": myId,
      	"beacon": {
        		"id": 		result.id_beacon,
        		"nom": 		result.nom,
        		"position": result.position,
      	},
      	"user": {
        		"nom": 		req.params.name,
        		"sexe": 	req.params.sex,
        		"type": 	req.params.profil
      	},
      	"date": 		date,
      	"prise": 		false
    	};

      Etablissement.update({"_id": result.etablissement.id}, {"$push": {sessions: {"$each": [session]}}}, function(err, result)
      {
  		if(err)
  		{
        		res.status(400).json({error: err});
  		}
  		else
  		{
        		res.json(session.id);
  		}
  	});
  });
});

/**
 * Ajout d'un beacon dans l'établissement
 * @param   id_etablissement : ID de l'établissement
 * @param   id : ID du beacon
 * @param 	nom: Nom du beacon
 * @return  JSON : Beacon créé ou err
 */
router.post('/add', function(req, res)
{
	req.checkBody('id_etablissement', 'Id Etablissement invalide').notEmpty().isMongoId();
	req.checkBody('id', 'Id Beacon invalide').notEmpty();
	req.checkBody('nom', 'Nom Beacon invalide').notEmpty();

	req.checkBody('xPosition', 'Position X invalide').notEmpty().isInt();
	req.checkBody('yPosition', 'Position Y invalide').notEmpty().isInt();
	req.checkBody('portee', 'Portee théorique invalide').notEmpty().isInt();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}


	Beacon.findOne({"id_beacon": req.body.id}, function(err, beacon)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(beacon)
			{
				res.status(400).json({error: "Beacon already exists"});
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
					if(!result)
					{
						res.status(400).json({error: "Etablissement unknown"});
						return;
					}

					beacon = new Beacon({
						id_beacon: req.body.id,
						nom: req.body.nom,
						portee: req.body.portee,
						position: {
							x: req.body.xPosition,
							y: req.body.yPosition
						},
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
		}
	})

});

// Je les previens du besoin d'aide

module.exports = router;
