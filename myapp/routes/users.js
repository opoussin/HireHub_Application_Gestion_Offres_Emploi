var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')


router.get('/candidat', function (req, res, next) {
  res.render('candidat');
});

router.get('/profil_candidat', function (req, res, next) { //ca marche pas mais jsp pourquoi
  var email = "oceane@etu";
  console.log(email);
  result=communModel.readUser(email, function(result){
    console.log(result);
    res.render('profil_candidat', { nom: result.nom, prenom: result.prenom, mail: result.mail, telephone: result.telephone, statut: result.statut, });  });
  
});

router.post('/profil_candidat', function(req,res,next){
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var telephone = req.body.telephone;
  var mail = req.body.mail;
  var mdp = req.body.mdp;
  console.log(req);
  candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
    if (result) {
      res.redirect('/users/profil_candidat');
    } else {
      res.render('connexion');
    }
  });
})

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