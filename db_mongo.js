// Chargement des dépendances
// --------------------------------------------------------------
var express = require('express')
var mongoose = require('mongoose');


// Données de connexion à la base MONGO DB
// --------------------------------------------------------------
module.exports = mongoose.connect('mongodb://localhost:27017/weguide');