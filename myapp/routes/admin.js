var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')

router.get('/devenirAdministrateur', function (req, res, next) {
    res.render('formulaire_admin');
  });

router.post('/devenirAdministrateur', function (req, res, next) {
    // Récupération des données du formulaire
    var mail = req.body.mail;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var mdp = req.body.mdp;
    var telephone = req.body.telephone;
  
    // Appel à la fonction creat du modèle Utilisateur
    adminModel.creat(mail, nom, prenom, mdp, telephone, function (result) {
      // Redirection vers la page d'accueil si l'ajout a réussi
      res.redirect('/admin');
    });
  });