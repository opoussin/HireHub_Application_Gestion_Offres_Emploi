var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')

router.get('/devenirRecruteur', function (req, res, next) {
    res.render('formulaire_recruteur');
  });

router.post('/devenirRecruteur', function (req, res, next) {
    var orga = req.body.orga;
    var user="oceane@etu";
  
    candidatModel.creatDmdRecruteur(user, orga, function (result) {
      res.redirect('/devenirRecruteur');
    });
  });

  module.exports = router;