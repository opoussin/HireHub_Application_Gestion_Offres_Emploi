var express = require('express');
var router = express.Router();
var userModel = require('../Modele/Utilisateur.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/connexion', function (req, res, next) {
  result = userModel.read(function (result) {
    res.render('connexion', { users: result });
  });
});
router.get('/inscription', function (req, res, next) {
  res.render('inscription');
});

router.post('/inscription', function (req, res, next) {
  // Récupération des données du formulaire
  var mail = req.body.mail;
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var mdp = req.body.mdp;
  var telephone = req.body.telephone;

  // Appel à la fonction creat du modèle Utilisateur
  userModel.creat(mail, nom, prenom, mdp, telephone, function (result) {
    // Redirection vers la page d'accueil si l'ajout a réussi
    res.redirect('/accueilUtilisateur');
  });
});

module.exports = router;
