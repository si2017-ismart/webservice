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
var Etablissement = require('../../app/Model/Etablissement');
var Beacon = 		require('../../app/Model/Beacon');

// Chargement du Model
// --------------------------------------------------------------
//var HelpSession = require('../../app/Tools/Session');


/**
 *	@brief 		Récupère un Etablissement via son Id
 *	@param 		id : ObjectId de l'utilisateur
 **/
router.get('/getById/:id', function(req, res)
{
	req.checkParams('id', 'Invalid id').notEmpty().isMongoId();
	var retour = {};


	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({'_id': req.params.id}, function(err, etablissement)
	{
		if (err)
        {
        	retour = {error: err};
            res.status(400).json(retour);
        }
        else
        {
        	if(etablissement)
        	{
        		res.json(etablissement);
        	}
        	else
        	{
        		retour = false;
        		res.status(400).json(retour);
        	}

        }
	});
});

router.get('/getByName/:name', function(req, res)
{
	req.checkParams('name', 'Nom invalide').notEmpty();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({'nom': req.params.name}, function(err, etablissement)
	{
		if (err)
        {
        	retour = {error: err};
            res.status(400).json(retour);
        }
        else
        {
        	if(etablissement)
        	{
        		res.json(etablissement);
        	}
        	else
        	{
        		retour = false;
        		res.status(400).json(retour);
        	}

        }
	});
});


router.get('/intervenants/getByEtablissement/:id', function(req, res)
{
	req.checkParams('id', 'Id de l\'etablissement invalide').notEmpty().isMongoId();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({"_id": req.params.id}, {intervenants: 1}, function(err, result)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			res.json(result);
		}
	});
});

router.get('/intervenants/getById/:id', function(req, res)
{
	req.checkParams('id', 'Id de l\'etablissement invalide').notEmpty().isMongoId();

	if(req.validationErrors())
	{
		retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({"intervenants._id": req.params.id}, {"intervenants.$": 1}, function(err, intervenant)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			res.json(intervenant);
		}
	})
});

router.get('/sessions/checkToken/:token', function(req, res)
{
	req.checkParams('token', 'Token invalide').notEmpty();

	var token = req.params.token.trim();

	Etablissement.findOne({"sessions.id": token}, function(err, session)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(session)
			{
				res.json(true);
			}
			else
			{
				res.json(false);
			}

		}
	});
})

/**
 *
 */
router.get('/sessions/getByToken/:token', function(req, res)
{
	req.checkParams('token', 'Token invalide').notEmpty();

	var token = req.params.token.trim();

	Etablissement.findOne({"sessions.id": token}, {"sessions.$": 1, "_id": 0}, function(err, session)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			res.json(session);
		}
	});
});

router.post('/sessions/setBeacon', function(req, res)
{
	req.checkBody('id_beacon', 'Id du beacon invalide').notEmpty();
	req.checkBody('token', 'Token invalide').notEmpty();

	var token = req.params.token.trim();

	Beacon.findOne({"id_beacon": req.body.id_beacon}, function(err, beacon)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(beacon)
			{
				Etablissement.update({"sessions.id": token}, {"$set": {
					"sessions.$.beacon.id": beacon.id_beacon,
					"sessions.$.beacon.nom": beacon.nom,
					"sessions.$.beacon.position": beacon.position
				}}, function(err, result)
				{
					if(err)
					{
						res.status(400).json({error: err});
					}
					else
					{
						res.json({success: true});
					}
				})
			}
			else
			{
				res.status(400).json({error: "Beacon unknown"});
			}
		}
	})

});


/**
 * Création d'un établissement
 * @param  {[type]} req      [description]
 * @param  {[type]} res){} [description]
 * @return {[type]}          [description]
 */
router.post('/add', function(req, res)
{
	req.checkBody('nom', 'Nom invalide').notEmpty();
	req.checkBody('mail', 'Mail invalide').notEmpty().isEmail();
	req.checkBody('adresse', 'Adresse invalide').notEmpty();
	req.checkBody('ville', 'Ville invalide').notEmpty().isAlpha();
	req.checkBody('pays', 'Pays invalide').notEmpty().isAlpha();
	req.checkBody('zip', 'Code postal invalide').notEmpty();
	req.checkBody('tel', 'Téléphone invalide').notEmpty();

	req.sanitizeBody('nom').escape();
	req.sanitizeBody('adresse').escape();
	req.sanitizeBody('zip').escape();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var etab = new Etablissement({
		nom: 		req.body.nom,
		adresse: 	req.body.adresse,
		ville: 		req.body.ville,
		pays: 		req.body.pays,
		zip: 		req.body.zip,
		mail: 		req.body.mail,
		tel: 		req.body.tel
	});

	Etablissement.findOne({nom: req.body.nom}, function(err, result)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(result)
			{
				res.status(400).json({error: "Etablissement already exists"});
				return;
			}

			etab.save(function(err, result)
			{
				if(err)
				{
					res.status(400).json({error: err});
				}
				else
				{
					res.status(200).json(result.id);
				}

			})
		}
	})
});

router.post('/intervenants/login', function(req, res)
{
	req.checkBody('nom_etablissement', 'Nom de l\'etablissement invalide').notEmpty();
	req.checkBody('identifiant', 'Identifiant invalide').notEmpty();
	req.checkBody('password', 'Password invalide').notEmpty();

	req.sanitizeBody('identifiant').escape();
	req.sanitizeBody('password').escape();
	req.sanitizeBody('nom_etablissement').escape();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

  var identifiant = req.body.identifiant + "";
  var nom_etablissement = req.body.nom_etablissement + "";
  var password = req.body.password + "";

	var promise = Etablissement.findOne({
    "$and": [{"intervenants.identifiant": identifiant.trim()},
             {"intervenants.password": password.trim()}],
		"nom": nom_etablissement.trim()
	}).exec();

	promise.then(function(etablissement)
	{
		if(etablissement)
		{
			res.json(etablissement._id);
		}
		else
		{
			res.status(400).json(false);
		}
	})
	.catch(function(err)
	{
		res.status(400).json({error: err});
	})
})

router.post('/loginAdmin', function(req, res)
{
	req.checkBody('identifiant', 'Identifiant invalide').notEmpty();
	req.checkBody('password', 'Password invalide').notEmpty();

	req.sanitizeBody('identifiant').escape();
	req.sanitizeBody('password').escape();


	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	Etablissement.findOne({
		"administrateur.identifiant": 	req.body.identifiant,
		"administrateur.password": 		req.body.password}, function(err, result)
		{
			if(err)
			{
				var retour = {'error': req.validationErrors()};
				res.status(400).json(retour);
				return;
			}
			else
			{
				if(result)
				{
					res.status(200).json({
						success: true,
						id_etablissement: result._id
					});
				}
				else
				{
					res.status(400).json({
						success: false
					});
				}
			}
		})
});

router.post('/createAdmin', function(req, res)
{
	req.checkBody('id', 'Id invalide').notEmpty().isMongoId();
	req.checkBody('identifiant', 'Identifiant administrateur invalide').notEmpty();
	req.checkBody('password', 'Password invalide').notEmpty();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var admin = {
		identifiant: 	req.body.identifiant,
		password: 		req.body.password
	};

	Etablissement.findOne({"administrateur.identifiant": req.body.identifiant}, function(err, result)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(result)
			{
				res.status(400).json({error: "Admin already exists"});
				return;
			}

			Etablissement.update({"_id": req.body.id}, {"$set": {administrateur: admin}}, function(err, result)
			{
				if(err)
				{
					res.status(400).json({error: err});
				}
				else
				{
					res.status(200).json(true);
				}
			});
		}
	})


});

router.post('/intervenants/add', function(req, res)
{
	req.checkBody('id', 'Id invalide').notEmpty().isMongoId();
	req.checkBody('nom', 'Nom invalide').notEmpty();
	req.checkBody('prenom', 'Prenom invalide').notEmpty();
	req.checkBody('identifiant', 'Identifiant invalide').notEmpty();
	req.checkBody('password', 'Password invalide').notEmpty();


	req.sanitizeBody('nom').escape();
	req.sanitizeBody('prenom').escape();
	req.sanitizeBody('identifiant').escape();
	req.sanitizeBody('password').escape();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var inter = {
		nom: 	req.body.nom,
		prenom: req.body.prenom,
		identifiant: req.body.identifiant,
		password: req.body.password,
		disponibilite: false
	};

	Etablissement.findOne({"_id": req.body.id, "intervenants.identifiant": req.body.identifiant}, function(err, result)
	{
		if(err)
		{
			res.status(400).json({error: err});
		}
		else
		{
			if(result)
			{
				res.status(400).json({error: "Intervenant already exists"});
				return;
			}

			Etablissement.update({"_id": req.body.id}, {"$push": {intervenants: {"$each": [inter]} }}, function(err, result)
			{
				if(err)
				{
					res.status(400).json({error: err});
				}
				else
				{
					res.status(200).json("Intervenant créé");
				}
			});
		}
	});


});

// Recherche si une session sans intervenant existe
router.get('/operator_ack/:id_etablissement', function(req, res)
{
  req.checkParams('id_etablissement', 'id_etablissement missing').notEmpty().isMongoId();

  Etablissement.findOne({"_id": req.params.id_etablissement, "sessions.prise":false},{"sessions.$":1}, function(err, result) {
    if(err)
    {
      res.status(400).json({error: err});
    }
    else
    {
      if(result)
      {
        res.json(result);
      }
      else{
        res.json('Nothing');
      }
    }
  });
});



router.post('/intervenants/takeSession', function(req, res)
{
	req.checkBody('id_intervenant', 'Id de l\'intervenant invalide').notEmpty().isMongoId();
	req.checkBody('token', 'Token invalide').notEmpty();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}

	var promise = Etablissement.findOne({"sessions.id": req.body.token}).exec();
	promise.then(function(etablissementSession)
	{
		if(etablissementSession)
		{
			return Etablissement.findOne({"intervenants._id": req.body.id_intervenant}, {"intervenants.$": 1});
		}
		else
		{
			throw new Error("No Session");
		}
	})
	.then(function(etablissementIntervenant)
	{
		if(etablissementIntervenant)
		{
			var inter = {
				id: 	etablissementIntervenant.intervenants[0].id,
				nom: 	etablissementIntervenant.intervenants[0].nom,
				prenom: etablissementIntervenant.intervenants[0].prenom,
			};
			return Etablissement.update({"sessions.id": req.body.token}, {"$set": {"sessions.$.intervenant": inter, "sessions.$.prise": true}});
		}
		else
		{
			throw new Error("No Intervenant");
		}
	})
	.then(function(update)
	{
		Etablissement.update({"intervenants._id": req.body.id_intervenant}, {"$set": {"intervenants.$.disponibilite": false}}, function(err, result)
		{
			if(err)
			{
				res.status(400).json({error: err});
			}
			else
			{
				res.json(req.body.token);
			}
		})
	})
	.catch(function(err)
	{
		res.status(400).json({error: err});
	});
});

router.post('/intervenants/endSession', function(req, res)
{
	req.checkBody('token', 'Token invalide').notEmpty();

	if(req.validationErrors())
	{
		var retour = {'error': req.validationErrors()};
		res.status(400).json(retour);
		return;
	}


	var promise = Etablissement.findOne({"sessions.id": req.body.token}, {"sessions.$": 1}).exec();
	promise.then(function(session)
	{
		// Récupérer l'id de l'intervenant et mettre sa disponibilité à true
		return Etablissement.update({"intervenants._id": session.sessions[0].intervenant.id}, {"$set": {"intervenants.$.disponibilite": true}});
	})
	.then(function(update)
	{
		return Etablissement.update({"sessions.id": req.body.token}, {"$pull": {sessions: {id: req.body.token}}});
	})
	.then(function(update)
	{
		res.status(200).json(true);
	})
	.catch(function(err)
	{
		res.status(400).json({error: err});
	});
});


module.exports = router;
