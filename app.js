// Chargement des dépendances
// --------------------------------------------------------------
var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');
var expressValidator = require('express-validator');
var app = module.exports = express();

var async = require("async");

// Accès aux répertoire public
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
//app.enable('trust proxy');

// Headers pour le retour
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});


// Chargement des controllers
app.use('/api/users', require('./app/Controllers/BeaconsController'));


// Lancement du serveur sur le port 3000
app.listen(3000, function () {
  console.log('Le serveur est en route');
});