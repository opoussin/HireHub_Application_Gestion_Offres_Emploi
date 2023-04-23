var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')

router.get('/devenirRecruteur', function (req, res, next) {

  result = orgaModel.readOrga(function (result) {
    res.render('formulaire_recruteur', {organisation : result});
  });
});

router.post('/devenirRecruteur', function (req, res, next) {
    var orga = req.body.orga;
    var user="oceane@etu";
  
    candidatModel.creatDmdRecruteur(user, orga, function (result) {
      res.redirect('/devenirRecruteur');
    });
  });

  module.exports = router;