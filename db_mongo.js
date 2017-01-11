// Chargement des dépendances
// --------------------------------------------------------------
var express = require('express')
var mongoose = require('mongoose');


// Données de connexion à la base MONGO DB
// --------------------------------------------------------------
//module.exports = mongoose.connect('mongodb://172.17.0.2:27017/weguide');
module.exports = mongoose.connect('mongodb://localhost:27017/weguide');
