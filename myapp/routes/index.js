var express = require('express');
var router = express.Router();
var communModel = require('../Modele/Commun.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/connexion', function (req, res, next) {
    res.render('connexion');
});

router.post('/connexion', function (req, res, next) {
  // Récupération des données du formulaire
  var mail = req.body.mail;
  var mdp = req.body.mdp;

  // Appel à la fonction creat du modèle Utilisateur
  communModel.areUserValid(mail, mdp, function (result) {
    // Redirection vers la page d'accueil si l'ajout a réussi
    if (result) {
      // Si l'utilisateur n'est pas connecté, on redirige vers la page de connexion
      res.redirect('/users/candidat');
    } else {
      // Sinon, on rend la vue "accueil"
      res.render('connexion');
    }
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
  communModel.creatUser(mail, nom, prenom, mdp, telephone, function (result) {
    if (result){ //result = vrai donc il y a une erreur
      res.redirect('/insciption')
    }
    else{
      res.redirect('/users/candidat');
    }
  });
});

module.exports = router;
