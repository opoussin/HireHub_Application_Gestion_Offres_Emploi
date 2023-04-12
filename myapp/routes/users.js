var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')


router.get('/candidat', function (req, res, next) {
  res.render('candidat');
});

router.get('/administrateur', function (req, res, next) {
  res.render('admin');
});

router.get('/devenirAdministrateur', function (req, res, next) {
  res.render('formulaire_admin');
});

router.post('/devenirAdministrateur', function (req, res, next) {
  var mail = req.body.mail;

  candidatModel.creatDmdAdmin (mail, function (result) {
    res.redirect('/admin');
  });
});

router.get('/recruteur', function (req, res, next) {
  res.render('recruteur');
});

router.get('/devenirRecruteur', function (req, res, next) {
  res.render('formulaire_recruteur');
});

router.post('/devenirRecruteur', function (req, res, next) {
  var mail = req.body.mail;
  var siren = req.body.siren;

  candidatModel.creatDmdRecruteur (siren, mail, function (result) {
    res.redirect('/admin');
  });
});

module.exports = router;