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

// // Chargement du Model
// // --------------------------------------------------------------
// var HelpSession = require('../../app/Tools/Session');

var crypto = require('crypto');

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


// Appeler de l'aide
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
    console.log('COucou beacon!');

    	if(!result)
    	{
    		retour = {error: "Unknown"};
    		res.status(400).json(retour);
    		return;
    	}
      //console.log("creation session");
    	//var session = new HelpSession.Session();
    //  console.log("session allouée");
    	//session.create(result.id, result.nom, result.position, result.etablissement_id, req.params.name, req.params.sex, req.params.profil);
      var date = new Date();
      alea = Math.floor((Math.random() * 1000000) + 1)
      console.log("alea session"+result.id);
      var rdm = date+alea+result.id;
      console.log(rdm);
      var myId = crypto.createHmac('sha256', rdm)
                       .update('I sucks')
                       .digest('hex')
      ;
      console.log("sha256 session");
      console.log('myid'+myId);
      var session = {
        "id": myId,
        "beacon": {
          "id": 		result.id,
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



      // console.log(session);
      Etablissement.update({"_id": result.etablissement.id}, {"$push": {sessions: {"$each": [session]}}}, function(err, result)
      {
        console.log('Update WTF!');


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

// Je les previens du besoin d'aide

module.exports = router;
